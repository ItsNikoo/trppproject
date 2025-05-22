import styles from './Header.module.css';
import {Link} from "react-router";
import logo from "../../assets/logo.jpg";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import {CartItem} from "../../types.ts";
import Cart from "../Cart";
import {useState} from "react";

export default function Header() {
    const [isMenuOpen, setMenuOpen] = useState(false);

    const {data: cartItems, error, isLoading} = useQuery<CartItem[]>({
        queryKey: ['cart'],
        queryFn: fetchCart,
    });

    async function fetchCart(): Promise<CartItem[]> {
        try {
            const {data} = await axios.get<CartItem[]>("http://127.0.0.1:8000/api/cart/");
            return data;
        } catch (error) {
            console.error('Ошибка при загрузке корзины:', error);
            throw error;
        }
    }

    function toggleMenu() {
        setMenuOpen(!isMenuOpen);
    }

    if (isLoading) {
        return <div>Загрузка...</div>;
    }

    if (error) {
        return <div>Ошибка при загрузке корзины</div>;
    }

    return (
        <div className={styles.Container}>
            <button onClick={toggleMenu} className={styles.MenuButton}>
                ☰
            </button>
            <Link to="/" >
                <img className={styles.Logo} src={logo} alt="Логотип"/>
            </Link>

            <nav className={`${styles.Nav} ${isMenuOpen && styles.NavOpen}`}>
                <ul className={styles.List}>
                    <li>
                        <Link className={styles.Link} to="/" onClick={toggleMenu}>Главная</Link>
                    </li>
                    <li>
                        <Link className={styles.Link} to="/catalog" onClick={toggleMenu}>Каталог</Link>
                    </li>
                    <li>
                        <Link className={styles.Link} to="/about" onClick={toggleMenu}>О нас</Link>
                    </li>
                </ul>
            </nav>
            {cartItems && <Cart data={cartItems}/>}
        </div>
    );
}