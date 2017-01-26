'use strict';

//noinspection JSUnresolvedVariable
import React, {Component} from 'react';
import {connect} from 'react-redux';
import classnames from 'classnames';

import * as actions from '../actions';
import _ from 'lodash';

import Loader from './Loader';

class CustomerForm extends Component {
  constructor(props) {
    super(props);

    this.state = this.buildStateObject(props);
  }

  componentWillReceiveProps(props) {
    this.setState(this.buildStateObject(props));
  }

  buildStateObject(props) {
    return {
      id: _.get(props, 'customer.id', null),
      name: _.get(props, 'customer.name', ''),
      address: _.get(props, 'customer.address', ''),
      phone: _.get(props, 'customer.phone', '')
    };
  }

  changeCustomerProp(key, value) {
    this.setState({[key]: value});
  }

  render() {
    let title = this.state.id ? 'Update' : 'Create';
    return (
      <div>
        <h2>{title} customer</h2>
        <form>
          <div className="form-group">
            <label>Name</label>
            <input className="form-control" value={this.state.name}
                   onChange={(e) => this.changeCustomerProp('name', e.target.value)}/>
          </div>
          <div className="form-group">
            <label>Address</label>
            <input className="form-control" value={this.state.address}
                   onChange={(e) => this.changeCustomerProp('address', e.target.value)}/>
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input className="form-control" value={this.state.phone}
                   onChange={(e) => this.changeCustomerProp('phone', e.target.value)}/>
          </div>
          <button className="btn btn-primary"
                  onClick={(e) => {
                    e.preventDefault();
                    this.props.onCreateOrUpdateCustomer(this.state)
                  }}>{title}</button>
        </form>
      </div>
    );
  }
}
CustomerForm.propTypes = {
  onCreateOrUpdateCustomer: React.PropTypes.func
};

class CustomerList extends Component {
  render() {
    return (
      <div>
        <table className="table table-striped table-hover">
          <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Address</th>
            <th>Phone</th>
            <th className="column-actions">(actions)</th>
          </tr>
          </thead>
          <tbody>
          {this.props.data.map(customer => (
            <tr className={classnames({success: this.props.selectedId === customer.id})} key={customer.id}>
              <td>{customer.id}</td>
              <td>{customer.name}</td>
              <td>{customer.address}</td>
              <td>{customer.phone}</td>
              <td>
                <button className="btn btn-info btn-action"
                        onClick={(e) => {
                          e.preventDefault();
                          this.props.onSelectCustomer(customer.id);
                        }}>{this.props.selectedId === customer.id ? 'Cancel' : 'Edit'}
                </button>
                <button className="btn btn-danger btn-action"
                        onClick={(e) => {
                          e.preventDefault();
                          this.props.onDeleteCustomer(customer.id);
                        }}>Delete
                </button>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    );
  }
}
CustomerList.propTypes = {
  data: React.PropTypes.array.isRequired,
  onSelectCustomer: React.PropTypes.func,
  onDeleteCustomer: React.PropTypes.func,
  selectedId: React.PropTypes.number
};

const mapStateToProps = state => ({
  customers: state.customers.data,
  loading: state.customers.status !== 'synced'
});

const mapDispatchToProps = dispatch => ({
  syncCustomers: () => dispatch(actions.syncCustomers()),
  createCustomer: (attrs) => dispatch(actions.createCustomer(attrs)),
  updateCustomer: (attrs) => dispatch(actions.updateCustomer(attrs)),
  deleteCustomer: (id) => dispatch(actions.deleteCustomer(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedCustomerId: -1
    };
  }

  getCustomer(id) {
    return (this.props.customers || []).find(c => c.id === id) || {};
  }

  componentDidMount() {
    if (this.props.loading) {
      this.props.syncCustomers();
    }
  }

  onEditCustomer(id) {
    let selectedCustomerId = id;
    if (id === this.state.selectedCustomerId) {
      selectedCustomerId = -1;
    }
    this.setState({
      selectedCustomerId
    });
  }

  createOrUpdateCustomer(customer) {
    if (customer.id) {
      this.props.updateCustomer(customer);
    } else {
      this.props.createCustomer(customer);
    }
  }

  render() {
    return (
      <div>
        <div className="col-md-9">
          <h1>Customers</h1>
          {
            this.props.loading ?
              (<Loader/>) : (
                <CustomerList
                  data={this.props.customers}
                  onSelectCustomer={id => this.onEditCustomer(id)}
                  onDeleteCustomer={id => this.props.deleteCustomer(id)}
                  selectedId={this.state.selectedCustomerId}/>
              )
          }
        </div>
        <div className="col-md-3" role="complementary">
          <CustomerForm customer={this.getCustomer(this.state.selectedCustomerId)}
                       onCreateOrUpdateCustomer={customer => this.createOrUpdateCustomer(customer)}/>
        </div>
      </div>
    );
  }
});
