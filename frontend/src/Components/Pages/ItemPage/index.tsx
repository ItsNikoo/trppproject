import { useParams } from "react-router";
import { useState } from "react";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import styles from "./ItemPage.module.css";
import Slider from "../../../UI/Slider";
import Select from "react-select";
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
    const queryClient = useQueryClient(); // Добавляем queryClient для управления кэшем

    // Запрос данных о товаре
    async function fetchItem() {
        const { data } = await axios.get(`http://127.0.0.1:8000/api/items/slug/${itemSlug}/`);
        return data;
    }

    const { data, isLoading, isError } = useQuery<Item>({
        queryKey: ["item", itemSlug],
        queryFn: fetchItem,
    });

    // Мутация для добавления товара в корзину
    const addToCartMutation = useMutation({
        mutationFn: async () => {
            if (!data?.id || !size) {
                throw new Error("Данные о товаре или размере отсутствуют");
            }
            return await axios.post(`http://127.0.0.1:8000/api/cart/`, {
                item: data.id,
                size: size,
                quantity: quantity,
            });
        },
        onSuccess: () => {
            setCartMessage("Товар успешно добавлен в корзину!");
            // Инвалидируем кэш корзины и товаров
            queryClient.invalidateQueries({ queryKey: ["cart"] });
            queryClient.invalidateQueries({ queryKey: ["cart-items"] });
            setTimeout(() => {
                setIsOpen(false);
                setCartMessage(null);
                setQuantity(1);
                setSize(null);
            }, 1500); // Закрываем модал через 1.5 секунды
        },
        onError: (error) => {
            setCartMessage("Ошибка при добавлении в корзину");
            console.error("Ошибка POST-запроса:", error);
        },
    });

    function checkSize() {
        if (!size) {
            setErrorSize(true);
            return;
        }
        setErrorSize(false);
        setIsOpen(true);
    }

    const options = [
        { value: "S", label: "S" },
        { value: "M", label: "M" },
        { value: "L", label: "L" },
        { value: "XL", label: "XL" },
    ];

    return (
        <motion.div
            initial={{ y: -25, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className={styles.Container}
        >
            {isLoading && <div className={styles.Loading}>Загрузка...</div>}
            {isError && <div className={styles.Error}>Ошибка загрузки данных</div>}
            {data && data.title && data.price && data.description && (
                <div className={styles.MainContainer}>
                    <div className={styles.PhotoContainer}>
                        {data.photos && data.photos.length > 0 ? (
                            <Slider photos={data.photos} />
                        ) : (
                            <div className={styles.NoImage}>Изображение отсутствует</div>
                        )}
                    </div>
                    <div className={styles.InfoContainer}>
                        <h1 className={styles.Title}>{data.title}</h1>
                        <p className={styles.Price}>{data.price} ₽</p>
                        <Select
                            className={styles.Select}
                            classNamePrefix="select"
                            options={options}
                            placeholder="Выберите размер"
                            isSearchable
                            onChange={(selected) => setSize(selected?.value || null)}
                            value={options.find((option) => option.value === size) || null}
                        />
                        <button
                            className={`${styles.Button} ${
                                data.available ? styles.ButtonAvailable : styles.ButtonUnavailable
                            }`}
                            onClick={checkSize}
                            disabled={!data.available || addToCartMutation.isPending}
                        >
                            {addToCartMutation.isPending ? "Добавление..." : "В корзину"}
                        </button>
                        {errorSize && (
                            <p className={styles.ChangeSize}>Пожалуйста, выберите размер</p>
                        )}
                        <ModalWindow onClose={() => setIsOpen(false)} isOpen={isOpen}>
                            <div className={styles.CartContent}>
                                <div className={styles.ImageContainer}>
                                    {data.photos && data.photos.length > 0 && (
                                        <img
                                            src={data.photos[0].photo_url}
                                            alt={data.title}
                                            className={styles.ModalImage}
                                        />
                                    )}
                                </div>
                                <div className={styles.ItemInfo}>
                                    <h1>{data.title}</h1>
                                    <p>Выбранный размер: {size}</p>
                                    <div className={styles.QuantityControl}>
                                        <button
                                            onClick={() => {
                                                if (quantity > 1) setQuantity(quantity - 1);
                                            }}
                                            disabled={quantity <= 1}
                                        >
                                            -
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
                                        <button onClick={() => setQuantity(quantity + 1)}>+</button>
                                    </div>
                                    <p className={styles.PriceInCart}>{data.price * quantity} ₽</p>
                                    <button
                                        className={styles.Button}
                                        onClick={() => addToCartMutation.mutate()}
                                        disabled={addToCartMutation.isPending}
                                    >
                                        {addToCartMutation.isPending ? "Добавление..." : "В корзину"}
                                    </button>
                                    {cartMessage && (
                                        <p
                                            className={`${styles.CartMessage} ${
                                                cartMessage.includes("Ошибка")
                                                    ? styles.ErrorMessage
                                                    : styles.SuccessMessage
                                            }`}
                                        >
                                            {cartMessage}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </ModalWindow>
                        {!data.available && (
                            <p className={styles.Available}>Нет в наличии</p>
                        )}
                        <ItemDescriptionContainer description={data.description} />
                    </div>
                </div>
            )}
        </motion.div>
    );
}