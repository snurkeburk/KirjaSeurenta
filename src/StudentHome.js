/* Copyright (C) Nils Blomberg & Isak Anderson - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Nils Blomberg <fred03.blomberg@gmail.com> and Isak Anderson <isak.anderson9@gmail.com>
 */

import { Button, createGenerateClassName } from "@material-ui/core";
import { db, username } from "./App";
import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import SidebarStudent from "./SidebarStudent";
import { motion } from "framer-motion";
import "./Home.css";
import { Redirect } from "react-router-dom";
import { Link } from "react-router-dom";
import User from "./User";
import { add, update, remove, read, readOne } from "./Crud";
import { Dock, SettingsInputCompositeTwoTone } from "@material-ui/icons";
import { AnimateSharedLayout } from "framer-motion";
import { CircularProgress } from "@material-ui/core";
import Add from "./Add";
import { userExists } from "./User";
import randomColor from "randomcolor";
import { userObject } from "./App";
import firebase from "firebase";
import { isSameWeek } from "date-fns";
import Footer from "./Footer";
import { ar } from "date-fns/locale";
import SmallAdd from "./SmallAdd";
import AbortController from "abort-controller";
import GetClassSize from "./GetClassSize";
import XssDetected from "./XssDetected";
import Collapse from "@material-ui/core/Collapse";

