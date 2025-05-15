import styles from "./RedirectToAdminPanelButton.module.css"
import {Link} from "react-router";

export default function RedirectToAdminPanelButton() {
    return (
        <div className={styles.LinkDiv}>
            <Link className={styles.ButtonLink} to={'/admin'}>На главную</Link>
        </div>
    )
}