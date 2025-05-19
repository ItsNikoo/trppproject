import type React from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { TextField, Button, CircularProgress, Alert } from "@mui/material";
import RedirectToAdminPanelButton from "../../../UI/RedirectToAdminPanelButton";
import styles from "./UpdateCategoryPage.module.css";

interface Category {
    id: number;
    category: string;
    category_name: string;
}

export default function UpdateCategoryPage() {
    const { category: categoryParam } = useParams<{ category: string }>(); // Используем category вместо id
    const navigate = useNavigate();
    const [category, setCategory] = useState<Category | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const queryClient = useQueryClient();

    // Запрос на получение данных категории
    async function fetchCategory(category: string) {
        try {
            const response = await axios.get<Category>(`http://127.0.0.1:8000/api/categories/${category}/`);

            return response.data;
        } catch (error) {
            console.error("Ошибка получения категории:", error);
            throw error;
        }
    }

    // Запрос данных категории
    const { data, isLoading, isError } = useQuery({
        queryKey: ["category", categoryParam],
        queryFn: () => fetchCategory(categoryParam!),
        enabled: !!categoryParam,
    });

    const updateMutation = useMutation({
        mutationFn: async (updatedCategory: Category) => {
            const response = await axios.put(`http://127.0.0.1:8000/api/categories/${updatedCategory.category}/`, updatedCategory);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["category", categoryParam] });
            queryClient.invalidateQueries({ queryKey: ["categories"] }); // Инвалидируем список категорий, если он используется
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                navigate(-1); // Возвращаемся назад после успешного обновления
            }, 3000);
        },
        onError: (error: any) => {
            setError(error.response?.data?.message || "Произошла ошибка при обновлении категории");
            setTimeout(() => setError(null), 3000);
        },
    });

    // Обновляем локальное состояние при получении данных
    useEffect(() => {
        if (data && !category) {
            setCategory(data);
        }
    }, [data, category]);

    // Обработчик изменения полей формы
    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        if (category) {
            setCategory((prevState) => ({
                ...prevState!,
                [name]: value,
            }));
        }
    }

    // Обработчик отправки формы
    function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        if (!category) {
            setError("Данные категории отсутствуют");
            return;
        }
        if (!category.category || !category.category_name) {
            setError("Все поля должны быть заполнены");
            return;
        }
        updateMutation.mutate(category);
    }

    if (isLoading) {
        return (
            <div className={styles.ContainerForm}>
                <CircularProgress />
                <p>Загрузка данных...</p>
            </div>
        );
    }

    if (isError || !category) {
        return (
            <div className={styles.ContainerForm}>
                <Alert severity="error">Ошибка при загрузке категории</Alert>
                <Button variant="contained" onClick={() => navigate(-1)}>
                    Вернуться назад
                </Button>
            </div>
        );
    }

    return (
        <div className={styles.ContainerForm}>
            <RedirectToAdminPanelButton />
            <h1>Редактирование категории {category.category}</h1>

            {success && (
                <Alert severity="success" style={{ marginBottom: "20px" }}>
                    Категория успешно обновлена!
                </Alert>
            )}

            {error && (
                <Alert severity="error" style={{ marginBottom: "20px" }}>
                    {error}
                </Alert>
            )}

            <form onSubmit={handleSubmit}>
                <TextField
                    name="category"
                    label="Название категории (например, pants)"
                    value={category.category || ""}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    error={!category.category}
                    helperText={!category.category ? "Поле обязательно" : ""}
                />
                <TextField
                    name="category_name"
                    label="Отображаемое имя категории"
                    value={category.category_name || ""}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    error={!category.category_name}
                    helperText={!category.category_name ? "Поле обязательно" : ""}
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={updateMutation.isPending || !category.category || !category.category_name}
                    style={{ marginTop: "20px" }}
                >
                    {updateMutation.isPending ? "Сохранение..." : "Сохранить изменения"}
                </Button>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => navigate(-1)}
                    style={{ marginTop: "20px", marginLeft: "10px" }}
                >
                    Отмена
                </Button>
            </form>
        </div>
    );
}