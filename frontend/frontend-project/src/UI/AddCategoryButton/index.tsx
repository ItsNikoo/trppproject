import {Link} from "react-router";
import styles from "./AddCategoryButton.module.css"

export default function AddCategoryButton() {
    return (
        <div className={styles.Container}>
            <Link className={styles.Button} to={'/admin/add_category'}>Добавить Категорию</Link>
        </div>
    )
}