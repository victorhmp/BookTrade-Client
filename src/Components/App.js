import React, { Component } from 'react';
import Auth from '../Modules/Auth';
import axios from 'axios';

import '../styles/styles.scss';

import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";
import NotFoundPage from './NotFoundPage';
import Navbar from './Navbar';
import LandingPage from './LandingPage';
import Dashboard from './Dashboard';
import Wishlist from './Wishlist';
import WishlistCreate from './WishlistCreate';
import WishlistItem from './WishlistItem';

class App extends Component {
  constructor() {
    super();
    this.state = {
      auth: Auth.isUserAuthenticated(),
    };
    this.handleRegisterSubmit = this.handleRegisterSubmit.bind(this);
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleWishlistSubmit = this.handleWishlistSubmit.bind(this);
    this.handleWishlistDelete = this.handleWishlistDelete.bind(this);
  }

  handleRegisterSubmit(e, data) {
    e.preventDefault();
    axios.post(`http://localhost:3000/users`, JSON.stringify({
      user: data,
    }), {
      headers: {
        'Content-Type': 'application/json',
      }
    }).then((response) => {
      Auth.authenticateToken(response.data.token);
      this.setState({
        auth: Auth.isUserAuthenticated(),
      });
    }).catch(err => {
      console.log(err);
    })
  }

  handleLoginSubmit(e, data) {
    e.preventDefault();
    axios.post(`http://localhost:3000/login`, JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(response => {
      Auth.authenticateToken(response.data.token);
      this.setState({
        auth: Auth.isUserAuthenticated(),
        // shouldGoToDashboard: true,
      });
      console.log(Auth.getToken());
    }).catch(err => {
      console.log(err);
    })
  }

  handleLogout() {
    axios.delete('http://localhost:3000/logout', {
      headers: {
        token: Auth.getToken(),
        'Authorization': `Token ${Auth.getToken()}`,
      }
    }).then(response => {
      Auth.deauthenticateUser();
      this.setState({
        auth: Auth.isUserAuthenticated(),
      })
    }).catch((err) => console.log(err));
  }

  handleWishlistSubmit(e, data) {
    e.preventDefault();
    axios.post('http://localhost:3000/wishlists', JSON.stringify({
      wishlist: data,
    }), {
      headers: {
        'Content-Type': 'application/json',
        token: Auth.getToken(),
        'Authorization': `Token ${Auth.getToken()}`,
      }
    }).then((response) => {
      console.log(response);      
    }).catch(err => {
      console.log(err);
    })
  }

  handleWishlistDelete(data) {
    axios.delete('http://localhost:3000/wishlists/' + data, {
      headers: {
        wishlist: data,
        token: Auth.getToken(),
        'Authorization': `Token ${Auth.getToken()}`,
      }
    }).then(response => {
      console.log(response);   
    }).catch(err => {
      console.log(err);
    })
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <Navbar loggedIn={this.state.auth} handleLogout={this.handleLogout} />
          <Switch>
            <Route path="/" component={LandingPage} exact={true} />
            <Route 
              path="/register" 
              render={
                () => (this.state.auth)
                ? <Redirect to="dash" />
                : <RegisterForm handleRegisterSubmit={this.handleRegisterSubmit}/>}
            />
            <Route 
              path="/login" 
              render={
                () => (this.state.auth)
                ? <Redirect to="dash" />
                : <LoginForm handleLoginSubmit={this.handleLoginSubmit} />
              }
            />
            <Route 
              path="/dash"
              render={
                () => (this.state.auth)
                ? <Dashboard />
                : <Redirect to="/" />
              }
            />
            <Route 
              path="/wishlists"
              render={
                () => (this.state.auth)
                ? <Wishlist handleWishlistDelete={this.handleWishlistDelete}/>
                : <Redirect to="/" />
              }
            />
            <Route 
              path="/wishlistsCreate"
              render={
                () => (this.state.auth)
                ? <WishlistCreate handleWishlistSubmit={this.handleWishlistSubmit}/>
                : <Redirect to="/wishlists"/>
              }
            />
            <Route 
              path="/wishlistItems"
              render={
                () => (this.state.auth)
                ? <WishlistItem />
                : <Redirect to="/wishlists"/>
              }
            />
            <Route component={NotFoundPage} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;