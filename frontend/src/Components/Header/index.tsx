import styles from './Header.module.css'
import {Link} from "react-router";
import logo from "../../assets/logo.jpg"
import cart from "../../../public/shopping-cart-outline-svgrepo-com.svg"
import ModalWindow from "../../UI/ModalWindow";
import {useState} from "react";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import {CartItem} from "../../types.ts";

export default function Header() {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const {data, error, isLoading} = useQuery<CartItem>({
        queryKey:['cart'],
        queryFn:fetchCart,
    })

    async function fetchCart() {
        const {data} = await axios.get("http://127.0.0.1:8000/api/cart/");
        return data;
    }

    if (isLoading) {
        return <div>Загрузка!...</div>
    }

    if (error) {
        return <div>Непредвиденная ошибка</div>
    }

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
                <div className={styles.Cart} onClick={() => setIsOpen(true)}>
                    <img className={styles.Image} src={cart} alt=""/>
                </div>
                <ModalWindow onClose={() => setIsOpen(false)} isOpen={isOpen}>
                    <div>
                        <h1>Корзина</h1>
                        <pre>{JSON.stringify(data)}</pre>
                    </div>
                </ModalWindow>
            </div>
        </>
    )
}