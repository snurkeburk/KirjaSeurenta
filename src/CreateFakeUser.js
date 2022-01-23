/* Copyright (C) Nils Blomberg & Isak Anderson - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Nils Blomberg <fred03.blomberg@gmail.com> and Isak Anderson <isak.anderson9@gmail.com>
 */

import { CircularProgress } from "@material-ui/core";
import { React, useEffect, useState } from "react";
import { FaUserPlus } from "react-icons/fa";
import firebase from "firebase";
import { db, userObject } from "./App";
import Sidebar from "./Sidebar";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@material-ui/core";
import Footer from "./Footer";
import "./CreateFakeUser.css";
import { AiFillDelete, AiOutlineConsoleSql } from "react-icons/ai";
function CreateFakeUser() {
  const [name, setName] = useState([]);
  const [id, setId] = useState([]);
  const [email, setEmail] = useState([]);
  const [status, setStatus] = useState([]);
  const [ffCount, setFfCount] = useState([])
  const arr_names = [
    "Svensson Gustav",
    "Wirgén Ivar",
    "Karlsson Viktor",
    "Roslund Erik",
    "Bergman Wiggo",
    "Axelsson Tuva",
    "Runevall David",
    "Broman Samuel",
    "Forsling Sixten",
    "Lindgren Ida",
    "Samuelberg Malte",
    "Öhrn Olof",
  ];

  function makeid(length) {
    // för HASH / id
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  function createFake() {
    console.log("--------F_U GEN----------");

    var r = Math.floor(Math.random() * (arr_names.length - 0 + 0)) + 0;
    setName(arr_names[r]);
    if (name == undefined) {
      console.log("undefined");
      setName("If you see this, try again!");
      console.log(name);
    } else {
      /*
        let firstName = name.split(" ")[0];
        let l_f = firstName.toLowerCase();

        let lastName = name.split(" ")[1];
        let l_l = lastName.toLowerCase();
        let tmail = l_f + "."+l_l+"@elev.ga.ntig.se";
        console.log(tmail)
        */

      var fname = name + "";
      var splitfname = fname.split(" ")[0];
      var lname = name + "";

      var splitlname = lname.split(" ")[1];

      setId(makeid(28));
      let tmail = splitfname + "." + splitlname + "@elev.ga.fakentig.se";
      let sstatus = "student";
      let classid = window.location.href;
      let lclassid = classid + "";
      let splitlclassid = lclassid.split("/");
      let fclassid = splitlclassid[4];

      console.log("-----END OF F_U GEN------");
      console.log(tmail + " " + tmail === "string");
      console.log(fclassid);
      console.log(name);
      console.log(id);
      console.log(tmail);
      console.log(sstatus);
      db.collection("classes").doc(fclassid).set({
        count: firebase.firestore.FieldValue.increment(1),
      }, {merge: true})
      .then(() => {
        return null
      })
      .catch(() => {
        return null
      })
      userObject.addFakeUser(fclassid, name, "JHADSUhuh7Z8hfdsfh", tmail, sstatus);
    }
  }

  return (
    <div>
      <div className="c-fake-container">
        <Button
          size="small"
          variant="contained"
          style={{
            backgroundColor: "lightgreen",
            width: "20px",
            borderRadius: "2rem",
            fontSize: "1.4rem",
            color: "black",
          }}
          onClick={() => createFake()}
        >
          <FaUserPlus />
        </Button>
        <p>Lägg till tillfällig användare</p>
      </div>
    </div>
  );
}

export default CreateFakeUser;
