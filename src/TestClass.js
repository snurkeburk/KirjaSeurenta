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
  AiOutlineEdit,
} from "react-icons/ai";
import { ImUpload2 } from "react-icons/im";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { BiBookAdd, BiBookAlt } from "react-icons/bi";
import CreateFakeUser from "./CreateFakeUser";
import { RiArrowDownSLine } from "react-icons/ri";
import { FaUserEdit, FaBookMedical } from "react-icons/fa";
import { MdAdd, MdOutlineAddTask } from "react-icons/md";
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
import PageNotFound from "./PageNotFound";
import XssDetected from "./XssDetected";
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
  const [realClassListDisplay, setRealClassListDisplay] = useState(true);
  const [butter, setButter] = useState([]);
  const [statusChange, setStatusChange] = useState(false);
  const [displayBooks, setDisplayBooks] = useState(false);
  const [addBookB, setAddBookB] = useState(true);
  const [addBookA, setAddBookA] = useState(false);
  const [addBookF, setAddBookF] = useState(false);
  const [addBookS, setAddBookS] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState([]);
  const [selectedId, setSelectedId] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [selectedTurnInDate, setSelectedTurnInDate] = useState([]);
  const [editBookA, setEditBookA] = useState(false);
  const [editBookF, setEditBookF] = useState(false);
  const [editBookKey, setEditBookKey] = useState([]);
  const [titleReset, setTitleReset] = useState("");
  const [idReset, setIdReset] = useState("");
  const [turnindateReset, setTurnindateReset] = useState("");
  const [EditStudentBookDisplay, setEditStudentBookDisplay] = useState(false);
  const [editChecked, setEditChecked] = useState([]);
  const [editCheckedPrev, setEditCheckedPrev] = useState();
  const [userSelectedEdit, setUserSelectedEdit] = useState(false);
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
                  console.log("MARKED");
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
      .where("marker", "==", "red")
      .onSnapshot((snapshot) => {
        setRedCounter(snapshot.size);
      });
    const _sender = db
      .collection("users")
      .doc("students")
      .collection(id)
      .where("marker", "==", "green")
      .onSnapshot((snapshot) => {
        setGreenCounter(snapshot.size);
      });
  });

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
    setAddBookF(true);
    console.log(korv);
    for (let i = 0; i < korv.length; i++) {
      if (korv[i].name == name) {
        korv.splice(i, 1);
        if (korv.length == 0) {
          setAddBookF(false);
        }
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
    setAddBookS(true);
    for (let i = 0; i < butter.length; i++) {
      if (butter[i].title == title) {
        butter.splice(i, 1);
        if (butter.length == 0) {
          setAddBookS(false);
        }
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
        AddBookToStudent(butter[k].title, "?", id, korv[i].name, new Date());
      }
    }
  }

  function AddBookUI(step) {
    switch (step) {
      case "one":
        setUserSelectedEdit(false);
        if (korv.length > 0) {
          setAddBookF(true);
        }
        setButtonDisplay(true);
        setAddBookA(true);
        setAddBookB(false);
        break;
      case "checkbox":
        setAddBookF(true);
        break;
      case "exit":
        setButtonDisplay(false);
        setAddBookB(true);
        setClassListDisplay(false);
        setRealClassListDisplay(true);
        setAddBookA(false);
        setAddBookF(false);
        setAddBookS(false);
        //* FÖR EDIT BOOK //
        setEditBookA(false);
        setEditStudentBookDisplay(false);
        setEditChecked(editCheckedPrev);
        break;
      case "final":
        if (butter.length > 0) {
          setAddBookS(true);
        }
        setClassListDisplay(true);
        setRealClassListDisplay(false);
        setAddBookF(false);
        break;
      case "submit":
        setClassListDisplay(false);
        setRealClassListDisplay(true);
        setAddBookA(false);
        setAddBookF(false);
        setAddBookB(true);
        setButtonDisplay(false);
        setAddBookS(false);
        if (!userSelectedEdit) {
          uploadBooksToStudent();
        } else {
          //* FÖR EDIT BOOK //
          setEditBookA(false);
          setEditStudentBookDisplay(false);
          setDisplayBooks(false);
        }
        const timer = setTimeout(() => {
          console.log("setdisplaybooks to true");
          if (user.length > 0) {
            showBooks(user);
          }
        }, 500);
        break;
    }
  }

  function addBookID(title) {
    //setShowID("block");
    //setShowAllBooks("none");
    setSelBook(title);
    AddBookToStudent(title, "ID", id);
  }

  function EditStudentBook(title, currentid, currentStatus, key, turnindate) {
    console.log(currentStatus);
    setUserSelectedEdit(true);
    if (currentStatus == "green") {
      setEditChecked(false);
    } else {
      setEditChecked(true);
    }
    setEditStudentBookDisplay(true);
    setRealClassListDisplay(false);
    setEditBookA(true);
    setAddBookA(true);
    setAddBookS(true);
    setAddBookB(false);
    setSelectedTitle(title);
    setSelectedId(currentid);
    setSelectedTurnInDate(turnindate);
    console.log(currentStatus);
    if (currentStatus == "green") {
      setSelectedStatus(false);
    } else if (currentStatus == "red") {
      setSelectedStatus(true);
    }
    setEditBookKey(key);
  }

  const AddBookBtnStyle = {
    borderRadius: "0.5rem",
    margin: "0rem 1rem",
    backgroundColor: "white",
    fontSize: "2rem",
  };
  //* Laddar upp redigerad bok till firebase och uppdaterar informationen
  function checkboxMarkUser(currentStatus) {
    setEditCheckedPrev(currentStatus);
    if (currentStatus) {
      setEditChecked(false);
    } else {
      setEditChecked(true);
    }
    console.log(editChecked);
  }

  async function uploadEditedBook(title, nr, status, turnInDate) {
    if (userSelectedEdit) {
      console.log("STATES: " + selectedTitle + " " + selectedId);
      console.log(title + " " + nr + " " + turnInDate);
      let _datum = new Date().toString();
      let _split_datum = _datum.split(" ");
      let s1_datum = _split_datum[1];
      let s2_datum = _split_datum[2];
      let s3_datum = _split_datum[3];
      let s4_datum = _split_datum[4];
      let _split_time = s4_datum.split(":");
      let s1_s4_time = _split_time[0];
      let s2_s4_time = _split_time[1];
      let s4_fin_time = s1_s4_time + ":" + s2_s4_time;
      let datum_fin =
        s1_datum + " " + s2_datum + " " + s3_datum + " " + s4_fin_time;
      // Kemi 1
      console.log(datum_fin);
      console.log(editBookKey);
      let status = "";
      if (editChecked) {
        status = "red";
      } else {
        status = "green";
      }
      const res = await db
        .collection("users")
        .doc("students")
        .collection(id)
        .doc(user)
        .collection("items")
        .doc(editBookKey)
        .update({
          nr: nr,
          name: title,
          status: status,
          lastEdit: datum_fin,
          turnInDate: turnInDate,
        });
    }
  }
  //* Tar formData från redigera bok sidan och skickar till funktionen ovan
  const sparaBok = (event) => {
    console.log("selected title: " + selectedTitle);
    event.preventDefault();
    const elementsArray = [...event.target.elements];
    const formData = elementsArray.reduce((accumulator, currentValue) => {
      console.log(
        "currentid: " + currentValue.id + " - " + currentValue.value.length
      );
      console.log(currentValue.placeholder);
      if (currentValue.id && currentValue.value.length > 0) {
        accumulator[currentValue.id] = currentValue.value;
      } else {
        accumulator[currentValue.id] = currentValue.placeholder;
      }
      return accumulator;
    }, {});

    let username = firebase.auth().currentUser.displayName;

    let formDataTitle = formData.title;
    let formDataId = formData.id;
    let formDataTurnInDate = formData.turnInDate;
    setTitleReset("");
    setTurnindateReset("");
    setIdReset("");
    console.log(formDataTitle + " " + formDataId + " " + formDataTurnInDate);
    uploadEditedBook(formDataTitle, formDataId, "green", formDataTurnInDate);
  };

  if (loadingStudents) {
    <Sidebar />;
    return <CircularProgress />;
  } else if (
    //* ======================= Anti XSS och felaktiga URL's =======================
    id.includes(
      "<",
      ">",
      "{",
      "}",
      "/",
      "%",
      "$",
      "[",
      "]",
      "#",
      "@",
      "?",
      "-",
      "'"
    )
  ) {
    return <XssDetected />;
  } else if (id.length != 5) {
    return <PageNotFound />;
  } else if (
    (id.length == 5 && id.includes("TE")) ||
    (id.length == 5 && id.includes("ES")) ||
    (id.length == 5 && id.includes("EE"))
  ) {
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

        <div className="class-big-container">
          <div className="class-left-side">
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

            <Collapse in={ReverseInfoDisplay}>
              <Button
                onClick={() => funcInfoDisplay()}
                style={{
                  width: "100%",
                  color: "rgb(65, 123, 199)",
                  backgroundColor: "rgba(65, 123, 199, 0.20)",
                }}
              >
                <RiArrowDownSLine
                  style={{ fontSize: "1.6rem", paddingRight: "0.5rem" }}
                />
                <p>info</p>
              </Button>
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
            <h4 className="info-selected-user">{user}</h4>
            <div className="student-books-container" layout>
              {/* <div className="info-bp-container" >
                <p className="info-bp">NR</p>
                <p className="info-bp">BOK</p>
                <p className="info-bp">STATUS</p>
              </div>*/}
              <Collapse in={displayBooks}>
                {books.length > 0 ? (
                  books.map((book, index) => (
                    <motion.div className="books" key={index}>
                      <div className="s-name" style={{ fontWeight: "300" }}>
                        <div
                          className="s-name-nr"
                          style={{ marginRight: "0rem" }}
                        >
                          {book.nr}
                        </div>
                        <div className="s-name-name">
                          {book.name}{" "}
                          <p style={{ color: "gray", fontSize: "1rem" }}>
                            {book.addedAt} <HiOutlineArrowNarrowRight />{" "}
                            {book.turnInDate}
                          </p>
                          <p
                            style={{
                              color: "gray",
                              fontSize: "1rem",
                              padding: "0",
                            }}
                          >
                            {book.addedBy}
                          </p>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            width: "20vw",
                          }}
                        >
                          {book.status == "green" ? (
                            <div>
                              <p
                                style={{
                                  backgroundColor: "rgb(118, 175, 118)",
                                  borderRadius: "0.3rem",
                                  textAlign: "center",
                                  padding: "0 0.7rem",
                                  marginBottom: "0.5rem",
                                }}
                              >
                                utdelad
                              </p>
                            </div>
                          ) : (
                            <div>
                              <p
                                style={{
                                  backgroundColor: "rgb(180, 83, 83)",
                                  borderRadius: "0.3rem",
                                  textAlign: "center",
                                  padding: "0 0.7rem",
                                  marginBottom: "0.5rem",
                                }}
                              >
                                saknas
                              </p>
                              <p style={{ color: "gray", fontSize: "1rem" }}>
                                {book.addedAt}
                              </p>
                            </div>
                          )}
                        </div>

                        <div
                          style={{
                            width: "20rem",
                            display: "flex",
                            flexDirection: "column",
                            marginTop: "-1rem",
                            alignItems: "center",
                          }}
                        >
                          <Button
                            onClick={() =>
                              EditStudentBook(
                                book.name,
                                book.nr,
                                book.status,
                                book.key,
                                book.turnInDate
                              )
                            }
                            style={{
                              width: "15rem",
                              color: "rgb(65, 123, 199)",
                              marginRight: "0rem",
                            }}
                          >
                            <AiOutlineEdit
                              style={{
                                fontSize: "1.6rem",
                                paddingRight: "0.5rem",
                              }}
                            />
                            <p>redigera</p>
                          </Button>
                          <p style={{ color: "gray", fontSize: "0.7rem" }}>
                            senast redigerad: {book.lastEdit}
                          </p>
                        </div>
                        {/*
                        <div>
                        
                          <motion.button
                            whileHover={{
                              scale: 1.1,
                              transition: { duration: 0.1 },
                            }}
                            onClick={() => setStatus(book.status, book.key)}
                            style={{
                              backgroundColor: book.status, // TODO: gör setStatusColor if(green) set(var(--utdelade-color)) fast rgba value
                            }}
                            className="student-status"
                            ></motion.button>
                        </div>
                          */}
                      </div>
                      <div></div>
                    </motion.div>
                  ))
                ) : user.length == 0 ? (
                  <div className="not-found">
                    <h4>Ingen elev har valts</h4>
                    <p>Tryck på elev från klasslistan</p>
                    <p className="e-book-nf" style={{ color: "gray" }}>
                      (Detta kan även bero på att eleven inte har någon bok för
                      tillfället)
                    </p>
                  </div>
                ) : (
                  <div className="not-found">
                    <p style={{ color: "rgba(0,0,0,0.7)" }}>
                      Eleven har inte blivit tillldelad några böcker!
                    </p>
                  </div>
                )}
              </Collapse>
            </div>
          </div>
          <div className="class-right-side">
            <div className="add-book">
              <div className="add-book-s-one">
                <Collapse in={addBookB} className="collapse-add">
                  <Button
                    onClick={() => AddBookUI("one")}
                    style={{
                      width: "12rem",
                      color: "rgb(65, 123, 199)",
                    }}
                  >
                    <MdAdd style={{ fontSize: "1.6rem" }} />
                    <p>Lägg till böcker</p>
                  </Button>
                </Collapse>
                <Collapse in={addBookA}>
                  <Button
                    onClick={() => AddBookUI("exit")}
                    style={{
                      width: "7.5rem",
                      color: "rgb(65, 123, 199)",
                    }}
                  >
                    <CloseIcon style={{ fontSize: "1.6rem" }} />
                    <p>Avbryt</p>
                  </Button>
                </Collapse>
              </div>
              <div className="add-book-s-one">
                <Collapse in={addBookF}>
                  <Button
                    onClick={() => AddBookUI("final")}
                    style={{
                      width: "7.5rem",
                      color: "rgb(65, 123, 199)",
                    }}
                  >
                    <MdOutlineAddTask
                      style={{ fontSize: "1.6rem", paddingRight: "0.5rem" }}
                    />
                    <p>välj</p>
                  </Button>
                </Collapse>
                <Collapse in={addBookS}>
                  <Button
                    form="edit-form"
                    type="submit"
                    onClick={() => AddBookUI("submit")}
                    style={{
                      width: "12rem",
                      color: "rgb(65, 123, 199)",
                    }}
                  >
                    <ImUpload2
                      style={{ fontSize: "1.6rem", paddingRight: "0.5rem" }}
                    />
                    {EditStudentBookDisplay ? <p>klar</p> : <p>lägg till</p>}
                  </Button>
                </Collapse>

                {/* EDIT STUDENT BOOK VIEW */}
              </div>
            </div>
            <ul>
              <li>
                <Collapse in={realClassListDisplay}>
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
                            <div className="eye-status-container">
                              <Collapse in={buttonDisplay}>
                                <Checkbox
                                  label="checkbox"
                                  value={post.key}
                                  key={post.key}
                                  color="primary"
                                  onClick={() => AddBookUI("checkbox")}
                                  onChange={() => saveCheckbox(post.name)}
                                />
                              </Collapse>
                              <Button
                                onClick={() => showBooks(post.name)}
                                className="show-books"
                                size="small"
                                style={{
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
                            </div>
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
                <Collapse in={editBookA}>
                  <div className="edit-book-container">
                    <div className="edit-book-header">
                      <h1
                        style={{
                          display: "flex",
                          justifySelf: "center",
                          textAlign: "center",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {selectedTitle}{" "}
                        <p className="s-name-nr" style={{ marginLeft: "2rem" }}>
                          {selectedId}
                        </p>
                      </h1>
                      <h2>Ägs av {user}</h2>
                    </div>
                    <form
                      className="edit-book-form"
                      id="edit-form"
                      onSubmit={sparaBok}
                      autocomplete="off"
                      style={{ display: "flex", flexDirection: "column" }}
                    >
                      <div className="inner-input">
                        <div className="edit-book-input-container">
                          <p className="edit-book-header-s">Boktitel</p>
                          <input
                            className="edit-book-input"
                            type="text"
                            id="title"
                            placeholder={selectedTitle}
                            value={titleReset}
                            onChange={(e) => setTitleReset(e.target.value)}
                          ></input>
                        </div>
                        <div className="edit-book-input-container">
                          <p className="edit-book-header-s">Boknummer</p>
                          <input
                            className="edit-book-input"
                            type="text"
                            id="id"
                            placeholder={selectedId}
                            value={idReset}
                            onChange={(e) => setIdReset(e.target.value)}
                          ></input>
                        </div>
                        <div
                          className="edit-book-input-container"
                          id="final-edit-field"
                        >
                          <p className="edit-book-header-s">Inlämningsdatum</p>
                          {selectedTurnInDate == "?" ? (
                            <input
                              className="edit-book-input"
                              type="text"
                              id="turnInDate"
                              placeholder="?"
                              value={turnindateReset}
                              onChange={(e) =>
                                setTurnindateReset(e.target.value)
                              }
                            ></input>
                          ) : (
                            <input
                              className="edit-book-input"
                              type="text"
                              id="turnInDate"
                              placeholder={selectedTurnInDate}
                              value={turnindateReset}
                              onChange={(e) =>
                                setTurnindateReset(e.target.value)
                              }
                            ></input>
                          )}
                        </div>
                        <div className="inner-input-text">
                          <p>format: xxx zz yyyy</p>
                        </div>
                      </div>
                    </form>
                    <div className="edit-book-s">
                      <div>
                        <Checkbox
                          label="checkbox"
                          color="primary"
                          key={selectedTitle}
                          defaultChecked={editChecked}
                          onChange={() => checkboxMarkUser(editChecked)}
                        />
                        <div>
                          <p>Markera boken som saknad</p>
                          <p className="edit-select-status-lower">
                            Detta kommer att röd-markera boken & eleven.
                          </p>
                        </div>
                      </div>
                      <div>
                        <Checkbox
                          label="checkbox"
                          color="primary"
                          key={selectedTitle}
                          onChange={() => console.log("")}
                          disabled
                        />
                        <div>
                          <p>Markera boken som inlämnad</p>
                          <p className="edit-select-status-lower">
                            Detta kommer att gul-markera boken & eleven.
                          </p>
                        </div>
                      </div>
                    </div>
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
