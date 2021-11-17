import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Search from "./Search";
import Books from "./Books";
import Login from "./Login";
import Home from "./Home";
import Add from "./Add";
import Class from "./Class";
import Elev from "./Elev";
import {db} from './App'
import ValidateUser from "./ValidateUser";
import {userObject} from './App';
import { Redirect } from "react-router";
import firebase from "firebase";
 class TeacherRouting extends Component {

    render(){
        //firebase.auth().signOut();
        //const auth = userObject.status;
        //console.log("THANK YOU LORD JESUS CHECK CONFIRMED")
        // DET HÄR ÄR RIKTIGT SMAKLIG KOD JAO 
        let username = firebase.auth().currentUser.displayName;
        let studentAuth;
  //  if(auth == "teacher"){
         //   userObject.status = auth;
         const collection = db.collection('users').doc('students').collection("TE19D").doc(username);
         if (collection.id.length > 0){
             console.log("TEACHERROUTING - User exists : " + collection.id)
             studentAuth = true;
         } else if ( collection.id.length == 0){
             studentAuth = false;
         }
         if (!studentAuth){

             return ( 
                 <Router>
                    <span>
                    <Switch>
                
                        <Route path="/validation">
                            <ValidateUser />
                        </Route>
                        <Route exact path="/">
                            <Home />
                        </Route>
                        <Route path="/home">
                            <Home />
                        </Route>
                        <Route path="/sök/">
                        <Search />
                        </Route>
                        <Route path="/böcker" >
                        <Books />
                        </Route>
                        <Route path="/add">
                        <Add />
                        </Route>
                        <Route path="/klass/:id">
                        <Class />
                        </Route>
                      
                        <Route component={() => (<div>404 Not found </div>)} />
                    </Switch>
                    </span>
                </Router>

);
} else if (studentAuth){
    
            return (
                <Router>
                    <span>
                    <Switch>

                            <Route exact path="/">
                                <Home />
                            </Route>
                            <Route exact path="/hb4w7n5vb034vf3q4vtq34vtqv34tv3q4tvv87vw34">
                                <ValidateUser />
                            </Route>
                            <Route component={() => (<Redirect to ="/" />)} />

                        </Switch>
                    </span>
                </Router>
            )
             }
         }
}

export default TeacherRouting;