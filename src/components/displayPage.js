import React, { useEffect, useState } from 'react';

import './Home.css';
import Modal from '../shared/components/Modal';
import firebase from "../firebase"
import Note from './Note';
import useForm from '../shared/hooks/form-hook';
import Input from '../shared/components/formElements/Input';
import { useContext } from 'react';
import { AuthContext } from '../shared/util/Auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckSquare, faImage } from '@fortawesome/free-regular-svg-icons';
import { SearchContext } from '../shared/util/SearchContext';

const DisplayPage = props => {

    const [notes, setNotes] = useState([])
    const [creating, setCreating] = useState(false)
    const [formState, inputHandler] = useForm({
        title: {
            value: "",
            isValid: false
        },
        body: {
            value: "",
            isValid: false
        }
    }, false)  

    const { currentUser, mode } = useContext(AuthContext)
    const { query } = useContext(SearchContext)

    const startCreating = () => setCreating(true)
    const stopCreating = () => {
        setCreating(false)
        inputHandler("title", "", false)
        inputHandler("body", "", false)
    }

    useEffect(() => {
        document.title = `Jotter - ${props.location}`
        getData()
    }, [])

    const getDataSync = async () => {
        const db = firebase.firestore()
        const database = db.collection("users").doc(currentUser.uid).collection(props.notesLocation)
        const data = await database.get()
        const notes = data.docs.map(doc => ({ ...doc.data(), id: doc.id }))
        setNotes(notes)
    }

    const getData = async () => {
        const db = firebase.firestore()
        getDataSync()
        if (currentUser) {
            db.collection("users").doc(currentUser.uid).collection(props.notesLocation).onSnapshot(snapshot => {
                const notes = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
                setNotes(notes)
            })
        }
    }

    const getSearchData = async () => {
        const noteFilter = note => {
            const q = query.trim().split(" ")
            console.log(q)
            for (const part of q) {
                if (note.body.includes(part) || note.title.includes(part) || note.color.includes(part))
                    return true
            }
        }

        if (query) {
            const db = firebase.firestore()
            const database = db.collection("users").doc(currentUser.uid).collection(props.notesLocation)
            const data = await database.get()
            const notes = data.docs.map(doc => ({ ...doc.data(), id: doc.id }))
            setNotes(notes.filter(noteFilter))
        }
    }

    const addNote = async e => {
        e.preventDefault()
        const note = {
            title: formState.inputs.title.value,
            body: formState.inputs.body.value,
            created: new Date().getTime(),
            pinned: false,
            color: "default"
        }

        if (mode === "user") {
            const db = firebase.firestore()
            await db.collection("users").doc(currentUser.uid).collection(props.notesLocation).add(note)
            getData()
        } else {
            setNotes([...notes, note])
        }
        stopCreating()
    }

    const regularNoteModal =
        <Modal show={creating} onSubmit={addNote} onCancel={stopCreating} footer={
            <button type="submit">Create Note</button>
        }>
            <Input label="Title" id="title" type="text" onInput={inputHandler} />
            <br />
            <Input label="Body" id="body" onInput={inputHandler} />
        </Modal>

    useEffect(() => {
        if (query) {
            getSearchData()
        } else {
            getDataSync()
        }
    }, [query])

    return (
        <div className="App">
            {regularNoteModal}
            {props.notesLocation === "notes" && <div className="newNote" >
                <input onClick={e => { startCreating(); e.target.blur() }} type="text" placeholder="Take a note..." />
                <button className="check"><FontAwesomeIcon icon={faCheckSquare} /><p className="Tooltip">New list</p></button>
            </div>}
            <div className="App__notes">
                {notes.map(note => (
                    <Note from={props.notesLocation} inArchive={props.notesLocation === "archive"} inTrash={props.notesLocation === "trash"} note={note} onUpdate={getData} onSearch={getSearchData} type={note.type} title={note.title} body={note.body} listitems={note.listitems} completedItems={note.completedItems || []} key={note.id} id={note.id} />
                ))}
            </div>
        </div>
    );
}

export default DisplayPage;
