import {Link} from "react-router";
import styles from "./PATCHButton.module.css"

export default function PATCHButton({id}: {id: number}) {
    return(
        <Link to={`/admin/update/${id}`} className={styles.Button}>Изменить товар</Link>
    )
}