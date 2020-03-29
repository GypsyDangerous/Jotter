import React, { useState, useEffect } from 'react';

import "./Sidebar.css"
import { CSSTransition } from 'react-transition-group';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare, faCheckSquare, faLightbulb} from '@fortawesome/free-regular-svg-icons';
import { faTrash, faArchive, faTrashRestore } from '@fortawesome/free-solid-svg-icons';

const Sidebar = props => {

    const [inProp, setInProp] = useState(true)

    useEffect(() => {
        setInProp(props.show)
    }, [props])

    return (
        <CSSTransition in={inProp} classNames="my-node">
            <div className={`sidebar`}>
                <NavLink className="option" activeClassName="option-active" exact to="/"><FontAwesomeIcon icon={faLightbulb} /><span>Notes</span></NavLink>
                <NavLink className="option" activeClassName="option-active" to="/archive"><FontAwesomeIcon icon={faArchive} /><span>Archive</span></NavLink>
                <NavLink className="option" activeClassName="option-active" to="/trash"><FontAwesomeIcon icon={faTrash} /><span>Trash</span></NavLink>
                <hr/>
            </div>
        </CSSTransition>
    );
}

export default Sidebar;
