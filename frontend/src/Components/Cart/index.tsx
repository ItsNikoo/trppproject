import styles from "./Cart.module.css"
import cart from "../../../public/shopping-cart-outline-svgrepo-com.svg";
import ModalWindow from "../../UI/ModalWindow";
import {useState} from "react";
import {CartItem, Item} from "../../types.ts";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import axios from "axios";

export default function Cart({data}: { data: CartItem[] }) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const queryClient = useQueryClient();

    const {data: items} = useQuery({
        queryKey: ['cart-items', data?.map(item => item.item).join(',')],
        queryFn: fetchItems,
        enabled: !!data?.length
    });

    const deleteMutation = useMutation({
        mutationFn: (cartItemId: number) =>
            axios.delete(`http://127.0.0.1:8000/api/cart/${cartItemId}/`),
        onSuccess: () => {
            // Инвалидируем кэш корзины и элементов корзины после успешного удаления
            queryClient.invalidateQueries({queryKey: ['cart']});
            queryClient.invalidateQueries({queryKey: ['cart-items']});
        },
        onError: (error) => {
            console.error('Ошибка при удалении товара:', error);
        }
    });

    async function fetchItem(id: number): Promise<Item | undefined> {
        try {
            const {data} = await axios.get<Item>(`http://127.0.0.1:8000/api/items/${id}/`);
            return data;
        } catch (error) {
            console.error('Ошибка при загрузке товара:', error);
            return undefined;
        }
    }

    async function fetchItems(): Promise<(Item | undefined)[]> {
        try {
            if (!data || !data.length) return [];
            return await Promise.all(data.map(cartItem => fetchItem(cartItem.item)));
        } catch (error) {
            console.error('Ошибка при загрузке товаров:', error);
            return [];
        }
    }

    const handleRemoveFromCart = (cartItemId: number) => {
        deleteMutation.mutate(cartItemId);
    };

    return (
        <>
            <div className={styles.Cart} onClick={() => setIsOpen(true)}>
                <img className={styles.Image} src={cart} alt="Корзина"/>
                {data?.length ? (
                    <span className={styles.CartCounter}>{data.length}</span>
                ) : null}
            </div>

            <ModalWindow onClose={() => setIsOpen(false)} isOpen={isOpen}>
                <div className={styles.Container}>
                    <h1>Корзина</h1>
                    <div className={styles.CartItems}>
                        {data && data.length > 0 ? (
                            data.map((cartItem, index) => {
                                const item = items?.[index];
                                return (
                                    <div key={index} className={styles.CartItem}>
                                        {item && (
                                            <div className={styles.ItemInfo}>
                                                <div className={styles.ImageContainer}>
                                                    {item.photos?.[0]?.photo_url && (
                                                        <img
                                                            className={styles.ImageInCart}
                                                            src={item.photos[0].photo_url}
                                                            alt={item.title}
                                                        />
                                                    )}
                                                </div>
                                                <div className={styles.ItemDetails}>
                                                    <h3 className={styles.ItemTitle}>{item.title}</h3>
                                                    <div className={styles.PriceRow}>
                                                        <span className={styles.Price}>{item.price} ₽</span>
                                                        <span className={styles.Multiply}>×</span>
                                                        <span className={styles.Quantity}>{cartItem.quantity}</span>
                                                        <span className={styles.TotalPrice}>
                                                            {item.price * cartItem.quantity} ₽
                                                        </span>
                                                    </div>
                                                    <p className={styles.Size}>Размер: {cartItem.size}</p>
                                                    <button
                                                        className={styles.Button}
                                                        onClick={() => handleRemoveFromCart(cartItem.id)}
                                                        disabled={deleteMutation.isPending}
                                                    >
                                                        {deleteMutation.isPending ? 'Удаление...' : 'Убрать из корзины'}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <p>Корзина пуста</p>
                        )}
                    </div>
                </div>
            </ModalWindow>
        </>
    )
}