import styles from "./AboutUsPage.module.css"

export default function AboutUsPage() {
    return (
        <div className={styles.Container}>
            <h1 className={styles.H1}>О нас</h1>
            <p className={styles.P}>Московский бренд одежды, основанный в 2017 году, выпускающий вещи в лимитированном кол-ве.</p>
            <p className={styles.P}>Наша задача, создавать качественные и стильные вещи, за доступную цену.</p>
            <p className={styles.P}>За всё время работы, смогли одеть более 15000 счастливых покупателей.</p>
        </div>
    )
}