import { add, update, remove, read } from './Crud'
//TODO Add function to remove and update books aswell
//TODO Check if book already exists

export class Book { 
   
    constructor (title, coverImg, isbn) {
       this.title = title;
       this.coverImg = coverImg;
       this.isbn = isbn;
       this.id = this.title.replace(/\s/g, '').toLowerCase(); //Removes spaces and makes all lowercase
       console.log("Book: ", this.title, this.coverImg);
    }

    
    addBook() {
        add(
            'books',
            this.id,
            {
                title: this.title,
                cover: this.coverImg,
                isbn: this.isbn
            }
        )
    }
    
    
    static async getAllBooks() {
        return read('books').then(function(res) {
            return res;
        })
    }

}