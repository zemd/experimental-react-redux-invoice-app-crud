'use strict';

import {Router, Route, IndexRedirect, hashHistory} from 'react-router';

import ReactDOM from 'react-dom';
import React from 'react';

import 'whatwg-fetch';

import App from 'components/App';
import Invoices from 'components/Invoices';
import Products from 'components/Products';
import Customers from 'components/Customers';

import 'jquery/dist/jquery';
import 'bootstrap/dist/js/bootstrap';

import 'index.html';
import 'app.css';

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRedirect to="invoices"/>
      <Route path="invoices" components={Invoices}/>
      <Route path="products" component={Products}/>
      <Route path="customers" component={Customers}/>
    </Route>
  </Router>,
  document.getElementById('app')
);
