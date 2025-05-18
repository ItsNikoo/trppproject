import { useParams } from "react-router";
import { useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import styles from "./ItemPage.module.css";
import Slider from "../../../UI/Slider";
import Select from 'react-select';
import { motion } from "framer-motion";
import ItemDescriptionContainer from "../../../UI/ItemDescriptionContainer";
import { Item } from "../../../types.ts";
import ModalWindow from "../../../UI/ModalWindow";

export default function ItemPage() {
    const { itemSlug } = useParams();
    const [size, setSize] = useState<string | null>(null);
    const [errorSize, setErrorSize] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [quantity, setQuantity] = useState<number>(1);
    const [cartMessage, setCartMessage] = useState<string | null>(null);

    async function fetchItem() {
        const { data } = await axios.get(`http://127.0.0.1:8000/api/items/slug/${itemSlug}/`);
        return data;
    }

    async function postItem() {
        if (!data || !data.id || !size) {
            setCartMessage("Ошибка: данные о товаре или размере отсутствуют");
            return;
        }

        try {
            const response = await axios.post(`http://127.0.0.1:8000/api/cart/`, {
                item: data.id,
                size: size,
                quantity: quantity,
            });
            console.log(response.data);
            setCartMessage("Товар успешно добавлен в корзину!");
            setTimeout(() => {
                setIsOpen(false);
                setCartMessage(null);
                setQuantity(1);
                setSize(null);
            }, 1500); // Закрыть модал через 1.5 секунды
        } catch (error) {
            setCartMessage("Ошибка при добавлении в корзину");
            console.error("Ошибка POST-запроса:", error);
        }
    }

    const { data, isLoading, isError } = useQuery<Item>({
        queryKey: ['item', itemSlug],
        queryFn: fetchItem,
    });

    function checkSize() {
        setErrorSize(true);
        if (size !== null) {
            setIsOpen(true);
            setErrorSize(false);
        }
    }

    const options = [
        { value: 'S', label: 'S' },
        { value: 'M', label: 'M' },
        { value: 'L', label: 'L' },
        { value: 'XL', label: 'XL' },
    ];

    return (
        <motion.div
            initial={{ y: -25, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className={styles.Container}
        >
            {isLoading && <div>Загрузка...</div>}
            {isError && <div>Ошибка загрузки данных</div>}
            {data && data.title !== undefined && data.price !== undefined && data.description !== undefined && (
                <div className={styles.MainContainer}>
                    <div className={styles.PhotoContainer}>
                        {data.photos && data.photos.length > 0 && <Slider photos={data.photos} />}
                    </div>
                    <div className={styles.InfoContainer}>
                        <h1 className={styles.Title}>{data.title}</h1>
                        <p className={styles.Price}>{data.price}</p>
                        <Select
                            className={styles.Select}
                            classNamePrefix={"select"}
                            options={options}
                            placeholder="Выберите размер"
                            isSearchable
                            onChange={(selected) => {
                                const newSize = selected?.value || "";
                                setSize(newSize);
                                console.log(newSize);
                            }}
                        />
                        <button
                            className={`${styles.Button} ${data.available !== undefined && data.available ? styles.ButtonAvailable : styles.ButtonUnavailable}`}
                            onClick={checkSize}
                            disabled={data.available === undefined || !data.available}
                        >
                            В корзину
                        </button>
                        {errorSize && <p className={styles.ChangeSize}>Пожалуйста выберите размер</p>}
                        <ModalWindow onClose={() => setIsOpen(false)} isOpen={isOpen}>
                            <div className={styles.CartContent}>
                                <div>
                                    {data.photos && data.photos.length > 0 && (
                                        <img
                                            src={data.photos[0].photo_url}
                                            alt={data.title || "Изображение товара"}
                                            className={styles.ModalImage}
                                        />
                                    )}
                                </div>
                                <div className={styles.ItemInfo}>
                                    <h1>{data.title}</h1>
                                    <p>Выбранный размер: {size}</p>
                                    <div>
                                        <button onClick={() => {
                                            if (quantity - 1 >= 1) {
                                                setQuantity(quantity - 1);
                                            }
                                        }}>-
                                        </button>
                                        <input
                                            className={styles.QuantityInput}
                                            type="number"
                                            value={quantity}
                                            onChange={(e) => {
                                                const value = parseInt(e.target.value);
                                                if (!isNaN(value) && value >= 1) {
                                                    setQuantity(value);
                                                }
                                            }}
                                        />
                                        <button onClick={() => {
                                            setQuantity(quantity + 1);
                                        }}>+
                                        </button>
                                    </div>
                                    <p className={styles.PriceInCart}>{data.price * quantity} р.</p>
                                    <button
                                        className={styles.Button}
                                        onClick={postItem}
                                    >
                                        В корзину
                                    </button>
                                    {cartMessage && <p className={styles.CartMessage}>{cartMessage}</p>}
                                </div>
                            </div>
                        </ModalWindow>
                        {data.available !== undefined && !data.available && (
                            <p className={styles.Available}>Нет в наличии</p>
                        )}
                        <ItemDescriptionContainer description={data.description} />
                    </div>
                </div>
            )}
        </motion.div>
    );
}