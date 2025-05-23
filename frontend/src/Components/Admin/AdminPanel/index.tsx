import axios from "axios";
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import styles from "./AdminPanel.module.css";
import DeleteButton from "../../../UI/DeleteButton";
import PATCHButton from "../../../UI/PATCHButton";
import CategoriesBar from "../CategoriesBar";
import Switch from "@mui/material/Switch";


interface Photo {
    id: number;
    photo_url: string;
}

interface Item {
    id: number;
    title: string;
    slug: string;
    is_featured: boolean;
    category: string;
    price: number;
    available: boolean;
    preorder: boolean;
    photos?: Photo[];
}

export default function AdminPanel() {
    const queryClient = useQueryClient();

    async function fetchData() {
        try {
            const {data} = await axios.get("http://127.0.0.1:8000/api/items/");
            return data;
        } catch (error) {
            console.log(error)
        }
    }

    const {data, isLoading, isError} = useQuery<Item[]>({
        queryKey: ['products'],
        queryFn: fetchData,
    });

    const mutation = useMutation({
        mutationFn: async ({id, is_featured, available, preorder}: {
            id: number,
            is_featured?: boolean,
            available?: boolean,
            preorder?: boolean
        }) => {
            const payload: Partial<Item> = {
                is_featured: is_featured,
                available: available,
                preorder: preorder
            };

            return axios.patch(`http://127.0.0.1:8000/api/items/${id}/`, payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['products']});
        }
    });


    if (isLoading) {
        return <div>Загрузка...</div>;
    }

    if (isError) {
        return <div>Ошибка загрузки данных</div>;
    }

    return (
        <div>
            <h1>Админ панель</h1>
            <CategoriesBar/>
            {data && <div className={styles.CardsContainer}>
                {data.map((item => (
                    <div className={styles.Card} key={item.id}>
                        {item.photos && item.photos.length > 0 && (
                            <img className={styles.ImageContainer} src={item.photos[0].photo_url} alt=""/>
                        )}
                        <div className={styles.InfoContainer}>
                            <h1>{item.title}</h1>
                            <p>{item.category}</p>
                            <p>{item.price}</p>
                        </div>
                        <div className={styles.ButtonsContainer}>
                            <DeleteButton id={item.id}/>
                            <PATCHButton id={item.id}/>
                        </div>
                        <div>
                            <label>На первой полосе</label>
                            <Switch
                                checked={item.is_featured}
                                onChange={() =>
                                    mutation.mutate({
                                        id: item.id,
                                        is_featured: !item.is_featured
                                    })
                                }
                                color="primary"
                            />
                        </div>
                        <div>
                            <label>В наличии</label>
                            <Switch
                                checked={item.available}
                                onChange={() =>
                                    mutation.mutate({
                                        id: item.id,
                                        available: !item.available
                                    })
                                }
                                color="primary"
                            />
                        </div>
                        <div>
                            <label>Предзаказ</label>
                            <Switch
                                checked={item.preorder}
                                onChange={() =>
                                    mutation.mutate({
                                        id: item.id,
                                        preorder: !item.preorder
                                    })
                                }
                                color="primary"
                            />
                        </div>
                    </div>
                )))}
            </div>
            }
        </div>
    )
}