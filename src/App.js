import React, { Component } from "react"
import firebase from "firebase"
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth"
import './App.css';
import Sidebar from './Sidebar';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Search from "./Search";
import useFetch from "./useFetch";
import Login from "./Login";

firebase.initializeApp({
  apiKey: 'AIzaSyB1pNriNplYWbyRUVUgfy29Wlc2C0-PLvs',
  authDomain: 'kirjanseuranta.firebaseapp.com'  
})

class App extends Component {
  state = { isSignedIn: false }
  uiConfig = {
    signInFlow: "popup",
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
  render(){
  return (
    <Router>
    <div className="app">

      {this.state.isSignedIn ? (
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
        ) : (
          <StyledFirebaseAuth
          uiConfig={this.uiConfig}
          firebaseAuth={firebase.auth()}
          />
          )
  
          }
    </div>
    </Router>
  );
        }
}

export default App;
