import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import ProtectedRoute from './Components/Routes/ProtectedRoutes';
import Login from './Views/Login/Login';
import Dashboard from './Layouts/Dashboard/Dashboard';

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
            <Switch>
                <Route
                    path="/login"
                    exact
                    component={Login}
                />
                <ProtectedRoute
                    component={Dashboard}
                    path="/" />
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
