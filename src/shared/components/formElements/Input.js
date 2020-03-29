import React, { useState } from 'react';

import "./Input.css"

const Input = props => {

    const [value, setValue] = useState(props.value || "")
    
    const changeHandler = e => {
        setValue(e.target.value)
        props.onInput(props.id, e.target.value, e.target.value.length > 0)
    }

    const elt = props.type === "text" ? 
    <input 
        type="text"
        value = {value}
        id={props.id}
        onChange={changeHandler}
        autoFocus
    />
    :
    <textarea 
        name="" 
        id={props.id} 
        cols="30" 
        rows="10"
        onChange={changeHandler}
        value={value}
    ></textarea>
    

    return (
        <div className={props.className}>
           <label htmlFor={props.id}>{props.label}</label>
           {elt}
        </div>
    );
}

export default Input;
