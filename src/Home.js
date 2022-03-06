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
import { useDetectAdBlock } from "adblock-detect-react";
import { AiFillWarning } from "react-icons/ai";
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
  const [showAdblock, setShowAdblock] = useState(false);
  const [cookieStyle, setCookieStyle] = useState([]);
  const [apple, setApple] = useState([]);
  const [orange, setOrange] = useState([]);
  const [loadingSize, setLoadingSize] = useState(true);
  const [loadingMissingSize, setLoadingMissingSize] = useState(true);
  const [loadingTotalSize, setLoadingTotalSize] = useState(true);
  const [banana, setBanana] = useState([]);
  let username = firebase.auth().currentUser.displayName;
  const [size, setSize] = useState([]);

  const adBlockDetected = useDetectAdBlock();

  useEffect(() => {
    if (adBlockDetected) {
      setShowAdblock(true);
    }
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
      let _red = 0;
      let counter = 0;
      classes.forEach(
        (dox) => {
          counter++;
          db.collection("users")
            .doc("students")
            .collection(dox)
            .onSnapshot((querySnapshot) => {
              console.log(querySnapshot.size);
              apple.push([querySnapshot.size]);
              console.log();
              console.log(apple.length + " " + counter);
              if (apple.length == counter) {
                setLoadingTotalSize(false);
              }
            });
          // för "saknade" användare
          db.collection("users")
            .doc("students")
            .collection(dox)
            .where("marker", "==", "red")
            .onSnapshot((querySnapshot) => {
              orange.push([querySnapshot.size]);
              if (orange.length == counter) {
                setLoadingMissingSize(false);
              }
            });
          db.collection("users")
            .doc("students")
            .collection(dox)
            .where("marker", "==", "green")
            .onSnapshot((querySnapshot) => {
              banana.push([querySnapshot.size]);
              if (banana.length == counter) {
                setLoadingSize(false);
              }
              console.log(banana + " " + banana.length + " " + counter);
            });
        },
        [loadingTotalSize]
      );

      console.log(apple);
      setClassCount(apple);
      setPosts(classes);
      setLoadingBooks(false);
      setLoadingStudents(false);
      //AddBookToStudent("matte50004", 12345, "TE19D", "Nils Blomberg")
    });

    // return cleanup function
    //return () => sender();
  }, [loadingStudents]);

  const [kiwi, setKiwi] = useState([]);

  useEffect(() => {
    console.log(apple);
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

  if (loadingStudents) {
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
              <div className="content">
                {" "}
                Kirjan Seuranta använder cookies
                <br />
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
              </div>
            </motion.div>
          </CookiesProvider>
        </motion.div>
      </Collapse>

      {/*<Collapse in={showAdblock}>
        <motion.div
          className="adblock-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ease: "easeOut", duration: 1, delay: 1 }}
        >
          <motion.div
            className="modal-adblock"
            initial={{ y: 0 }}
            animate={{ y: 0 }}
            transition={{ ease: "easeOut", duration: 1, delay: 1 }}
          >
            <div className="content">
              <AiFillWarning className="adblock-warningicon" size={50} />
              <div className="header">
                <important>Adblock</important> upptäcktes!
              </div>{" "}
              <p>
                {" "}
                Kirja Seurenta använder tjänster som hjälper oss att skydda &
                förbättra hemsidan och användares upplevelse. Tyvärr så
                blockeras dessa tjänster av tillägg som är till för att blockera
                reklam.
              </p>
              <p>
                {" "}
                För att hemsidan ska fungera felfritt så ber vi dig att stänga
                av adblock när du besöker Kirja Seurenta.
              </p>
              <br />
              <important>
                Kirja Seurenta kommer aldrig att visa reklam eller använda
                informationen till tredje-parts tjänster. Läs mer om våran
                policy
              </important>
            </div>
            <div
              className="actions"
              style={{ display: "flex", justifyContent: "space-evenly" }}
            ></div>
          </motion.div>
        </motion.div>
                </Collapse>*/}

      <Sidebar />

      <div className="upper-container">
        <div className="total">
          <p>Totalt:</p>
        </div>
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
              posts.map((post, index) => (
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

                  <div className="klassEleverContainer">
                    <div className="klassEleverStatus">
                      {loadingSize ? (
                        <p className="utdelade">
                          <CircularProgress />
                        </p>
                      ) : (
                        <div>
                          <p className="utdelade">{banana[index]}</p>
                          <p className="klassEleverStatus-text">utdelade</p>
                        </div>
                      )}
                      {loadingMissingSize ? (
                        <p className="saknas">
                          <CircularProgress />
                        </p>
                      ) : (
                        <div>
                          <p className="saknas">{orange[index]}</p>
                          <p className="klassEleverStatus-text">saknas</p>
                        </div>
                      )}
                    </div>
                    {loadingTotalSize ? (
                      <div className="klassEleverAntal">
                        <CircularProgress />
                      </div>
                    ) : (
                      <div>
                        <div className="klassEleverAntal">{apple[index]}</div>
                        <p className="klassEleverStatus-text">totalt</p>
                      </div>
                    )}
                  </div>
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
