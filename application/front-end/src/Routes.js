import React, { Component } from "react";
import { Router, Switch, Route } from "react-router-dom";
import About from "./components/About/AboutMe";
import Admin from "./components/Admin/Admin";
import CreateProduct from "./components/Products/CreateProduct"
import Home from "./components/Home/Home";
import Message from "./components/Message/Message";
import Product from "./components/Products/Product";
import Profile from "./components/Profile/Profile";
import Result from "./components/Result/Result";
import Transaction from "./components/Transaction/Transaction";
import PrivateRoute from "./PrivateRoute";
import ProtectedRoute from "./ProtectedRoute";
import history from './history';
import AdminSigninModal from "./components/Admin/Modals/AdminSigninModal";

export default class Routes extends Component {
  render() {
    return (
      <Router history={history}>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/admin" component={Admin} />
          <PrivateRoute path="/adminLogin" component={AdminSigninModal} />
          <ProtectedRoute path="/createProduct" component={CreateProduct} />
          <ProtectedRoute path="/message" component={Message} />
          <Route path="/product" component={Product} />
          <Route path="/profile" component={Profile} />
          <Route path="/search" component={Result} />
          <ProtectedRoute path="/transaction" component={Transaction} />
          <Route path="*" component={() => <h1 style={{ textAlign: "center" }}>404 NOT FOUND</h1>} />
        </Switch>
      </Router>
    );
  }
}
