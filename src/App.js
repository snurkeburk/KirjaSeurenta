/* Copyright (C) Nils Blomberg & Isak Anderson - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Nils Blomberg <fred03.blomberg@gmail.com> and Isak Anderson <isak.anderson9@gmail.com>
 */

import React, { Component } from "react";
import firebase from "firebase";
import TestRouter from "./TestRouter"
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import "./App.css";
import Sidebar from "./Sidebar";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Search from "./Search";
import Books from "./Books";
import Login from "./Login";
import { motion } from "framer-motion";
import Home from "./Home";
import { func } from "prop-types";
import Add from "./Add";
import Footer from "./Footer";
import Class from "./Class";
import Elev from "./Elev";
import ValidateUser from "./ValidateUser";
import TeacherRouting from "./TeacherRouting";
//import { add, update, remove, read } from './Crud' //! Remove later
import { Book } from "./Book";
import {
  add,
  update,
  remove,
  read,
  readWhere,
  updateField,
  nestedAdd,
  nestedRead,
  readOne,
} from "./Crud";

import { User, setUserStatus } from "./User";
firebase.initializeApp({
  apiKey: "AIzaSyB1pNriNplYWbyRUVUgfy29Wlc2C0-PLvs",
  authDomain: "kirjanseuranta.firebaseapp.com",
  projectId: "kirjanseuranta",
  storageBucket: "kirjanseuranta.firebaseapp.com",
});
export const db = firebase.firestore();
export const FieldValue = firebase.firestore.FieldValue;

export var userObject;

class App extends Component {
  state = { isSignedIn: false };
  uiConfig = {
    signInFlow: "redirect",
    redirectUrl: "search",
    signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
    callbacks: {
      signInSuccess: () => false,
    },
  };

  componentDidMount = () => {
    console.log("user")
    firebase.auth().onAuthStateChanged((user) => {
      console.log("user", user)
      this.setState({ isSignedIn: !!user });
      if (user !== null) {
        console.log("adding user")
        //adds user to database if logged in
        userObject = new User(
          user.displayName,
          user.uid,
          user.email,
          user.status,
          user.marker
        );

      }
    });
  };
  getContent() {
    if (this.state.isSignedIn) {
      return (
        <motion.div initial={{ opacity: "0%" }} animate={{ opacity: "100%" }}>
          <TestRouter />
        </motion.div>
      );
    } else {
      return (
        <motion.div
          className="big-welcome-container"
          initial={{ opacity: "0%" }}
          animate={{ opacity: "100%" }}
        >
          <div className="welcome-container">
            <motion.div className="small-welcome-container">
              <motion.div className="left">
                <h2 className="welcomeMessege">Välkommen till</h2>
                <h2 class="welcomeName">
                  <h2>K</h2>irjan<h2>S</h2>eurenta
                </h2>

                <p className="welcomeUnder">
                  Gör det lättare för dig att hålla koll på dina skolböcker
                </p>
                <p className="websitelink">www.kirjanseuranta.se</p>
              </motion.div>
              <motion.div className="right">
                <StyledFirebaseAuth
                  uiConfig={this.uiConfig}
                  firebaseAuth={firebase.auth()}
                />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      );
    }
  }

  render() {
    return (
    <div className="app">{this.getContent()}</div>
    );
  }
}

export default App;
