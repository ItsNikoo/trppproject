import styles from "./Slider.module.css"
import {useState} from "react";

interface Photo {
    id: number;
    photo_url: string;
}


export default function Slider({photos}: { photos: Photo[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!photos || photos.length === 0) {
        return <div>No photos available</div>;  // Handle the case where photos are empty or undefined
    }

    function nextSlide() {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length);
    }

    function prevSlide() {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length);
    }

    function goToSlide(index: number) {
        setCurrentIndex(index);
    }


    return (
        <div className={styles.Container}>
            <div className={styles.Photos}>
                <button className={styles.PrevButton} onClick={prevSlide}>{`<`}</button>
                <img className={styles.Photo} src={photos[currentIndex].photo_url} alt=""/>
                <button className={styles.NextButton}  onClick={nextSlide}>{`>`}</button>
            </div>
            <div className={styles.ArrayContainer}>
                {photos.map((photo, index) => (
                    <img
                        key={photo.id}
                        className={styles.SmallPhoto}
                        src={photo.photo_url}
                        alt={`Thumbnail ${index + 1}`}
                        onClick={() => goToSlide(index)} // При клике на миниатюру переходим на соответствующую фотографию
                    />
                ))}
            </div>
        </div>
)
}