import { CircularProgress } from "@material-ui/core";
import React, { useState, useEffect} from 'react';
import SidebarStudent from './SidebarStudent';
import {motion} from 'framer-motion';
import firebase from 'firebase';
import {db} from './App';
import { userObject } from "./App";

import App from './App';
import { Redirect } from 'react-router-dom';

function Elev() {
 
    const [loadingBooks, setLoadingBooks] = useState(true);
    const [books, setBooks] = useState([]);
    const [bookImages, setImages] = useState([]);
    const [bookIds, setIds] = useState([]);
  
    
    let username = firebase.auth().currentUser.displayName;

    
  // för böcker
 useEffect(() => {
    async function sender() {
      console.log("FUCKING SKITBÖCKER")

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
      console.log("bbbbbbbbbbbbbbbbbbbbbbbbbbbb")
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
        console.log("Active class: ")

        if(!null){ // hela skiten här e knullad ska fixa det nån annan gång
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
          setLoadingBooks(false);
        } else {
          console.log("res.books är null"); 
        }
        });
      
  }, [loadingBooks]); 
    
  

  if (userObject.firstLogin == true){
      return (
          <div>
              <Redirect to="/hb4w7n5vb034vf3q4vtq34vtqv34tv3q4tvv87vw34"></Redirect>
           </div>
      )
  }
  if (loadingBooks) {
    return (
      <div>
        <SidebarStudent />
        <p>Laddar böcker...</p>
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
    )
}

export default Elev
