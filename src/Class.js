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
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@material-ui/core";
import "./Class.css";
import { AiFillDelete } from "react-icons/ai";
import { AiFillEdit } from "react-icons/ai";
import Collapse from "@material-ui/core/Collapse";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import Alert from "@material-ui/lab/Alert";
import IconButton from "@material-ui/core/IconButton";

 
function Class() {
async function AddNr(name, formData) { // HÄR TAR DEN NAMN O NUMMER 
  // OCH LÄGGER TILL I FIREBASE
console.log("AddNR")
db
.collection("users")
.doc("students")
.collection("TE19D")
.doc(name)
.update({
nr: formData
})

}

  const { id } = useParams(); // id = klassnamnet
  let username = firebase.auth().currentUser.displayName;
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [students, setStudents] = useState([]);
  const [name, setName] = useState([]);
  const sparaKlass = (event) => {
 
    event.preventDefault();
    const elementsArray = [...event.target.elements];
    const formData = elementsArray.reduce((accumulator, currentValue) => {
      if (currentValue.id) {
        accumulator[currentValue.id] = currentValue.value;
      }
      return accumulator;
    }, {});

    let username = firebase.auth().currentUser.displayName;

    let formDataClassName = formData.namn.toUpperCase();

    middleman(formDataClassName); // skickar nr till middleman

  
  }
  
  function Cum(name){ // HÄR FÅR DEN NAMN
    setName(name) // sätter namn till const
  }
  function middleman(nr){
    console.log("middleman")
    console.log("Namn: " + name + " Nr: " + nr)
    AddNr(name,nr); // skickar namn och nr till AddNr
    
  }

  // för elever i klassen:
  useEffect(() => {
    const getStudentsFromFirebase = [];
    const sender = db
      .collection("users")
      .doc("students")
      .collection(id) // här ska det vara klasserna som läraren har
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          getStudentsFromFirebase.push({
            ...doc.data(), //spread operator
            key: doc.id, // id från firebase
          });
        });
        setStudents(getStudentsFromFirebase);
        setLoadingStudents(false);
      });

    // return cleanup function
    return () => sender();
  }, [loadingStudents]);


  if (loadingStudents) {
    <Sidebar />;
    return <CircularProgress />;
  } else
    return (
      <motion.div initial={{ opacity: "0%" }} animate={{ opacity: "100%" }}>
        <Sidebar />
        <div className="totalContainer">
          <h1 className="class-title">{id}</h1>
          <div className="innerTotalContainer">
            <div className="class-utdeladeContainer">
              <p className="class-utdelade">0</p>
              <p className="class-utdelade-desc">utdelade</p>
            </div>
            <div className="class-saknasContainer">
              <p className="class-saknas">0</p>
              <p className="class-saknas-desc">saknas</p>
            </div>
          </div>
          <Button size={"small"}>
            <AiFillDelete className="class-deleteClass" size={35} />
          </Button>
        </div>
        <div className="class-big-container">
          <div className="class-left-side">
            <h1>bok här</h1>
           
          </div>

          <div className="class-right-side">
      
            <ul>
              <li>
                <motion.div className="students-container" layout>
                  {students.length > 0 ? (
                    students.map((post) => (
                      <motion.div
                        className="students"
                        key={post.key}
                        whileHover={{}}
                      >
                       
                      
                        <p className="student-number-disp">{post.nr}</p>
                        <p className="student">
                          {post.name}
                        </p>
                        <p className="student-status"></p>
                        <div>
                          <form className="form-submit" onSubmit={sparaKlass} autocomplete="off">
                          <motion.button onClick={() => Cum(post.name)} className="submit-number" whileHover={{ scale: 1.1 }}> 
                            <AiFillEdit />
                          </motion.button>
                            <motion.input
                              className="student-number"
                              type="text"
                              id="namn"
                              required
                              placeholder={post.nr}
                              whileFocus={{ scale: 1.2 }}
                              ></motion.input>
                          </form>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="not-found">
                      <h4>Inga elever tillagda</h4>
                    </div>
                  )}
                </motion.div>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>
    );
}

export default Class;
