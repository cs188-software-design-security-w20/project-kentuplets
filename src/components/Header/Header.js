import React from 'react';
import {connect} from 'react-redux';
import {NavLink} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faUser, faShoppingCart, faSignOutAlt} from '@fortawesome/free-solid-svg-icons'
import {Auth} from 'aws-amplify'

const Header = () => {
    return (

        <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
            <div className="container">

                <NavLink className="navbar-brand" to="/">KennysList</NavLink>
                <div>
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item">
                            <NavLink className="nav-link" to={"/additem"}><FontAwesomeIcon icon={faPlus} />Add Item</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to={"/profile"}><FontAwesomeIcon icon={faUser} />Selling</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to={"/cart"}><FontAwesomeIcon icon={faShoppingCart} />BidCart</NavLink>
                        </li>
                        <li className="nav-item ml-4" onClick={() => Auth.signOut().then(data => console.log(data)).catch(err => console.log(err))}>
                            <NavLink className="nav-link" to={"/logout"}><FontAwesomeIcon icon={faSignOutAlt} />Logout</NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default connect(null)(Header);