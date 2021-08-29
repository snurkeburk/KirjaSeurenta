import React from 'react'
import Sidebar from './Sidebar'
import { motion } from "framer-motion"
import './Home.css';
function Home() {
    return (
        <div>
             <Sidebar />
            <motion.div 
            className="home-container"
            initial={{ opacity: "0%" }}
            animate={{ opacity: "100%" }}
            >
                <div className="left-side">
                    <p>Sök på bok</p>
                </div>
                <div className="right-side">

                <h1>Klasser</h1>
                    <div className="klass">
                        <ul>
                            <li>Elev</li>
                            <li>Elev</li>
                            <li>Elev</li>
                            <li>Elev</li>
                            <li>Elev</li>
                            <li>Elev</li>
                            <li>Elev</li>
                            <li>Elev</li>
                            <li>Elev</li>
                            <li>Elev</li>
                            <li>Elev</li>
                            <li>Elev</li>
                        </ul>
                    </div>
                </div>
             
            </motion.div>
        </div>
    )
}

export default Home
