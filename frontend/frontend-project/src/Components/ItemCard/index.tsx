import styles from "./ItemCard.module.css"

<<<<<<< HEAD

interface Photo {
    id: number;
    photo_url: string;
}

interface ItemProps {
    title: string;
    price: number;
    available: boolean;
    preorder: boolean;
    photos: Photo[];
}

export default function ItemCard({title, price, available, preorder, photos}: ItemProps) {
    return (
        <a href={''} className={styles.MainContainer}>
            <div className={styles.PhotoContainer}>
                <img className={styles.photo} src={`${photos[0].photo_url}`} alt=""/>
            </div>
            <div className={styles.ContentContainer}>
                <h1 className={styles.Title}>{title}</h1>
                <p className={styles.Price}>{price}</p>
                <p className={`${styles.Preorder} ${!preorder ? styles.hidden : ''}`}>
                    Предзаказ
                </p>
                <p>{available}</p>
            </div>
        </a>
=======
export default function ItemCard() {
    return (
        <div className={styles.MainContainer}>
            <div className={styles.PhotoContainer}>

            </div>
        </div>
>>>>>>> b63f5ce7b48603637a510e2e78b66d25a3954c60
    )
}