import styles from "./CatalogPage.module.css"
import {useCallback, useState} from "react";
import axios from "axios";
import {useQuery} from "@tanstack/react-query";
import CatalogCard from "../../../UI/CatalogCard";
import {Item, Category} from "../../../types.ts"
import {Autocomplete, TextField} from "@mui/material";


export default function CatalogPage() {
    const [query, setQuery] = useState<string>("")
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    const {
        data: categories = [], // По умолчанию пустой массив
        isLoading: isCategoriesLoading,
        error: categoriesError,
    } = useQuery<Category[]>({
        queryKey: ["categories"],
        queryFn: async () => {
            const {data} = await axios.get("http://127.0.0.1:8000/api/categories/");
            return data;
        },
    });

    // Запрос для товаров
    const {
        data: items = [], // По умолчанию пустой массив
        isLoading: isItemsLoading,
        error: itemsError,
    } = useQuery<Item[]>({
        queryKey: ["products", selectedCategory?.category], // Зависит от category
        queryFn: async () => {
            const url = selectedCategory
                ? `http://127.0.0.1:8000/api/categories/${selectedCategory.category}/items/`
                : "http://127.0.0.1:8000/api/items/";
            const {data} = await axios.get(url);
            return data;
        },
    });

    // Обработчик изменения строки поиска
    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        setQuery(event.target.value);
    }

    const handleCategoryChange = useCallback(
        (_event: React.SyntheticEvent, value: Category | null) => {
            setSelectedCategory(value);
        },
        []
    );

    // Фильтрация по строке поиска
    const filteredData = items.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase())
    );

    // Обработка загрузки и ошибок
    if (isCategoriesLoading || isItemsLoading) return <div>Загрузка...</div>;
    if (categoriesError)
        return <div>Ошибка загрузки категорий: {categoriesError.message}</div>;
    if (itemsError)
        return <div>Ошибка загрузки товаров: {itemsError.message}</div>;

    return (
        <div className={styles.default}>
            <input
                onChange={handleChange}
                className={styles.Input}
                type="text"
                placeholder="Поиск"
                value={query}
            />

            <div className={styles.Settings}>
                <Autocomplete
                    options={categories}
                    getOptionLabel={(option) => option.category_name}
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    renderInput={(params) => (
                        <TextField {...params} label="Выберите категорию" variant="outlined"/>
                    )}
                    fullWidth
                />
            </div>

            <div className={styles.grid}>
                {filteredData?.map((item: Item) => (
                    <CatalogCard item={item} key={item.id}/>
                ))}
            </div>
        </div>
    )
}