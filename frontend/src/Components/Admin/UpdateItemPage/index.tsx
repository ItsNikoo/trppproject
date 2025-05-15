import type React from "react"

import {useParams, useNavigate} from "react-router"
import axios from "axios"
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query"
import {useState, useEffect} from "react"
import RedirectToAdminPanelButton from "../../../UI/RedirectToAdminPanelButton"
import {
    Autocomplete,
    TextField,
    Checkbox,
    FormGroup,
    FormControlLabel,
    Alert,
    CircularProgress,
    Button,
} from "@mui/material"
import styles from "./UpdateItemPage.module.css"
import UploadFilesArea from "../../../UI/UploadFilesArea"

interface Photo {
    id: number
    photo_url: string
}

interface Item {
    title: string
    slug: string
    category: string
    description: string
    price: number
    available: boolean
    preorder: boolean
    amount: number
    photos?: Photo[]
}

interface Category {
    id: number
    category: string
    category_name: string
}

export default function UpdateItemPage() {
    const {id} = useParams()
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const [newItem, setNewItem] = useState<Item | null>(null)
    const [categories, setCategories] = useState<Category[]>([])
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
    const [success, setSuccess] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    async function fetchItem(id: number) {
        try {
            const item = await axios.get(`http://127.0.0.1:8000/api/items/${id}`)
            return item.data
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    const {data, isLoading, isError} = useQuery<Item>({
        queryKey: ["item", id],
        queryFn: () => fetchItem(Number(id)),
        enabled: !!id,
    })

    // Мутация для обновления товара
    const updateMutation = useMutation({
        mutationFn: async (item: Item) => {
            const response = await axios.patch(`http://127.0.0.1:8000/api/items/${id}/`, item)
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["item", id]})
            setSuccess(true)
            setTimeout(() => setSuccess(false), 3000)
        },
        onError: (error: any) => {
            setError(error.message || "Произошла ошибка при обновлении товара")
            setTimeout(() => setError(null), 3000)
        },
    })

    useEffect(() => {
        if (data) {
            setNewItem(data)
            if (data.category && categories.length > 0) {
                const currentCategory = categories.find((cat) => cat.category === data.category)
                setSelectedCategory(currentCategory || null)
            }
        }
    }, [data, categories])

    useEffect(() => {
        loadCategories()
    }, [])

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const {name, value, type, checked} = e.target
        if (newItem) {
            setNewItem((prevState) => ({
                ...prevState!,
                [name]: type === "checkbox" ? checked : value,
            }))
        }
    }

    function handleCategoryChange(_: unknown, value: Category | null) {
        setSelectedCategory(value)
        if (newItem && value) {
            setNewItem({
                ...newItem,
                category: value.category,
            })
        }
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        if (newItem && id) {
            const numericId = Number(id)
            if (!isNaN(numericId)) {
                updateMutation.mutate(newItem)
            } else {
                setError("Неверный ID товара")
            }
        } else {
            setError("Нет данных для отправки")
        }
    }

    async function loadCategories() {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/categories/")
            setCategories(response.data)
        } catch (error) {
            console.error("Ошибка получения категорий:", error)
            setError("Ошибка загрузки категорий")
        }
    }

    if (isLoading) {
        return (
            <div className={styles.ContainerForm}>
                <div className={styles.MainContainer}>
                    <CircularProgress/>
                    <p>Загрузка данных...</p>
                </div>
            </div>
        )
    }

    if (isError) {
        return (
            <div className={styles.ContainerForm}>
                <div className={styles.MainContainer}>
                    <Alert severity="error">Ошибка загрузки данных товара</Alert>
                    <Button variant="contained" onClick={() => navigate(-1)} style={{marginTop: "20px"}}>
                        Вернуться назад
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.ContainerForm}>
            <h1>Страница товара {id}</h1>
            <RedirectToAdminPanelButton/>

            {success && (
                <Alert severity="success" style={{marginBottom: "20px"}}>
                    Товар успешно обновлен!
                </Alert>
            )}

            {error && (
                <Alert severity="error" style={{marginBottom: "20px"}}>
                    {error}
                </Alert>
            )}

            {newItem && (
                <form onSubmit={handleSubmit} className={styles.Form}>
                    <TextField
                        name="title"
                        label="Название"
                        value={newItem.title}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        name="slug"
                        label="Slug"
                        value={newItem.slug}
                        onChange={handleChange}
                        fullWidth
                    />
                    <Autocomplete
                        options={categories}
                        getOptionLabel={(option) => option.category_name}
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        renderInput={(params) => <TextField {...params} label="Категория"
                                                            className={styles.Input}/>}
                        fullWidth
                    />
                    <TextField
                        name="price"
                        label="Цена"
                        type="number"
                        value={newItem.price}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        name="description"
                        label="Описание"
                        type="text"
                        value={newItem.description}
                        onChange={handleChange}
                        fullWidth
                        multiline
                        rows={4}
                    />
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={newItem.available}
                                    onChange={(e) => setNewItem({...newItem, available: e.target.checked})}
                                    name="available"
                                />
                            }
                            label="Доступно"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={newItem.preorder}
                                    onChange={(e) => setNewItem({...newItem, preorder: e.target.checked})}
                                    name="preorder"
                                />
                            }
                            label="Предзаказ"
                        />
                    </FormGroup>
                    <TextField
                        name="amount"
                        label="Количество"
                        type="number"
                        value={newItem.amount}
                        onChange={handleChange}
                        fullWidth
                    />
                    <div>
                        <UploadFilesArea
                            folder={newItem.slug}
                            id={id}
                            onUploadSuccess={(uploadedPhotos) => {
                                setNewItem((prev) => (prev ? {...prev, photos: uploadedPhotos} : null))
                            }}
                        />
                    </div>
                    <Button
                        className={styles.Button}
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={updateMutation.isPending}
                    >
                        {updateMutation.isPending ? "Сохранение..." : "Сохранить изменения"}
                    </Button>
                </form>
            )}
        </div>
    )
}
