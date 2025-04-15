import ItemCard from "../ItemCard";
import styles from "./CardsContainer.module.css"

export default function CardsContainer() {
    return (
        <div className={styles.MainContainer}>
            <div className={styles.CardsContainer}>
                <ItemCard/>
                <ItemCard/>
                <ItemCard/>
                <ItemCard/>
                <ItemCard/>
                <ItemCard/>
                <ItemCard/>
                <ItemCard/>
            </div>
        </div>
    )
}