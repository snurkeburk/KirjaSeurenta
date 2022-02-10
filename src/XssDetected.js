/* Copyright (C) Nils Blomberg & Isak Anderson - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Nils Blomberg <fred03.blomberg@gmail.com> and Isak Anderson <isak.anderson9@gmail.com>
 */

import React, { useState, useEffect } from "react";
import { db, FieldValue, userObject } from "./App";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import axios from "axios";

import "./PageNotFound.css";
function XssDetected() {
  const date = new Date().toString();
  console.log(date);
  let date1 = date.split(" ")[0];
  let date2 = date.split(" ")[1];
  let date3 = date.split(" ")[2];
  let date4 = date.split(" ")[3];
  let date5 = date.split(" ")[4];
  let _date1 = date5.split(":")[0];
  let _date2 = date5.split(":")[1];
  let _date = _date1 + ":" + _date2;
  let fin_date = date1 + " " + date2 + " " + date3 + " " + date4 + " " + _date;
  console.log(fin_date);
  const [newCount, setNewCount] = useState([]);
  // TODO: gör en counter i cookie, om den är över 3 så skickas en rapport till firebase in
  //* Att skicka in: url params, namn, klass / status, tid, IP

  //* =============== få information =============== */
  let { id } = useParams(); // id = klassnamnet
  let name = userObject.name;
  let uid = userObject.id;
  let datum = new Date().toString();
  //* ======= få IP adress ======= */
  const [ip, setIP] = useState("");

  //creating function to load ip address from the API
  const getData = async () => {
    const res = await axios.get("https://geolocation-db.com/json/");
    setIP(res.data.IPv4);
  };

  useEffect(() => {
    //passing getData method to the lifecycle method
    getData();
  }, []);
  //* ============================================== */

  useEffect(() => {
    const getPostsFromFirebase = [];
    const sender = db
      .collection("reports")
      .doc("xss")
      .collection(userObject.status)
      .doc(userObject.id)
      .set(
        {
          params: FieldValue.arrayUnion(id),
          tries: FieldValue.arrayUnion(fin_date),
          ips: FieldValue.arrayUnion(ip),
          name: userObject.name,
          id: userObject.id + "&" + userObject.status,
        },
        { merge: true }
      );
  });
  /*
  useEffect(() => {
    const getPostsFromFirebase = [];
    console.log(userObject.status);
    const sender = db
      .collection("reports")
      .doc("xss")
      .collection(userObject.status)
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          getPostsFromFirebase.push({
            ...doc.data(), //spread operator
            key: doc.id, // id från firebase
          });
          console.log(doc.data());
          if (doc.data().name == name) {
            console.log("exists");
            db.collection("reports")
              .doc("xss")
              .collection(userObject.status)
              .doc(doc.id)
              .update({
                params: FieldValue.arrayUnion(id),
                tries: FieldValue.arrayUnion(fin_date),
                ips: FieldValue.arrayUnion(ip),
              });
          } else {
            console.log("report doesnt exists");
            db.collection("reports")
              .doc("xss")
              .collection(userObject.status)
              .doc(doc.id)
              .set({
                params: FieldValue.arrayUnion(id),
                tries: FieldValue.arrayUnion(fin_date),
                ips: FieldValue.arrayUnion(ip),
                name: userObject.name,
                id: userObject.id + "&" + userObject.status,
              });
          }
        });
        console.log(getPostsFromFirebase);
      });
  });*/

  return (
    <div className="a404-body">
      <h1>
        <important>XSS</important> Varning
      </h1>
      <p>{ip}</p>
      <p>{name}</p>
      <p>{datum}</p>
      <p>"{id}"</p>
      <h2>Vi har upptäckt misstänksam aktivitet</h2>
      <p>
        Detta meddelande visas för att skydda våra användare från attacker mot
        hemsidan då vårat system har upptäckt misstänksam aktivitet.
      </p>
      <h2>Vad händer nu?</h2>
      <p>
        Om du har kommit hit på grund av ett misstag så gör det inget. Vi håller
        koll på hur många gånger du har besökt denna hemsida och orsaken bakom
        det.
      </p>
      <p>
        Vid upprepande besök hit kommer en automatisk rapport att skickas in för
        granskning.
      </p>
      <Link className="a404-link" to="/">
        Återvänd till startsidan
      </Link>
    </div>
  );
}

export default XssDetected;
