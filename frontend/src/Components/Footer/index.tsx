import {Link} from "react-router";
import styles from "./Footer.module.css";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                {/* Основные ссылки */}
                <div className={styles.grid}>
                    <div>
                        <h3 className={styles.sectionTitle}>Информация</h3>
                        <ul className={styles.linkList}>
                            <li>
                                <Link to="/privacy" className={styles.link}>
                                    ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ
                                </Link>
                            </li>
                            <li>
                                <Link to="/terms" className={styles.link}>
                                    ДОГОВОР ОФЕРТЫ
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className={styles.sectionTitle}>Покупателям</h3>
                        <ul className={styles.linkList}>
                            <li>
                                <Link to="/delivery" className={styles.link}>
                                    ДОСТАВКА
                                </Link>
                            </li>
                            <li>
                                <Link to="/returns" className={styles.link}>
                                    ВОЗВРАТ
                                </Link>
                            </li>
                            <li>
                                <Link to="/support" className={styles.link}>
                                    ПОДДЕРЖКА
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className={styles.sectionTitle}>Компания</h3>
                        <ul className={styles.linkList}>
                            <li>
                                <Link to="/requisites" className={styles.link}>
                                    РЕКВИЗИТЫ
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Социальные сети */}
                <div className={styles.socialSection}>
                    <div className={styles.copyright}>
                        <p>© {new Date().getFullYear()} Hommeplusless. Все права защищены.</p>
                    </div>

                    <div className={styles.socialLinks}>
                        <Link
                            to="https://facebook.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.socialLink}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                 fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                 strokeLinejoin="round">
                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                            </svg>
                            <span className={styles.srOnly}>Facebook</span>
                        </Link>
                        <Link
                            to="https://instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.socialLink}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                 fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                 strokeLinejoin="round">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                            </svg>
                            <span className={styles.srOnly}>Instagram</span>
                        </Link>
                        <Link
                            to="https://twitter.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.socialLink}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                 fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                 strokeLinejoin="round">
                                <path
                                    d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                            </svg>
                            <span className={styles.srOnly}>Twitter</span>
                        </Link>
                        <Link
                            to="https://youtube.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.socialLink}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                 fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                 strokeLinejoin="round">
                                <path
                                    d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                            </svg>
                            <span className={styles.srOnly}>YouTube</span>
                        </Link>
                        <Link
                            to="https://t.me/your_channel"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.socialLink}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                 fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                 strokeLinejoin="round">
                                <path d="M21 2l-2 13s-1 1-2 1-2-1-2-1L8 8s-1-1 0-2 2 0 2 0l11 11"></path>
                            </svg>
                            <span className={styles.srOnly}>Telegram</span>
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}