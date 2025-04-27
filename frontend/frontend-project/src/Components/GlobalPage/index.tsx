import GeneralSlider from "../GeneralSlider";
import CardsContainer from "../CardsContainer";
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
    category: string;
    price: number;
    available: boolean;
    preorder: boolean;
    photos: Photo[];
}

const slides = [
    {
        title: "Title 1",
        description: "Description of title 1",
    },
    {
        title: "Title 2",
        description: "Description of title 2",
    },
    {
        title: "Title 3",
        description: "Description of title 3",
    }
]


export default function GlobalPage() {
    async function fetchData() {
        const {data} = await axios.get("http://127.0.0.1:8000/api/items/");
        console.log(data)
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
            <GeneralSlider slides={slides}/>
            {data && <CardsContainer data={data}/>}
        </>
    )
}