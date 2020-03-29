import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import ProtectedRoute from './Components/Routes/ProtectedRoute';
import Login from './Views/Login/Login';
import Error from './Views/Error/Error';
import Reset from './Views/Reset Password/Reset';
import Dashboard from './Layouts/Dashboard/Dashboard';
import GetToken from './Views/Reset Password/GetToken';

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
            <Switch>
                <Route
                    path="/securelogin/token-id=r$3easd"
                    exact
                    component={Login}
                />
                <Route
                    path="/error"
                    exact
                    component={Error}
                />
                <Route
                    path="/get-token"
                    exact
                    component={GetToken}
                />
                <Route
                    path="/reset-password/:authToken"
                    exact
                    component={Reset}
                />
                <ProtectedRoute
                    component={Dashboard}
                    path="/" 
                />  
            </Switch>
        </BrowserRouter>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
