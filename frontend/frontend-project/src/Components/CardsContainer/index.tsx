import ItemCard from "../ItemCard";
import styles from "./CardsContainer.module.css";

interface Photo {
    id: number;
    photo_url: string;
}

interface Item {
    id: number;
    title: string;
    slug: string;
    category: string;
    price: number;
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
                    <ItemCard
                        key={item.id}
                        title={item.title}
                        price={item.price}
                        available={item.available}
                        preorder={item.preorder}
                        photos={item.photos}
                        slug={item.slug}
                        category={item.category}
                    />
                ))}
            </div>
        </div>
    )
}