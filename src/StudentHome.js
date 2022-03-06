/* Copyright (C) Nils Blomberg & Isak Anderson - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Nils Blomberg <fred03.blomberg@gmail.com> and Isak Anderson <isak.anderson9@gmail.com>
 */

import { Button, createGenerateClassName } from "@material-ui/core";
import { db, username, FieldValue } from "./App";
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
import { MdAdd, MdOutlineAddTask } from "react-icons/md";

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
import { Cookies, CookiesProvider } from "react-cookie";
import { useCookies, getCookie } from "react-cookie";

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
  const [cookies, setCookie, removeCookie] = useCookies(["cid"]);
  const [cid, setCid] = useState([]);
  const [loadingCookie, setLoadingCookie] = useState(true);
  const [ready, setReady] = useState(false);
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
    if (cookies.cid) {
      console.log("coookiie exists");
    }
    async function sender() {
      const ids = db.collection("users").doc("ids");
      const iddoc = await ids.get();
      let _id = userObject.id + "&" + userObject.status;
      let id = userObject.id;
      let data = iddoc.data().ids;
      for (let i = 0; i < data.length; i++) {
        console.log("comparing: " + data[i] + " to: " + userObject.id);
        if (data[i].includes(userObject.id)) {
          console.log("found: " + data[i] + " in: " + userObject.id);
          console.log("user exists(studenthome)");
          // sets cid as classname for readCollection below
          if (cookies.cid) {
            if (cookies.cid == data[i].split("&")[2]) {
              console.log("everything is fine (using cookie for items)");
            } else {
              console.log("cookie and ID are not a match, recreating cookie..");
            }
          } else {
            //TODO: DO all thhis before checking for books tto prevent reloads etc
            console.log("create cookie here");
            setCookie("cid", data[i].split("&")[2], {
              path: "/",
            });
            setLoading(false);
            setLoadingCookie(false);
          }
          i = data.length;
        }
      }
      if (cookies.cid) {
        const readCollection = db
          .collection("users")
          .doc("students")
          .collection(cookies.cid)
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
        setLoadingCookie(false);
        return bookArray;

        const getStudentsFromFirebase = [];
      }
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

    /*
     * lite skum kod för att ändra status och lägga till klassnamn i status 
        setCookkie(className), ta cookie och implementera i ID, cookie spelar nt ngn roll efter det
    */

    async function getCookieCID() {
      if (cookies.cid) {
        console.log(cookies.cid);
        console.log(userObject.name + " | " + username);
        const collection = db
          .collection("users")
          .doc("students")
          .collection(cookies.cid)
          .doc(userObject.name);
        const doc = await collection.get();
        console.log(doc.data().id);
        let new_id = doc.data().id;
        const ids = db.collection("users").doc("ids");
        const iddoc = await ids.get();
        let data = iddoc.data().ids;
        for (let i = 0; i < data.length; i++) {
          if (new_id.includes(data[i]) && !data[i].includes(cookies.cid)) {
            console.log("found: " + data[i] + " in: " + new_id);
            /* db.collection("users")
            .doc("ids")
            .update({
              ids: FieldValue.arrayUnion(new_id),
            });*/
            const removeRes = await ids
              .update({
                ids: firebase.firestore.FieldValue.arrayRemove(data[i]),
              })
              .then(() => console.log("removed old id"));
            const updateRes = await ids.update({
              ids: firebase.firestore.FieldValue.arrayUnion(new_id),
            });
          }
          for (const id of data) {
            // sätter in nya ID't som innehåller klassnamnet!
          }
        }
      }
    }
    getCookieCID();
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
  /*
  useEffect(() => {
    while (loading) {
      console.log("loading");
    }
    while (loadingCookie) {
      console.log("loading cookie");
    }
  });
*/
  if (loading || loadingCookie) {
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
          <div>
            <h3>
              Du har <important>{books.length}</important> böcker
            </h3>
            <Button
              onClick={() => coll()}
              style={{
                width: "7.5rem",
                height: "2.5rem",
                color: "rgb(65, 123, 199)",
                backgroundColor: "rgba(0, 0, 0, 0.1)",
                marginTop: "1rem",
              }}
            >
              <MdAdd style={{ fontSize: "1.6rem" }} />
              <p>se info</p>
            </Button>
          </div>
        ) : books.length == 1 ? (
          <h3>
            <div>
              <h3>
                Du har <important>{books.length}</important> bok
              </h3>
              <Button variant="outlined" onClick={() => coll()}>
                se mer info
              </Button>
            </div>
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
            {books.length > 0 ? (
              books.map((post, index) => (
                <motion.div className="bokContainer">
                  <motion.div>
                    {" "}
                    <Collapse in={collapse}>
                      <div
                        className="böcker"
                        style={{
                          backgroundSize: "cover",
                          borderStyle: "outset",
                          borderWidth: "2px",
                          borderBottomStyle: "outset",
                          borderColor: bookStatus[index],
                          backgroundColor: "rgba(128, 128, 128, 0.15)",
                        }}
                      >
                        <div
                          style={{
                            paddingRight: "0rem",
                            paddingTop: ".5rem",
                            textAlign: "center",
                          }}
                        >
                          {bookStatus[index] == "red" ? (
                            <p
                              style={{
                                fontSize: "1.5rem",
                                color: bookStatus[index],
                              }}
                            >
                              status: saknas!
                            </p>
                          ) : (
                            <p
                              style={{
                                color: bookStatus[index],
                                fontSize: "1.5rem",
                              }}
                            >
                              status: utdelad
                            </p>
                          )}
                          <div
                            className="book-innerinfo"
                            style={{ marginTop: "1rem" }}
                          >
                            <div style={{ textAlign: "left" }}>
                              <p>bok:</p>
                            </div>
                            <div style={{ textAlign: "left", width: "7rem" }}>
                              <p>{post}</p>
                            </div>
                          </div>
                          <div className="book-innerinfo">
                            <div style={{ textAlign: "left" }}>
                              <p>nummer:</p>
                            </div>
                            <div style={{ textAlign: "left", width: "7rem" }}>
                              <p>{bookIds[index]} </p>
                            </div>
                          </div>
                          <div className="book-innerinfo">
                            <div style={{ textAlign: "left" }}>
                              <p>utdelad:</p>
                            </div>
                            <div style={{ textAlign: "left", width: "7rem" }}>
                              <p>{addedAt[index]}</p>
                            </div>
                          </div>
                          <div className="book-innerinfo">
                            <div style={{ textAlign: "left" }}>
                              <p>inlämnas:</p>
                            </div>
                            <div style={{ textAlign: "left", width: "7rem" }}>
                              <p>{turnIn[index]}</p>
                            </div>
                          </div>
                          <div className="book-innerinfo">
                            <div style={{ textAlign: "left" }}>
                              <p>utgivare:</p>
                            </div>
                            <div style={{ textAlign: "left", width: "7rem" }}>
                              <p>{addedBy[index]}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Collapse>
                    <Collapse in={antiCollapse}>
                      <motion.div
                        className="böcker"
                        style={{
                          backgroundImage: bookImages[index],
                          backgroundSize: "cover",
                          borderStyle: "outset",
                          borderWidth: "2px",
                          borderBottomStyle: "outset",
                          borderColor: bookStatus[index],
                          /*backgroundSize: 'cover' */
                        }}
                        key={post.key}
                      >
                        {bookStatus[index] == "red" ? (
                          <div
                            style={{
                              backgroundColor: "rgb(180, 83, 83)",
                              color: "white",
                            }}
                          >
                            saknas!
                          </div>
                        ) : (
                          <div></div>
                        )}
                      </motion.div>
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
                    </Collapse>
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
