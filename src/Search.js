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
