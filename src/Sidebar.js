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
import App from "./App";
import { motion } from "framer-motion";
import { role } from "./ValidateUser";
import { AiOutlineMenu, AiOutlineLogout, AiFillLock } from "react-icons/ai";
import { userObject, db } from "./App";
import DateFnsUtils from "@date-io/date-fns"; // choose your lib
import {
  DatePicker,
  TimePicker,
  DateTimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import { SettingsApplicationsTwoTone } from "@material-ui/icons";
import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";

function Sidebar() {
  const [displayStatus, setDisplayStatus] = useState([]);
  let username = firebase.auth().currentUser.displayName;

  getName();
  async function getName() {
    const mentorRef = db.collection("users").doc("mentors").collection("data");

    const snapshot = await mentorRef.where("name", "==", username).get();
    if (snapshot.empty) {
      console.log("No matching documents.");
      return;
    }

    snapshot.forEach((doc) => {
      if (doc.data().email == userObject.email) {
        setDisplayStatus("Mentor");
      }
    });

    const teacherRef = db
      .collection("users")
      .doc("teachers")
      .collection("data");

    const ssnapshot = await teacherRef.where("name", "==", username).get();
    if (ssnapshot.empty) {
      console.log("No matching documents.");
      return;
    }

    ssnapshot.forEach((docc) => {
      if (docc.data().email == userObject.email) {
        setDisplayStatus("Lärare");
      }
    });
  }

  return (
    <div className="big-sidebar">
      <div className="sidebar">
        <div className="sidebar-upper-960px-container">
          <div className="sidebar__left">
            <h2 class="name">Kirjan Seurenta</h2>
          </div>
          <div className="sidebar__mid">
            <Link className="Link" to="/">
              Hem
            </Link>
            <Link className="Link" to="/add">
              Lägg till{" "}
            </Link>
            <Link style={{ color: "lightgray" }} className="Link">
              Böcker
            </Link>
            <Link style={{ color: "lightgray" }} className="Link">
              Sök{" "}
            </Link>
          </div>
          <div className="sidebar__right">
            <img
              className="profilePic"
              alt="profile picture"
              src={firebase.auth().currentUser.photoURL}
            />
            <p className="username">
              {firebase.auth().currentUser.displayName}
              <p className="status">{displayStatus}</p>
            </p>
            <p className="status">{}</p>
            <Button
              style={{
                backgroundColor: "#FFF",
                borderRadius: "10rem",
                padding: "0",
                width: "max-content",
              }}
              variant="contained"
              className="signout"
              onClick={() => firebase.auth().signOut()}
            >
              <AiOutlineLogout style={{ color: "black" }} fontSize="1.5rem" />
            </Button>
          </div>
          <div className="trashDropdownContainer">
            <Menu
              className="dropdown"
              menuButton={
                <MenuButton>
                  {" "}
                  <AiOutlineMenu style={{ color: "black" }} size={"30px"} />
                </MenuButton>
              }
              transition
            >
              <div className="dropdown-links-container">
                <Link className="Link-drop" to="/">
                  Hem
                </Link>
                <Link className="Link-drop" to="/böcker">
                  Böcker
                </Link>
                <Link className="Link-drop" to="/sök">
                  Sök{" "}
                </Link>
                <Link className="Link-drop" to="/add">
                  Lägg till{" "}
                </Link>
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: "rgb(225, 142, 142)",
                    height: "34px",
                  }}
                  onClick={() => firebase.auth().signOut()}
                >
                  <ExitToAppIcon style={{ color: "black" }} fontSize="medium" />
                </Button>
              </div>
            </Menu>
          </div>
        </div>
      </div>
      <motion.div className="sidebar__mid_lower">
        <div className="lower_inner">
          <Link className="Link" to="/">
            hem
          </Link>
          <Link className="Link" to="/böcker">
            böcker
          </Link>
          <Link className="Link" to="/sök">
            sök{" "}
          </Link>
          <Link className="Link" to="/add">
            lägg till{" "}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default Sidebar;
