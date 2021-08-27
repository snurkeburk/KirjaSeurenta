import React, { Component } from "react"
import firebase from "firebase"
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth"
import './App.css';
import Sidebar from './Sidebar';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Search from "./Search";
import Login from "./Login";
import { func } from "prop-types";
import { Class } from "@material-ui/icons";
import { getBooks } from './AddBook'

firebase.initializeApp({
  apiKey: 'AIzaSyB1pNriNplYWbyRUVUgfy29Wlc2C0-PLvs',
  authDomain: 'kirjanseuranta.firebaseapp.com',
  projectId: 'kirjanseuranta'
})

export const db = firebase.firestore();

//getBooks() //prints books to console

class App extends Component {
  state = { isSignedIn: false }
  uiConfig = {
    signInFlow: "popup",
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
      console.log("user", user)
    })
  }

getContent () {
  if (this.state.isSignedIn){
    return (
      <Router>
      <span>

      <Switch>
        <Route exact path="/">
          <Sidebar />
        </Route>
      
        <Route path="/search">
          <Search />
        </Route>



      </Switch>

      </span>
      </Router>

    )
    
  } else {
    return (
      
      <div className="big-welcome-container">
        <div className="welcome-container" >
        <h2 className="welcomeMessege">Välkommen till</h2> <h2 class="welcomeName"><h2>K</h2>irja<h2>S</h2>eurenta</h2>
        <p className="welcomeUnder">För dig som har en jävla massa böcker att hålla koll på</p>
        
      <StyledFirebaseAuth
      uiConfig={this.uiConfig}
      firebaseAuth={firebase.auth()}
      />
      </div>
      </div>
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
