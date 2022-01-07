import React, { Component, useState } from "react";
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
import  firebase, {FieldValue, arrayRemove, arrayUnion} from "firebase";
import TestClass from "./TestClass";
import GetClassSize from "./GetClassSize";
import Sidebar from "./Sidebar";
import StudentHome from "./StudentHome"
import { CircularProgress } from "@material-ui/core";
const TestRouter = () => {
  const [authed, setAuthed] = useState(false);
  const [authedTeacher, setAuthedTeacher] = useState(false);
  const [active, setActive] = useState([]);
  let username = firebase.auth().currentUser.displayName;
 
  console.log("router");
  routerAuth();
  async function routerAuth() {
    const read = await readOne("users", "ids");
    let _id = userObject.id+"&"+userObject.status;
    let id = userObject.id;
    console.log(_id, id);
    if (read.ids.includes(_id)){
      console.log("user exists(router)")
      // check if student or teacher / mentor
      if (userObject.status == "student"){
        console.log("student exists")
        setAuthed(true)
      }
    } else if (read.ids.includes(id)){
      console.log("user exists with wrong id")
      console.log(id)
      console.log(_id)
      updateId(id,_id);
    
    } else {
      let split_id = _id.split("&")[0];
      console.log("split: " + split_id)
      if (read.ids.includes(split_id+"&mentor")||read.ids.includes(split_id+"&teacher")){
        setAuthedTeacher(true);
    }
  }
  }
  console.log(authed, authedTeacher)

  async function updateId(id,_id){
 
    const idRef = db.collection('users').doc('ids');

    const removeRes = await idRef.update({
      ids:  firebase.firestore.FieldValue.arrayRemove(id)
    }).then(()=>console.log("removed old id"));
    const updateRes = await idRef.update({
      ids:  firebase.firestore.FieldValue.arrayUnion(_id)
    }).then(()=> window.location.reload(true));
    /*const timer = setTimeout(() => {
      console.log("reloading page.. 1000")
      window.location.reload(true);
    }, 1000);*/
  }
  return (
    <Router>
      <span>
        {authed ? (
          <Switch>
            {authed ? (
              <Route path="/">
                <StudentHome />
              </Route>
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
                <TestClass /> 
              </Route>
              <Route component={() => <div>404 Not found </div>} />
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
