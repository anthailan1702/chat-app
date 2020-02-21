import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';

import APIService from '../libs/apiService';
import { LocalStorageKey } from '../constants';
import ChatPage from './ChatPage';
import LoginPage from './LoginPage';
import SignUpPage from './SignUpPage';

class App extends React.Component {
  state = {
    isLoading: false,
    isAuthenticated: false,
    user: null
  }

  getMyInfo() {
    this.setState({ isLoading: true });
    APIService.getMyInfo()
      .then(res => {
        this.setState({
          user: res.data,
          isAuthenticated: true
        })
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        this.setState({
          isLoading: false,
        })
      })
  }

  componentDidMount() {
    const accessToken = localStorage.getItem(LocalStorageKey.ACCESS_TOKEN);

    if (accessToken) {
      this.getMyInfo();
    }
  }

  handleLogIn = (accessToken, user) => {
    localStorage.setItem(LocalStorageKey.ACCESS_TOKEN, accessToken);
    this.getMyInfo();
  }

  handleSignUp = (accessToken, user) => {
    localStorage.setItem(LocalStorageKey.ACCESS_TOKEN, accessToken);
    this.getMyInfo();
  }

  handleLogOut = () => {
    localStorage.removeItem(LocalStorageKey.ACCESS_TOKEN);
    this.setState({ 
      isAuthenticated: false
    });
  }

  render() {
    const { isAuthenticated, isLoading, user } = this.state;

    if (isLoading) return null;

    return (
      <Router>        
        { isAuthenticated ? (
          <Switch>
            <Route path="/messages">
              <ChatPage user={user} />
            </Route>
            <Redirect to="/messages"/>
          </Switch>
        ) : (
          <Switch>
            <Route path="/sign-up">
              <SignUpPage onSignUpSuccess={this.handleSignUp}/>
            </Route>
            <Route path="/">
              <LoginPage onLoginSuccess={this.handleLogIn}/>
            </Route>
            <Redirect to="/"/>
          </Switch>
        ) } 
      </Router>
    );
  }
}

export default App;
