/* Copyright (C) Nils Blomberg & Isak Anderson - All Rights Reserved
* Unauthorized copying of this file, via any medium is strictly prohibited
* Proprietary and cofidential
* Written by Nils Blomberg <fred03.blomberg@gmail.com> and Isak Anderson <isak.anderson@gmail.com
*/

import React, { useEffect, useState } from 'react';
import firebase from "firebase"
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth"
import HomeIcon from '@material-ui/icons/Home';
import SearchIcon from '@material-ui/icons/Search';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import ListAltIcon from '@material-ui/icons/ListAlt';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { Button } from "@material-ui/core";
import AddBoxIcon from '@material-ui/icons/AddBox';
import GroupIcon from '@material-ui/icons/Group';
import SidebarOption from './SidebarOption';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ListAlt from '@material-ui/icons/ListAlt';
import { Link } from 'react-router-dom';
import './Sidebar.css';
import './SidebarOption.css';
import App from './App';
import { motion } from "framer-motion";

import { AiOutlineMenu } from "react-icons/ai"
import { userObject } from './App';
import DateFnsUtils from '@date-io/date-fns'; // choose your lib
import {
  DatePicker,
  TimePicker,
  DateTimePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import { SettingsApplicationsTwoTone } from '@material-ui/icons';
import {
    Menu,
    MenuItem,
    MenuButton
} from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/slide.css';

function Sidebar() {



   return (
    <div className="big-sidebar">
        <div className="sidebar">
             <div className="sidebar__left">
                <h2 class="name"><h2>K</h2>irja<h2>S</h2>eurenta</h2>
            </div>
            <div className="sidebar__mid">
                <Link className="Link" to="/">hem</Link> 
                <Link className="Link" to="/böcker">böcker</Link> 
                <Link className="Link" to="/sök">sök </Link>
                <Link className="Link" to="/add">lägg till </Link>
            </div>
           
             <div className="sidebar__right">
                <img className="profilePic"
                alt="profile picture"
                src={firebase.auth().currentUser.photoURL}
                />
                 <p className="username">{firebase.auth().currentUser.displayName}
                 </p>
                 <Button style={{backgroundColor: "#FFF"}} variant="contained" className="signout" onClick={() => firebase.auth().signOut()}>
                     <ExitToAppIcon style={{color: "black" }} fontSize="small"/>
                     
                </Button>
             <div 
       
             className="trashDropdownContainer">
                <Menu className="dropdown"
                 menuButton={<MenuButton> <AiOutlineMenu style={{color: "black" }} size={"30px"}/></MenuButton>} transition>
                        <div className="dropdown-links-container">
                            <Link className="Link-drop" to="/">hem</Link> 
                            <Link className="Link-drop" to="/böcker">böcker</Link> 
                            <Link className="Link-drop" to="/sök">sök </Link>
                            <Link className="Link-drop" to="/add">lägg till </Link>
                            <Button variant="contained" style={{backgroundColor: "rgb(225, 142, 142)", height: "34px"}} onClick={() => firebase.auth().signOut()}> 
                             <ExitToAppIcon style={{color: "black" }} fontSize="medium"/>
                             </Button>
                        </div>
                </Menu>

            </div>
            
            </div>
                </div>
                <motion.div 
               
                className="sidebar__mid_lower">
                    <div className="lower_inner">
                        <Link className="Link" to="/">hem</Link> 
                        <Link className="Link" to="/böcker">böcker</Link> 
                        <Link className="Link" to="/sök">sök </Link>
                        <Link className="Link" to="/add">lägg till </Link>
                    </div>
                 </motion.div>

                
        </div>
    )
}

export default Sidebar
