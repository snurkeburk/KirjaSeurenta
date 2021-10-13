/* Copyright (C) Nils Blomberg & Isak Anderson - All Rights Reserved
* Unauthorized copying of this file, via any medium is strictly prohibited
* Proprietary and cofidential
* Written by Nils Blomberg <fred03.blomberg@gmail.com> and Isak Anderson <isak.anderson@gmail.com
*/

import React from 'react'
import Sidebar from './Sidebar'
import { motion } from "framer-motion"
import './Search.css'
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
            </motion.div>
        </div>
    )
}

export default Search
