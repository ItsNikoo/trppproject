import styles from "./ModalWIndow.module.css"
import {useEffect} from "react";

interface ModalWindow {
    isOpen: boolean,
    onClose: () => void,
    children: React.ReactNode,
}

export default function ModalWindow({isOpen, onClose, children}: ModalWindow) {

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                onClose();
            }
        }

        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) {
        return null;
    }

    return (
        <div className={styles.ModalOverlay}>
            <div className={styles.ModalContent}>
                <button className={styles.ModalClose} onClick={onClose}>
                    ×
                </button>
                {children}
            </div>
        </div>
    )
}