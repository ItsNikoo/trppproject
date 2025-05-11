"use client"

import {useState} from "react"
import styles from "./ItemDescriptionContainer.module.css"
import {motion, AnimatePresence} from "framer-motion"

interface Data{
    description: string
}

export default function ItemDescriptionContainer({description}: Data) {
    const [isOpen, setIsOpen] = useState<boolean>(false)

    return (
        <div className={styles.Default}>
            <motion.div
                onClick={() => setIsOpen(!isOpen)}
                className={styles.HigherContainer}
            >
                <h2>Описание</h2>
                <div className={`${styles.Arrow} ${isOpen ? styles.ArrowOpen : ""}`}></div>
            </motion.div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className={styles.ContentContainer}
                        initial={{height: 0, opacity: 0, y: -10}}
                        animate={{
                            height: "auto",
                            opacity: 1,
                            y: 0,
                            transition: {duration: 0.3}
                        }}
                        exit={{
                            height: 0,
                            opacity: 0,
                            y: -10,
                            transition: {duration: 0.3}
                        }}
                        style={{overflow: "hidden"}}
                    >
                        <div className={styles.Description}>
                            <p>{description}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
