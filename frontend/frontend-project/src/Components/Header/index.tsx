import styles from './Header.module.css'
import {Link} from "react-router";

export default function Header() {
    return (
        <>
            <div className={styles.Container}>
                <div className={styles.Logo}>
                    <p>logo</p>
                </div>
                <div>
                    <ul className={styles.List}>
                        <li className={styles.ListItem}>
                            <Link className={styles.Link} to={"/"}>
                                Главная
                            </Link>
                        </li>
                        <li className={styles.ListItem}>
                            <Link className={styles.Link} to={"/catalog"}>
                                Каталог
                            </Link>
                        </li>
                        <li className={styles.ListItem}>
                            <Link className={styles.Link} to={"/about"}>
                                О нас
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className={styles.Cart}>123</div>
            </div>
        </>
    )
}