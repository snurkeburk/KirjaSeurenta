import { db, FieldValue } from "./App";
import { React, useEffect, useState } from "react";
import firebase from "firebase";

export var greenCounter;
export var redCounter;
export async function GetClassSize(className) {
  let _green = 0;
  let _red = 0;
  const greenRef = db.collection("users").doc("students").collection(className);
  const snapshots = await greenRef.where("marker", "==", "green").get();
  snapshots.forEach((selDoc) => {
    db.collection("classes").doc(className).set({
      count: firebase.firestore.FieldValue.increment(1),
    }, {merge: true})
    .then(() => {
      return null
    })
    .catch(() => {
      return null
    })
  });
  const redRef = db.collection("users").doc("students").collection(className);
  const snapshot = await redRef.where("marker", "==", "red").get();
  snapshot.forEach((selDocc) => {
    _red++;
  });

  greenCounter = _green;
  redCounter = _red;
}
