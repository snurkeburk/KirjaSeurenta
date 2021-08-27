import { db } from './App'

//* Adds a new book to the database
/*
async function addNewBook(title, cover) {
  console.log("Hej");
  const booksCollection = db.collection('books').doc(title);
  await booksCollection.set({
    title: title,
    cover: cover
  });
}
    
addNewBook('Matte 5000 4', 'LinkToBookCover');
*/

//* Gets books from database
/*
export async function getBooks() { 
    db.collection('books')
    .get() 
    .then(querySnapshot => {
        const data = querySnapshot.docs.map(doc => doc.data())
        console.log("books", data);
        //console.log(querySnapshot);
        //return querySnapshot; 
        //console.log(data)
    })
}
*/
