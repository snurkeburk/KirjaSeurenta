import React, { Component } from "react"
import firebase from "firebase"
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth"
import './App.css';
import Sidebar from './Sidebar';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Search from "./Search";
import Klasser from "./Klasser";
import Login from "./Login";
import { motion } from "framer-motion"
import Home from './Home'
import { func } from "prop-types";
import Add from './Add';  
//import { add, update, remove, read } from './Crud' //! Remove later
import { Book } from './Book';
import { add, update, remove, read, readWhere, updateField, nestedAdd, nestedRead, readOne } from './Crud'
import { User, setUserStatus } from './User';

firebase.initializeApp({
  apiKey: 'AIzaSyB1pNriNplYWbyRUVUgfy29Wlc2C0-PLvs',
  authDomain: 'kirjanseuranta.firebaseapp.com',
  projectId: 'kirjanseuranta'
})
export const db = firebase.firestore();


class App extends Component {
  state = { isSignedIn: false }
  uiConfig = {
    signInFlow: "redirect",
    redirectUrl: 'search',
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      signInSuccess: () => false
    }
  }
 
  componentDidMount = () => {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({ isSignedIn: !!user })
      //console.log("user", user)

      if (user !== null) { //adds user to database if logged in 
        const userObject = new User( user.displayName  /*"Test Name"*/ ,user.uid, user.email, 'te19d');
        //userObject.addBookToUser('ergofysik2', '123abc');
       
        //console.table(userObject.getBooks());
      }
      
    })
  }


getContent () {
  if (this.state.isSignedIn){
    return (
      <motion.div
      initial={{ opacity: "0%" }}
      animate={{ opacity: "100%" }}
      >
      <Router>
      <span>

      <Switch>
        <Route exact path="/">
              <Home />
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
      



      </Switch>

      </span>
      </Router>
      </motion.div>
    )
    
  } else {
    return (
      
      <motion.div className="big-welcome-container"

      >
        <div className="welcome-container" >
        <h2 className="welcomeMessege">Välkommen till</h2> <h2 class="welcomeName"><h2>K</h2>irja<h2>S</h2>eurenta</h2>
        <p className="welcomeUnder">För dig som har en jävla massa böcker att hålla koll på</p>
        
      <StyledFirebaseAuth
      uiConfig={this.uiConfig}
      firebaseAuth={firebase.auth()}
      />
      </div>
      </motion.div>
    );
  }
}


  render(){
  return (
    <div className="app">
        {this.getContent()}
    </div>
  );
        }
}

export default App;
