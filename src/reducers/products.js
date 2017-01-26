'use strict';

import * as actions from '../actions';

import {Observable} from 'rxjs/Observable';

import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

export default (state = {status: 'inited', data: []}, action) => {
  switch (action.type) {
    case actions.ACTION_SYNC_PRODUCTS_SUCCEEDED: {
      return Object.assign(
        {},
        {data: action.data},
        {status: 'synced'}
      );
    }
    case actions.ACTION_CREATE_PRODUCT_SUCCEEDED: {
      let products = state.data.slice();
      products.push(action.product);

      return Object.assign(
        {},
        state,
        {data: products}
      )
    }
    case actions.ACTION_DELETE_PRODUCT_SUCCEEDED: {
      let index = state.data.findIndex(el => el.id === action.id);
      let products = state.data.slice();
      products.splice(index, 1);

      return Object.assign(
        {},
        state,
        {data: products}
      );
    }
    case actions.ACTION_UPDATE_PRODUCT_SUCCEEDED: {
      let products = state.data.slice();
      products.splice(products.findIndex(p => p.id === action.product.id), 1, action.product);

      return Object.assign(
        {},
        state,
        {data: products}
      );
    }
  }
  return state;
};

export const syncProductsEpic = (action$, store) => action$
  .ofType(actions.ACTION_SYNC_PRODUCTS)
  .mergeMap(() => Observable
    .fromPromise(
      fetch('/api/products')
        .then(response => response.json())
    )
  )
  .map(res => actions.syncedProducts(res));

export const createProductEpic = (action$, store) => {
  return action$
    .ofType(actions.ACTION_CREATE_PRODUCT)
    .mergeMap(action => {
      return Observable
        .fromPromise(
          fetch('/api/products', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name: action.payload.name,
              price: action.payload.price
            })
          })
            .then(response => response.json())
        );
    })
    .map(res => actions.createProductSucceeded(res));
};

export const deleteProductEpic = (action$, store) => {
  return action$
    .ofType(actions.ACTION_DELETE_PRODUCT)
    .mergeMap(action => {
      return Observable
        .fromPromise(
          fetch(`/api/products/${action.id}`, {
            method: 'DELETE'
          })
            .then(response => response.json())
        );
    })
    .map((res) => actions.deleteProductSucceeded(res.id))
};

export const updateProductEpic = (action$, store) => {
  return action$
    .ofType(actions.ACTION_UPDATE_PRODUCT)
    .mergeMap(action => {
      return Observable
        .fromPromise(
          fetch(`/api/products/${action.payload.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name: action.payload.name,
              price: action.payload.price
            })
          })
            .then(response => response.json())
        );
    })
    .map(res => actions.updateProductSucceeded(res))
};
