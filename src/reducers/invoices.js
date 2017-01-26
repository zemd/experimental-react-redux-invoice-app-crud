'use strict';

import * as actions from '../actions';

import {Observable} from 'rxjs/Observable';

import 'rxjs/add/observable/fromPromise';
//import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/debounce';
import 'rxjs/add/operator/filter';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/defer';

export default (state = {status: 'inited', data: []}, action) => {
  switch (action.type) {
    case actions.ACTION_SYNC_INVOICES_SUCCEEDED: {
      return Object.assign(
        {},
        state,
        {data: action.data},
        {status: 'synced'}
      );
    }
    case actions.ACTION_SYNC_INVOICES: {
      return Object.assign(
        {},
        state,
        {status: 'syncing'}
      );
    }
    case actions.ACTION_CREATE_INVOICE_SUCCEEDED: {
      let data = state.data.slice();
      data.push(action.invoice);

      return Object.assign(
        {},
        state,
        {data}
      );
    }
    case actions.ACTION_DELETE_INVOICE_SUCCEEDED: {
      let index = state.data.findIndex(el => el.id === action.id);
      let data = state.data.slice();
      data.splice(index, 1);

      return Object.assign(
        {},
        state,
        {data}
      );
    }
    case actions.ACTION_UPDATE_INVOICE_SUCCEEDED: {
      let data = state.data.slice();
      data.splice(data.findIndex(el => el.id === action.invoice.id), 1, action.invoice);

      return Object.assign(
        {},
        state,
        {data}
      )
    }
  }
  return state;
};

const ofSyncAction$ = function (action$, store) {
  return action$
    .ofType(actions.ACTION_SYNC_INVOICES)
    .filter(() => store.getState().invoices.status === 'syncing');
};

export const syncInvoicesEpic = (action$, store) => {
  return ofSyncAction$(action$, store)
    .mergeMap(() => Observable
        .fromPromise(
          fetch('/api/invoices')
            .then(response => response.json())
            .then((invoices) => {
              let items = invoices.map(i =>
                fetch(`/api/invoices/${i.id}/items`)
                  .then(res => res.json())
                  .then((iItems) => {
                    i.products = iItems.reduce((acc, item) => {
                      acc[item.product_id] = {
                        quantity: item.quantity,
                        id: item.id
                      };
                      return acc;
                    }, {});
                    return i;
                  })
              );

              return Promise.all(items)
            })
        )
      // .takeUntil(ofSyncAction$(action$, store))
    )
    .map(res => actions.syncInvoicesSucceeded(res));
};

const createInvoiceItem$ = (id, product_id, quantity) => {
  return Observable.fromPromise(
    fetch(`/api/invoices/${id}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        product_id: product_id,
        quantity: quantity
      })
    }).then(res => res.json())
  );
};

export const createInvoiceEpic = (action$, store) => {
  return action$.ofType(actions.ACTION_CREATE_INVOICE)
    .mergeMap((action) => {
      return Observable.fromPromise(
        fetch('/api/invoices', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            customer_id: action.payload.customer_id,
            discount: action.payload.discount,
            total: action.payload.total
          })
        })
          .then(response => response.json())
      ).mergeMap((invoice) => {
        let items$ = Object.keys(action.payload.products)
          .map(productId => createInvoiceItem$(invoice.id, productId, action.payload.products[productId].quantity));

        // TODO: implement backpressure
        return Observable.forkJoin(...items$)
          .map((items) => {
            invoice.products = items.reduce((acc, item) => {
              acc[item.product_id] = {
                id: item.id,
                quantity: item.quantity
              };
              return acc;
            }, {});
            return actions.createInvoiceSucceeded(invoice);
          });
      });
    });
};

export const sillyDeleteInvoiceEpic = (action$, store) => {
  return action$.ofType(actions.ACTION_DELETE_INVOICE)
    .mergeMap(action => {
      return Observable
        .fromPromise(
          fetch(`/api/invoices/${action.id}`, {
            method: 'DELETE'
          })
            .then(response => response.json())
        );
    })
    .map((res) => actions.deleteInvoiceSucceded(res.id));
};

export const smartDeleteInvoiceEpic = (action$, store) => {
  return action$.ofType(actions.ACTION_DELETE_INVOICE)
    .mergeMap(action => {
      return Observable
        .fromPromise(
          fetch(`/api/invoices/${action.id}/items`)
            .then((res) => res.json())
            .then((items) => {
              let promises = items.map((item) => fetch(`/api/invoices/${action.id}/items/${item.id}`, {
                method: 'DELETE'
              }));

              return Promise.all(promises);
            })
        )
        .map(() => action);
    })
    .mergeMap(action => {
      return Observable
        .fromPromise(
          fetch(`/api/invoices/${action.id}`, {
            method: 'DELETE'
          })
            .then(response => response.json())
        );
    })
    .map((res) => actions.deleteInvoiceSucceded(res.id));
};

export const updateInvoiceEpic = (action$, store) => {
  return action$
    .ofType(actions.ACTION_UPDATE_INVOICE)
    .mergeMap(action => {
      return Observable
        .fromPromise(
          fetch(`/api/invoices/${action.payload.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              customer_id: action.payload.customer_id,
              discount: action.payload.discount,
              total: action.payload.total
            })
          })
            .then(response => response.json())
            .then((invoice) => {
              let oldProducts = action.old_data.products;
              let productsToDelete = [];
              let schedule = Object.keys(oldProducts)
                .map(oldProductId => {
                  let url = `/api/invoices/${action.payload.id}/items/${oldProducts[oldProductId].id}`;
                  if (action.payload.products[oldProductId]) {
                    // UPDATE
                    return fetch(url, {
                      method: 'PUT',
                      headers: {
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify({
                        product_id: oldProductId | 0,
                        quantity: action.payload.products[oldProductId].quantity
                      })
                    })
                  }
                  productsToDelete.push(oldProducts[oldProductId].id);
                  // DELETE
                  return fetch(url, {method: 'DELETE'});
                });

              // CREATE
              let newItems = Object.keys(action.payload.products)
                .filter(key => !oldProducts[key])
                .map((key) => {
                  return fetch(`/api/invoices/${action.payload.id}/items`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                      product_id: key,
                      quantity: action.payload.products[key].quantity
                    })
                  });
                });

              return Promise.all(schedule.concat(newItems))
                .then(res => Promise.all(res.map(r => r.json())))
                .then((items) => {
                  invoice.products = items.reduce((acc, item) => {
                    if (productsToDelete.indexOf(item.id) === -1) {
                      acc[item.product_id] = {
                        id: item.id,
                        quantity: item.quantity
                      };
                    }
                    return acc;
                  }, {});
                  return invoice;
                })
            })
        );
    })
    .map(res => actions.updateInvoiceSucceeded(res))
};
