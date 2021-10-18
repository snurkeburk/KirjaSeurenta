import { CircularProgress } from "@material-ui/core";
import { React, useEffect, useState } from "react";
import { db } from "./App";
import Sidebar from "./Sidebar";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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
      <div>
        <Sidebar />
        <h1>{id}</h1>
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
                    <p className="student" href="#">
                      {post.name}
                    </p>
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
    );
}

export default Class;
