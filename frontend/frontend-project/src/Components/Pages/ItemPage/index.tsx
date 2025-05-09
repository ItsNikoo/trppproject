import {useParams} from "react-router";
import {useEffect, useState} from "react";
import axios from "axios";
import {useQuery} from "@tanstack/react-query";
import styles from "./ItemPage.module.css"
import Slider from "../../../UI/Slider";
import Select from 'react-select';

interface Photo {
    id: number;
    photo_url: string;
}

interface ItemProps {
    title: string;
    slug: string;
    category: string;
    description: string;
    price: number;
    available: boolean;
    preorder: boolean;
    photos?: Photo[];
}

export default function ItemPage() {
    const {itemSlug} = useParams();
    const [item, setItem] = useState<ItemProps | null>(null);
    const [size, setSize] = useState<string>("");
    const [isOpen, setIsOpen] = useState<boolean>(false);


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
            document.title = data.title;
        }
    }, [data]);

    const options = [
        {value: 'S', label: 'S'},
        {value: 'M', label: 'M'},
        {value: 'L', label: 'L'},
        {value: 'XL', label: 'XL'},
    ];

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
                        <h1 className={styles.Title}>{data.title}</h1>
                        <p className={styles.PriceContainer}>{data.price}</p>
                        <Select
                            className={styles.Select}
                            classNamePrefix={"select"}
                            options={options}
                            placeholder="Выберите размер"
                            isSearchable
                            onChange={(selected) => {
                                setSize(selected?.value || "")
                                console.log(size)
                            }}
                        />
                        <button className={`${styles.Button} ${item?.available ? styles.ButtonAvailable : styles.ButtonUnavailable}`}>В корзину</button>
                        {!item?.available && <p className={styles.Available}>Нет в наличии</p>}
                        <div onClick={() => setIsOpen(!isOpen)} className={styles.Description}>
                            <div className={styles.Header}>
                                <h1>Описание товара</h1>
                                <div className={`${styles.Arrow} ${isOpen ? styles.ArrowOpen : ""}`}></div>
                            </div>
                            <div className={`${styles.DescriptionContent} ${isOpen ? styles.Open : ""}`}>
                                <p className={styles.Description}>{data.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}