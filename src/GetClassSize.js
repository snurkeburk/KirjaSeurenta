
/* Copyright (C) Nils Blomberg & Isak Anderson - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Nils Blomberg <fred03.blomberg@gmail.com> and Isak Anderson <isak.anderson9@gmail.com>
 */

import { CircularProgress } from "@material-ui/core";
import { React, useEffect, useState } from "react";
import firebase from "firebase";
import { db, userObject } from "./App";
import Sidebar from "./Sidebar";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import Footer from "./Footer";
import "./Class.css";
import { AiFillDelete, AiOutlineConsoleSql } from "react-icons/ai";
import CreateFakeUser from "./CreateFakeUser";
import { FaUserEdit } from "react-icons/fa";

function GetClassSize() {
  // get class id
  let username = firebase.auth().currentUser.displayName;
   
  // GET from DATA
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState([]);
  const [loading, setLoading] = useState([false])
  const [studentClasses, setStudentClasses] = useState([false])
  const [students, setStudents] = useState([]);
  //useEffect(() => {
    async function GetClassCount(){
      const getPostsFromFirebase = [];
      const sender = db
      .collection("users")
      .doc("teachers")
      .collection(username)
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          getPostsFromFirebase.push({
            ...doc.data(), //spread operator
            key: doc.id, // id från firebase
        });
      });
      for (let i = 0; i < getPostsFromFirebase[0].classes.length; i++){
        console.log(i + " = " + getPostsFromFirebase[0].classes[i]);

        GetRealCount(getPostsFromFirebase[0].classes[i]);
      }
      setTotal((getPostsFromFirebase[0].classes.length)+1);
     // setPosts(getPostsFromFirebase[0].classes[0]); // 0 ska vara nummret / platsen som klassen har i listan i firebase
      setLoading(false);
      //console.log(posts)
    }); 
  } 

    // GET from STUDENTS
    async function GetRealCount(data) {
      const getClassFromFirebase = [];
      const sender = db
      .collection("users")
      .doc("students")
      .collection(data)
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          getClassFromFirebase.push({
            ...doc.data(), //spread operator
            key: doc.id, // id från firebase
          });
        });
        for (let k = 0; k < total.length; k++){
          setStudents(getClassFromFirebase.length);
        }
        setLoading(false);
        console.log("total: " + total);
        console.log("count for " + data + " = " + getClassFromFirebase.length);

        db.collection("users")
        .doc("students")
        .collection("TE19D")
        .update({
          antal:2,
        });

      });
    }
      /*
      return () => sender();
       }
      },[loading]);*/

    
    // compare the two



    // return cleanup function

  // 

  // display students quantity
  return (
    <div>
      {students.map(student => <div>{student}</div>)}
      <Button onClick={() => GetClassCount()}>test</Button>
    </div>
  );
}

export default GetClassSize;
