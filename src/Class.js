/* Copyright (C) Nils Blomberg & Isak Anderson - All Rights Reserved
* Unauthorized copying of this file, via any medium is strictly prohibited
* Proprietary and confidential
* Written by Nils Blomberg <fred03.blomberg@gmail.com> and Isak Anderson <isak.anderson9@gmail.com>
*/

import { CircularProgress } from "@material-ui/core";
import { React, useEffect, useState } from "react";
import { db } from "./App";
import Sidebar from "./Sidebar";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./Class.css";

function Class() {
  const { id } = useParams();
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [students, setStudents] = useState([]);
  // för elever i klassen:
  useEffect(() => {
    const getStudentsFromFirebase = [];
    const sender = db
      .collection("users")
      .doc("students")
      .collection(id) // här ska det vara klasserna som läraren har
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          getStudentsFromFirebase.push({
            ...doc.data(), //spread operator
            key: doc.id, // id från firebase
          });
        });
        setStudents(getStudentsFromFirebase);
        setLoadingStudents(false);
      });

    // return cleanup function
    return () => sender();
  }, [loadingStudents]);

  if (loadingStudents) {
    <Sidebar />;
    return <CircularProgress />;
  } else
    return (
      <motion.div initial={{ opacity: "0%" }} animate={{ opacity: "100%" }}>
        <Sidebar />
        <div className="totalContainer">
          <h1 className="class-title">{id}</h1>
          <div className="innerTotalContainer">
            <div className="class-utdeladeContainer">
              <p className="class-utdelade">30</p>
              <p className="class-utdelade-desc">utdelade</p>
            </div>
            <div className="class-saknasContainer">
              <p className="class-saknas">1</p>
              <p className="class-saknas-desc">saknas</p>
            </div>
          </div>
        </div>
        <div className="class-big-container">
          <div className="class-left-side"></div>

          <div className="class-right-side">
            <ul>
              <li>
                <motion.div className="students-container" layout>
                  {students.length > 0 ? (
                    students.map((post) => (
                      <motion.div
                        className="students"
                        key={post.key}
                        whileHover={{}}
                      >
                        <p className="student-number">nr: 215</p>
                        <p className="student" href="#">
                          {post.name}
                        </p>
                        <p className="student-status"></p>
                      </motion.div>
                    ))
                  ) : (
                    <div className="not-found">
                      <h4>Inga elever tillagda</h4>
                    </div>
                  )}
                </motion.div>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>
    );
}

export default Class;
