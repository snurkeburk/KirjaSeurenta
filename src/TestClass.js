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
import { TextField } from "@material-ui/core";
import Footer from "./Footer";
import "./Class.css";
import { AiFillDelete, AiOutlineConsoleSql } from "react-icons/ai";
import { AiFillEdit } from "react-icons/ai";
import Collapse from "@material-ui/core/Collapse";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import Alert from "@material-ui/lab/Alert";
import IconButton from "@material-ui/core/IconButton";
import { v4 as uuid_v4 } from "uuid";
import { getOverlappingDaysInIntervals } from "date-fns";

function TestClass() {
  const { id } = useParams(); // id = klassnamnet

  // för elever i klassen:
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
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

        setStudents(getStudentsFromFirebase);
        setLoadingStudents(false);
      });

    // return cleanup function
  }, [loadingStudents]);

  const [loadingBooks, setLoadingBooks] = useState(false);
  const [books, setBooks] = useState([]);
  const getBooksFromFirebase = [];
  const [user, SetUser] = useState([]);
  async function showBooks(user) {
    SetUser(user);
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

        setLoadingBooks(false);
      });
  }

  // TODO: lägg till status brevid elev-namn som visar röd ifall
  // .. minst en av böckerna saknas, annars visar den grönt
  // .. visa t.ex. gult ifall eleven inte har någon bok (eller vitt/grått)

  async function changeStatus(status, book) {
    console.log(status, book);
    console.log(user);
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
    }

    showBooks(user);
  }

  if (loadingStudents) {
    <Sidebar />;
    return <CircularProgress />;
  } else {
    console.log(students);
  }
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
                  <button
                    onClick={() => changeStatus(book.status, book.subj)}
                    variant="contained"
                    disableElevation
                    style={{
                      backgroundColor: book.status,
                    }}
                    className="student-status"
                  ></button>
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
                        <p className="student-number-disp">{}</p>
                        <p className="student">{post.name}</p>
                        <Button
                          onClick={() => showBooks(post.name)}
                          className="show-books"
                          size="small"
                          variant="contained"
                          style={{
                            backgroundColor: "lightgray",
                            width: "100px",
                          }}
                        >
                          visa
                        </Button>
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
