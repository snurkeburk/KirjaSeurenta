import React, {useState } from 'react';
import {db, user} from './App';
import Sidebar from './Sidebar';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import './Add.css';
import { motion } from "framer-motion"
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import firebase from 'firebase';
function Add() {

    const sparaKlass = (event) => {
        event.preventDefault();
        const elementsArray = [...event.target.elements];   
        const formData = elementsArray.reduce((accumulator, currentValue)=> {
            if (currentValue.id){
                accumulator[currentValue.id] = currentValue.value;
            }
            return accumulator;
        },{});
        let username = firebase.auth().currentUser.displayName
        console.log(formData.namn);   
        if(formData.namn.includes("TE")){
            db.collection("users").doc("teachers").collection(username).doc("classes").collection("teknik").add(formData);
        } else if (formData.namn.includes("ES")){
            db.collection("users").doc("teachers").collection(username).doc("classes").collection("estet").add(formData);
            console.log(formData)
        } else if (formData.namn.includes("EE")){
            db.collection("users").doc("teachers").collection(username).doc("classes").collection("el").add(formData);
        } else {
            console.log("Invalid classname!");
        }
        setTimeout(() => {
            setOpen(true);
          }, 500);
        setOpen(false);
    };

    const useStyles = makeStyles((theme) => ({
        root: {
          width: '100%',
          '& > * + *': {
            marginTop: theme.spacing(2),
          },
        },
      }));

    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    return (
        <div className="add">
            <Sidebar />
            <Collapse in={open}>
                <Alert
                action={
                    <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                        setOpen(false);
                    }}
                    >
                    <CloseIcon fontSize="inherit" />
                    </IconButton>
                }
                >
                Klassen har lagts till!
                </Alert>
            </Collapse>
 
            <motion.div 
            className="add-container"
            initial={{ opacity: "0%" }}
            animate={{ opacity: "100%" }}
            >
                <h1 className="main-text">Lägg till en klass</h1>
                <form onSubmit={sparaKlass} autocomplete="off">
                    <motion.input className="input" type="text" id="namn" required placeholder="Skriv här..."
                      whileFocus={{ scale: 1.2 }}
                      
                    ></motion.input>
                    
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      
                      > + </motion.button>        
                </form>
            </motion.div>
        </div>
    )
}

export default Add
