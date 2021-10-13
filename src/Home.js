/* Copyright (C) Nils Blomberg & Isak Anderson - All Rights Reserved
* Unauthorized copying of this file, via any medium is strictly prohibited
* Proprietary and cofidential
* Written by Nils Blomberg <fred03.blomberg@gmail.com> and Isak Anderson <isak.anderson@gmail.com
*/

import { db } from './App';
import React,{useState,useEffect} from 'react';
import Sidebar from './Sidebar'
import SidebarStudent from './SidebarStudent'
import { motion } from "framer-motion"
import './Home.css';
import { Redirect } from "react-router-dom";  
import { Link } from 'react-router-dom';
import User from './User';
import { add, update, remove, read } from './Crud'
import { Dock, SettingsInputCompositeTwoTone } from '@material-ui/icons';
import { AnimateSharedLayout } from "framer-motion"
import { CircularProgress } from '@material-ui/core';
import Add from './Add';
import { userExists } from './User';
import randomColor from 'randomcolor';
import { userObject } from './App';
import firebase from 'firebase';
import { isSameWeek } from 'date-fns';

function Home() {
    
  /*  const [klasser,setKlasser]=useState([])
    const fetchKlasser=async()=>{
      const response=db.collection('test');
      const data=await response.get();
      data.docs.forEach(item=>{
       setKlasser([...klasser,item.data()])
      })
    }
    useEffect(() => {
      fetchKlasser();
    }, [])*/


    const [loading, setLoading] = useState(true);
    const [loadingBooks, setLoadingBooks] = useState(true);
  const [posts, setPosts] = useState([]);
  const [books, setBooks] = useState([]);
    const [student, setStudent] = useState([]);
  let username = firebase.auth().currentUser.displayName

  useEffect(() => {
    const getPostsFromFirebase = [];
    const sender = db
      .collection("users").doc("teachers").collection(username).doc("data").collection("classes")
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
    //const getPostsFromFirebase = [];
    /*const sender = db
      .collection("books")
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          getPostsFromFirebase.push({
            ...doc.data(), //spread operator
            key: doc.id, // id från firebase
          });
        });
        setBooks(getPostsFromFirebase);
        setStudent(false)
        setLoadingBooks(false);

      }); */
      //const getPostsFromFirebase = [];
      
      async function sender() {
        console.log('sendeA');

        const readCollection = db.collection('users').doc('students').collection('TE19D').doc(username);
        const doc = await readCollection.get();

        if(!doc.exists) {
          console.log("Error");
        } else {
          return doc.data();
        }

        /*
        await console.log(snapshot);
        let arr = [];
        await snapshot.forEach(doc => {
          const data = doc.data();
          arr.push(data);

        })
        */
        //getPostsFromFirebase.push('Matte 5000 4')
        
        //getPostsFromFirebase = arr;
        /*
        console.log(getPostsFromFirebase);
        setBooks(getPostsFromFirebase);
        setStudent(false);
        setLoadingBooks(false);
        */

      }

      sender().then(function(res) {
        console.log(res.books);

        const booksArray = Object.keys(res.books);

        setBooks(booksArray);
        setStudent(false);
        setLoadingBooks(false);
      })
      //return sender();

    // return cleanup function
    //return () => sender();
    
  }, [loading]); 

  if (loadingBooks) {
    return (
        <div>
            <Sidebar />
            <CircularProgress className="loading"/>
            
        </div>
    );
  }

    if (userObject.status === 'teacher'){ return (
        <div>
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

                    <motion.div className="klasser-container"layout >
                        {posts.length > 0 ? (
                            posts.map((post) => <motion.div
                            className="klasser"
                            key={post.key}
                            whileHover={{
                                scale: 1.03,
                                transition: { duration: 0.1 },
                              }
                            }
                              >
                                <a className="klass" href="#" >{post.namn}</a>
                                
                                </motion.div>)
                        ) : (
                            <div className="not-found">
                                <h4>Inga klasser tillagda</h4>
                                <Link className="link" to="/add">Lägg till en klass</Link>
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
                    */  }
                    </motion.div>



                     
                </motion.div>
             
            </motion.div>
        </div>
    ) } else if (userObject.status === "student" && username.includes("Nils") && userObject.firstLogin === false) {
      return (
        <div className="student-home-container">
          <SidebarStudent /> { /* ändra detta till StudentSidebar.js */}
          <div className="student-s-container">
         
          <motion.div className="student-left-side">
              <motion.div className="böcker-container"layout >
                        {books.length > 0 ? (
                            books.map((post) => <motion.div
                            className="böcker"
                            key={post.key}
                            whileHover={{
                                scale: 1.03,
                                transition: { duration: 0.1 },
                              }
                            }
                              >
                                <a className="bok" href="#" >{books}</a>
                                </motion.div>)
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
                    */  }
                    </motion.div>


          </motion.div>


        </div>
                  </div>

      )
    } else if (userObject.status === "student" && userObject.firstLogin === true) {
      console.log(userObject.firstLogin);
        return (
          <div>
             <p>Vänta...</p>
             <CircularProgress className="loading"/>
              <Redirect to="/validation" />
            </div>
        )
    }
}

export default Home
