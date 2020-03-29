import React, { useState, useContext, useEffect } from 'react';

import "./Note.css"
import Modal from '../shared/components/Modal';
import firebase from "../firebase"
import useForm from '../shared/hooks/form-hook';
import Input from '../shared/components/formElements/Input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare, faCheckSquare } from '@fortawesome/free-regular-svg-icons';
import { faPlus, faTrash, faArchive, faTrashRestore, faPalette, faCheck } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../shared/util/Auth';
import showdown from "showdown"
import MDReactComponent from 'markdown-react-js';


const newLineify = str => {
    str = str.replace(/(\r\n|\n|\r)/gm,"&nbsp;  \n ").split(" ")

    const urlRegex = /(https?:\/\/[^ ]*)/

    for(let i = 0; i < str.length; i++){
        const word = str[i]
        const match = word.match(urlRegex)
        if(match){
            str[i] = `<${word}>`
        }
    }
    
    return str.join(" ")
}

const ListItem = props => {
    // console.log(props.item)
    const [checked, setChecked] = useState(props.item.isChecked)

    useEffect(() => {
        setChecked(props.item.isChecked)
    }, [props])

    const {currentUser, mode} = useContext(AuthContext)

    const updateCheck = async () => {
        const db = firebase.firestore()
        const copy = [...props.parentList]
        setChecked(c => !c)

        copy[props.index].isChecked = !checked
        if(!checked){
            const item = copy.splice(props.index, 1)
            
            await db.collection("users").doc(currentUser.uid).collection("notes").doc(props.parentId).update({
                listitems: copy,
                completedItems: [...item, ...props.completedItems]
            })
        }else{
            const item = copy.splice(props.index, 1)
            await db.collection("users").doc(currentUser.uid).collection("notes").doc(props.parentId).update({
                listitems: [...props.listItems, ...item],
                completedItems: copy
            })
        }   

        props.onUpdate()
    } 

    return (
        <div className="list-item" >
            <FontAwesomeIcon className="list-item__checkbox" onClick={updateCheck} icon={checked? faCheckSquare : faSquare}/>
            <span className={`list-item__content ${checked && "list-item__content-complete"}`}>
                {props.item.body}
            </span>
        </div>
    )
}

