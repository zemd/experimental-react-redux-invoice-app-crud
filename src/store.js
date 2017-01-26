'use strict';

import {createStore, applyMiddleware} from 'redux';
import {createEpicMiddleware} from 'redux-observable';
import {combineEpics} from 'redux-observable';
import {combineReducers} from 'redux';

// REDUCERS & EPICS
import invoices, {
  syncInvoicesEpic,
  createInvoiceEpic,
  sillyDeleteInvoiceEpic,
  smartDeleteInvoiceEpic,
  updateInvoiceEpic
} from './reducers/invoices';
import customers, {
  syncCustomersEpic,
  createCustomerEpic,
  deleteCustomerEpic,
  updateCustomerEpic
} from './reducers/customers';
import products, {syncProductsEpic, createProductEpic, deleteProductEpic, updateProductEpic} from './reducers/products';

const epicMiddleware = createEpicMiddleware(combineEpics(
  syncInvoicesEpic,
  createInvoiceEpic,
  //sillyDeleteInvoiceEpic,
  smartDeleteInvoiceEpic,
  updateInvoiceEpic,

  syncCustomersEpic,
  createCustomerEpic,
  deleteCustomerEpic,
  updateCustomerEpic,

  syncProductsEpic,
  createProductEpic,
  deleteProductEpic,
  updateProductEpic
));

let store = createStore(
  combineReducers({
    invoices,
    customers,
    products
  }),
  window.__initial__state__,
  applyMiddleware(epicMiddleware)
);

export default store;
