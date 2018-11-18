import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import Auth from '../../Auth'

const ProtectedRoutes = ({ component, path, ...props }) => {
    if (Auth.getAuthentication()) {
        return <Route
            path={path}
            component={component}
            {...props} />
    } else {
        return <Redirect to="/login" />
    }
}

export default ProtectedRoutes
