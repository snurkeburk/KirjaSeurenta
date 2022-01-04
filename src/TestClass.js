/* Copyright (C) Nils Blomberg & Isak Anderson - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Nils Blomberg <fred03.blomberg@gmail.com> and Isak Anderson <isak.anderson9@gmail.com>
 */

import { CircularProgress } from "@material-ui/core";
import { React, useEffect, useState } from "react";
import firebase from "firebase";
import Crud from "./Crud";
import { db, userObject } from "./App";
import Sidebar from "./Sidebar";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@material-ui/core";
import Footer from "./Footer";
import "./Class.css";
import { AiFillDelete, AiOutlineConsoleSql } from "react-icons/ai";
import CreateFakeUser from "./CreateFakeUser";
import { FaUserEdit } from "react-icons/fa";
import Alert from "@material-ui/lab/Alert";
import IconButton from "@material-ui/core/IconButton";
import Collapse from "@material-ui/core/Collapse";
import CloseIcon from "@material-ui/icons/Close";
import { Link } from "react-router-dom";
import TeacherRouting from "./TeacherRouting";

function TestClass() {
  const [open, setOpen] = useState(false);
  const { id } = useParams(); // id = klassnamnet
  const [students, setStudents] = useState([]);
  const [marked, setMarked] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const getPostsFromFirebase = [];
    const sender = db
      .collection("users")
      .doc("students")
      .collection(id)
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          getPostsFromFirebase.push({
            ...doc.data(), //spread operator
            key: doc.id, // id från firebase
          });
        });
        for (let i = 0; i < getPostsFromFirebase.length; i++){
          let mark = false;
          console.log(getPostsFromFirebase.length)
          const getBookFromFirebase = [];
          db.collection("users")
          .doc("students")
          .collection(id)
          .doc(getPostsFromFirebase[i].name)
          .collection("items")
          .onSnapshot((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              getBookFromFirebase.push({
                ...doc.data(), //spread operator
                key: doc.id, // id från firebase
              });
              
            })        
            for (let k = 0; k < getBookFromFirebase.length; k++){
              if (getBookFromFirebase[k].status == "red"){
                console.log(getBookFromFirebase[k].name + " is red" + " (" + getPostsFromFirebase[i].name + ")");
                mark = true;
                k = getBookFromFirebase.length;
              }
              else {
                console.log(getBookFromFirebase[k].name + " is green" + " (" + getPostsFromFirebase[i].name + ")");
              }
            
            }
          
            if (mark){
              console.log(getPostsFromFirebase[i].name + " red!!!");
              checkMarked(getPostsFromFirebase[i].name, true)
  
            }
            else {
              console.log(getPostsFromFirebase[i].name + " green!")
              checkMarked(getPostsFromFirebase[i].name, false)
  
            }
          })
        }
        setPosts(getPostsFromFirebase);
        setLoadingStudents(false);
      });

    // return cleanup function
    return () => sender();
  }, [loadingStudents]);

  function checkMarked(user, marked){
    console.log(user + " marked: " + marked)
    if (marked){
      setMarkedUser(user);
    }
    else if (!marked){
      setUnMarkedUser(user);
    }
  }

  function setMarkedUser(user){
    console.log(user + " WAS MARKED!!")
    db.collection("users").doc("students").collection(id).doc(user).update({
      marker: "red",
    });
  }
  function setUnMarkedUser(user){
    console.log(user + " WAS NOT MARKED!")

    db.collection("users").doc("students").collection(id).doc(user).update({
      marker: "green",
    });
  }
  useEffect(() => {
    const sender = db
      .collection("users")
      .doc("students")
      .collection("TE19D")
      .where("status", "==", "student")
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            //.log("New : ", change.doc.data());
          }
          if (change.type === "modified") {
            console.log("Modified : ", change.doc.data());
            //showBooks("NONE")
              setOpen(true);
          }
          if (change.type === "removed") {
            //console.log("Removed : ", change.doc.data());
          }
        });
      });
    return () => {
      sender();
    };
  }, []);

  // för elever i klassen:
  const getStudentsFromFirebase = [];
  useEffect(() => {
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
        // TODO om sidan märker en change i firebase så kommer det en POPUP
        // som tillåter användaren att "uppdatera sidan" eller "X".
        for (let i = 0; i < getStudentsFromFirebase.length; i++) {
          if (getStudentsFromFirebase[i].marker == "green") {
            console.log(
              "green: " +
                getStudentsFromFirebase[i].name +
                "|" +
                getStudentsFromFirebase[i].marker
            );
          } else if (getStudentsFromFirebase[i].marker == "red") {
            console.log(
              "red: " +
                getStudentsFromFirebase[i].name +
                "|" +
                getStudentsFromFirebase[i].marker
            );
          }
        }
        setStudents(getStudentsFromFirebase);
        setLoadingStudents(false);
        sender();
      });

    // return cleanup function
  }, [loadingStudents]);

  const [books, setBooks] = useState([]);
  const getBooksFromFirebase = [];
  const [user, SetUser] = useState([]);

  async function showBooks(user) {
    SetUser(user);
    const stop = db
      .collection("users")
      .doc("students")
      .collection(id)
      .doc(user)
      .collection("items")
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          getBooksFromFirebase.push({
            ...doc.data(), //spread operator
            key: doc.id, // id från firebase
          });
        });
        setBooks(getBooksFromFirebase);
        console.log(getBooksFromFirebase);
        stop();
      });
  }

  function setStatus(status, key) {
    console.log("current status: " + status + ". key: " + key);
    if (status == "green") {
      db.collection("users")
        .doc("students")
        .collection(id)
        .doc(user)
        .collection("items")
        .doc(key)
        .update({
          status: "red",
        });
      // update user_status to red
      db.collection("users").doc("students").collection(id).doc(user).update({
        marker: "red",
      });
    } else if (status == "red") {
      db.collection("users")
        .doc("students")
        .collection(id)
        .doc(user)
        .collection("items")
        .doc(key)
        .update({
          status: "green",
        });
    }
      setOpen(true);
  
  }

  // TODO: lägg till status brevid elev-namn som visar röd ifall
  // .. minst en av böckerna saknas, annars visar den grönt
  // .. visa t.ex. gult ifall eleven inte har någon bok (eller vitt/grått)

  // man kanske kan lägga till en animation på showBooks eller något
  // som gör så att animationen ex. opacity varar tillräckligt länge
  // för att buggen inte ska visas.
  // detta kommer däremot inte att fixa window resize problemet

  function changeStatus(status, book) {
    if (status == "green") {
      status = "red";
      db.collection("users")
        .doc("students")
        .collection(id)
        .doc(user)
        .collection("items")
        .doc(book)
        .update({
          status: "red",
        });

      db.collection("users").doc("students").collection(id).doc(user).update({
        marker: "red",
      });
    } else if (status == "red") {
      status = "green";
      db.collection("users")
        .doc("students")
        .collection(id)
        .doc(user)
        .collection("items")
        .doc(book)
        .update({
          status: "green",
        });
      const sender = db
        .collection("users")
        .doc("students")
        .collection(id)
        .doc(user)
        .collection("items")
        .onSnapshot((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            getBooksFromFirebase.push({
              ...doc.data(), //spread operator
              key: doc.id, // id från firebase
            });
          });

          setBooks(getBooksFromFirebase);

          if (books.length == 0) {
            db.collection("users")
              .doc("students")
              .collection(id)
              .doc(user)
              .update({
                marker: "yellow",
              });
          }
          for (let i = 0; i < books.length; i++) {
            if (books[i].status == "red") {
              db.collection("users")
                .doc("students")
                .collection(id)
                .doc(user)
                .update({
                  marker: "red",
                });
            } else {
              db.collection("users")
                .doc("students")
                .collection(id)
                .doc(user)
                .update({
                  marker: "green",
                });
            }
          }
        });
    }
  }

  if (loadingStudents) {
    <Sidebar />;
    return <CircularProgress />;
  } else {
    return (
      <motion.div initial={{ opacity: "0%" }} animate={{ opacity: "100%" }}>
        <Sidebar />
        <Collapse in={open}>
          <Alert
            variant="filled"
            severity="info"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setOpen(false);
                  showBooks("NONE");
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            Sidan har uppdaterats -{" "}
            <important>
              <Link
                style={{
                  paddingRight: "0.2rem",
                  color: "white",
                }}
                onClick={() => window.location.reload(true)}
              >
                uppdatera sidan
              </Link>
              för att visa ändringar!
            </important>
          </Alert>
        </Collapse>

        <div className="totalContainer">
          <h1 className="class-title">{id}</h1>
          <h5 className="class-title">{students.length}</h5>
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
        <CreateFakeUser />
        <div className="class-big-container">
          <div className="class-left-side">
            <div className="s-info">
              <p>NR</p>
              <p className="s-info-margin">BOK</p>
              <p>STATUS</p>
            </div>
            <div className="student-books-container" layout>
              {books.length > 0 ? (
                books.map((book) => (
                  /*<motion.div className="books" key={post.id}>*/
                  <div className="s-name" key={book.key}>
                    <div className="s-name-nr">{book.id}</div>
                    <div className="s-name-name">{book.name}</div>
                    <motion.button
                      whileHover={{
                        scale: 1.1,
                        transition: { duration: 0.1 },
                      }}
                      onClick={() => setStatus(book.status, book.key)}
                      style={{
                        backgroundColor: book.status,
                      }}
                      className="student-status"
                    ></motion.button>
                  </div>
                ))
              ) : (
                <div className="not-found">
                  <h4>Ingen elev har valts</h4>
                  <p>Tryck på elev från klasslistan</p>
                  <p className="e-book-nf">
                    Detta kan även bero på att eleven inte har någon bok för
                    tillfället
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="class-right-side">
            <ul>
              <li>
                <motion.div className="cont">
                  {students.length > 0 ? (
                    students.map((post) => (
                      <div className="w-cont">
                        <motion.div className="students">
                          <Link
                            to={
                              "/" +
                              post.id +
                              "&" +
                              post.name +
                              "&" +
                              post.marker +
                              "&" +
                              id
                            }
                          >
                            Ändra
                          </Link>

                          <p
                            user={post.name}
                            key={post.key}
                            className="student"
                          >
                            {post.name}
                          </p>

                          <Button
                            onClick={() => showBooks(post.name)}
                            className="show-books"
                            size="small"
                            variant="contained"
                            style={{
                              backgroundColor: "white",
                              borderRadius: "2rem",
                              fontSize: "1.4rem",
                              width: "20px",
                            }}
                          >
                            <FaUserEdit />
                          </Button>
                          <button
                            style={{
                              backgroundColor: post.marker,
                            }}
                            className="student-status-marker"
                          ></button>
                        </motion.div>
                      </div>
                    ))
                  ) : (
                    <div className="not-found">
                      <h4>Inga elever tillagda</h4>
                    </div>
                  )}
                </motion.div>
              </li>
            </ul>
            <Footer />
          </div>
        </div>
      </motion.div>
    );
  }
}

export default TestClass;
