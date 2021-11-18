/* Copyright (C) Nils Blomberg & Isak Anderson - All Rights Reserved
* Unauthorized copying of this file, via any medium is strictly prohibited
* Proprietary and confidential
* Written by Nils Blomberg <fred03.blomberg@gmail.com> and Isak Anderson <isak.anderson9@gmail.com>
*/

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