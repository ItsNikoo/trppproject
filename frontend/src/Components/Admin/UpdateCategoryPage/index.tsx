import type React from "react"

import {useParams, useNavigate} from "react-router"
import axios from "axios"
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query"
import {useEffect, useState} from "react"
import {TextField, Button, CircularProgress, Alert} from "@mui/material"
import RedirectToAdminPanelButton from "../../../UI/RedirectToAdminPanelButton";
import styles from "./UpdateCategoryPage.module.css"

interface Category {
    id: number
    category: string
    category_name: string
}

export default function UpdateCategoryPage() {
    const {id} = useParams()
    const navigate = useNavigate()
    const [category, setCategory] = useState<Category | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<boolean>(false)
    const queryClient = useQueryClient()

    async function fetchCategory(id: number) {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/categories/${id}/`)
            return response.data
        } catch (error) {
            console.error("Ошибка получения категории:", error)
            throw error
        }
    }

    // Запрос на получение данных
    const {data, isLoading, isError} = useQuery({
        queryKey: ["category", id],
        queryFn: () => fetchCategory(Number(id)),
        enabled: !!id,
    })

    // Мутация для обновления категории
    const updateMutation = useMutation({
        mutationFn: async (updatedCategory: Category) => {
            const response = await axios.put(`http://127.0.0.1:8000/api/categories/${id}/`, updatedCategory)
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["category", id]})
            setSuccess(true)
            setTimeout(() => setSuccess(false), 3000)
        },
        onError: (error) => {
            setError(error.message || "Произошла ошибка при обновлении категории")
            setTimeout(() => setError(null), 3000)
        },
    })

    // Обновляем локальное состояние при получении данных
    useEffect(() => {
        if (data) {
            setCategory(data)
        }
    }, [data])

    // Обработчик изменения полей формы
    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const {name, value} = event.target
        if (category) {
            setCategory((prevState) => ({
                ...prevState!,
                [name]: value,
            }))
        }
    }

    // Обработчик отправки формы
    function handleSubmit(event: React.FormEvent) {
        event.preventDefault()
        if (category) {
            updateMutation.mutate(category)
        }
    }

    if (isLoading) {
        return (
            <div className={styles.ContainerForm}>
                <CircularProgress/>
                <p>Загрузка данных...</p>
            </div>
        )
    }

    if (isError) {
        return (
            <div className={styles.ContainerForm}>
                <Alert severity="error">Ошибка при загрузке категории</Alert>
                <Button variant="contained" onClick={() => navigate(-1)}>
                    Вернуться назад
                </Button>
            </div>
        )
    }

    return (
        <div className={styles.ContainerForm}>
            <RedirectToAdminPanelButton/>
            <h1>Редактирование категории {id}</h1>

            {success && (
                <Alert severity="success" style={{marginBottom: "20px"}}>
                    Категория успешно обновлена!
                </Alert>
            )}

            {error && (
                <Alert severity="error" style={{marginBottom: "20px"}}>
                    {error}
                </Alert>
            )}

            <form onSubmit={handleSubmit}>
                <TextField
                    name="category"
                    label="Название категории"
                    value={category?.category || ""}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />

                <TextField
                    name="category_name"
                    label="Отображаемое имя категории"
                    value={category?.category_name || ""}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={updateMutation.isPending}
                    style={{marginTop: "20px"}}
                >
                    {updateMutation.isPending ? "Сохранение..." : "Сохранить изменения"}
                </Button>
            </form>
        </div>
    )
}
