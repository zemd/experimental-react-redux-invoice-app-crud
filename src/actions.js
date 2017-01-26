'use strict';

// -----------------------------------------------------------------
// ---- INVOICES
// -----------------------------------------------------------------
export const ACTION_SYNC_INVOICES = 'SYNC_INVOICES';
export const syncInvoices = () => ({
  type: ACTION_SYNC_INVOICES
});

export const ACTION_SYNC_INVOICES_SUCCEEDED = 'SYNC_INVOICES_SUCCEEDED';
export const syncInvoicesSucceeded = data => ({
  type: ACTION_SYNC_INVOICES_SUCCEEDED,
  data
});

export const ACTION_CREATE_INVOICE = 'CREATE_INVOICE';
export const createInvoice = data => ({
  type: ACTION_CREATE_INVOICE,
  payload: {
    ...data
  }
});

export const ACTION_CREATE_INVOICE_SUCCEEDED = 'CREATE_INVOICE_SUCCEEDED';
export const createInvoiceSucceeded = invoice => ({
  type: ACTION_CREATE_INVOICE_SUCCEEDED,
  invoice
});

export const ACTION_UPDATE_INVOICE = 'UPDATE_INVOICE';
export const updateInvoice = (data, oldData) => ({
  type: ACTION_UPDATE_INVOICE,
  payload: {
    ...data
  },
  old_data: oldData
});

export const ACTION_UPDATE_INVOICE_SUCCEEDED = 'UPDATE_INVOICE_SUCCEEDED';
export const updateInvoiceSucceeded = invoice => ({
  type: ACTION_UPDATE_INVOICE_SUCCEEDED,
  invoice
});

export const ACTION_DELETE_INVOICE = 'DELETE_INVOICE';
export const deleteInvoice = id => ({
  type: ACTION_DELETE_INVOICE,
  id
});

export const ACTION_DELETE_INVOICE_SUCCEEDED = 'DELETE_INVOICE_SUCCEEDED';
export const deleteInvoiceSucceded = (id) => ({
  type: ACTION_DELETE_INVOICE_SUCCEEDED,
  id
});

// -----------------------------------------------------------------
// ---- CUSTOMERS
// -----------------------------------------------------------------
export const ACTION_SYNC_CUSTOMERS = 'SYNC_CUSTOMERS';
export const syncCustomers = () => ({
  type: ACTION_SYNC_CUSTOMERS
});

export const ACTION_SYNC_CUSTOMERS_SUCCEEDED = 'SYNC_CUSTOMERS_SUCCEEDED';
export const syncCustomersSucceeded = data => ({
  type: ACTION_SYNC_CUSTOMERS_SUCCEEDED,
  data
});

export const ACTION_CREATE_CUSTOMER = 'CREATE_CUSTOMER';
export const createCustomer = data => ({
  type: ACTION_CREATE_CUSTOMER,
  payload: {
    ...data
  }
});

export const ACTION_CREATE_CUSTOMER_SUCCEEDED = 'CREATE_CUSTOMER_SUCCEEDED';
export const createCustomerSucceeded = customer => ({
  type: ACTION_CREATE_CUSTOMER_SUCCEEDED,
  customer
});

export const ACTION_UPDATE_CUSTOMER = 'UPDATE_CUSTOMER';
export const updateCustomer = data => ({
  type: ACTION_UPDATE_CUSTOMER,
  payload: {
    ...data
  }
});

export const ACTION_UPDATE_CUSTOMER_SUCCEEDED = 'UPDATE_CUSTOMER_SUCCEEDED';
export const updateCustomerSucceeded = customer => ({
  type: ACTION_UPDATE_CUSTOMER_SUCCEEDED,
  customer
});

export const ACTION_DELETE_CUSTOMER = 'DELETE_CUSTOMER';
export const deleteCustomer = id => ({
  type: ACTION_DELETE_CUSTOMER,
  id
});

export const ACTION_DELETE_CUSTOMER_SUCCEEDED = 'DELETE_CUSTOMER_SUCCEEDED';
export const deleteCustomerSucceeded = (id) => ({
  type: ACTION_DELETE_CUSTOMER_SUCCEEDED,
  id
});

// -----------------------------------------------------------------
// ---- PRODUCTS
// -----------------------------------------------------------------
export const ACTION_SYNC_PRODUCTS = 'SYNC_PRODUCTS';
export const syncProducts = () => ({
  type: ACTION_SYNC_PRODUCTS
});

export const ACTION_SYNC_PRODUCTS_SUCCEEDED = 'SYNC_PRODUCTS_SUCCEEDED';
export const syncedProducts = data => ({
  type: ACTION_SYNC_PRODUCTS_SUCCEEDED,
  data
});

export const ACTION_CREATE_PRODUCT = 'CREATE_PRODUCT';
export const createProduct = data => ({
  type: ACTION_CREATE_PRODUCT,
  payload: {
    ...data
  }
});

export const ACTION_CREATE_PRODUCT_SUCCEEDED = 'CREATE_PRODUCT_SUCCEEDED';
export const createProductSucceeded = product => ({
  type: ACTION_CREATE_PRODUCT_SUCCEEDED,
  product
});

export const ACTION_UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const updateProduct = data => ({
  type: ACTION_UPDATE_PRODUCT,
  payload: {
    ...data
  }
});

export const ACTION_UPDATE_PRODUCT_SUCCEEDED = 'UPDATE_PRODUCT_SECCUSSFUL';
export const updateProductSucceeded = product => ({
  type: ACTION_UPDATE_PRODUCT_SUCCEEDED,
  product
});

export const ACTION_DELETE_PRODUCT = 'DELETE_PRODUCT';
export const deleteProduct = id => ({
  type: ACTION_DELETE_PRODUCT,
  id
});

export const ACTION_DELETE_PRODUCT_SUCCEEDED = 'DELETE_PRODUCT_SUCCEEDED';
export const deleteProductSucceeded = (id) => ({
  type: ACTION_DELETE_PRODUCT_SUCCEEDED,
  id
});
