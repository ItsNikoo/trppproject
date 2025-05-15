import styles from "./CatalogCard.module.css"
import {Link} from "react-router";
import {useState} from "react";
import {GlobalItem} from "../../types.ts"


export default function CatalogCard({item}: GlobalItem) {
    const [hovered, setHovered] = useState(false);

    return (
        <Link className={styles.Link} to={`/${item.category}/${item.slug}`}>
            <div className={styles.Card}>
                <div className={styles.imageContainer}>
                    {item.photos?.length > 0 && (
                        <img
                            className={styles.image}
                            onMouseEnter={() => setHovered(true)}
                            onMouseLeave={() => setHovered(false)}
                            src={hovered && item.photos[1] ? item.photos[1].photo_url : item.photos[0].photo_url}
                            alt={item.title}
                        />
                    )}
                </div>
                <div className={styles.info}>
                    <h3 className={styles.title}>{item.title}</h3>
                    <p className={styles.price}>{item.price}₽</p>
                    {item.preorder && <span className={styles.preorder}>Предзаказ</span>}
                    {!item.available && <span className={styles.outOfStock}>Нет в наличии</span>}
                </div>
            </div>
        </Link>
    )
}