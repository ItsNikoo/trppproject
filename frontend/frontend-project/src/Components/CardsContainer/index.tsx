import ItemCard from "../ItemCard";
import styles from "./CardsContainer.module.css";
import axios from "axios";
import {useQuery} from "@tanstack/react-query";

interface Photo {
    id: number;
    photo_url: string;
}

interface Item {
    id: number;
    title: string;
    price: number;
    available: boolean;
    preorder: boolean;
    photos: Photo[];
}

export default function CardsContainer() {
    async function fetchData() {
        const {data} = await axios.get("http://127.0.0.1:8000/api/items/");
        return data;
    }

    const {data, isLoading, isError} = useQuery<Item[]>({
        queryKey: ['products'],
        queryFn: fetchData,
    });

    if (isLoading) {
        return <div>Загрузка...</div>;
    }

    if (isError) {
        return <div>Ошибка при загрузке данных</div>;
    }

    if (!data || data.length === 0) {
        return <div>Товары не найдены</div>;
    }

    return (
        <div className={styles.MainContainer}>
            <div className={styles.CardsContainer}>
                {data.map((item) => (
                    <ItemCard
                        key={item.id}
                        title={item.title}
                        price={item.price}
                        available={item.available}
                        preorder={item.preorder}
                        photos={item.photos}
                    />
                ))}
            </div>
        </div>
    )
}