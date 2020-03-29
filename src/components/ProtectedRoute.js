import React, {useContext, useState, useEffect} from 'react';
import {Route, Redirect} from "react-router-dom"
import {AuthContext } from "../shared/util/Auth"

const ProtectedRoute = ({component: RouteComponent, ...rest}) => {
    
    const {currentUser} = useContext(AuthContext)
    const [render, setRender] = useState(false)

    return (
        <>
            {<Route
                {...rest}
                render={routeProps => 
                    !!currentUser ? (
                        <RouteComponent {...routeProps}/>
                    ) : (
                        <Redirect to="/auth/login"/>
                    )
                }
            />}
        </>
    );
}

export default ProtectedRoute;
