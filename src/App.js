/* Copyright (C) Nils Blomberg & Isak Anderson - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and cofidential
 * Written by Nils Blomberg <fred03.blomberg@gmail.com> and Isak Anderson <isak.anderson@gmail.com
 */

import React, { Component } from "react";
import firebase from "firebase";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import "./App.css";
import Sidebar from "./Sidebar";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Search from "./Search";
import Klasser from "./Klasser";
import Login from "./Login";
import { motion } from "framer-motion";
import Home from "./Home";
import { func } from "prop-types";
import Add from "./Add";
import Footer from "./Footer";
import Class from "./Class";
import ValidateUser from "./ValidateUser";
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
    firebase.auth().onAuthStateChanged((user) => {
      this.setState({ isSignedIn: !!user });
      //console.log("user", user)

      if (user !== null) {
        //adds user to database if logged in
        userObject = new User(
          user.displayName /*"Test Name"*/,
          user.uid,
          user.email
        );
        //userObject.addBookToUser('ergofysik2', '123abc');

        //let username = firebase.auth().currentUser.displayName;

        //console.log(username + " " +  userObject.status);
        //let test = db.collection("users").doc("students").collection("te19d").doc;
        //console.log("TEST = " + test);
        //console.log(userObject.firstLogin);
        //console.table(userObject.getBooks());
      }
    });
  };

  getContent() {
    if (this.state.isSignedIn) {
      return (
        <motion.div initial={{ opacity: "0%" }} animate={{ opacity: "100%" }}>
          <Router>
            <span>
              <Switch>
                <Route exact path="/">
                  <Home />
                </Route>
                <Route path="/home">
                  <Home />
                </Route>
                <Route exact path="/validation">
                  <ValidateUser />
                </Route>

                <Route path="/sök">
                  <Search />
                </Route>
                <Route path="/klasser">
                  <Klasser />
                </Route>
                <Route path="/add">
                  <Add />
                </Route>
                <Route path="/klass/:id">
                  <Class />
                </Route>
              </Switch>
            </span>
          </Router>
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
                  <h2>K</h2>irja<h2>S</h2>eurenta
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
    return <div className="app">{this.getContent()}</div>;
  }
}

export default App;
