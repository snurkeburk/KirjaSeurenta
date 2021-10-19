/* Copyright (C) Nils Blomberg & Isak Anderson - All Rights Reserved
* Unauthorized copying of this file, via any medium is strictly prohibited
* Proprietary and confidential
* Written by Nils Blomberg <fred03.blomberg@gmail.com> and Isak Anderson <isak.anderson9@gmail.com>
*/

import { db } from './App'

// Adds a new entry to the database

export async function add(collection, document, paramObj) {
  const addToCollection = db.collection(collection).doc(document);
  await addToCollection.set(paramObj);
}


export async function nestedAdd(collection1, document1, collection2, document2, paramObj) {
  const addToCollection = db.collection(collection1).doc(document1).collection(collection2).doc(document2);
  await addToCollection.set(paramObj);
}

// Updates existing database entry
export async function update(collection, document, paramObj) {
  const updateCollection = db.collection(collection).doc(document);
  await updateCollection.update(paramObj);
}

// Updates a specific field in a database entry (nested objects)
export async function updateField(collection, document, field, paramObj) {
  const updateCollection = db.collection(collection).doc(document);

  await updateCollection.update({
    [field]: paramObj
  })
}

// Removes entry from database
export async function remove(collection, document) {
  const removeCollection = db.collection(collection).doc(document);
  await removeCollection.delete();
}

// Reads content of one specific document
export async function readOne(collection, document) {
  const readCollection = db.collection(collection).doc(document);
  const doc = await readCollection.get();

  if (!doc.exists) {
    console.log("Error");
  } else {
    //console.log('Document data: ', doc.data());
    return doc.data();
  }
}

// Reads all documents from specified collection, returns array of all documents
export async function read(collection) {
  const readCollection = db.collection(collection);
  const snapshot = await readCollection.get();
  let arr = [];
  snapshot.forEach(doc => {
    arr.push(
      {
        'id': doc.id, 
        'data': doc.data()
      });
  })
  
  return arr;

}

// Reads all documents where a field is set to a specific valued (data)
export async function readWhere(collection, field, data) {
  const readCollection = db.collection(collection);
  const snapshot = await readCollection.where(field, '==', data).get(); //TODO Make '==' general
  
  let arr = [];
  snapshot.forEach(doc => {
    const data = doc.data();
    arr.push(data);
  })
  return arr;
}

export async function nestedRead(collection1, document1, collection2, field, data) {
  const readCollection = db.collection(collection1).doc(document1).collection(collection2);
  const snapshot = await readCollection.where(field, '==', data).get(); //TODO Make '==' general

  let arr = [];
  snapshot.forEach(doc => {
    const data = doc.data();
    arr.push(data);
  })
  return arr;

}


//* EXAMPLES

//* Example for adding to the database
/*
add(
  'books', 
  'ergofysik2',
  {
    title: 'Ergo Fysik 2',
    cover: 'fyrisk'
  }
)
*/

//* Example for updating a database entry
/*
update(
  'books',
  'matte50004',
  {
    cover: 'actuallinktocoverimage'
  }
)
*/
//* Example for removing a document from the database
/*
remove('books', 'matte50004');
*/
//* Example for reading a document from the database
/*
readOne('books', 'matte50004');
*/

//* Example for reading all documents in a collection 
/*
read('books').then(function(res) {
  console.log(res);
});
*/

