import styles from './Header.module.css'

export default function Header() {
    return (
        <>
            <div className={styles.Container}>
                <div className={styles.Logo}>
                    <p>logo</p>
                </div>
                <div>
                    <ul className={styles.List}>
                        <li className={styles.ListItem}>Главная</li>
                        <li className={styles.ListItem}>Каталог</li>
                        <li className={styles.ListItem}>О нас</li>
                    </ul>
                </div>
                <div className={styles.Cart}>123</div>
            </div>
        </>
    )
}