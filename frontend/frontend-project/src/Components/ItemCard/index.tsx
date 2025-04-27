import styles from "./ItemCard.module.css"
import {Link} from "react-router";
import {useState} from "react";

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

export default function ItemCard({title, price, available, preorder, photos, slug, category}: ItemProps) {
    const [hovered, setHovered] = useState(false);

    return (
        <Link to={`/${category}/${slug}`} className={styles.MainContainer}>
            <div className={styles.PhotoContainer}>
                {photos && photos.length > 0 && (
                    <img className={styles.photo}
                         onMouseEnter={() => setHovered(true)}
                         onMouseLeave={() => setHovered(false)}
                         src={hovered ? photos[1].photo_url : photos[0].photo_url} alt=""/>
                )}
            </div>
            <div className={styles.ContentContainer}>
                <h1 className={styles.Title}>{title}</h1>
                <p className={styles.Price}>{price}</p>
                <p className={`${styles.Preorder} ${!preorder ? styles.hidden : ''}`}>
                    Предзаказ
                </p>
                <p>{available}</p>
            </div>
        </Link>
    )
}