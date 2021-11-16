/* Copyright (C) Nils Blomberg & Isak Anderson - All Rights Reserved
* Unauthorized copying of this file, via any medium is strictly prohibited
* Proprietary and confidential
* Written by Nils Blomberg <fred03.blomberg@gmail.com> and Isak Anderson <isak.anderson9@gmail.com>
*/

import React from 'react'
import Sidebar from './Sidebar'
import { motion } from "framer-motion"
import { useParams } from 'react-router'
import './Search.css'
import { userObject } from './App'

function Search() {

        return (
            <div>
            <Sidebar />
            <motion.div 
            className="content"
            initial={{opacity: "0%" }}
            animate={{opacity: "100%" }}
            
            >
                <h1>Sök</h1>
                <h2>{userObject.status}</h2>
            </motion.div>
        </div>
    )

}

export default Search
