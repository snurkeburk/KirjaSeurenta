/* Copyright (C) Nils Blomberg & Isak Anderson - All Rights Reserved
* Unauthorized copying of this file, via any medium is strictly prohibited
* Proprietary and cofidential
* Written by Nils Blomberg <fred03.blomberg@gmail.com> and Isak Anderson <isak.anderson@gmail.com
*/

import { CircularProgress } from "@material-ui/core";
import { db } from "./App";
import React, { useState, useEffect} from 'react';
import User from './User';
import App from './App';
import { motion } from "framer-motion"
import Sidebar from './Sidebar'
import firebase from 'firebase';
import './Books.css';
import { add, update, remove, read, readWhere, updateField, nestedAdd, nestedRead, readOne } from './Crud'



function Books() {
    const [loadingBooks, setLoadingBooks] = useState(true);
    const [loading, setLoading] = useState(true);
    const [books, setBooks] = useState([]);
    const [student, setStudent] = useState([]);
    const [bookImages, setImages] = useState([]);
    const [bookIds, setIds] = useState([]);
    let username = firebase.auth().currentUser.displayName;
    
      useEffect(() => {
        async function sender() {
          const readCollection = db
            .collection("users")
            .doc("students")
            .collection("TE19D") 
            .doc(username);
          const doc = await readCollection.get();
    
          if (!doc.exists) {
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
    
        sender().then(function (res) {
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
        });
      }, [loadingBooks]);
    
      if (loadingBooks) {
        return (
          <div>
            <Sidebar />
            <motion.div className="MyBooks"
            initial={{opacity: "0%" }}
            animate={{opacity: "100%" }}
            >
            

                    <div className="left-books-container">
                        <p>Alla böcker:</p>
                        <CircularProgress className="loading-allbooks" />

                    </div>
                    <div className="right-books-container">
                        <p>Mina böcker:</p>
                        <CircularProgress className="loading-mybooks" />

                    </div>
                   
            </motion.div>
          </div>
        );
      }
        else { 
            return (
        <div>
            <Sidebar />
            <motion.div className="MyBooks"
            initial={{opacity: "0%" }}
            animate={{opacity: "100%" }}
            >
            

            <div className="left-books-container">
                <p>Alla böcker:</p>
                
                <motion.div className="böcker-mybooks-container" layout>
                {books.length > 0 ? (
                    books.map((post, index) => (
                    <motion.div className="bokContainer">
                        <motion.div
                        className="böcker-mybooks"
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
                            className="mybooks-bok"
                            href="#" /* style={{backgroundColor: 'green'}} */
                            >
                        </a>
                        </motion.div>
                        <div className="allbooks-id">
                              <p className="allbooks-name"> {post} </p>
                        </div>
                    </motion.div>
                    ))
                    ) : (
                        <div className="not-found">
                    <h4>Inga böcker tillagda</h4>
                    </div>
                )}
                </motion.div>
                        </div>
                        <div className="right-books-container">
                            <p>Mina böcker:</p>

                        </div>
                    
                </motion.div>
        </div>
    )
}}

export default Books
