import React, { useState } from 'react';
import User from './User';
import App from './App';
import { motion } from "framer-motion"
import Sidebar from './Sidebar'
import firebase from 'firebase';
import { add, update, remove, read, readWhere, updateField, nestedAdd, nestedRead, readOne } from './Crud'



function Klasser() {
    // collection1, document1, collection2, field, data
  /*  read('test').then(function(res) {
        console.log(res);
        let test = "hello";
        return <> 
            <p>{ test } </p>
        </>
      });
      */
    return (
        <div>
            <Sidebar />
            <motion.div className="klasser"
            className="content"
            initial={{opacity: "0%" }}
            animate={{opacity: "100%" }}
    >
                <div className="placeholderClass">
            
                    <h1>Klasser</h1>
                   
                </div>
            </motion.div>
        </div>
    )
}

export default Klasser
