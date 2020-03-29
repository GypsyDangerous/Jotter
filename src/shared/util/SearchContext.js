import React, { useEffect, useState, createContext } from "react"
import firebase from "../../firebase"


export const SearchContext = createContext()

export const SearchProvider = props => {
    
    const [isSearching, setIsSearching] = useState(false)
    const [query, setQuery] = useState("");

    return (
        <SearchContext.Provider
            value={{
                isSearching,
                setIsSearching, 
                query,
                setQuery
            }}
        >
            {props.children}
        </SearchContext.Provider>
    )
}