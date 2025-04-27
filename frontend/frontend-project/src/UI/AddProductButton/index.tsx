import {Link} from "react-router";
import styles from "./AddProductButton.module.css"

export default function AddProductButton() {
    return (
        <div className={styles.Container}>
            <Link className={styles.Button} to={'/admin/add'}>Добавить товар</Link>
        </div>
    )
}