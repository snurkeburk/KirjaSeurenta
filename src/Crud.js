import { db } from './App'

//* Adds a new entry to the database
export async function add(collection, document, paramObj) {
  const addToCollection = db.collection(collection).doc(document);
  await addToCollection.set(paramObj);
}

export async function update(collection, document, paramObj) {
  const updateCollection = db.collection(collection).doc(document);
  await updateCollection.update(paramObj);
}

export async function remove(collection, document) {
  const removeCollection = db.collection(collection).doc(document);
  await removeCollection.delete();
}

export async function readOne(collection, document) {
  const readCollection = db.collection(collection);
  const doc = await readCollection.get();
  if (!doc.exists) {
    console.log("Error");
  } else {
    //console.log('Document data: ', doc.data());
    return doc.data();
  }
}

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





//* EXAMPLES  (to be inserted in app.js)

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

