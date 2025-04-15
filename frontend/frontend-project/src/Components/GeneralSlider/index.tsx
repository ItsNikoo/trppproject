// Slider.js
import {useState} from 'react';
import styles from "./GeneralSlider.module.css"

export default function GeneralSlider({slides}) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === slides.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? slides.length - 1 : prevIndex - 1
        );
    };

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    return (
        <div className={styles.mainContainer}>
            <button className={styles.prev} onClick={prevSlide}>{`<`}</button>
            <div className={styles.slider}>
                <div
                    className={styles.slidesContainer}
                    style={{transform: `translateX(-${currentIndex * 100}%)`}}
                >
                    {slides.map((slide, index) => (
                        <div className={styles.slide} key={index}>
                            <div className={styles.imageContainer}>
                            </div>
                            <div className={styles.infoContainer}>
                                <h1>Title</h1>
                                <p>{slide.description}</p>
                            </div>
                        </div>
                    ))}
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
            <button className={styles.next} onClick={nextSlide}>{`>`}</button>
        </div>
    );
};

