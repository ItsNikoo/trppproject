import styles from "./CatalogPage.module.css"
import {useState} from "react";

export default function CatalogPage() {
    const [query, setQuery] = useState<string>("")

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        setQuery(event.target.value)
    }
    return (
        <div>
            <input onChange={handleChange} className={styles.Input} type="text" placeholder="Search..."/>
            <p>{query}</p>
        </div>
    )
}