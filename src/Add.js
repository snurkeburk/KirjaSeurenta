/* Copyright (C) Nils Blomberg & Isak Anderson - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Nils Blomberg <fred03.blomberg@gmail.com> and Isak Anderson <isak.anderson9@gmail.com>
 */

import React, { useState } from "react";
import { db, user } from "./App";
import Sidebar from "./Sidebar";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import "./Add.css";
import { motion } from "framer-motion";
import { makeStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";
import IconButton from "@material-ui/core/IconButton";
import Collapse from "@material-ui/core/Collapse";
import Button from "@material-ui/core/Button";
import CloseIcon from "@material-ui/icons/Close";
import firebase from "firebase";
import { FieldValue } from "./App";
import { AlertTitle } from "@material-ui/lab";

function Add() {
  const [open, setOpen] = React.useState(false);
  const [alertType, setAlertType] = useState("success");
  const [alertTitleText, setAlertTitleText] = useState("");
  const [alertResultText, setAlertResultText] = useState(
    "Klassen har lagts till!"
  );
  const [expectedError, setExpectedError] = useState([]);
  async function AddClassToTeacher(formData) {
    let username = firebase.auth().currentUser.displayName;
    let _id = firebase.auth().currentUser.uid;
    console.log("adding to doc: " + _id);
    const collection = db
      .collection("users")
      .doc("teachers")
      .collection("data")
      .doc(_id);

    const collectionMentor = db
      .collection("users")
      .doc("mentors")
      .collection("data")
      .doc(_id);

    if (
      (formData.includes("TE") ||
        formData.includes("ES") ||
        formData.includes("EE")) &&
      formData.length == 5
    ) {
      //lägger till en teknikklass, samma för de under.
      const addClass = await collection
        .update({
          classes: FieldValue.arrayUnion(formData),
        })
        .then(() => setOpen(true))
        .catch((err) => setExpectedError(err));

      if (expectedError) {
        const addClassMentor = await collectionMentor
          .update({
            classes: FieldValue.arrayUnion(formData),
          })
          .then(() => setOpen(true));
      }
      setAlertType("success");
      setAlertTitleText("");
      setAlertResultText("Klassen har lagts till!");
    } else if (
      !(formData.includes("TE") ||
      formData.includes("ES") ||
      formData.includes("EE"))
      && formData.length == 5
    ) {
      console.log(formData.length);
      setAlertType("error");
      setAlertTitleText("Error");
      setAlertResultText("Ett fel uppstod, försök igen!");
      setOpen(true);
      console.log("Invalid classname!");
    } else if (
      (formData.includes("TE") ||
      formData.includes("ES") ||
      formData.includes("EE") )&&
      formData.length != 5
    ){
      setAlertType("error");
      setAlertTitleText("Error");
      setAlertResultText("Klassnamn får endast innehålla 5 karaktärer!");
      setOpen(true);
      console.log("Invalid classname!");
    } // TODO: anti-cross-site-scripting
  }
  const sparaKlass = (event) => {
    event.preventDefault();
    const elementsArray = [...event.target.elements];
    const formData = elementsArray.reduce((accumulator, currentValue) => {
      if (currentValue.id) {
        accumulator[currentValue.id] = currentValue.value;
      }
      return accumulator;
    }, {});

    let username = firebase.auth().currentUser.displayName;

    let formDataClassName = formData.namn.toUpperCase();

    console.log(formDataClassName);

    AddClassToTeacher(formDataClassName);
  };

  const useStyles = makeStyles((theme) => ({
    root: {
      width: "100%",
      "& > * + *": {
        marginTop: theme.spacing(2),
      },
    },
  }));

  const classes = useStyles();
  return (
    <div className="add">
      <Sidebar />
      <Collapse in={open}>
        <Alert
          severity={alertType}
          variant="filled"
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
          <AlertTitle>{alertTitleText}</AlertTitle>
          {alertResultText}
        </Alert>
      </Collapse>

      <motion.div
        className="add-container"
        initial={{ opacity: "0%" }}
        animate={{ opacity: "100%" }}
      >
        <h1 className="main-text">Lägg till en klass</h1>
        <form onSubmit={sparaKlass} autocomplete="off">
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
      </motion.div>
    </div>
  );
}

export default Add;
