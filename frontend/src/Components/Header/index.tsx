import styles from './Header.module.css';
import {Link} from "react-router";
import logo from "../../assets/logo.jpg";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import {CartItem} from "../../types.ts";
import Cart from "../Cart";

export default function Header() {

    // Запрос для получения корзины
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

    if (isLoading) {
        return <div>Загрузка...</div>;
    }

    if (error) {
        return <div>Ошибка при загрузке корзины</div>;
    }

    return (
        <div className={styles.Container}>
            <Link to="/">
                <img className={styles.Logo} src={logo} alt="Логотип"/>
            </Link>

            <nav>
                <ul className={styles.List}>
                    <li className={styles.ListItem}>
                        <Link className={styles.Link} to="/">Главная</Link>
                    </li>
                    <li className={styles.ListItem}>
                        <Link className={styles.Link} to="/catalog">Каталог</Link>
                    </li>
                    <li className={styles.ListItem}>
                        <Link className={styles.Link} to="/about">О нас</Link>
                    </li>
                </ul>
            </nav>
            {cartItems && <Cart data={cartItems}/>}
        </div>
    );
}