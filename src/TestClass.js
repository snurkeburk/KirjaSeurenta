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
import { Button } from "@material-ui/core";
import Footer from "./Footer";
import "./Class.css";
import { AiFillDelete, AiOutlineConsoleSql } from "react-icons/ai";
import CreateFakeUser from "./CreateFakeUser";
import { FaUserEdit } from "react-icons/fa";

function TestClass() {
  const { id } = useParams(); // id = klassnamnet
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
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
            console.log("green: " + getStudentsFromFirebase[i].name);
          } else if (getStudentsFromFirebase[i].marker == "red") {
            console.log("red: " + getStudentsFromFirebase[i].name);
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
      .collection("books")
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          getBooksFromFirebase.push({
            ...doc.data(), //spread operator
            key: doc.id, // id från firebase
          });
        });
        setBooks(getBooksFromFirebase);
        console.log(getBooksFromFirebase)
        console.log("stop here");
      });
  }

  // TODO: lägg till status brevid elev-namn som visar röd ifall
  // .. minst en av böckerna saknas, annars visar den grönt
  // .. visa t.ex. gult ifall eleven inte har någon bok (eller vitt/grått)

  // man kanske kan lägga till en animation på showBooks eller något
  // som gör så att animationen ex. opacity varar tillräckligt länge
  // för att "buggen" inte ska visas.
  // detta kommer däremot inte att fixa window resize problemet som
  // tillkommer med denna "bug".
  function changeStatus(status, book) {
    if (status == "green") {
      status = "red";
      db.collection("users")
        .doc("students")
        .collection(id)
        .doc(user)
        .collection("books")
        .doc(book)
        .update({
          status: "red",
        });
      showBooks(user);

      db.collection("users").doc("students").collection(id).doc(user).update({
        marker: "red",
      });
    } else if (status == "red") {
      status = "green";
      db.collection("users")
        .doc("students")
        .collection(id)
        .doc(user)
        .collection("books")
        .doc(book)
        .update({
          status: "green",
        });
      const sender = db
        .collection("users")
        .doc("students")
        .collection(id)
        .doc(user)
        .collection("books")
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
      showBooks(user);
    }
  }

  if (loadingStudents) {
    <Sidebar />;
    return <CircularProgress />;
  } else {
  }
  return (
    <motion.div initial={{ opacity: "0%" }} animate={{ opacity: "100%" }}>
      <Sidebar />
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
                <div className="s-name">
                  <div className="s-name-nr">{book.nr}</div>
                  <div className="s-name-name">{book.name}</div>
                  <motion.button
                    whileHover={{
                      scale: 1.1,
                      transition: { duration: 0.1 },
                    }}
                    onClick={() => changeStatus(book.status, book.subj)}
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
                        <p user={post.name} key={post.id} className="student">
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

export default TestClass;
