import React, { useEffect, useState } from 'react';
import firebase from 'firebase';
import './ValidateUser.css';
import { db } from './App';
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';
import { blue } from '@material-ui/core/colors';
import User from './User'
function ValidateUser() {
    let username = firebase.auth().currentUser.displayName
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);


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
        setLoading(false);

      });
    

    // return cleanup function
    return () => sender();
    
  }, [loading]); 

  if (loading) {
    return (
        <div>
            <CircularProgress className="loading"/>
            
        </div>
    );
  } if (1 == 1)
    return (
        <div className="valUser">
            <h1 className="validate-promt">Välkommen, {username}</h1>
            <p className="validate-question">Vilken klass går du i?</p>
            <motion.div className="validate-klasser-container"layout >
                        {posts.length > 0 ? (
                            posts.map((post) => <motion.div
                            className="validate-klasser"
                            key={post.key}
                            whileHover={{
                                scale: 1.03,
                                backgroundColor: "rgba(134, 43, 219, 0.26)",
                                transition: { duration: 0.1 },
                              }
                            }
                              >
                               
                               <button className="validate-klass" onClick={() =>                  
                                    /* KÖR addUser() HÄR */
                                    console.log("User added")
                                }  >{post.namn}</button>
                                </motion.div>)
                        ) : (
                            <div className="validate-not-found">
                                <h4>Inga klasser tillagda</h4>
                            </div>
                        )}
            </motion.div>
        </div>
    )
}

export default ValidateUser