import React, { useState } from 'react';
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
import DateFnsUtils from '@date-io/date-fns'; // choose your lib
import {
  DatePicker,
  TimePicker,
  DateTimePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';



function Sidebar() {
    const [selectedDate, handleDateChange] = useState(new Date());
    return (

        <div className="sidebar">
             <div className="sidebar__left">
                <h2 class="name"><h2>K</h2>irja<h2>S</h2>eurenta</h2>
            </div>

            <div className="sidebar__mid">
                <Link className="Link" to="/">Hem</Link> 
                <Link className="Link">Klasser</Link> 
                <Link className="Link" to="/search">Sök </Link>
                <Link className="Link">Lägg till </Link>
            </div>
             <div className="sidebar__right">
                <img className="profilePic"
                alt="profile picture"
                src={firebase.auth().currentUser.photoURL}
                />
                 <p className="username">{firebase.auth().currentUser.displayName}
                 <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DatePicker value={selectedDate} onChange={handleDateChange} />
                    <TimePicker value={selectedDate} onChange={handleDateChange} />
                </MuiPickersUtilsProvider>

                 </p>
                 <Button style={{backgroundColor: "#FFF"}} variant="contained" className="signout" onClick={() => firebase.auth().signOut()}>
                     <ExitToAppIcon style={{color: "black" }} fontSize="small"/>
                     
                </Button>
               

            </div>
            
           { /* <Button variant="outlined" className="sidebar__tweet" fullWidth>Tweet</Button> */} 
            
        </div>
        
    )
}

export default Sidebar
