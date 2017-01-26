'use strict';

//noinspection JSUnresolvedVariable
import React, {Component} from 'react';
import {connect} from 'react-redux';
import classnames from 'classnames';

import * as actions from '../actions';
import _ from 'lodash';

import Loader from './Loader';

class ProductForm extends Component {
  constructor(props) {
    super(props);

    this.state = this.buildStateObject(props);
  }

  componentWillReceiveProps(props) {
    this.setState(this.buildStateObject(props));
  }

  buildStateObject(props) {
    return {
      id: _.get(props, 'product.id', null),
      name: _.get(props, 'product.name', ''),
      price: _.get(props, 'product.price', ''),
    };
  }

  changeProductProp(key, value) {
    this.setState({[key]: value});
  }

  render() {
    let title = this.state.id ? 'Update' : 'Create';
    return (
      <div>
        <h2>{title} product</h2>
        <form>
          <div className="form-group">
            <label>Name</label>
            <input className="form-control" value={this.state.name}
                   onChange={(e) => this.changeProductProp('name', e.target.value)}/>
          </div>
          <div className="form-group">
            <label>Price</label>
            <div className="input-group">
              <div className="input-group-addon">$</div>
              <input className="form-control" value={this.state.price}
                     onChange={(e) => this.changeProductProp('price', e.target.value)}/>
            </div>
          </div>
          <button className="btn btn-primary"
                  onClick={(e) => {
                    e.preventDefault();
                    this.props.onCreateOrUpdateProduct(this.state)
                  }}>{title}</button>
        </form>
      </div>
    );
  }
}
ProductForm.propTypes = {
  onCreateOrUpdateProduct: React.PropTypes.func
};

class ProductList extends Component {
  render() {
    return (
      <div>
        <table className="table table-striped table-hover">
          <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th className="column-actions">(actions)</th>
          </tr>
          </thead>
          <tbody>
          {this.props.data.map(product => (
            <tr className={classnames({success: this.props.selectedId === product.id})} key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>${product.price}</td>
              <td>
                <button className="btn btn-info btn-action"
                        onClick={(e) => {
                          e.preventDefault();
                          this.props.onSelectProduct(product.id);
                        }}>{this.props.selectedId === product.id ? 'Cancel' : 'Edit'}
                </button>
                <button className="btn btn-danger btn-action"
                        onClick={(e) => {
                          e.preventDefault();
                          this.props.onDeleteProduct(product.id);
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
ProductList.propTypes = {
  data: React.PropTypes.array.isRequired,
  onSelectProduct: React.PropTypes.func,
  onDeleteProduct: React.PropTypes.func,
  selectedId: React.PropTypes.number
};

const mapStateToProps = state => ({
  products: state.products.data,
  loading: state.products.status !== 'synced'
});

const mapDispatchToProps = dispatch => ({
  syncProducts: () => dispatch(actions.syncProducts()),
  createProduct: (attrs) => dispatch(actions.createProduct(attrs)),
  updateProduct: (attrs) => dispatch(actions.updateProduct(attrs)),
  deleteProduct: (id) => dispatch(actions.deleteProduct(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedProductId: -1
    };
  }

  getProduct(id) {
    return (this.props.products || []).find(p => p.id === id) || {};
  }

  componentDidMount() {
    if (this.props.loading) {
      this.props.syncProducts();
    }
  }

  onEditProduct(id) {
    let selectedProductId = id;
    if (id === this.state.selectedProductId) {
      selectedProductId = -1;
    }
    this.setState({
      selectedProductId
    });
  }

  createOrUpdateProduct(product) {
    if (product.id) {
      this.props.updateProduct(product);
    } else {
      this.props.createProduct(product);
    }
  }

  render() {
    return (
      <div>
        <div className="col-md-9">
          <h1>Products</h1>
          {
            this.props.loading ?
              (<Loader/>) : (
                <ProductList
                  data={this.props.products}
                  onSelectProduct={id => this.onEditProduct(id)}
                  onDeleteProduct={id => this.props.deleteProduct(id)}
                  selectedId={this.state.selectedProductId}/>
              )
          }
        </div>
        <div className="col-md-3" role="complementary">
          <ProductForm product={this.getProduct(this.state.selectedProductId)}
                       onCreateOrUpdateProduct={product => this.createOrUpdateProduct(product)}/>
        </div>
      </div>
    );
  }
});
