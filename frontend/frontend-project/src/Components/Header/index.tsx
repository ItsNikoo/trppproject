import styles from './Header.module.css'
import {Link} from "react-router";
import logo from "../../assets/logo.jpg"

export default function Header() {
    return (
        <>
            <div className={styles.Container}>
                <Link to={'/'}>
                    <img className={styles.Logo} src={logo} alt=""/>
                </Link>
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