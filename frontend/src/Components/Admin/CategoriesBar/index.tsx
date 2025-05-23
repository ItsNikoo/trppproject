import AddProductButton from "../../../UI/AddProductButton";
import axios from "axios";
import {useQuery} from "@tanstack/react-query";
import styles from "./CategoriesBar.module.css"
import CategoryCard from "./CategoryCard";
import AddCategoryButton from "../../../UI/AddCategoryButton";
import {Category} from "../../../types.ts";


export default function CategoriesBar() {

    async function loadCategories() {
        const response = await axios.get("http://127.0.0.1:8000/api/categories/")
        return response.data;
    }

    const {data, isLoading, isError} = useQuery({
        queryKey: ['categories'],
        queryFn: loadCategories,
    })
    if (isLoading) {
        return <div>Загрузка...</div>;
    }

    if (isError) {
        return <div>Ошибка загрузки данных</div>;
    }

    return (
        <div className={styles.MainContainer}>
            <div className={styles.CategoriesContainer}>
                <h1>Категории</h1>
                {data && data.map((category: Category) => (
                    <CategoryCard category={category}/>
                ))}
            </div>
            <div className={styles.Buttons}>
                <AddProductButton/>
                <AddCategoryButton/>
            </div>
        </div>
    )
}