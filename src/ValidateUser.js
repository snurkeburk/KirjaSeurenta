/* Copyright (C) Nils Blomberg & Isak Anderson - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and cofidential
 * Written by Nils Blomberg <fred03.blomberg@gmail.com> and Isak Anderson <isak.anderson@gmail.com
 */

import React, { useEffect, useState } from "react";
import firebase from "firebase";
import "./ValidateUser.css";
import { db } from "./App";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CircularProgress } from "@material-ui/core";
import { blue } from "@material-ui/core/colors";
import User from "./User";
import { userObject } from "./App";
import { ContactlessOutlined } from "@material-ui/icons";
import { Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";

function ValidateUser() {
<<<<<<< HEAD
  let username = firebase.auth().currentUser.displayName;
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [classChosen, setClassChosen] = useState(false);
=======
    let username = firebase.auth().currentUser.displayName
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    const [classChosen, setClassChosen] = useState(false);

    function AddClassToUser(className){ 
      userObject.className = className;
      setClassChosen(true);
      userObject.addBookToUser('matte50004', '123abc');
      userObject.addBookToUser('ergofysik2', 'abcdefg');
      userObject.addUser();
      userObject.firstLogin = false;
    }
>>>>>>> 94bef05132e23130d83f5ec04340c9b78241cf21

  function AddClassToUser(className) {
    userObject.className = className;
    setClassChosen(true);
    userObject.addBookToUser("matte50004", "123abc");
    userObject.addBookToUser("ergofysik2", "abcdefg");
    userObject.addUser();
    userObject.firstLogin = false;
  }

<<<<<<< HEAD
  useEffect(() => {
    const getPostsFromFirebase = [];
    const sender = db.collection("classes").onSnapshot((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        getPostsFromFirebase.push({
          ...doc.data(), //spread operator
          key: doc.id, // id från firebase
=======
    useEffect(() => {
      const getPostsFromFirebase = [];
      const sender = db
      .collection('classes')
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          getPostsFromFirebase.push({
            ...doc.data(), //spread operator
            key: doc.id, // id från firebase
          });
>>>>>>> 94bef05132e23130d83f5ec04340c9b78241cf21
        });
      });
      setPosts(getPostsFromFirebase);
      setLoading(false);
    });

    // return cleanup function
    return () => sender();
  }, [loading]);

  if (loading) {
    return (
<<<<<<< HEAD
      <div>
        <CircularProgress className="loading" />
      </div>
=======
        <div>
            <CircularProgress className="loading"/> 
        </div>
>>>>>>> 94bef05132e23130d83f5ec04340c9b78241cf21
    );
  }
  if (classChosen == false) {
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
                  onClick={() => AddClassToUser(post.namn)}
                >
                  {post.namn}
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
    return <Redirect to="/" />;
  }
}

export default ValidateUser;
