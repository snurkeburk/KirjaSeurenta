
/* Copyright (C) Nils Blomberg & Isak Anderson - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Nils Blomberg <fred03.blomberg@gmail.com> and Isak Anderson <isak.anderson9@gmail.com>
 */

import { CircularProgress } from "@material-ui/core";
import { React, useEffect, useState } from "react";
import firebase from "firebase";
import { db, userObject } from "./App";
import Sidebar from "./Sidebar";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import Footer from "./Footer";
import "./Class.css";
import Popup from './Popup';

import "./GetClassSize.css";

function GetClassSize() {

  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  }

  function togglePop(user, book, status, cid){
    console.log(user + book + status + cid)
    if (open){
      setOpen(false);
    }
    else {
      setOpen(true);
    }
  }

  const [loading, setLoading] = useState(true);
  const { id } = useParams(); 

  const [user, setUser] = useState([]);
  const [uid, setUid] = useState([]);
  const [status, setStatus] = useState([]);
  const [mail, setMail] = useState([]);
  const [classid, setClassid] = useState([]);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    var _id = id.split("&")[0];
    var _name = id.split("&")[1];
    var _status = id.split("&")[2];
    var _classid = id.split("&")[3];
    
    var sf_name = _name.split(" ")[0];
    var ss_name = _name.split(" ")[1];

    sf_name = sf_name.toLowerCase();
    ss_name = ss_name.toLowerCase();

    var _mail = sf_name + "." + ss_name + "@elev.ga.ntig.se";
    
    setClassid(_classid);
    setMail(_mail);
    setUid(_id);
    setUser(_name);

    if (_status == "green"){
      setStatus("Utdelad")
    }
    else if (_status == "red"){
      setStatus("Saknas")
    }
    else if (_status == "yellow"){
      setStatus("Ej tilldelad")
    }
    else {
      setStatus("Error")
    }

    console.log(_id + " " + _name + " "+ _status);
    setLoading(false);
    getBook(_name, _classid)
  }, [loading])
  
  async function getBook(name, klass){
    const getBooksFromFirebase = [];
    const sender = db
    .collection("users")
    .doc("students")
    .collection(klass)
    .doc(name)
    .collection("books")
    .onSnapshot((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        getBooksFromFirebase.push({
          ...doc.data(), //spread operator
          key: doc.id, // id från firebase
        });
      });
      console.log(getBooksFromFirebase)
      setBooks(getBooksFromFirebase);
      setLoading(false);
    });
    // return cleanup function
    return () => sender();
  }

  function state(user, book, status, klass) {
    console.log(user + " | " + book + " | " + status + " | " + klass)
    let _status;
    if (status == "green"){
      _status = "red";
    }
    else if (status == "red"){
      _status = "green";
    }

    console.log("new status: "  + _status)

    return <><p>hello</p></>
   /* const sender = db.collection("users")
    .doc("students")
    .collection(klass)
    .doc(user)
    .collection("books")
    .doc(book)
    .update({
      status: _status,
    })
    return () => sender();*/
  }


    
  if (loading){
    return (
      <h1>Loading...</h1>
    )
  }


  return (
    <div>
      <Sidebar />
     
      <table>
        <tbody>
          <h1 className="tbody_header">Information om {user}</h1>
          <tr>
            <th>{uid}</th>
            <th>{user}</th>
            <th>{classid}</th>
            <th>{status}</th>
            <th>{mail}</th>
          </tr>
          <h1 className="tbody_header">Böcker</h1>
          <tr className="tr_books">
            {books.length > 0 ? (
              books.map((book) => (
                  <div key={book.key} className="info_book_container">
                    <h1>{book.subj}</h1>
                    <h4>{book.name}</h4>
                    <p>{book.nr}</p>
                    {book.status == "red" ? (
                      <p className="book_saknas">Saknas</p>
                    ):(
                      <p className="book_utdelad">Utdelad</p>
                    )}

                    
                    {open ? (
                      <div>
                        <h1>Ändra status</h1>
                        <p>Godkänn följande ändringar:</p>
                        <p>Bok: {book.name}</p>
                        { status == "green" ? (
                            <p>Nytt status: saknas</p>
                          ): (
                            <p>Nytt status: utdelad</p>
                          )}
                        <p>Elev: {user}</p>
                        <div className="acc-decc">
                          <Button variant="contained">ändra</Button>
                          <Button variant="contained" onClick={() => setOpen(false)}>Avbryt</Button>
                        </div>
                        </div>
                    ): (
                      <div>
                          <Button onClick={() => togglePop(user, book.subj, book.status, classid)}>toggle</Button>
                      </div>
                    )}
                    
                     <input
                        type="button"
                        value="Click to Open Popup"
                        onClick={togglePopup}
                      />
                      {isOpen && <Popup
                      content={<>
                        <h1>Ändra status</h1>
                        <p>Godkänn följande ändringar för {user}</p>
                        <div>
                          { status == "green" ? (
                            <p>Nytt status: saknas</p>
                          ): (
                            <p>Nytt status: utdelad</p>
                          )}
                          <p>Elev: {user}</p>
                        </div>
                        <Button
                        variant="contained"
                        onClick={() => state(user, book.subj, book.status, classid)}
                        >Ändra</Button>
                      </>}
                      handleClose={togglePopup}
                    />}
                  </div>
              ))
            ):(
              <h1>Inga böcker hittades!</h1>
            )}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
const spring = {
  type: "spring",
  stiffness: 700,
  damping: 30
};
export default GetClassSize;
