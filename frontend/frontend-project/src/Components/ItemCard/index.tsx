import styles from "./ItemCard.module.css"
import {Link} from "react-router";
import {useState} from "react";
import {GlobalItem} from "../../types.ts";


export default function ItemCard({item}: GlobalItem) {
    const [hovered, setHovered] = useState(false);

    return (
        <Link to={`/${item.category}/${item.slug}`} className={styles.MainContainer}>
            <div className={styles.PhotoContainer}>
                {item.photos && item.photos.length > 0 && (
                    <img className={styles.photo}
                         onMouseEnter={() => setHovered(true)}
                         onMouseLeave={() => setHovered(false)}
                         src={
                             item.photos.length > 1 && hovered
                                 ? item.photos[1].photo_url
                                 : item.photos[0].photo_url
                         }
                         alt=""
                    />
                )}
            </div>
            <div className={styles.ContentContainer}>
                <h1 className={styles.Title}>{item.title}</h1>
                <p className={styles.Price}>{item.price}</p>
                <p className={`${styles.Preorder} ${!item.preorder ? styles.hidden : ''}`}>
                    Предзаказ
                </p>
                {!item.available && (
                    <p className={`${styles.NotAvailable} ${item.available ? styles.hidden : ''}`}>
                        Нет в наличии
                    </p>
                )}
            </div>
        </Link>
    )
}