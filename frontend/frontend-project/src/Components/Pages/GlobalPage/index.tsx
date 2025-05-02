import GeneralSlider from "../../GeneralSlider";
import CardsContainer from "../../CardsContainer";
import axios from "axios";
import {useQuery} from "@tanstack/react-query";

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
    photos: Photo[];
}

export default function GlobalPage() {
    async function fetchData() {
        const {data} = await axios.get("http://127.0.0.1:8000/api/items/");
        return data;
    }

    const {data, isLoading, isError} = useQuery<Item[]>({
        queryKey: ['products'],
        queryFn: fetchData,
    });

    if (isLoading) {
        return <div>Загрузка...</div>;
    }

    if (isError) {
        return <div>Ошибка загрузки данных</div>;
    }

    return (
        <>
            <GeneralSlider />
            {data && <CardsContainer data={data}/>}
        </>
    )
}