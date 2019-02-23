import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoutes'
import Login from '../Login'
import NHome from '../NHome'

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route
                    path="/login"
                    exact
                    component={Login}
                />
                <ProtectedRoute
                    component={NHome}
                    exact
                    path="/" />
            </Switch>
        </BrowserRouter>
    )
}

export default AppRouter