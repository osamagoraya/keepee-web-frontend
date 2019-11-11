import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import Auth from '../../Services/Auth'

const ProtectedRoute = ({ component, path, ...props }) => {
    if (Auth.getAuthentication()) {
        return <Route
            path={path}
            component={component}
            {...props} />
    } else {
        return <Redirect to="/securelogin/token-id=r$3easd" />;
    }
}

export default ProtectedRoute
