/* Copyright (C) Nils Blomberg & Isak Anderson - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Nils Blomberg <fred03.blomberg@gmail.com> and Isak Anderson <isak.anderson9@gmail.com>
 */

import { Checkbox, CircularProgress } from "@material-ui/core";
import { React, useEffect, useState } from "react";
import firebase from "firebase";
import Crud from "./Crud";
import { db, userObject } from "./App";
import Sidebar from "./Sidebar";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@material-ui/core";
import Footer from "./Footer";
import "./Class.css";
import {
  AiFillDelete,
  AiOutlineConsoleSql,
  AiFillCloseCircle,
  AiFillInfoCircle,
  AiFillEye,
  AiOutlineEye,
} from "react-icons/ai";
import { BiBookAdd, BiBookAlt } from "react-icons/bi";
import CreateFakeUser from "./CreateFakeUser";
import { FaUserEdit } from "react-icons/fa";
import Alert from "@material-ui/lab/Alert";
import IconButton from "@material-ui/core/IconButton";
import Collapse from "@material-ui/core/Collapse";
import CloseIcon from "@material-ui/icons/Close";
import { Link } from "react-router-dom";
import TeacherRouting from "./TeacherRouting";
import { AddBookToStudent } from "./AddBook";
import { useCookies, getCookie } from "react-cookie";
import { collection, query, where, getDocs } from "firebase";
import { RemoveClassFromTeacher } from "./DeleteClass";

