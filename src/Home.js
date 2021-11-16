/* Copyright (C) Nils Blomberg & Isak Anderson - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Nils Blomberg <fred03.blomberg@gmail.com> and Isak Anderson <isak.anderson9@gmail.com>
 */

import { Button } from "@material-ui/core";
import { db, username } from "./App";
import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import SidebarStudent from "./SidebarStudent";
import { motion } from "framer-motion";
import "./Home.css";
import { Redirect } from "react-router-dom";
import { Link } from "react-router-dom";
import User from "./User";
import { add, update, remove, read } from "./Crud";
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
function Home() {
  //console.log("Home userObject: ");
  //console.log(userObject);
  const controller = new AbortController();
  const signal = controller.signal;
  const [loading, setLoading] = useState(true);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [students, setStudents] = useState([]);
  const [posts, setPosts] = useState([]);
  const [books, setBooks] = useState([]);
  const [student, setStudent] = useState([]);
  const [bookImages, setImages] = useState([]);
  const [bookIds, setIds] = useState([]);

  let username = firebase.auth().currentUser.displayName;
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
        .collection(username)
        .doc("data");

      const doc = await collection.get();

      if (!doc.exists) {
        console.log("Error!");
        return;
      } else {
        return doc.data();
      }
    }

    if (userObject.status == "student") {
      GetTeachersClasses().then(function (res) {
        let classes = res.classes;
        setPosts(classes);
        setLoadingBooks(false);
      });
    }

    // return cleanup function
    //return () => sender();
  }, [loadingBooks]);
  // för elever i klassen:
  useEffect(() => {
    const getStudentsFromFirebase = [];
    const sender = db
      .collection("users")
      .doc("students")
      .collection("TE19D")
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          getStudentsFromFirebase.push({
            ...doc.data(), //spread operator
            key: doc.id, // id från firebase
          });
        });
        setStudents(getStudentsFromFirebase);
        setLoadingStudents(false);
        console.log("Home js är typ fast i en loop");
      });
  }, [loadingBooks]);
  // för böcker

  useEffect(() => {
    async function sender() {
      console.log("FUCKING SKITBÖCKER");

      const readCollection = db
        .collection("users")
        .doc("students")
        .collection("TE19D") // måste ändras så den kollar på ex active_class elr något
        .doc(username);
      const doc = await readCollection.get();

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
        console.log("Active class: ");

        if (!null) {
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
    }
  }, [loadingBooks]);

  signal.addEventListener("abort", () => {
    console.log("aborted!");
  });

  if (loadingBooks) {
    return (
      <div>
        <Sidebar />
        <CircularProgress className="loading" />
      </div>
    );
  }

  if (userObject.status === "student") {
    //teacher view
    return (
      <div className="home">
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

                    <div className="klassEleverContainer">
                      <div className="klassEleverStatus">
                        <p className="utdelade">30</p>
                        <p className="saknas">1</p>
                      </div>
                      <div className="klassEleverAntal">
                        <p className="antalElever">31</p>
                      </div>
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
  } else if (
    userObject.status === "student" && //student view
    userObject.firstLogin === false
  ) {
    return (
      <div className="student-home-container">
        <SidebarStudent />
        <div className="student-s-container">
          <motion.div className="student-left-side">
            <motion.div className="böcker-container" layout>
              {books.length > 0 ? (
                books.map((post, index) => (
                  <motion.div className="bokContainer">
                    <motion.div
                      className="böcker"
                      style={{ backgroundImage: bookImages[index] }}
                      style={{
                        backgroundImage: bookImages[index],
                        backgroundSize: "cover",
                        /*backgroundSize: 'cover' */
                      }}
                      key={post.key}
                      whileHover={{
                        scale: 1.03,
                        transition: { duration: 0.1 },
                      }}
                    >
                      <a
                        className="bok"
                        href="#" /* style={{backgroundColor: 'green'}} */
                      >
                        {post}
                      </a>
                    </motion.div>
                    <div className="bokId">
                      <p>id: {bookIds[index]} </p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="not-found">
                  <h4>Inga böcker tillagda</h4>
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
          </motion.div>
        </div>
      </div>
    );
  } else if (userObject.status == "student" && userObject.firstLogin === true) {
    return (
      <div>
        <p>Vänta...</p>
        <CircularProgress className="loading" />
        <Redirect to="/hb4w7n5vb034vf3q4vtq34vtqv34tv3q4tvv87vw34" />
      </div>
    );
  }
}

export default Home;
