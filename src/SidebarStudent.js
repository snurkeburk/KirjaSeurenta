/* Copyright (C) Nils Blomberg & Isak Anderson - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Nils Blomberg <fred03.blomberg@gmail.com> and Isak Anderson <isak.anderson9@gmail.com>
 */

import React, { useEffect, useState } from "react";
import firebase from "firebase";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import HomeIcon from "@material-ui/icons/Home";
import SearchIcon from "@material-ui/icons/Search";
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";
import ListAltIcon from "@material-ui/icons/ListAlt";
import PermIdentityIcon from "@material-ui/icons/PermIdentity";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import { Button } from "@material-ui/core";
import AddBoxIcon from "@material-ui/icons/AddBox";
import GroupIcon from "@material-ui/icons/Group";
import SidebarOption from "./SidebarOption";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ListAlt from "@material-ui/icons/ListAlt";
import { Link } from "react-router-dom";
import "./Sidebar.css";
import "./SidebarOption.css";
import SwapIcon from "@material-ui/icons/SwapHoriz";
import App from "./App";
import { userObject } from "./App";
import DateFnsUtils from "@date-io/date-fns"; // choose your lib
import {
  DatePicker,
  TimePicker,
  DateTimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";

function SidebarStudent() {
  const [selectedDate, handleDateChange] = useState(new Date());
  return (
    <div className="sidebar">
      <div className="sidebar__left">
        <h2 class="name">Kirjan Seurenta</h2>
      </div>

      <div className="sidebar__mid"></div>
      <div className="sidebar__right">
        <img
          className="profilePic"
          alt="profile picture"
          src={firebase.auth().currentUser.photoURL}
        />
        <p className="username">
          {firebase.auth().currentUser.displayName}
          <p className="status">{"student"}</p>
        </p>
        <Button
          style={{ backgroundColor: "#FFF" }}
          variant="contained"
          className="signout"
          onClick={() => firebase.auth().signOut()}
        >
          <ExitToAppIcon style={{ color: "black" }} fontSize="small" />
        </Button>
      </div>
    </div>
  );
}

export default SidebarStudent;
