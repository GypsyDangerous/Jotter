import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch, Link, NavLink } from "react-router-dom"
import LoginPage from './LoginPage';
import SignUpPage from './SignUpPage';

import "./Auth.css"

const AuthPage = () => {

    return (
        <>
           <div className="auth-form__body">
               <Switch>
                   <Route path="/auth/login" component={LoginPage}/>
                   <Route path="/auth/register" component={SignUpPage}/>
               </Switch>
           </div>
        </>
    );
}

export default AuthPage;
