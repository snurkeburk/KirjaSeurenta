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

function Home() {
  console.log("loading student home...")
  console.log(userObject.status)

  //console.log("Home userObject: ");
  //console.log(userObject);
  const controller = new AbortController();
  const signal = controller.signal;
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState([]);
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
    async function sender() {
      const readCollection = db
        .collection("users")
        .doc("students")
        .collection("TE19D") 
        .doc("Nils Blomberg")
        .collection('items')

      const snapshot = await readCollection.get();

      if (snapshot.empty) {
        console.log("wallah det här borde inte vara så här")
        return;
      }

      let bookArray = [];

      snapshot.forEach(doc =>{
        console.log(doc.id, '=>', doc.data())
        bookArray.push(doc.data());
      })

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
          let idsArray = []

          res.forEach(book => {
            booksArray.push(book.name);
            idsArray.push(book.nr);
          });

          //const idsArray = Object.values(res.books);
          //const idsArray  = res.nr;

          console.log(booksArray);
          console.log(idsArray);

          
          let bookTitleArray = [];
          let bookImageArray = [];

          returnBookTitle(booksArray).then(function (res) {
            bookTitleArray = res[0];

            setBooks(bookTitleArray);

            bookImageArray = res[1];

            setImages(bookImageArray);
          });

          setIds(idsArray);
          setLoading(false);
        } else {
          console.log("res.books är null");
        }
      });
    }else {setLoading(false)}
  }, [loading]);


 

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
  } 


export default Home;
