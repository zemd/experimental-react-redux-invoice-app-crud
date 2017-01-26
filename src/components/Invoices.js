'use strict';

//noinspection JSUnresolvedVariable
import React, {Component} from 'react';
import Loader from './Loader';
import {connect} from 'react-redux';
import * as actions from '../actions';
import _ from 'lodash';
import classnames from 'classnames';

class InvoiceForm extends Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.state = this.buildStateObject(props);
  }

  componentWillReceiveProps(props) {
    this.setState(this.buildStateObject(props));
  }

  buildStateObject(props) {
    let products = _.get(props, 'invoice.products', Object.create(null));
    return {
      id: _.get(props, 'invoice.id', null),
      customer_id: _.get(props, 'invoice.customer_id', _.get(props, 'customers[0].id')),
      discount: _.get(props, 'invoice.discount', 0),
      products: products,
      total: this.getTotal(products)
    };
  }

  changeCustomerProp(key, value) {
    this.setState({[key]: value});
  }

  customerToString(id) {
    if (!id) {
      return '';
    }
    let customer = this.props.customers.find((c) => c.id === parseInt(id, 10));
    return `${customer.name} (${customer.id})`;
  }

  addProduct(id, count) {
    let products = _.cloneDeep(this.state.products);
    products[id] = products[id] || Object.create(null);

    if (count) {
      if (count <= 0) {
        delete products[id];
      } else {
        products[id] = Object.assign({}, products[id], {quantity: count});
      }
    } else {
      products[id] = Object.assign({}, products[id], {quantity: (products[id].quantity | 0) + 1});
    }

    this.setState({
      products,
      total: this.getTotal(products)
    });
  }

  getProduct(id) {
    return this.props.products.find(p => p.id === id) || {};
  }

  removeProduct(id) {
    let products = _.cloneDeep(this.state.products);

    delete products[id];

    this.setState({
      products,
      total: this.getTotal(products)
    });
  }

  getSelectedProducts(products) {
    let data = this.state.products;
    if (products) {
      data = products;
    }
    return Object.keys(data).map(productId => productId | 0);
  }

  getTotal(products) {
    let data = this.state.products;
    if (products) {
      data = products;
    }

    let value = this.getSelectedProducts(products)
      .reduce((acc, id) => {
        return acc + this.getProduct(id).price * data[id].quantity;
      }, 0)
      .toString();

    return value.slice(0, value.indexOf('.') + 3);
  }

  getDiscount() {
    let value = ((this.getTotal() / 100) * this.state.discount).toString();
    return value.slice(0, value.indexOf('.') + 3);
  }

  render() {
    let title = this.state.id ? 'Update' : 'Create';
    return (
      <div>
        <h2>{title} invoice</h2>
        <form>
          <div className="form-group">
            <label>Customer</label>
            <select className="form-control"
                    onChange={(e) => this.changeCustomerProp('customer_id', e.target.value | 0)}
                    value={this.state.customer_id}>
              {this.props.customers.map(customer => (
                <option key={customer.id} value={customer.id}>{this.customerToString(customer.id)}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Discount</label>
            <div className="input-group">
              <input className="form-control" value={this.state.discount}
                     onChange={(e) => this.changeCustomerProp('discount', e.target.value)}
                     max={99} maxLength="2"/>
              <div className="input-group-addon">%</div>
            </div>
          </div>

          <div className="form-group">
            <label>Products</label>
            <div className="form-row">
              <select ref={input => this.selectProduct = input} className="form-control input-sm">
                {this.props.products.map(product => (
                  <option key={product.id} value={product.id}>{product.name} ({product.id})</option>
                ))}
              </select>
              <button className="btn btn-default btn-xs" onClick={(e) => {
                e.preventDefault();
                this.addProduct(this.selectProduct.value | 0);
              }}>
                Add
              </button>
            </div>
            <br/>
            <table className="table table-responsive table-hovered">
              <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Count</th>
                <th>
                  <small>actions</small>
                </th>
              </tr>
              </thead>
              <tbody>
              {this.getSelectedProducts().map(id => (
                <tr key={id}>
                  <td>{this.getProduct(id).name} ({id})</td>
                  <td>${this.getProduct(id).price}</td>
                  <td>
                    <input type="number" className="input-count" value={this.state.products[id].quantity}
                           onChange={(e) => this.addProduct(id, e.target.value | 0)}/>
                  </td>
                  <td>
                    <button className="btn btn-xs btn-danger" title="remove" onClick={(e) => {
                      e.preventDefault();
                      this.removeProduct(id);
                    }}>remove
                    </button>
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
            {!Object.keys(this.state.products).length && (<div>No products added yet.</div>)}
            <hr/>
            <div>
              <strong>Total:</strong> ${this.state.total}<br/>
              <strong>Discount:</strong> ${this.getDiscount()}
            </div>
          </div>
          <button className="btn btn-primary"
                  disabled={!Object.keys(this.state.products).length || this.state.customer_id <= 0}
                  onClick={(e) => {
                    e.preventDefault();
                    this.props.onCreateOrUpdateInvoice(this.state)
                  }}>{title}</button>
        </form>
      </div >
    );
  }
}
InvoiceForm.propTypes = {
  onCreateOrUpdateInvoice: React.PropTypes.func
};

class InvoiceList extends Component {
  customerToString(id) {
    let customer = this.props.customers.find(c => c.id === id);
    return `${customer.name} (${id})`;
  }

  render() {
    return (
      <div>
        <table className="table table-striped table-hover">
          <thead>
          <tr>
            <th>ID</th>
            <th>Customer(ID)</th>
            <th>Discount</th>
            <th>Total</th>
            <th className="column-actions">(actions)</th>
          </tr>
          </thead>
          <tbody>
          {this.props.data.map(invoice => (
            <tr className={classnames({success: this.props.selectedId === invoice.id})} key={invoice.id}>
              <td>{invoice.id}</td>
              <td>{this.customerToString(invoice.customer_id)}</td>
              <td>{invoice.discount}%</td>
              <td>${invoice.total}</td>
              <td>
                <button className="btn btn-info btn-action"
                        onClick={(e) => {
                          e.preventDefault();
                          this.props.onSelectInvoice(invoice.id);
                        }}>{this.props.selectedId === invoice.id ? 'Cancel' : 'Edit'}
                </button>
                <button className="btn btn-danger btn-action"
                        onClick={(e) => {
                          e.preventDefault();
                          this.props.onDeleteInvoice(invoice.id);
                        }}>Delete
                </button>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
        {this.props.data.length ? '' : 'No invoices created yet.'}
      </div>
    );
  }
}
InvoiceList.propTypes = {
  data: React.PropTypes.array.isRequired,
  onDeleteInvoice: React.PropTypes.func,
  onSelectInvoice: React.PropTypes.func
};

const mapStateToProps = state => ({
  invoices: state.invoices.data,
  customers: state.customers.data,
  products: state.products.data,
  loading: state.invoices.status !== 'synced' || state.customers.status !== 'synced' || state.products.status !== 'synced'
});

const mapDispatchToProps = dispatch => ({
  syncInvoices: () => dispatch(actions.syncInvoices()),
  syncCustomers: () => dispatch(actions.syncCustomers()),
  syncProducts: () => dispatch(actions.syncProducts()),
  createInvoice: (invoice) => dispatch(actions.createInvoice(invoice)),
  updateInvoice: (attrs, oldAttr) => dispatch(actions.updateInvoice(attrs, oldAttr)),
  deleteInvoice: (id) => dispatch(actions.deleteInvoice(id))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedInvoiceId: -1
    };
  }

  getInvoice(id) {
    return (this.props.invoices || []).find(el => el.id === id) || {};
  }

  componentDidMount() {
    if (this.props.loading) {
      this.props.syncInvoices();
      this.props.syncCustomers();
      this.props.syncProducts();
    }
  }

  onEditInvoice(id) {
    let selectedInvoiceId = id;
    if (id === this.state.selectedInvoiceId) {
      selectedInvoiceId = -1;
    }
    this.setState({
      selectedInvoiceId
    });
  }

  createOrUpdateInvoice(invoice) {
    if (invoice.id) {
      this.props.updateInvoice(invoice, this.getInvoice(invoice.id));
    } else {
      this.props.createInvoice(invoice);
    }
  }

  render() {
    return (
      <div>
        <div className="col-md-9">
          <h1>Invoices</h1>
          {this.props.loading ? (<Loader/>) : (
              <InvoiceList customers={this.props.customers}
                           data={this.props.invoices}
                           onSelectInvoice={id => this.onEditInvoice(id)}
                           onDeleteInvoice={id => this.props.deleteInvoice(id)}
                           selectedId={this.state.selectedInvoiceId}/>
            )}
        </div>
        <div className="col-md-3" role="complementary">
          {this.props.loading ? (<Loader/>) : (
              <InvoiceForm invoice={this.getInvoice(this.state.selectedInvoiceId)}
                           customers={this.props.customers}
                           products={this.props.products}
                           onCreateOrUpdateInvoice={invoice => this.createOrUpdateInvoice(invoice)}/>
            )}
        </div>
      </div>
    );
  }
});