function TestClass() {
  const [open, setOpen] = useState(false);
  const { id } = useParams(); // id = klassnamnet
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [posts, setPosts] = useState([]);
  const [infoDisplay, setInfoDisplay] = useState(true);
  const [ReverseInfoDisplay, setReverseInfoDisplay] = useState(false);
  const [allBooks, setAllBooks] = useState([]);
  const [userSel, setUserSel] = useState([]);
  const [showID, setShowID] = useState("none");
  const [count, setCount] = useState([]);
  const [showAllBooks, setShowAllBooks] = useState("block");
  const [selBook, setSelBook] = useState([]);
  const [cookies, setCookie] = useCookies(["user"]);
  const [timerDisplay, setTimerDisplay] = useState([]);
  const [counter, setCounter] = useState([]);
  const [_c, set_c] = useState(false);
  const [arr, setArr] = useState([]);
  let username = firebase.auth().currentUser.displayName;
  useEffect(() => {
    if (cookies.user) {
      let c = cookies.user;
      let _c = c.split("%")[1];
      if (_c == "notseeninfo") {
        setInfoDisplay(true);
        setReverseInfoDisplay(false);
        set_c(false);
      } else {
        setInfoDisplay(false);
        setReverseInfoDisplay(true);
        set_c(true);
      }
    }
  });
  useEffect(() => {
    if (cookies.user == username) {
    } else {
      console.log("Cookie does not exist");
    }
  });

  useEffect(() => {
    setShowID("none");
    const getPostsFromFirebase = [];
    const sender = db
      .collection("users")
      .doc("students")
      .collection(id)
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          getPostsFromFirebase.push({
            ...doc.data(), //spread operator
            key: doc.id, // id från firebase
          });
        });
        for (let i = 0; i < getPostsFromFirebase.length; i++) {
          let mark = false;
          const getBookFromFirebase = [];
          db.collection("users")
            .doc("students")
            .collection(id)
            .doc(getPostsFromFirebase[i].name)
            .collection("items")
            .onSnapshot((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                getBookFromFirebase.push({
                  ...doc.data(), //spread operator
                  key: doc.id, // id från firebase
                });
              });
              for (let k = 0; k < getBookFromFirebase.length; k++) {
                if (getBookFromFirebase[k].status == "red") {
                  mark = true;
                  k = getBookFromFirebase.length;
                } else {
                }
              }

              if (mark) {
                checkMarked(getPostsFromFirebase[i].name, true);
              } else {
                checkMarked(
                  getPostsFromFirebase[i].name,
                  false,
                  getBookFromFirebase.length
                );
              }
            });
        }
        setPosts(getPostsFromFirebase);
        setLoadingStudents(false);
      });

    // return cleanup function
    return () => sender();
  }, [loadingStudents]);

  function checkMarked(user, marked, count) {
    if (marked) {
      setMarkedUser(user);
    } else if (!marked) {
      setUnMarkedUser(user, count);
    }
  }

  function setMarkedUser(user) {
    db.collection("users").doc("students").collection(id).doc(user).update({
      marker: "red",
    });
  }
  function setUnMarkedUser(user, count) {
    if (count > 0) {
      db.collection("users").doc("students").collection(id).doc(user).update({
        marker: "green",
      });
    } else {
      db.collection("users").doc("students").collection(id).doc(user).update({
        marker: "yellow",
      });
    }
  }
  useEffect(() => {
    const sender = db
      .collection("users")
      .doc("students")
      .collection(id)
      .where("status", "==", "student")
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            //.log("New : ", change.doc.data());
          }
          if (change.type === "modified") {
              console.log("Modified : ", change.doc.data());
              //showBooks("NONE")
              if (!change.doc.data().selected){
                setOpen(true);        
              }
            }
          if (change.type === "removed") {
          }
        });
      });
    return () => {
      sender();
    };
  }, []);

  // för elever i klassen:
  const getStudentsFromFirebase = [];
  useEffect(() => {
    const sender = db
      .collection("users")
      .doc("students")
      .collection(id) // här ska det vara klasserna som läraren har
      .orderBy('name')
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          getStudentsFromFirebase.push({
            ...doc.data(), //spread operator
            key: doc.id, // id från firebase
          });
        });
        // TODO om sidan märker en change i firebase så kommer det en POPUP
        // som tillåter användaren att "uppdatera sidan" eller "X".

        setStudents(getStudentsFromFirebase);
        setLoadingStudents(false);
        sender();
      });

    // return cleanup function
  }, [loadingStudents]);

  const [books, setBooks] = useState([]);
  const getBooksFromFirebase = [];
  const [user, SetUser] = useState([]);

  async function showBooks(user) {
    SetUser(user);
    const stop = db
      .collection("users")
      .doc("students")
      .collection(id)
      .doc(user)
      .collection("items")
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          getBooksFromFirebase.push({
            ...doc.data(), //spread operator
            key: doc.id, // id från firebase
          });
        });
        setBooks(getBooksFromFirebase);
        stop();
      });
  }

  function setStatus(status, key) {
    if (status == "green") {
      db.collection("users")
        .doc("students")
        .collection(id)
        .doc(user)
        .collection("items")
        .doc(key)
        .update({
          status: "red",
        });
      // update user_status to red
      db.collection("users").doc("students").collection(id).doc(user).update({
        marker: "red",
      });
    } else if (status == "red") {
      db.collection("users")
        .doc("students")
        .collection(id)
        .doc(user)
        .collection("items")
        .doc(key)
        .update({
          status: "green",
        });
    }
    setOpen(true);
  }

  // TODO: lägg till status brevid elev-namn som visar röd ifall
  // .. minst en av böckerna saknas, annars visar den grönt
  // .. visa t.ex. gult ifall eleven inte har någon bok (eller vitt/grått)

  // man kanske kan lägga till en animation på showBooks eller något
  // som gör så att animationen ex. opacity varar tillräckligt länge
  // för att buggen inte ska visas.
  // detta kommer däremot inte att fixa window resize problemet

  function changeStatus(status, book) {
    if (status == "green") {
      status = "red";
      db.collection("users")
        .doc("students")
        .collection(id)
        .doc(user)
        .collection("items")
        .doc(book)
        .update({
          status: "red",
        });

      db.collection("users").doc("students").collection(id).doc(user).update({
        marker: "red",
      });
    } else if (status == "red") {
      status = "green";
      db.collection("users")
        .doc("students")
        .collection(id)
        .doc(user)
        .collection("items")
        .doc(book)
        .update({
          status: "green",
        });
      const sender = db
        .collection("users")
        .doc("students")
        .collection(id)
        .doc(user)
        .collection("items")
        .onSnapshot((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            getBooksFromFirebase.push({
              ...doc.data(), //spread operator
              key: doc.id, // id från firebase
            });
          });

          setBooks(getBooksFromFirebase);
          if (books.length == 0) {
            db.collection("users")
              .doc("students")
              .collection(id)
              .doc(user)
              .update({
                marker: "yellow",
              });
          }
          for (let i = 0; i < books.length; i++) {
            if (books[i].status == "red") {
              db.collection("users")
                .doc("students")
                .collection(id)
                .doc(user)
                .update({
                  marker: "red",
                });
            } else {
              db.collection("users")
                .doc("students")
                .collection(id)
                .doc(user)
                .update({
                  marker: "green",
                });
            }
          }
        });
    }
  }
  const sparaID = (event) => {
    event.preventDefault();
    const elementsArray = [...event.target.elements];
    const formData = elementsArray.reduce((accumulator, currentValue) => {
      if (currentValue.id) {
        accumulator[currentValue.id] = currentValue.value;
      }
      return accumulator;
    }, {});

    let username = firebase.auth().currentUser.displayName;

    let formDataID = formData.namn.toUpperCase();

    //AddBookToStudent(selBook, formDataID, id, userSel).then(setOpen(true));
  };

  function funcInfoDisplay() {
    if (cookies.user && !_c) {
      setCookie("user", username + "%" + "seeninfo", {
        path: "/",
      });
    } else if (cookies.user && _c) {
      setCookie("user", username + "%" + "notseeninfo", {
        path: "/",
      });
    } else {
      if (infoDisplay) {
        setInfoDisplay(false);
        setReverseInfoDisplay(true);
      } else {
        setInfoDisplay(true);
        setReverseInfoDisplay(false);
      }
    }
    /*if (infoDisplay) {
      setInfoDisplay(false);
      setReverseInfoDisplay(true);
    } else {
      setInfoDisplay(true);
      setReverseInfoDisplay(false);
    }*/
  }

  async function addBookDropdown() {
    async function getSelectedStudentsToArr() {
      let array = [];
      let amountSel = 0;
      const citiesRef = db
        .collection("users")
        .doc("students")
        .collection("TE19D");
      const snapshots = await citiesRef.where("selected", "==", true).get();
      snapshots.forEach((selDoc) => {
        array[amountSel] = selDoc.data().name + ", ";
        amountSel++;
      });
      setArr(array);
    }
  
    getSelectedStudentsToArr();
    const sender = db.collection("books").onSnapshot((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        getBooksFromFirebase.push({
          ...doc.data(), //spread operator
          key: doc.id, // id från firebase
        });
      });
      setUserSel(user);
      setShowAllBooks("block");
      //setShowID("none");
      setAllBooks(getBooksFromFirebase);
    });
  }

  async function checkBox(name) {
    const c = await db
      .collection("users")
      .doc("students")
      .collection(id)
      .doc(name)
      .get();
    let selected = c.data().selected;
    console.log(selected);
    if (selected) {
      db.collection("users").doc("students").collection(id).doc(name).update({
        selected: false,
      });
    } else if (!selected) {
      db.collection("users").doc("students").collection(id).doc(name).update({
        selected: true,
      });
    }
  }

   function deSelect(name){
     db.collection("users").doc("students").collection(id).doc(name).update({
      selected: false,
    })
  }

  function addBookID(title) {
    //setShowID("block");
    //setShowAllBooks("none");
    setSelBook(title);
    AddBookToStudent(title, "ID", id);
  }
  if (loadingStudents) {
    <Sidebar />;
    return <CircularProgress />;
  } else {
    return (
      <motion.div initial={{ opacity: "0%" }} animate={{ opacity: "100%" }}>
        <Sidebar />
        <Collapse in={open}>
          <Alert
            variant="filled"
            severity="info"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setOpen(false);
                  showBooks("NONE");
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            Sidan har uppdaterats -{" "}
            <important>
              <Link
                style={{
                  paddingRight: "0.2rem",
                  color: "white",
                }}
                onClick={() => window.location.reload(true)}
              >
                uppdatera sidan
              </Link>
              för att visa ändringar!
            </important>
          </Alert>
        </Collapse>

        <div className="totalContainer">
          <h1 className="class-title">{id}</h1>
          <h5 className="class-title-size">{students.length}</h5>
          <div className="innerTotalContainer">
            <div className="class-utdeladeContainer">
              <p className="class-utdelade">0</p>
              <p className="class-utdelade-desc">utdelade</p>
            </div>
            <div className="class-saknasContainer">
              <p className="class-saknas">0</p>
              <p className="class-saknas-desc">saknas</p>
            </div>
          </div>
          <CreateFakeUser />
          <Button
            size={"small"}
            onClick={() =>
              RemoveClassFromTeacher(
                firebase.auth().currentUser.displayName,
                id
              )
            }
          >
            <AiFillDelete className="class-deleteClass" size={35} />
          </Button>
        </div>

        <div className="class-big-container">
          <div className="class-left-side">
            <Collapse in={ReverseInfoDisplay}>
              <motion.button
                whileHover={{
                  scale: 1.2,
                  transition: { duration: 0.1 },
                }}
                onClick={() => funcInfoDisplay()}
                className="button-info-open"
              >
                <AiFillInfoCircle size={40} className="info-open" />
              </motion.button>
            </Collapse>
            <Collapse in={infoDisplay}>
              <div className="class-important-info">
                <motion.button
                  whileHover={{
                    scale: 1.2,
                    transition: { duration: 0.1 },
                  }}
                  onClick={() => funcInfoDisplay()}
                  className="button-info-close"
                >
                  <AiFillCloseCircle size={30} className="info-close" />
                  <p>{timerDisplay}</p>
                </motion.button>
                <h1>Viktig information!</h1>
                <p>
                  Vid ändringar av status krävs det att sidan uppdateras för att
                  ändringar ska visas.
                </p>
                <Alert
                  variant="filled"
                  severity="info"
                  action={
                    <IconButton aria-label="close" color="inherit" size="small">
                      <CloseIcon fontSize="inherit" />
                    </IconButton>
                  }
                >
                  Sidan har uppdaterats -{" "}
                  <important>
                    <Link
                      style={{
                        paddingRight: "0.2rem",
                        color: "white",
                      }}
                    >
                      uppdatera sidan
                    </Link>
                    för att visa ändringar!
                  </important>
                </Alert>
                <p>
                  Om en blå "varning" dyker upp så behöver du uppdatera sidan,
                  denna kan dyka upp flera gånger i rad{" "}
                  <important className="important">
                    (sidan måste uppdateras varje gång den kommer upp)
                  </important>
                  .
                </p>
                <p>
                  Ändringar går fortfarande igenom men visas ej tills att sidan
                  har uppdaterats.
                </p>
              </div>
            </Collapse>
            <motion.div className="all-books-container">
              <p>Välj bok:</p>
              {allBooks.length > 0 ? (
                allBooks.map((book) => (
                  /*<motion.div className="books" key={post.id}>*/
                  <motion.div
                    className="s-all-books"
                    key={book.key}
                    style={{ display: showAllBooks }}
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                  >
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      className="all-books-sel"
                      onClick={() => addBookID(book.title)}
                    >
                      {book.title}
                    </motion.button>
                  </motion.div>
                ))
              ) : (
                <p></p>
              )}
              <div className="sel-ID" style={{ display: showID }}>
                <p>Ange boknummer:</p>
                <form onSubmit={sparaID} autocomplete="off">
                  <motion.input
                    className="input"
                    type="text"
                    id="namn"
                    required
                    placeholder="Skriv här..."
                    whileFocus={{ scale: 1.2 }}
                  ></motion.input>

                  <motion.button whileHover={{ scale: 1.1 }}> + </motion.button>
                </form>
              </div>
            </motion.div>
            <div className="student-books-container" layout>
              <div className="info-bp-container">
                <p className="info-bp">NR</p>
                <p className="info-bp">BOK</p>
                <p className="info-bp">STATUS</p>
              </div>
              {books.length > 0 ? (
                books.map((book) => (
                  /*<motion.div className="books" key={post.id}>*/
                  <div className="s-name" key={book.key}>
                    <div className="s-name-nr">{book.nr}</div>
                    <div className="s-name-name">{book.name}</div>
                    <div>
                      <motion.button
                        whileHover={{
                          scale: 1.1,
                          transition: { duration: 0.1 },
                        }}
                        onClick={() => setStatus(book.status, book.key)}
                        style={{
                          backgroundColor: book.status,
                        }}
                        className="student-status"
                      ></motion.button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="not-found">
                  <h4>Ingen elev har valts</h4>
                  <p>Tryck på elev från klasslistan</p>
                  <p className="e-book-nf">
                    Detta kan även bero på att eleven inte har någon bok för
                    tillfället
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="class-right-side">
            <ul>
              <li>
                <motion.div className="cont">
                  {students.length > 0 ? (
                    students.map((post) => (
                      <div className="w-cont">
                        <motion.div className="students">
                          <p
                            user={post.name}
                            key={post.key}
                            className="student"
                          >
                            {post.name}
                          </p>
                          {post.selected ? (
                            deSelect(post.name),
                            <Button
                            onClick={() => addBookDropdown()}
                            className="show-books"
                            size="small"
                            variant=""
                            style={{
                              backgroundColor: "white",
                              borderRadius: "2rem",
                              fontSize: "1.1rem",
                              width: "20px",
                              padding: "0",
                            }}
                          >
                              <Checkbox
                                label="checkbox"
                                value={post.key}
                                key={post.key}
                                onChange={() => checkBox(post.name)}
                              />
                          </Button>
                            ) : (
                              <Button
                            onClick={() => addBookDropdown()}
                            className="show-books"
                            size="small"
                            variant=""
                            style={{
                              backgroundColor: "white",
                              borderRadius: "2rem",
                              fontSize: "1.1rem",
                              width: "20px",
                              padding: "0",
                            }}
                          >
                              <Checkbox
                                label="checkbox"
                                value={post.key}
                                key={post.key}
                                onChange={() => checkBox(post.name)}
                              />
                          </Button>
                            )}
                          <Button
                            onClick={() => showBooks(post.name)}
                            className="show-books"
                            size="small"
                            variant=""
                            style={{
                              backgroundColor: "white",
                              borderRadius: "2rem",
                              fontSize: "1.5em",
                              width: "20px",
                              marginRight: "50px",
                              padding: "0",
                            }}
                          >
                            <AiOutlineEye />
                          </Button>
                          <button
                            style={{
                              backgroundColor: post.marker,
                            }}
                            className="student-status-marker"
                          ></button>
                        </motion.div>
                      </div>
                    ))
                  ) : (
                    <div className="not-found">
                      <h4>Inga elever tillagda</h4>
                    </div>
                  )}
                </motion.div>
              </li>
            </ul>
            <Footer />
          </div>
        </div>
      </motion.div>
    );
  }
}

export default TestClass;
