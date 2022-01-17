/* Copyright (C) Nils Blomberg & Isak Anderson - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Nils Blomberg <fred03.blomberg@gmail.com> and Isak Anderson <isak.anderson9@gmail.com>
 */

import React, { useEffect, useState } from "react";
import firebase from "firebase";
import "./ValidateUser.css";
import { db, FieldValue } from "./App";
import { add, update, remove, read, readOne } from "./Crud";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button, CircularProgress } from "@material-ui/core";
import { blue } from "@material-ui/core/colors";
import User from "./User";
import { userObject } from "./App";
import { ContactlessOutlined } from "@material-ui/icons";
import { Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";
import TestRouter from "./TestRouter";
import Home from "./Home";
import Sidebar from "./Sidebar";
function ValidateUser() {
  let username = firebase.auth().currentUser.displayName;
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [classChosen, setClassChosen] = useState(false);
  const [roleChosen, setRoleChosen] = useState(false);
  const [count, setCount] = useState([]);
  const [redirect, setRedirect] = useState(false);

  async function GetActiveUserStatus() {
    let _id_teacher = userObject.id + "&teacher"
    let _id_mentor = userObject.id + "&mentor"
    let _id_student = userObject.id + "&student"
    const read = await readOne("users", "ids");
    if (read.ids.includes(_id_teacher)) {
      console.log("teacher ID matched")
    }
    else if (read.ids.includes(_id_mentor)) {
      console.log("mentor ID matched")
    }
    else if (read.ids.includes(_id_student)) {
      console.log("student ID matched")
    }
  }
  test();
  async function test(){
    const read = await readOne("users", "ids");
    console.log("ID:s : ", read.ids);
      if (read.ids.includes(userObject.id)){
        console.log("redirect to home")
      }else{
          setRedirect(false);
    }
  
    return read.ids;
  }

  async function AddClassToUser(className) {
    const ccollection = db
      .collection("users")
      .doc("students")
      const doc = await ccollection.get();
      console.log(doc.data());
      let k = 1;
      console.log(doc.length + " = lengthhhh")
      for (let i = 0; i<doc.data().length; i++){
        console.log(doc.data()[i])
        if (doc.data()[i] == className){
          console.log("its a baby")
        }
     
      }
  
      // return cleanup function

    userObject.className = className;
    setClassChosen(true);

    //! Adds defaiult books to user 
    //userObject.addBookToUser("matte50004", "123abc");
    //userObject.addBookToUser("ergofysik2", "abcdefg");
    userObject.addUser();

    //userObject.addBookToUser('svenskaimpulser3')

    userObject.firstLogin = false;
   
  }

  useEffect(() => {
    if (userObject.status == "student"){

      const getPostsFromFirebase = [];
      const sender = db.collection("classes").onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          getPostsFromFirebase.push({
            ...doc.data(), //spread operator
            key: doc.id, // id från firebase
          });
        });
        setPosts(getPostsFromFirebase);
        setLoading(false);
        console.log(getPostsFromFirebase[1])
      });
      
      // return cleanup function
      return () => sender();
    }else {
      setLoading(false);
    }
  }, [loading]);

  async function AddAuthoritarian(role){
    console.log("Adding " + username + " as " + role)
    let _status;
    if (role == "mentors"){
       _status = "mentor";
    }else if (role == "teachers"){
       _status = "teacher";
    }
    // add teacher to database
    const sender = db
    .collection("users")
    .doc(role)
    .collection("data")
    .doc(firebase.auth().currentUser.uid)
    .set({
      name: username,
      status: _status,
      createdAt: new Date(),
      classes: [],
      email: userObject.email,
    })
    
    // add ID to database
    const read = await readOne("users", "ids");
    console.log("ID:s : ", read.ids);
    let id_pos = read.ids.lenght + 1;
    setRoleChosen(true);
    GetActiveUserStatus();
    db.collection('users').doc('ids').update({
      'ids': FieldValue.arrayUnion(userObject.id + "&"+_status)
    }).then(()=> window.location.reload(true));
  }



  if (loading) {
    return (
      <div>
        <CircularProgress className="loading" />
      </div>
    );
  }
  if (userObject.status == "teacher-mentor" && !roleChosen){
    return (
      <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 2 }}
      className="authoritarian-div"
      >
        <h1 className="validate-promt">Välkommen {username}</h1>
        <p className="validate-question">Skapa konto som</p>
        <div className="validate-klasser-container" layout>
          <Button
          onClick={() => AddAuthoritarian("teachers")}
          variant="contained"
          style={{backgroundColor: "purple", color: "white", width: "5rem"}}
          size="large"
          >lärare</Button>
          <Button
          onClick={() => AddAuthoritarian("mentors")}
          variant="contained"
          style={{backgroundColor: "lightblue", color: "white", width: "5rem"}}

          >mentor</Button>
        </div>
      </motion.div>
    )
  }

  if (classChosen == false && userObject.status == "student") {
    console.log(classChosen);
    return (
      <div className="valUser">
        <h1 className="validate-promt">Välkommen, {username}</h1>
        <p className="validate-question">Vilken klass går du i?</p>
        <motion.div className="validate-klasser-container" layout>
          {posts.length > 0 ? (
            posts.map((post) => (
              <motion.div
                className="validate-klasser"
                key={post.key}
                whileHover={{
                  scale: 1.03,
                  backgroundColor: "rgba(134, 43, 219, 0.26)",
                  transition: { duration: 0.1 },
                }}
              >
                <button
                  className="validate-klass"
                  onClick={() => AddClassToUser(post.key)}
                >
                  {post.key}
                </button>
              </motion.div>
            ))
          ) : (
            <div className="validate-not-found">
              <h4>Inga klasser tillagda</h4>
            </div>
          )}
        </motion.div>
      </div>
    );
  }
  if (classChosen == true) {
    return <CircularProgress />;
  }
  if (roleChosen == true) {
     return <CircularProgress />;
  }

}

export default ValidateUser;
