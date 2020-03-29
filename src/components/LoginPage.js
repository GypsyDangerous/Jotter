import React, { useState } from 'react';
import { withRouter, Redirect } from 'react-router';
import firebase from "../firebase"
import { useContext } from 'react';
import { AuthContext } from '../shared/util/Auth';
import { faGoogle, faGithub } from "@fortawesome/free-brands-svg-icons"
import {faEye, faEyeSlash, faUsers} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

const LoginPage = ({ history, match }) => {

    console.log(match)
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [showPassword, setShowPassword] = useState(false)

    const formSubmitHandler = async e => {
        e.preventDefault()
        login(email, password)
        setMode("user")
    }

    const login = async (eml, pword) => {
        try {
            if(remember){
                await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
            }else{
                await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE)
            }
            await firebase.auth().signInWithEmailAndPassword(eml, pword)
            history.push("/")
        } catch (err) {
            alert(err)
        }
    }

    const { currentUser, setMode, remember, setRemember} = useContext(AuthContext)

    if(currentUser){
        return <Redirect to="/"/>
    } 

    const handleGoolgeSignIn = async e => {
        if (remember) {
            await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        } else {
            await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE)
        }
        const provider = new firebase.auth.GoogleAuthProvider();
        const result = await firebase.auth().signInWithRedirect(provider)
        const user = result.user
        firebase.firestore().collection("users").doc(user.uid).set({
            name: user.displayName,
            uid: user.uid
        })
        setMode("user")
    }

    const handleDemoSignIn = async e => {
        e.preventDefault()
        login("demo@gmail.com", "password")
        setMode("demo")
    }

    return (

        <div className="row">
            <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                <div className="card card-signin my-5">
                    <div className="card-body">
                        <h5 className="card-title text-center">Sign In</h5>
                        <form className="form-signin" onSubmit={formSubmitHandler}>
                            <div className="form-label-group">
                                <input type="email" id="inputEmail" value={email} onChange={e => setEmail(e.target.value)} className="form-control" placeholder="Email address" required autofocus/>
                                <label htmlFor="inputEmail">Email address</label>
                            </div>
                            <div className="form-label-group">
                                <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} id="inputPassword" className="form-control" placeholder="Password" required/>
                                <label htmlFor="inputPassword">Password</label>
                                <input type="checkbox" id="showPassword" checked={showPassword} onChange={e => setShowPassword(e.target.checked)}/>
                                <label htmlFor="showPassword" className="show-password" style={{cursor: "pointer"}}><FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash}/></label>
                            </div>
                            <div className="custom-control custom-checkbox mb-3">
                                <input type="checkbox" className="custom-control-input" id="customCheck1" checked={remember} onChange={e => setRemember(e.target.checked)}/>
                                <label className="custom-control-label" htmlFor="customCheck1">Remember Me</label>
                            </div>
                            <button className="btn btn-lg btn-primary btn-block text-uppercase" type="submit">Sign in</button>
                            <hr className="my-4"/>
                        </form>
                        <div className="form-signin">
                            <button onClick={handleGoolgeSignIn} className="btn btn-lg btn-google btn-block text-uppercase" type="submit"><FontAwesomeIcon icon={faGoogle} className="logo mr-2" /> Sign in with Google</button>
                            <button className="btn btn-lg btn-github btn-block text-uppercase" type="submit"><FontAwesomeIcon icon={faGithub} className="logo mr-2" />Sign in with Github</button>
                            <button onClick={handleDemoSignIn} className="btn btn-lg btn-github btn-block text-uppercase" type="submit"><FontAwesomeIcon icon={faUsers} className="logo mr-2" />Sign in with Demo Account</button>
                            <div className="form__links">
                                <span>Need an account? <Link to="/auth/register">Register</Link></span>
                                <Link to="/auth/register">Change Password</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default withRouter(LoginPage)
