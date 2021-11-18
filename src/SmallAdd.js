/* Copyright (C) Nils Blomberg & Isak Anderson - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and cofidential
 * Written by Nils Blomberg <fred03.blomberg@gmail.com> and Isak Anderson <isak.anderson@gmail.com
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

async function AddClassToTeacher(formData) {
  let username = firebase.auth().currentUser.displayName;
  const collection = db
    .collection("users")
    .doc("teachers")
    .collection(username)
    .doc("data");

  if (formData.includes("TE")) {
    //lägger till en teknikklass, samma för de under.

    const addClass = await collection.update({
      classes: FieldValue.arrayUnion(formData),
    });
  } else if (formData.includes("ES")) {
    const addClass = await collection.update({
      classes: FieldValue.arrayUnion(formData),
    });
  } else if (formData.includes("EE")) {
    const addClass = await collection.update({
      classes: FieldValue.arrayUnion(formData),
    });

    console.log("formdata: " + formData);
  } else {
    console.log("Invalid classname!");
  }
}

function SmallAdd() {
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

    setTimeout(() => {
      setOpen(true);
    }, 500);
    setOpen(false);
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
  const [open, setOpen] = React.useState(false);
  return (
    <div className="smalladd">
      <Collapse in={open}>
        <Alert
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
          Klassen har lagts till!
        </Alert>
      </Collapse>

      <motion.div
        className="smalladd-container"
        initial={{ opacity: "0%" }}
        animate={{ opacity: "100%" }}
      >
        <form className="smallForm" onSubmit={sparaKlass} autocomplete="off">
          <motion.input
            className="smallinput"
            type="text"
            id="namn"
            required
            placeholder="Skriv här..."
            whileFocus={{ scale: 1.2 }}
          ></motion.input>

          <motion.button whileHover={{ scale: 1.1 }}> + </motion.button>
        </form>
        <h1 className="smallmain-text">Lägg till en klass</h1>
      </motion.div>
    </div>
  );
}

export default SmallAdd;
