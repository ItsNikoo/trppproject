import RedirectToAdminPanelButton from "../../../UI/RedirectToAdminPanelButton";
import {useState} from "react";
import {TextField} from "@mui/material";
import styles from "./AddCategoryPage.module.css"
import axios from "axios";
import {useQueryClient} from "@tanstack/react-query";

interface Category {
    category: string;
    category_name: string;
}

interface ApiError {
    response?: {
        status: number;
        data: {
            message?: string;
        };
    };
    message: string;
}

export default function AddCategoryPage() {
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [category, setCategory] = useState<Category>({
        category: "",
        category_name: "",
    })

    const queryClient = useQueryClient();

    async function createCategory(e: React.FormEvent) {
        e.preventDefault()

        if (!category.category || !category.category_name) {
            setError("Пожалуйста, заполните все поля")
            return
        }

        setLoading(true)
        setError(null)


        try {
            console.log("Отправляемые данные:", category)
            await axios.post("http://127.0.0.1:8000/api/categories/", category)
            queryClient.invalidateQueries({queryKey: ["categories"]})
            setCategory({
                category: "",
                category_name: "",
            })
        } catch (err) {
            const apiError = err as ApiError
            setError(apiError.response?.data?.message || apiError.message || "Произошла ошибка")
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className={styles.ContainerForm}>
                <div className={styles.MainContainer}>
                    <RedirectToAdminPanelButton/>
                    <h1>Добавить категорию</h1>
                    <p>Загрузка...</p>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.ContainerForm}>
            <RedirectToAdminPanelButton/>
            <h1>Добавить категорию</h1>
            <form onSubmit={createCategory} className={styles.Form}>
                <TextField
                    label="Идентификатор категории"
                    value={category.category}
                    onChange={(e) => setCategory({...category, category: e.target.value})}
                    fullWidth
                />
                <TextField
                    label="Категория"
                    value={category.category_name}
                    onChange={(e) => setCategory({...category, category_name: e.target.value})}
                    fullWidth
                />
                <button className={styles.Button} type='submit'>Добавить категорию</button>
            </form>
            <p className={styles.Error}>{error}</p>
        </div>
    )
}