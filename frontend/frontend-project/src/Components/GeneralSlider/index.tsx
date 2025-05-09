import {useState} from 'react';
import styles from "./GeneralSlider.module.css"
import axios from "axios";
import {useQuery} from "@tanstack/react-query";
import {Link} from "react-router";
import {AnimatePresence, motion} from "framer-motion";

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
    const [direction, setDirection] = useState(0) // -1 для влево, 1 для вправо

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
            setDirection(1)
            setCurrentIndex((prevIndex) => prevIndex + 1);
        }
    }

    function prevSlide() {
        if (currentIndex > 0) {
            setDirection(-1)
            setCurrentIndex((prevIndex) => prevIndex - 1);
        }
    }

    function goToSlide(index: number) {
        setDirection(index > currentIndex ? 1 : -1)
        setCurrentIndex(index)
    }

    const currentItem: Item = slides[currentIndex];

    if (isLoading) {
        return <div>Loading</div>
    }

    if (isError) return <div>Непредвиденная ошибка</div>

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 500 : -500,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
            transition: {
                duration: 0.3,
            },
        },
        exit: (direction: number) => ({
            x: direction > 0 ? -500 : 500,
            opacity: 0,
            transition: {
                duration: 0.3,
            },
        }),
    };

    return (
        <div className={styles.mainContainer}>
            <motion.div className={styles.ItemsContainer}
                        initial={{y: -25}}
                        animate={{y: 0}}
                        exit={{opacity: 0}}
                        transition={{duration: 0.5}}
            >
                <button onClick={prevSlide}>{`<`}</button>
                <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.div
                        key={currentIndex}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className={styles.Link}>
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
                    </motion.div>
                </AnimatePresence>
                <button onClick={nextSlide}>{`>`}</button>
            </motion.div>
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

