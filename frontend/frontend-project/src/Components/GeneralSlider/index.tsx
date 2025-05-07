// Slider.js
import {useState} from 'react';
import styles from "./GeneralSlider.module.css"
import axios from "axios";
import {useQuery} from "@tanstack/react-query";
import {Link} from "react-router";

interface Photo {
    id: number;
    photo_url: string;
}

interface Item {
    id: number;
    title: string;
    slug: string;
    is_featured: boolean;
    category: string;
    price: number;
    available: boolean;
    preorder: boolean;
    photos: Photo[];
}

export default function GeneralSlider() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [hovered, setHovered] = useState(false);

    async function fetchData(): Promise<Item[]> {
        const {data} = await axios.get("http://127.0.0.1:8000/api/featured-items/");
        return data;
    }

    const {data: slides = [], isLoading, isError} = useQuery<Item[]>({
        queryKey: ['featured-items'],
        queryFn: fetchData,
    })

    function nextSlide() {
        if (currentIndex < slides.length - 1) {
            setCurrentIndex((prevIndex) => prevIndex + 1);
        }
    }

    function prevSlide() {
        if (currentIndex > 0) {
            setCurrentIndex((prevIndex) => prevIndex - 1);
        }
    }

    function goToSlide(index: number) {
        setCurrentIndex(index);
    }

    const currentItem: Item = slides[currentIndex];

    if (isLoading) {
        return <div>Loading</div>
    }

    if (isError) return <div>Непредвиденная ошибка</div>

    return (
        <div className={styles.mainContainer}>
            <div className={styles.ItemsContainer}>
                <button onClick={prevSlide}>{`<`}</button>
                <Link className={styles.Link} to={`${currentItem.category}/${currentItem.slug}`}>
                    <div className={styles.Item}>
                        <div className={styles.PhotoContainer}>
                            {currentItem.photos && currentItem.photos.length > 0 && (
                                <img
                                    onMouseEnter={() => setHovered(true)}
                                    onMouseLeave={() => setHovered(false)}
                                    src={hovered ? currentItem.photos[1].photo_url : currentItem.photos[0].photo_url}
                                    alt=""/>
                            )}
                        </div>
                        <div className={styles.InfoContainer}>
                            <h2>{currentItem.title}</h2>
                            <p>{currentItem.category}</p>
                            <p>{currentItem.price}₽</p>
                        </div>
                    </div>
                </Link>
                <button onClick={nextSlide}>{`>`}</button>
            </div>
            <div className={styles.dots}>
                {slides.map((_, index) => (
                    <span
                        key={index}
                        className={`${styles.dot} ${currentIndex === index ? styles.active : ''}`}
                        onClick={() => goToSlide(index)}
                    />
                ))}
            </div>
        </div>
    );
};

