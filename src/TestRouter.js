import React, { useEffect, Component, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Search from "./Search";
import Books from "./Books";
import { add, update, remove, read, readOne } from "./Crud";
import Login from "./Login";
import Home from "./Home";
import Add from "./Add";
import Class from "./Class";
import Elev from "./Elev";
import { db } from "./App";
import ValidateUser from "./ValidateUser";
import { userObject } from "./App";
import { Redirect } from "react-router";
import firebase, { FieldValue, arrayRemove, arrayUnion } from "firebase";
import TestClass from "./TestClass";
import GetClassSize from "./GetClassSize";
import Sidebar from "./Sidebar";
import StudentHome from "./StudentHome";
import { CircularProgress } from "@material-ui/core";
import PageNotFound from "./PageNotFound";
const TestRouter = () => {
  const [authed, setAuthed] = useState(false);
  const [authedTeacher, setAuthedTeacher] = useState(false);
  const [active, setActive] = useState([]);
  let username = firebase.auth().currentUser.displayName;

  console.log("router");
  routerAuth();
  async function routerAuth() {
    const ids = db.collection("users").doc("ids");
    const iddoc = await ids.get();
    let _id = userObject.id + "&" + userObject.status;
    let id = userObject.id;
    let data = iddoc.data().ids;
    for (let i = 0; i < data.length; i++) {
      console.log("comparing: " + data[i] + " to: " + userObject.id);
      if (data[i].includes(userObject.id)) {
        console.log("found: " + data[i] + " in: " + userObject.id);
        console.log("user exists(router)");
        // check if student or teacher / mentor

        if (data[i].includes("student")) {
          console.log("student exists");
          setAuthed(true);
          i = data.length;
        } else if (data[i].includes("teacher") || data[i].includes("mentor")) {
          console.log("teacher/mentor exists");
          setAuthedTeacher(true);
          i = data.length;
        } else {
          updateId(id, _id);
        }
      }
    }
  }
  console.log(authed, authedTeacher);

  async function updateId(id, _id) {
    const idRef = db.collection("users").doc("ids");

    const removeRes = await idRef
      .update({
        ids: firebase.firestore.FieldValue.arrayRemove(id),
      })
      .then(() => console.log("removed old id"));
    const updateRes = await idRef
      .update({
        ids: firebase.firestore.FieldValue.arrayUnion(_id),
      })
      .then(() => window.location.reload(true));
    /*const timer = setTimeout(() => {
      console.log("reloading page.. 1000")
      window.location.reload(true);
    }, 1000);*/
  }

  useEffect(() => {
    console.log(userObject.firstLogin);

    return () => {};
  }, []);

  return (
    <Router>
      <span>
        {authed ? (
          <Switch>
            {authed ? (
              <Switch>
                <Route path="/:id">
                  <PageNotFound />
                </Route>
                <Route path="/">
                  <StudentHome />
                </Route>
              </Switch>
            ) : (
              <Route path="/">
                <ValidateUser />
              </Route>
            )}
          </Switch>
        ) : (
          <Switch>
            {authedTeacher ? (
              <Switch>
                <Route exact path="/">
                  <Home />
                </Route>
                <Route path="/home">
                  <Home />
                </Route>
                <Route path="/sök/">
                  <Search />
                </Route>
                <Route path="/böcker">
                  <Books />
                </Route>
                <Route path="/add">
                  <Add />
                </Route>
                <Route path="/klass/:id">
                  <TestClass />
                </Route>
                <Route path="/:id">
                  <PageNotFound />
                </Route>
                <Route component={() => <PageNotFound />} />
              </Switch>
            ) : (
              <Route path="/">
                <ValidateUser />
              </Route>
            )}
          </Switch>
        )}
      </span>
    </Router>
  );
};

export default TestRouter;
