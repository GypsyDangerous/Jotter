import React, { useState, useContext, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faSearch, faSignOutAlt} from "@fortawesome/free-solid-svg-icons"
import { Link } from "react-router-dom"



import "./Header.css"
import { AuthContext } from '../shared/util/Auth';
import firebase from "../firebase"
import { SearchContext } from '../shared/util/SearchContext';


const SearchBar = props => {


    const searchSubmitHandler = e => {
        e.preventDefault()
    }

    const { query, setQuery, setIsSearching} = useContext(SearchContext)

    return (
        <form className={props.className} onSubmit={searchSubmitHandler}>
            <button disabled={props.disabled} type="submit" className="search__button"> <FontAwesomeIcon icon={faSearch} /> </button>
            <input onFocus={() => setIsSearching(true)} onBlur={() => setIsSearching(false)} placeholder="search" disabled={props.disabled} type="text" className="search__text" value={query} onChange={e => setQuery(e.target.value)}/>
        </form>  
    )
}

const Header = props => {

    const { currentUser } = useContext(AuthContext)
    const [show, setShow] = props.sidebarOptions
    return (
        <header className="site-header">
            <div className="site-header__left">
                <button disabled={!currentUser} onClick = {() => setShow(s => !s)} className="site-header__hamburger">
                    <span id="a" className="bar"></span>
                    <span id="b" className="bar"></span>
                    <span id="c" className="bar"></span>
                </button>
                <Link to="/" className="site-header__title">
                    <img src="https://img.icons8.com/clouds/2x/note.png" className="site-header__logo" alt="logo"/>
                    <h2>Jotter</h2>
                </Link>
            </div>
            <SearchBar searchOptions={props.searchOptions} disabled={!currentUser} className="site-header__search"></SearchBar>
            <div className="site-header__user">
                <button className="signout" onClick={() => { firebase.auth().signOut(); localStorage.removeItem("currentUser"); setShow(false) }}><FontAwesomeIcon icon={faSignOutAlt} />  </button>:
            </div>
        </header>
    );
}

export default Header;
