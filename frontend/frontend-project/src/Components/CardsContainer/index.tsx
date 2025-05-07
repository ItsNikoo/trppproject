import ItemCard from "../ItemCard";
import styles from "./CardsContainer.module.css";

interface Photo {
    id: number;
    photo_url: string;
}

interface Item {
    id: number;
    title: string;
    price: number;
    slug: string;
    is_featured: boolean;
    description: string;
    category: string;
    available: boolean;
    preorder: boolean;
    photos: Photo[];
}

export default function CardsContainer({data}: { data: Item[] }) {
    if (!data || data.length === 0) {
        return <div>Товары не найдены</div>;
    }

    return (
        <div className={styles.MainContainer}>
            <div className={styles.CardsContainer}>
                {data.map((item) => (
                    <ItemCard item={item} key={item.id}/>
                ))}
            </div>
        </div>
    )
}