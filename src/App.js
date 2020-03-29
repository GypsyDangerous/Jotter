import React, { useState, useEffect, useContext } from 'react';
import {BrowserRouter as Router, Route, Redirect, Switch, Link} from "react-router-dom"

import './App.css';
import Header from './components/Header';
import { AuthProvider, AuthContext } from './shared/util/Auth';
import Home from './components/Home';
import ProtectedRoute from './components/ProtectedRoute';
import AuthPage from './components/AuthPage';
import Trash from './components/Trash';
import Archive from "./components/Archive"
import Sidebar from './components/Sidebar';
import { SearchContext, SearchProvider } from './shared/util/SearchContext';




function App() {
  const [render, setRender] = useState(false)
  const [show, setShow] = useState(false)

  const {currentUser, setCurrentUser, setMode} = useContext(AuthContext)

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem("currentUser"))
    if(!currentUser && localUser){
      setCurrentUser(localUser)
      if(localUser.email === "demo@gmail.com"){
        setMode("demo")
      }
    }else if(currentUser){
      if(currentUser.email === "demo@gmail.com"){
        setMode("demo")
      }
    }
  }, [render])

  useEffect(() => {
    setRender(true)
  }, [])


  return (
    <SearchProvider>
      <Router>
        <Header sidebarOptions = {[show, setShow]} />
        <Sidebar show={show}/>
          {render && <div className="container" >
            <Switch>
              <ProtectedRoute exact path="/" component={Home}></ProtectedRoute>
              <ProtectedRoute exact path="/archive" component={Archive}></ProtectedRoute>
              <ProtectedRoute exact path="/trash" component={Trash}></ProtectedRoute>
              <Route path="/auth" component={AuthPage}/>
              <Redirect to="/"/>
            </Switch>
          </div>}
      </Router>
    </SearchProvider>
  );
}

export default App;
