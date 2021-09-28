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
import { SettingsInputCompositeTwoTone } from '@material-ui/icons';
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
  const [posts, setPosts] = useState([]);

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
        setLoading(false);

      });

    // return cleanup function
    return () => sender();
    
  }, [loading]); 

  if (loading) {
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
    ) } else if (userObject.status === "student" && !username.includes("Isak")) {
      return (
        <div className="student-home-container">
          <SidebarStudent /> { /* ändra detta till StudentSidebar.js */}
          <div className="student-s-container">
         
          <motion.div className="student-left-side">
            <p>bok</p>

          </motion.div>

           <motion.div className="student-right-side">
          </motion.div>
        </div>
                  </div>

      )
    } else if (userObject.status === "student" && username.includes("Isak")) {
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
