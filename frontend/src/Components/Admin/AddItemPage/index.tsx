import {useState, useEffect} from "react";
import styles from "./AddItemPage.module.css";
import {useQueryClient} from "@tanstack/react-query";
import axios from "axios";
import {Autocomplete, TextField, Checkbox, FormGroup, FormControlLabel} from "@mui/material";
import RedirectToAdminPanelButton from "../../../UI/RedirectToAdminPanelButton";
import {useNavigate} from "react-router";
import UploadFilesArea from "../../../UI/UploadFilesArea";

interface Photo {
    id: number;
    photo_url: string;
}

interface NewItem {
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

interface ApiError {
    response?: {
        status: number;
        data: {
            message?: string;
        };
    };
    message: string;
}

export default function AddItemPage() {
    const [newItem, setNewItem] = useState<NewItem>({
        title: "",
        slug: "",
        category: "",
        description: "",
        price: 0,
        available: false,
        preorder: false,
        amount: 0,
        photos: [], // Инициализируем как пустой массив
    });
    const [categories, setCategories] = useState<Category[]>([]);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    useEffect(() => {
        loadCategories();
    }, []);

    async function createItem(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        try {
            const itemToSend = {
                ...newItem,
                photos: newItem.photos?.map((photo) => ({
                    id: photo.id,
                    photo_url: photo.photo_url,
                })) || [],
            };

            console.log("Отправляемые данные:", itemToSend);
            await axios.post("http://127.0.0.1:8000/api/items/", itemToSend);
            queryClient.invalidateQueries({queryKey: ["products"]});
            setNewItem({
                title: "",
                slug: "",
                category: "",
                description: "",
                price: 0,
                available: false,
                preorder: false,
                amount: 0,
                photos: [],
            });
            navigate("/admin");
        } catch (err: unknown) {
            const error = err as ApiError;
            if (error.response?.status === 400) {
                setError(error.response.data?.message || "Неверные данные. Проверьте введенные значения.");
            } else {
                console.error("Ошибка добавления:", error.message);
                setError("Произошла ошибка при добавлении товара");
            }
        }
    }

    async function loadCategories() {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/categories/");
            setCategories(response.data);
        } catch (error) {
            console.error("Ошибка получения категорий:", error);
            setError("Ошибка загрузки категорий");
        }
    }

    return (
        <div className={styles.ContainerForm}>
            <RedirectToAdminPanelButton/>
            <h1>Добавить товар</h1>
            <form onSubmit={createItem} className={styles.Form}>
                <TextField
                    label="Название"
                    value={newItem.title}
                    onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                    fullWidth
                />
                <TextField
                    label="Slug"
                    value={newItem.slug}
                    onChange={(e) => setNewItem({...newItem, slug: e.target.value})}
                    fullWidth
                />
                <Autocomplete
                    options={categories}
                    getOptionLabel={(option) => option.category_name}
                    onChange={(_, value) => setNewItem({...newItem, category: value?.category || ""})}
                    renderInput={(params) => (
                        <TextField {...params} label="Категория" className={styles.Input}/>
                    )}
                    fullWidth
                />
                <TextField
                    label="Описание"
                    value={newItem.description}
                    onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                    multiline
                    rows={4}
                    fullWidth
                />
                <TextField
                    type="number"
                    label="Цена"
                    value={newItem.price}
                    onChange={(e) => setNewItem({...newItem, price: Number(e.target.value)})}
                    fullWidth
                />
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={newItem.available}
                                onChange={(e) => setNewItem({...newItem, available: e.target.checked})}
                            />
                        }
                        label="Доступно"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={newItem.preorder}
                                onChange={(e) => setNewItem({...newItem, preorder: e.target.checked})}
                            />
                        }
                        label="Предзаказ"
                    />
                </FormGroup>
                <TextField
                    type="number"
                    label="Количество"
                    value={newItem.amount}
                    onChange={(e) => setNewItem({...newItem, amount: Number(e.target.value)})}
                    fullWidth
                />
                <UploadFilesArea
                    folder={newItem.slug}
                    onUploadSuccess={(photos) => {
                        setNewItem((prev) => ({
                            ...prev,
                            photos: photos,
                        }));
                    }}
                />
                {error && <div className={styles.Error}>{error}
                </div>
                }
                <button className={styles.Button} type="submit">
                    Добавить продукт
                </button>
            </form>
        </div>
    )
        ;
}