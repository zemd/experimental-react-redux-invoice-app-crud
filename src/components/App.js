'use strict';

//noinspection JSUnresolvedVariable
import React, {Component} from 'react';
import {Provider} from 'react-redux';

import Header from './Header';

import store from '../store';

export default class extends Component {
  render() {
    return (
      <Provider store={store}>
        <div>
          <Header/>
          <div className="container">
            {this.props.children}
          </div>
        </div>
      </Provider>
    );
  }
}
