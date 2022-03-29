/* Copyright (C) Nils Blomberg & Isak Anderson - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Nils Blomberg <fred03.blomberg@gmail.com> and Isak Anderson <isak.anderson9@gmail.com>
 */

import {
  add,
  update,
  remove,
  read,
  readWhere,
  updateField,
  nestedAdd,
  nestedRead,
  readOne,
} from "./Crud";
import firebase from "firebase";
import { userObject } from "./App";
import { db } from "./App";
function ClassCountIncr(classid) {
  const sender = db
    .collection("classes")
    .doc(classid)
    .update({ count: +1 });
}
export class User {
  constructor(name, id, email, className, classes) {
    this.name = name.split(" ")[1] + " " + name.split(" ")[0];
    this.id = id;
    this.allIds = [];
    this.email = email;
    this.className = className;
    this.classes = classes;
    this.books = {};
    this.setUserStatus();
    this.userExists();

    this.firstLogin = false;
  }

  getBooks() {
    //Returns books and book numbers as an array of arrays
    return Object.entries(this.books);
  }

  /*
  addBookToUser(book, id) {
    // Adds a book to a user
    this.books[book] = id;
    updateField("users", this.className, this.name, "books", this.books);
  }
  */

  /*
  async addBookToUser(book, id) {
    const data = {
      id: id,
      name: book,
      status: 'green',
      type: 'book'
    }

    await db.collection('users').doc('students').collection(this.className).doc(this.name).collection('items').set(data);

  }
  */

  setUserStatus() {
    let splitEmail = this.email.split("@")[1];
    let username = firebase.auth().currentUser.displayName;

    if (splitEmail.includes("elev")) {
      //student
      this.status = "student";
      //this.status = "teacher";
    } else if (
      splitEmail.includes("ntig.se") ||
      splitEmail.includes("gmail.com") //! TA BORT DETTA
    ) {
      //teacher
      this.status = "teacher-mentor";
      //this.status = "student";
    } else {
      this.status = "unauthorized";
      firebase.auth().signOut();
    }
    console.log(this.status);
  }

  AddTeacher() {
    const collection = db
      .collection("users")
      .doc("teachers")
      .collection(this.name)
      .doc("data");

    /*
    if (this.firstLogin == true) {
      collection.set({
        classes: []
      })
    }
    */

    collection.set({
      classes: [],
    });

    add(
      "users",
      //'usersTest'>,
      "ids",
      {
        ids: this.allIds,

        /*ids: [
          'testID1',
          'testID2',
          this.id
        ]*/
      }
    );
  }

  addFakeUser(classid, name, id, email, status) {
    // Adds user to database
    //TODO Merge function with userExists() ???

    nestedAdd(
      "users",
      //'usersTest',
      "students",
      classid,
      name,
      {
        //'test': 'user.js l43'
        id: id,
        //'matte50004': 'User.js'

        email: email,
        name: name,
        status: status,
        marked: false,
      }
    );
  }

  addUser() {
    // Adds user to database
    //TODO Merge function with userExists() ???

    nestedAdd(
      "users",
      //'usersTest',
      "students",
      this.className,
      this.name,
      {
        //'test': 'user.js l43'
        id: this.id + "&" + this.status + "&" + this.className,
        //'matte50004': 'User.js'

        email: this.email,
        name: this.name,
        status: this.status,
        marker: "yellow",
        createdAt: new Date(),

        /*books: this.books,*/
      },
      {}
    ).then(() => window.location.reload(true), console.log("AADDED USER"));

    add(
      "users",
      //'usersTest',
      "ids",
      {
        ids: this.allIds,

        /*ids: [
              'testID1',
              'testID2',
              this.id
            ]*/
      }
    );
  }

  async userExists() {
    // Checks if user is in database, calls addUser() if not
    //const read = await readWhere('users', 'id', this.id);
    //const read = await nestedRead('users', 'students' , this.className, 'id', this.id);
    const read = await readOne("users", "ids");
    console.log("ID:s : ", read.ids);
    console.log("Current user id: " + this.id);
    let _id = this.id;
    let user_exists = false;
    // loopa igenom read och sök id match
    console.log(read.ids.length);
    for (let i = 0; i < read.ids.length; i++) {
      if (read.ids[i].includes(_id)) {
        console.log("ID FOUND");
        user_exists = true;
      }
    }
    if (!user_exists) {
      console.log("User does not exist yet");
      this.allIds = read.ids;
      this.allIds.push(this.id);
      this.firstLogin = true;

      //console.log(this.allIds);

      if (this.status == "teacher") {
        //this.AddTeacher();
      }

      //this.addUser();
    } else {
      console.log("User does exist");
      this.firstLogin = false;
      //console.log("Firstlogin in class: " + this.firstLogin);
    }
  }
}

export default User;
