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
import StudentBooks from "./StudentBooks";
function TestClass() {
  const [open, setOpen] = useState(false);
  const { id } = useParams(); // id = klassnamnet
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [posts, setPosts] = useState([]);
  const [infoDisplay, setInfoDisplay] = useState(true);
  const [ReverseInfoDisplay, setReverseInfoDisplay] = useState(false);
  const [allBooks, setAllBooks] = useState([]);
  const [showID, setShowID] = useState("none");
  const [showAllBooks, setShowAllBooks] = useState("block");
  const [selBook, setSelBook] = useState([]);
  const [cookies, setCookie] = useCookies(["user"]);
  const [timerDisplay, setTimerDisplay] = useState([]);
  const [_c, set_c] = useState(false);
  const [arr, setArr] = useState([]);
  const [korv, setKorv] = useState([]);
  const [greenCounter, setGreenCounter] = useState([]);
  const [redCounter, setRedCounter] = useState([]);
  const [buttonDisplay, setButtonDisplay] = useState(false);
  const [classListDisplay, setClassListDisplay] = useState(false);
  const [butter, setButter] = useState([]);
  const [statusChange, setStatusChange] = useState(false);
  const [displayBooks, setDisplayBooks] = useState(false);
  let username = firebase.auth().currentUser.displayName;

  const containerVariants = {
    hidden: {
      opacity: 0,
      x: "0",
      transition: {
        staggerChildren: 0.06,
      },
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        mass: 0.1,
        damping: 8,
        staggerChildren: 0.06,
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
      });

    // return cleanup function
    return () => sender();
  }, []);

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
            setOpen(true);
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
      .orderBy("name")
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
  const [showUser, setShowUser] = useState([]);
  const [orange, setOrange] = useState([]);
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
      });
    const timer = setTimeout(() => {
      console.log("setdisplaybooks to true");
      setDisplayBooks(true);
    }, 700);
  }

  function setStatus(status, key) {
    setDisplayBooks(false);
    if (status == "green") {
      db.collection("users")
        .doc("students")
        .collection(id)
        .doc(user)
        .collection("items")
        .doc(key)
        .update({
          status: "red",
        })
        .then(
          db
            .collection("users")
            .doc("students")
            .collection(id)
            .doc(user)
            .update({ marker: "red" })
        )
        .then(showBooks(user));
    } else if (status == "red") {
      db.collection("users")
        .doc("students")
        .collection(id)
        .doc(user)
        .collection("items")
        .doc(key)
        .update({
          status: "green",
        })
        .then(showBooks(user).then(setOpen(true)));
    }
  }

  // TODO: lägg till status brevid elev-namn som visar röd ifall
  // .. minst en av böckerna saknas, annars visar den grönt
  // .. visa t.ex. gult ifall eleven inte har någon bok (eller vitt/grått)

  // man kanske kan lägga till en animation på showBooks eller något
  // som gör så att animationen ex. opacity varar tillräckligt länge
  // för att buggen inte ska visas.
  // detta kommer däremot inte att fixa window resize problemet

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

  useEffect(() => {
    const sender = db.collection("books").onSnapshot((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        getBooksFromFirebase.push({
          ...doc.data(), //spread operator
          key: doc.id, // id från firebase
        });
      });
      setAllBooks(getBooksFromFirebase);
    });
    return () => sender();
  }, []);

  function saveCheckbox(name) {
    for (let i = 0; i < korv.length; i++) {
      if (korv[i].name == name) {
        korv.splice(i, 1);
        return name;
      }
    }
    setKorv([
      ...korv,
      {
        name: name,
      },
    ]);
  }
  function saveBookCheckbox(title) {
    for (let i = 0; i < butter.length; i++) {
      if (butter[i].title == title) {
        butter.splice(i, 1);
        return title;
      }
    }
    setButter([
      ...butter,
      {
        title: title,
      },
    ]);
  }

  function uploadBooksToStudent() {
    for (let i = 0; i < korv.length; i++) {
      for (let k = 0; k < butter.length; k++) {
        AddBookToStudent(butter[k].title, "ID", id, korv[i].name, new Date());
      }
    }
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
              <p className="class-utdelade">{greenCounter}</p>
              <p className="class-utdelade-desc">utdelade</p>
            </div>
            <div className="class-saknasContainer">
              <p className="class-saknas">{redCounter}</p>
              <p className="class-saknas-desc">saknas</p>
            </div>
          </div>
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
            <div className="student-books-container" layout>
              <div className="info-bp-container">
                <p className="info-bp">NR</p>
                <p className="info-bp">BOK</p>
                <p className="info-bp">STATUS</p>
              </div>
              <Collapse in={displayBooks}>
                {books.length > 0 ? (
                  books.map((book, index) => (
                    <motion.div className="books" key={index}>
                      <div className="s-name">
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
                    </motion.div>
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
              </Collapse>
            </div>
          </div>
          <div className="class-right-side">
            <Button variant="outlined" onClick={() => setButtonDisplay(true)}>
              +
            </Button>
            <Button
              variant="contained"
              onClick={() => setClassListDisplay(true)}
            >
              KLAR
            </Button>
            <Button
              variant="contained"
              style={{ backgroundColor: "lightgreen" }}
              onClick={() => uploadBooksToStudent()}
            >
              SISTA
            </Button>
            <ul>
              <li>
                <Collapse in={!classListDisplay}>
                  <motion.div
                    className="cont"
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                  >
                    {students.length > 0 ? (
                      students.map((post, index) => (
                        <motion.div className="w-cont" variants={childVariants}>
                          <motion.div className="students">
                            <p user={post.name} key={index} className="student">
                              {post.name}
                            </p>
                            <Collapse in={buttonDisplay}>
                              <Button
                                onClick={() => console.log("click")}
                                className="show-books"
                                size="small"
                                variant=""
                                style={{
                                  backgroundColor: "white",
                                  borderRadius: "2rem",
                                  fontSize: "1.1rem",
                                  width: "20px",
                                  padding: "0",
                                  mariginRight: "2rem",
                                }}
                              >
                                <Checkbox
                                  label="checkbox"
                                  value={post.key}
                                  key={post.key}
                                  onChange={() => saveCheckbox(post.name)}
                                />
                              </Button>
                            </Collapse>
                            <Button
                              onClick={() => showBooks(post.name)}
                              className="show-books"
                              size="small"
                              variant=""
                              style={{
                                backgroundColor: "rgba(128, 128, 128, 0.04)",
                                borderRadius: "2rem",
                                fontSize: "1.5em",
                                width: "0",
                                padding: "0.1px",
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
                        </motion.div>
                      ))
                    ) : (
                      <div className="not-found">
                        <h4>Inga elever tillagda</h4>
                      </div>
                    )}
                  </motion.div>
                </Collapse>
                <Collapse in={classListDisplay}>
                  <div>
                    <motion.div className="all-books-container">
                      <p>Välj bok:</p>
                      {allBooks.length > 0 ? (
                        allBooks.map((book, index) => (
                          /*<motion.div className="books" key={post.id}>*/
                          <motion.div
                            className="s-all-books"
                            key={index}
                            initial={{ y: -100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                          >
                            <div className="book">
                              <p>{book.title}</p>
                              <Checkbox
                                label="checkbox"
                                value={book.key}
                                onChange={() => saveBookCheckbox(book.title)}
                              />
                            </div>
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

                          <motion.button whileHover={{ scale: 1.1 }}>
                            {" "}
                            +{" "}
                          </motion.button>
                        </form>
                      </div>
                    </motion.div>
                  </div>
                </Collapse>
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