function Home() {
  console.log("loading student home...");
  console.log(userObject.status);

  //console.log("Home userObject: ");
  //console.log(userObject);
  const controller = new AbortController();
  const signal = controller.signal;
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState([]);
  const [bookImages, setImages] = useState([]);
  const [bookIds, setIds] = useState([]);
  const [bookStatus, setStatus] = useState([]);
  const [addedAt, setAddedAt] = useState([]);
  const [addedBy, setAddedBy] = useState([]);
  const [turnIn, setTurnIn] = useState([]);
  const [collapse, setCollapse] = useState(false);
  const [antiCollapse, setAntiCollapse] = useState(true);
  let _username = firebase.auth().currentUser.displayName;
  let _firstname = _username.split(" ")[0];
  let _lastname = _username.split(" ")[1];
  let username = _lastname + " " + _firstname;
  const containerVariants = {
    hidden: {
      opacity: 0,
      x: "0",
      transition: {
        staggerChildren: 0.1,
      },
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        mass: 0.1,
        damping: 8,
        staggerChildren: 0.1,
        delay: 0,
        when: "beforeChildren",
      },
    },
  };
  const childVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
    },
  };
  useEffect(() => {
    async function sender() {
      const readCollection = db
        .collection("users")
        .doc("students")
        .collection("TE19D")
        .doc(username)
        .collection("items");

      const snapshot = await readCollection.get();

      if (snapshot.empty) {
        console.log("wallah det här borde inte vara så här");
        return;
      }

      let bookArray = [];

      snapshot.forEach((doc) => {
        console.log(doc.id, "=>", doc.data());
        bookArray.push(doc.data());
      });

      return bookArray;

      const getStudentsFromFirebase = [];

      /*
      console.log(doc);

      if (!doc.exists) {
        console.log(username);
        console.log("Error");
      } else {
        console.log(doc.data());
        return doc.data();
      }
      */
    }

    async function returnBookTitle(arr) {
      let bookTitleArray = [];
      let allBooksArray = [];
      let bookImageArray = [];
      const readCollection = db.collection("books");
      const snapshot = await readCollection.get();
      snapshot.forEach((doc) => {
        allBooksArray.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      arr.forEach((element) => {
        allBooksArray.forEach((bookElement) => {
          console.log("ID: " + bookElement.id + " element: " + element);
          if (element == bookElement.id) {
            bookTitleArray.push(bookElement.data.title);
            bookImageArray.push("url(" + bookElement.data.cover + ")");
          }
        });
      });

      return [bookTitleArray, bookImageArray];
    }

    if (userObject.status == "student") {
      sender().then(function (res) {
        if (res != null && res != undefined) {
          // hela skiten här e knullad ska fixa det nån annan gång
          //const booksArray = Object.keys(res.books);
          let booksArray = [];
          let idsArray = [];
          let statusArray = [];
          let addedAtArray = [];
          let turnInArray = [];
          let addedByArray = [];
          // TODO  let addedByArray = [];
          res.forEach((book) => {
            booksArray.push(book.bid);
            idsArray.push(book.nr);
            statusArray.push(book.status);
            addedAtArray.push(book.addedAt);
            turnInArray.push(book.turnInDate);
            addedByArray.push(book.addedBy);
            // TODO addedBy.push(book.addedBy);
          });

          //const idsArray = Object.values(res.books);
          //const idsArray  = res.nr;

          let bookTitleArray = [];
          let bookImageArray = [];

          returnBookTitle(booksArray).then(function (res) {
            bookTitleArray = res[0];

            setBooks(bookTitleArray);

            bookImageArray = res[1];

            setImages(bookImageArray);
          });
          setStatus(statusArray);
          setTurnIn(turnInArray);
          setAddedAt(addedAtArray);
          setAddedBy(addedByArray);
          setIds(idsArray);
          setLoading(false);
        } else {
          console.log("res.books är null");
        }
      });
    } else {
      setLoading(false);
    }
  }, [loading]);
  function coll(key) {
    console.log(key);
    if (antiCollapse) {
      setAntiCollapse(false);
      setCollapse(true);
    } else {
      setAntiCollapse(true);
      setCollapse(false);
    }
  }
  if (loading) {
    return (
      <div>
        <SidebarStudent />
        <CircularProgress className="loading" />
      </div>
    );
  }
  return (
    <div className="student-home-container">
      <SidebarStudent />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ease: "easeOut", duration: 2, delay: 0.2 }}
        className="student-welcome-container"
      >
        <h1 className="student-welcome-msg">Välkommen {_firstname}</h1>
        {books.length > 1 ? (
          <h3>
            Du har <important>{books.length}</important> böcker
          </h3>
        ) : books.length == 1 ? (
          <h3>
            Du har <important>{books.length}</important> bok
          </h3>
        ) : (
          <h3>Du har inga böcker.</h3>
        )}
      </motion.div>
      <div className="student-s-container">
        <motion.div className="student-left-side">
          <motion.div
            className="böcker-container"
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ease: "easeOut", duration: 1, delay: 1 }}
          >
            <Button variant="contained" onClick={() => coll()}></Button>
            {books.length > 0 ? (
              books.map((post, index) => (
                <motion.div className="bokContainer">
                  <motion.div
                    whileHover={{
                      scale: 1.03,
                      transition: { duration: 0.1 },
                    }}
                  >
                    {" "}
                    <Collapse in={collapse}>
                      <div
                        className="böcker"
                        style={{
                          backgroundSize: "cover",
                          borderStyle: "outset",
                          borderWidth: "2px",
                          borderBottomStyle: "none",
                          borderColor: bookStatus[index],
                          backgroundColor: "rgb(26, 16, 41)",
                        }}
                      >
                        <div
                          style={{
                            paddingLeft: "0.6rem",
                            paddingRight: "0rem",
                            paddingTop: "1rem",
                            textAlign: "left",
                          }}
                        >
                          {bookStatus[index] == "red" ? (
                            <p
                              style={{
                                paddingTop: "1rem",
                                fontSize: "1.5rem",
                                color: bookStatus[index],
                              }}
                            >
                              status: saknas!
                            </p>
                          ) : (
                            <p
                              style={{
                                paddingTop: "1rem",
                                color: bookStatus[index],
                                fontSize: "1.5rem",
                              }}
                            >
                              status: utdelad
                            </p>
                          )}
                          <p
                            style={{
                              color: "rgb(212, 211, 211)",
                              paddingTop: "1rem",
                            }}
                          >
                            utdelad: {addedAt[index]}{" "}
                          </p>
                          <p
                            style={{
                              color: "rgb(212, 211, 211)",
                            }}
                          >
                            inlämnas: {turnIn[index]}{" "}
                          </p>
                          <p
                            style={{
                              color: "rgb(212, 211, 211)",
                              paddingTop: "1rem",
                            }}
                          >
                            utlånad av: {addedBy[index]}
                          </p>
                        </div>
                      </div>
                    </Collapse>
                    <Collapse in={antiCollapse}>
                      <motion.div
                        className="böcker"
                        style={{ backgroundImage: bookImages[index] }}
                        style={{
                          backgroundImage: bookImages[index],
                          backgroundSize: "cover",
                          borderStyle: "outset",
                          borderWidth: "2px",
                          borderBottomStyle: "none",
                          borderColor: bookStatus[index],
                          /*backgroundSize: 'cover' */
                        }}
                        key={post.key}
                      >
                        {bookStatus[index] == "red" ? (
                          <div
                            style={{
                              backgroundColor: "rgb(180, 83, 83)",
                              borderTopRightRadius: "0.8rem",
                              borderTopLeftRadius: "0.8rem",
                              color: "white",
                            }}
                          >
                            saknas!
                          </div>
                        ) : (
                          <div></div>
                        )}
                      </motion.div>
                    </Collapse>
                    <div
                      className="bokId"
                      style={{
                        borderStyle: "outset",
                        borderColor: bookStatus[index],
                        borderTopStyle: "none",
                        borderWidth: "2px",

                        /*backgroundSize: 'cover' */
                      }}
                    >
                      <p>{post}</p>
                      <p>{bookIds[index]} </p>
                    </div>
                  </motion.div>
                </motion.div>
              ))
            ) : (
              <div className="not-found">
                <h4>Inga böcker tillagda</h4>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default Home;
