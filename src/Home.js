import { db } from "./App";
import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import SidebarStudent from "./SidebarStudent";
import { motion } from "framer-motion";
import "./Home.css";
import { Redirect } from "react-router-dom";
import { Link } from "react-router-dom";
import User from "./User";
import { add, update, remove, read } from "./Crud";
import { SettingsInputCompositeTwoTone } from "@material-ui/icons";
import { AnimateSharedLayout } from "framer-motion";
import { CircularProgress } from "@material-ui/core";
import Add from "./Add";
import { userExists } from "./User";
import randomColor from "randomcolor";
import { userObject } from "./App";
import firebase from "firebase";
import Footer from "./Footer";
import { isSameWeek } from "date-fns";
function Home() {
  const [loading, setLoading] = useState(true);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [posts, setPosts] = useState([]);
  const [books, setBooks] = useState([]);
  const [student, setStudent] = useState([]);
  let username = firebase.auth().currentUser.displayName;

  useEffect(() => {
    const getPostsFromFirebase = [];
    const sender = db
      .collection("users")
      .doc("teachers")
      .collection(username)
      .doc("data")
      .collection("classes")
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          getPostsFromFirebase.push({
            ...doc.data(), //spread operator
            key: doc.id, // id från firebase
          });
        });
        setPosts(getPostsFromFirebase);
        setStudent(true);
        setLoadingBooks(false);
      });

    // return cleanup function
    return () => sender();
  }, [loadingBooks]);
  useEffect(() => {
    const getPostsFromFirebase = [];
    const sender = db
      .collection("users")
      .doc("students")
      .collection("TE19D")
      .doc("Isak Anderson")
      .collection("books")

      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          getPostsFromFirebase.push({
            ...doc.data(), //spread operator
            key: doc.id, // id från firebase
          });
        });
        setBooks(getPostsFromFirebase);
        setStudent(false);
        setLoadingBooks(false);
        console.log(userObject.className);
      });

    // return cleanup function
    return () => sender();
  }, [loading]);

  if (loadingBooks) {
    return (
      <div>
        <Sidebar />
        <CircularProgress className="loading" />
      </div>
    );
  }

  if (userObject.status === "student") {
    return (
      <div className="home">
        <Sidebar />
        <div className="total">
          <p>Totalt:</p>
        </div>
        <motion.div
          className="home-container"
          initial={{ opacity: "0%" }}
          animate={{ opacity: "100%" }}
        >
          <div className="left-side">
            <p>Sök efter bok</p>
          </div>
          <motion.div className="right-side">
            <motion.div className="klasser-container" layout>
              {posts.length > 0 ? (
                posts.map((post) => (
                  <motion.div
                    className="klasser"
                    key={post.key}
                    whileHover={{
                      scale: 1.03,
                      transition: { duration: 0.1 },
                    }}
                  >
                    <a className="klass" href="#">
                      {post.namn}
                    </a>

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
    userObject.status === "student" &&
    userObject.firstLogin === false
  ) {
    return (
      <div className="student-home-container">
        <SidebarStudent /> {/* ändra detta till StudentSidebar.js */}
        <div className="student-s-container">
          <motion.div className="student-left-side">
            <motion.div className="böcker-container" layout>
              {books.length > 0 ? (
                books.map((post) => (
                  <motion.div
                    className="böcker"
                    key={post.key}
                    whileHover={{
                      scale: 1.03,
                      transition: { duration: 0.1 },
                    }}
                  >
                    <a className="bok" href="#">
                      {post.title}
                    </a>
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
  } else if (
    userObject.status === "student" &&
    userObject.firstLogin === true
  ) {
    console.log(userObject.firstLogin);
    return (
      <div>
        <p>Vänta...</p>
        <CircularProgress className="loading" />
        <Redirect to="/validation" />
      </div>
    );
  }
}

export default Home;
