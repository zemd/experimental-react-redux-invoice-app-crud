'use strict';

import * as actions from '../actions';

import {Observable} from 'rxjs/Observable';

import 'rxjs/add/observable/fromPromise';
//import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

// Status flow:
// inited -> syncing -> synced

export default (state = {status: 'inited'}, action) => {
  switch (action.type) {
    case actions.ACTION_SYNC_CUSTOMERS_SUCCEEDED: {
      return Object.assign(
        {},
        {data: action.data},
        {status: 'synced'}
      );
    }
    case actions.ACTION_CREATE_CUSTOMER_SUCCEEDED: {
      let data = state.data.slice();
      data.push(action.customer);

      return Object.assign(
        {},
        state,
        {data}
      )
    }
    case actions.ACTION_DELETE_CUSTOMER_SUCCEEDED: {
      let index = state.data.findIndex(el => el.id === action.id);
      let data = state.data.slice();
      data.splice(index, 1);

      return Object.assign(
        {},
        state,
        {data}
      );
    }
    case actions.ACTION_UPDATE_CUSTOMER_SUCCEEDED: {
      let data = state.data.slice();
      data.splice(data.findIndex(el => el.id === action.customer.id), 1, action.customer);

      return Object.assign(
        {},
        state,
        {data}
      );
    }
  }
  return state;
};

export const syncCustomersEpic = (action$, store) => action$
  .ofType(actions.ACTION_SYNC_CUSTOMERS)
  .mergeMap(() => Observable.fromPromise(fetch('/api/customers').then(response => response.json())))
  .map(res => actions.syncCustomersSucceeded(res));

export const createCustomerEpic = (action$, store) => {
  return action$
    .ofType(actions.ACTION_CREATE_CUSTOMER)
    .mergeMap(action => {
      return Observable
        .fromPromise(
          fetch('/api/customers', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name: action.payload.name,
              address: action.payload.address,
              phone: action.payload.phone
            })
          })
            .then(response => response.json())
        );
    })
    .map(res => actions.createCustomerSucceeded(res));
};

export const deleteCustomerEpic = (action$, store) => {
  return action$
    .ofType(actions.ACTION_DELETE_CUSTOMER)
    .mergeMap(action => {
      return Observable
        .fromPromise(
          fetch(`/api/customers/${action.id}`, {
            method: 'DELETE'
          })
            .then(response => response.json())
        );
    })
    .map((res) => actions.deleteCustomerSucceeded(res.id))
};

export const updateCustomerEpic = (action$, store) => {
  return action$
    .ofType(actions.ACTION_UPDATE_CUSTOMER)
    .mergeMap(action => {
      return Observable
        .fromPromise(
          fetch(`/api/customers/${action.payload.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name: action.payload.name,
              address: action.payload.address,
              phone: action.payload.phone
            })
          })
            .then(response => response.json())
        );
    })
    .map(res => actions.updateCustomerSucceeded(res))
};
