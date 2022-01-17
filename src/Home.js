/* Copyright (C) Nils Blomberg & Isak Anderson - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Nils Blomberg <fred03.blomberg@gmail.com> and Isak Anderson <isak.anderson9@gmail.com>
 */

import { Button, Collapse, createGenerateClassName } from "@material-ui/core";
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
import Popup from "reactjs-popup";
import { CookiesProvider } from "react-cookie";
import { useCookies, getCookie } from "react-cookie";
import { GetClassSize, greenCounter, redCounter } from "./GetClassSize";
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
import { AddBookToStudent } from "./AddBook";
import "reactjs-popup/dist/index.css";

function Home() {
  console.log("loading home...");
  console.log(userObject.status);
  //console.log("Home userObject: ");
  //console.log(userObject);
  const controller = new AbortController();
  const signal = controller.signal;
  const [loading, setLoading] = useState(true);
  const [chosenNoCookies, setChosenNoCookies] = useState(false);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [students, setStudents] = useState([]);
  const [posts, setPosts] = useState([]);
  const [classCount, setClassCount] = useState([]);
  const [books, setBooks] = useState([]);
  const [student, setStudent] = useState([]);
  const [bookImages, setImages] = useState([]);
  const [bookIds, setIds] = useState([]);
  const [cookies, setCookie] = useCookies(["user"]);
  const [showCookies, setShowCookies] = useState(false);
  const [cookieStyle, setCookieStyle] = useState([]);
  let username = firebase.auth().currentUser.displayName;
  const [size, setSize] = useState([]);

  useEffect(() => {
    console.log(cookies.user);
  });
  function handleCookie() {
    setCookie("user", username + "%" + "notseeninfo", {
      path: "/",
    });
  }
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
    async function GetTeachersClasses() {
      const getPostsFromFirebase = [];
      const collection = db
        .collection("users")
        .doc("teachers")
        .collection("data")
        .doc(firebase.auth().currentUser.uid);

      const doc = await collection.get();
      console.log(doc.data().classes);
      if (!doc.exists) {
        console.log("Error!");
        const getPostsFromFirebase = [];
        const collection = db
          .collection("users")
          .doc("mentors")
          .collection("data")
          .doc(firebase.auth().currentUser.uid);

        const doc = await collection.get();
        return doc.data();
      } else {
        return doc.data();
      }
    }

    GetTeachersClasses().then(function (res) {
      let classes = res.classes;
      const shit = [];
      let _red = 0;
      classes.forEach((dox) => {
        db.collection("users")
          .doc("students")
          .collection(dox)
          .onSnapshot((querySnapshot) => {
            console.log(querySnapshot.size);
            shit.push({
              size: querySnapshot.size,
            });
          });
      });

      console.log(shit);
      setClassCount(shit);
      setPosts(classes);
      setLoadingBooks(false);
      //AddBookToStudent("matte50004", 12345, "TE19D", "Nils Blomberg")
    });

    // return cleanup function
    //return () => sender();
  }, [loadingStudents]);

  useEffect(() => {
    async function sender() {
      const readCollection = db
        .collection("users")
        .doc("students")
        .collection("TE19D") // måste ändras så den kollar på ex active_class elr något
        .doc(username); // TODO: platsen för books har flyttats till .doc(username).collection("books");
      const doc = await readCollection.get();
      const getStudentsFromFirebase = [];

      if (!doc.exists) {
        console.log(username);
        console.log("Error");
      } else {
        return doc.data();
      }
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
        if (res.books != null && res.books != undefined) {
          // hela skiten här e knullad ska fixa det nån annan gång
          const booksArray = Object.keys(res.books);

          const idsArray = Object.values(res.books);

          let bookTitleArray = [];
          let bookImageArray = [];

          returnBookTitle(booksArray).then(function (res) {
            bookTitleArray = res[0];

            setBooks(bookTitleArray);

            bookImageArray = res[1];

            setImages(bookImageArray);
          });

          setIds(idsArray);
          setStudent(false);
          setLoadingBooks(false);
        } else {
          console.log("res.books är null");
        }
      });
    } else {
      setLoadingBooks(false);
    }
  }, [loadingBooks]);

  signal.addEventListener("abort", () => {
    console.log("aborted!");
  });

  useEffect(() => {
    console.log(classCount);
    if (cookies.user) {
      return showCookies;
    } else {
      if (!chosenNoCookies) {
        setShowCookies(true);
      }
    }
  });

  function closeCookies() {
    setChosenNoCookies(true);
    setShowCookies(false);
    setCookieStyle({
      backgroundColor: "white",
    });
  }
  function consentCookies() {
    handleCookie();
  }

  if (loadingBooks) {
    return (
      <div>
        <Sidebar />
        <CircularProgress className="loading" />
      </div>
    );
  }

  //teacher view
  return (
    <div className="home">
      <Collapse in={showCookies}>
        <motion.div
          className="cookies-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ease: "easeOut", duration: 1, delay: 1 }}
        >
          <CookiesProvider>
            <motion.div
              className="modal"
              initial={{ y: 500 }}
              animate={{ y: 0 }}
              transition={{ ease: "easeOut", duration: 1, delay: 1 }}
            >
              <div className="header">Cookies</div>
              <div className="content">
                {" "}
                Kirjan Seuranta använder cookies för att förbättra din
                upplevelse på vår webbplats och för att visa dig relevant
                information.
                <br />
                För att veta mer, läs om cookies [här] och [här]
              </div>
              <div
                className="actions"
                style={{ display: "flex", justifyContent: "space-evenly" }}
              >
                <Button
                  onClick={() => {
                    consentCookies();
                    closeCookies();
                  }}
                  className="button"
                  variant="contained"
                  style={{
                    backgroundColor: "lightgreen",
                    width: "max-content",
                  }}
                >
                  Godkänn
                </Button>
                <Button
                  className="button"
                  variant="contained"
                  onClick={() => {
                    console.log("modal closed ");
                    closeCookies();
                  }}
                >
                  Stäng
                </Button>
              </div>
            </motion.div>
          </CookiesProvider>
        </motion.div>
      </Collapse>
      <Sidebar />

      <div className="upper-container">
        <div className="total">
          <p>Totalt:</p>
        </div>
        <SmallAdd />
      </div>
      <motion.div
        className="home-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="left-side">
          <p>Sök efter bok</p>
        </div>
        <motion.div className="right-side">
          <motion.div
            className="klasser-container"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            layout
          >
            {posts.length > 0 ? (
              posts.map((post) => (
                <motion.div
                  variants={childVariants}
                  className="klasser"
                  key={post.key}
                  whileHover={{
                    scale: 1.03,
                    transition: { duration: 0.1 },
                  }}
                >
                  <Link className="klass" to={"klass/" + post}>
                    {post}
                  </Link>
                  {classCount.length > 0 ? (
                    classCount.map((count) => (
                      <div className="klassEleverContainer">
                      <div className="klassEleverStatus">
                        <p className="utdelade">{count.size}</p>
                        <p className="saknas">1</p>
                      </div>
                      <div className="klassEleverAntal">{post}</div>
                    </div>
                      ))
                  ) : (
                    <div className="klassEleverContainer">
                      <div className="klassEleverStatus">
                        <p className="utdelade"></p>
                        <p className="saknas">1</p>
                      </div>
                      <div className="klassEleverAntal">{post}</div>
                    </div>
                  )}
                </motion.div>
              ))
            ) : (
              <div className="not-found">
                <h4>Inga klasser tillagda</h4>
                <Link className="link" to="/add">
                  Lägg till en klass
                </Link>
              </div>
            )}

            {/*
                        klasser.map(klass=>{
                        return(
                            <div className="blog-container">
                            <h4>{klass.namn}</h4>

                            </div>
                        )
                        })
                    */}
          </motion.div>
          <Footer />
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Home;
