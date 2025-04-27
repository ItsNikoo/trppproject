import {useParams, useNavigate} from "react-router";
import axios from "axios";
import {useQuery} from "@tanstack/react-query";
import {useState, useEffect} from "react";
import RedirectToAdminPanelButton from "../../../UI/RedirectToAdminPanelButton";
import {Autocomplete, TextField, Checkbox, FormGroup, FormControlLabel} from "@mui/material";
import styles from "./UpdateItemPage.module.css"


interface Photo {
    id: number;
    photo_url: string;
}

interface Item {
    title: string;
    slug: string;
    category: string;
    description: string;
    price: number;
    available: boolean;
    preorder: boolean;
    amount: number;
    photos?: Photo[];
}

interface Category {
    id: number;
    category: string;
    category_name: string;
}

export default function UpdateItemPage() {
    const id = useParams().id;
    const navigate = useNavigate()
    const [newItem, setNewItem] = useState<Item | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    async function fetchItem(id: number) {
        try {
            const item = await axios.get(`http://127.0.0.1:8000/api/items/${id}`)
            return item.data;
        } catch (error) {
            console.log(error)
        }
    }

    const {data, isLoading, isError} = useQuery<Item>({
        queryKey: ['item', id],
        queryFn: () => fetchItem(Number(id)),
    })

    useEffect(() => {
        if (data) {
            setNewItem(data);
            if (data.category && categories.length > 0) {
                const currentCategory = categories.find(cat => cat.category === data.category);
                setSelectedCategory(currentCategory || null);
            }
        }
    }, [data, categories]);

    useEffect(() => {
        loadCategories()
    }, []);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const {name, value, type, checked} = e.target;
        if (newItem) {
            setNewItem(prevState => ({
                ...prevState!,
                [name]: type === "checkbox" ? checked : value,
            }));
        }
    }

    function handleCategoryChange(_: any, value: Category | null) {
        setSelectedCategory(value)
        if (newItem && value) {
            setNewItem({
                ...newItem,
                category: value.category
            });
        }
    }

    async function patchItem(id: number, item: Item) {
        try {
            const response = await axios.patch(`http://127.0.0.1:8000/api/items/${id}/`, item)
            console.log("Товар обновлён успешно", response.data);
            navigate('/admin')
        } catch (error) {
            console.error("Ошибка при обновлении товара", error);
        }
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        if (newItem && id) {
            const numericId = Number(id);
            if (!isNaN(numericId)) {
                patchItem(numericId, newItem);
            } else {
                console.error("Неверный ID товара");
            }
        } else {
            console.error("Нет данных для отправки");
        }
    }

    async function loadCategories() {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/categories/");
            setCategories(response.data);
        } catch (error) {
            console.error('Ошибка получения категорий:', error);
        }
    }


    if (isLoading) return <div>Загрузка</div>

    if (isError) return <div>Ошибка загрузки данных</div>

    return (
        <div className={styles.ContainerForm}>
            <div className={styles.MainContainer}>
                <h1>Страница товара {id}</h1>
                <RedirectToAdminPanelButton/>
                {newItem &&
                    <form onSubmit={handleSubmit} className={styles.Form}>
                        <TextField
                            name={'title'}
                            label="Название"
                            value={newItem.title}
                            onChange={handleChange}
                            fullWidth
                        />
                        <TextField
                            name={'slug'}
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
                            renderInput={(params) => (
                                <TextField {...params} label="Категория" className={styles.Input}/>
                            )}
                            fullWidth
                        />
                        <TextField
                            name={'price'}
                            label="Цена"
                            type="number"
                            value={newItem.price}
                            onChange={handleChange}
                            fullWidth
                        />
                        <TextField
                            name={'description'}
                            label="Описание"
                            type="text"
                            value={newItem.description}
                            onChange={handleChange}
                            fullWidth
                        />
                        <FormGroup>
                            <FormControlLabel control={<Checkbox
                                checked={newItem.available}
                                onChange={(e) => setNewItem({...newItem, available: e.target.checked})}
                            />} label="Доступно"/>
                            <FormControlLabel control={<Checkbox
                                checked={newItem.preorder}
                                onChange={(e) => setNewItem({...newItem, preorder: e.target.checked})}
                            />} label="Предзаказ"/>
                        </FormGroup>
                        <TextField
                            name={'amount'}
                            label="Количество"
                            type="number"
                            value={newItem.amount}
                            onChange={handleChange}
                            fullWidth
                        />
                        <button className={styles.Button} type={'submit'}>Отправить</button>
                    </form>
                }
            </div>
        </div>
    )
}