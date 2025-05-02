import {useParams} from "react-router";
import {useEffect, useState} from "react";
import axios from "axios";
import {useQuery} from "@tanstack/react-query";
import styles from "./ItemPage.module.css"
import Slider from "../../../UI/Slider";

interface Photo {
    id: number;
    photo_url: string;
}

interface ItemProps {
    title: string;
    slug: string;
    category: string;
    price: number;
    available: boolean;
    preorder: boolean;
    photos?: Photo[];
}

export default function ItemPage() {
    const {itemSlug} = useParams();
    const [item, setItem] = useState<ItemProps | null>(null);

    async function fetchItem() {
        const {data} = await axios.get(`http://127.0.0.1:8000/api/items/slug/${itemSlug}/`);
        console.log(data)
        return data;
    }

    const {data, isLoading, isError} = useQuery<ItemProps>({
        queryKey: ['item', itemSlug],
        queryFn: fetchItem,
    });

    useEffect(() => {
        if (data) {
            setItem(data);
        }
    }, [data]);


    return (
        <div>
            {isLoading && <div>Загрузка...</div>}
            {isError && <div>Ошибка загрузки данных</div>}
            {data && (
                <div className={styles.MainContainer}>
                    <div className={styles.PhotoContainer}>
                        {item?.photos && <Slider photos={item?.photos}/>}
                    </div>
                    <div className={styles.InfoContainer}>
                        <h1>{data.title}</h1>
                        <p className={styles.PriceContainer}>{data.price}</p>
                        <button className={styles.Button}>В корзину</button>
                    </div>
                </div>
            )}
        </div>
    )
}