const Note = props => {

    const [editing, setEditing] = useState(false)
    const [body, setBody] = useState(props.body)
    const [title, setTitle] = useState(props.title)
    const [warning, setWarn] = useState(false)
    const [color, setColor] = useState(props.note.color)
    const [viewMode, setViewMode] = useState(false)
    const [formState, inputHandler] = useForm({
        title: {
            value: props.title,
            isValid: true
        },
        body: {
            value: props.body,
            isValid: true
        }
    }, true)

    const handleSubmit = e => {
        if(!editing){
            setEditing(true)
            // setViewMode(false)
        }
    }

    const { currentUser, mode } = useContext(AuthContext)

    const updateNote = async e => {
        try{
            e.preventDefault()
        }catch(err){

        }
        if(mode === "user"){
            if(props.note.type === "list"){
                const db = firebase.firestore()
                await db.collection("users").doc(currentUser.uid).collection(props.from).doc(props.id).update({
                    color: color
                })
            }else{
                const db = firebase.firestore()
                await db.collection("users").doc(currentUser.uid).collection(props.from).doc(props.id).update({
                    title: formState.inputs.title.value,
                    body: formState.inputs.body.value,
                    color: color
                })
            }
        }
        setTitle(formState.inputs.title.value)
        setBody(formState.inputs.body.value)
        setEditing(false)
    }

    useEffect(() => {
        updateNote()
        props.onSearch()
    }, [title, color, body])

    const deleteNote = () => {
        moveNote(props.from, "trash")
    }

    const archiveNote = () => {
        moveNote("notes", "archive")
    }

    const unTrashNote = () => {
        moveNote("trash", "notes")
    }

    const unArchiveNote = () => {
        moveNote("archive", "notes")
    }

    const moveNote = async (from, to) => {
        const db = firebase.firestore()
        const user = db.collection("users").doc(currentUser.uid)
        const data = await user.collection(from).doc(props.id).get()
        const note = data.data()
        const id = data.id
        await user.collection(to).doc(id).set(note)
        await user.collection(from).doc(props.id).delete()
        props.onUpdate()
    }

    const PermaDeleteNote = async () => {
        const db = firebase.firestore()
        const user = db.collection("users").doc(currentUser.uid)
        await user.collection(props.from).doc(props.id).delete()
        props.onUpdate()
    }

    const noteBody = !!props.listitems ?
    <article className="note__body" onClick={handleSubmit}>
        <h5 className="note__title">{props.title}</h5>
       {props.listitems.map((item, i) => (<ListItem key={i} index={i} onUpdate={props.onUpdate} listItems={props.listitems || []} parentId={props.id} parentList={props.listitems} completedItems={props.completedItems} item={item}/>))}
       <hr/>
            {props.completedItems.map((item, i) => (<ListItem key={i} onUpdate={props.onUpdate} listItems={props.listitems || []} index={i} parentId={props.id} parentList={props.completedItems} completedItems={props.completedItems} item={item} />))}
    </article> :
    <article className="note__body" onClick={handleSubmit}>
        <h5 className="note__title">{title}</h5>
        {/* {newLineify(body).map(str => str === "br" ? <br key={props.id} /> : str instanceof Object ? <a className="note__link" key={str.link} href={str.link}>{str.link}</a> : str + " ")} */}
        <MDReactComponent text={newLineify(body)} /> 
    </article>


    const isDisabled = mode === "demo"

    const colorTip = <p className="Tooltip color__tooltip">
        {["default", "red", "green", "blue", "yellow", "orange", "purple", "pink", "teal"].map(col => (
            <button key={col} onClick={e => setColor(col)}  className={`color color-${col}`}><FontAwesomeIcon className={`${color === col && "current"}`} icon={faCheck} /><p className="Tooltip">{col}</p></button>
        ))}
    </p>

    const buttons = props.inTrash ?
        <>
            <button disabled={isDisabled} onClick={unTrashNote} className="note__button"><FontAwesomeIcon icon={faTrashRestore}/><p className="Tooltip">Restore</p></button>
            <div className="note__button"><FontAwesomeIcon icon={faPalette}/>{colorTip}</div>
            <button disabled={isDisabled} onClick={PermaDeleteNote} className="note__button"><FontAwesomeIcon icon={faTrash} /><p className="Tooltip">Delete Forever</p></button>
        </> : 
        props.inArchive ? 
        <>
            <button disabled={isDisabled} onClick={unArchiveNote} className="note__button" type="submit"><FontAwesomeIcon icon={faArchive} /><p className="Tooltip">UnArchive</p></button>
            <div className="note__button"><FontAwesomeIcon icon={faPalette}/>{colorTip}</div>
            <button disabled={isDisabled} onClick={deleteNote} className="note__button"><FontAwesomeIcon icon={faTrash}></FontAwesomeIcon><p className="Tooltip">Trash</p></button>
        </> : 
        <>
            <button disabled={isDisabled} onClick={archiveNote} className="note__button" type="submit"><FontAwesomeIcon icon={faArchive} /><p className="Tooltip">Archive</p></button>
            <div className="note__button"><FontAwesomeIcon icon={faPalette}/>{colorTip}</div>
            <button disabled={isDisabled} onClick={deleteNote} className="note__button"><FontAwesomeIcon icon={faTrash}></FontAwesomeIcon><p className="Tooltip">Trash</p></button>
        </>

    return (
        <div className={`note color-${color}`} >
            <Modal show={editing} className="note__editor" headerClass="note__editor--header" onSubmit={updateNote} onCancel={() => setEditing(false)} footer={
                (
                    <button type="submit">Update Note</button>
                )
            }>
                <Input className="note__display-title" label="" id="title" type="text" value={title} onInput={inputHandler} autofocus />
                <br />
                {props.note.type !== "list" && 
                <div className="note__display-body">
                    {!viewMode && <Input label="" className="note__editing" id="body" value={body} onInput={inputHandler} />}
                    {viewMode && <MDReactComponent  text={newLineify(body)}/>}
                </div>
                }
                {props.note.type === "list" && 
                <>
                    {props.note.listitems.map(item => (
                       <div>{item.body}</div>
                    ))}
                    <hr/>
                    {props.note.completedItems.map(item => (
                        <div >{item.body}</div>
                    ))}
                </>
                }
                <div onClick={() => setViewMode(v => !v)} className="view__button">View note</div>
            </Modal>
            <Modal show={warning} onCancel={() => setWarn(false)} headerClass="modal__header--danger" header={<h2>Warning</h2>} footer={
                <>
                    <button onClick={() => setWarn(false)}>Cancel</button>
                    <button onClick={() => {deleteNote(); setWarn(false)}}>Yes Delete Note</button>
                </>
            }>
                <h4>Are you sure you want to delete this note, this action can not be undone</h4>
            </Modal>
            
            {noteBody}
            <div className="note__buttons">
                {buttons}
            </div>
        </div>
    );
}

export default Note;
