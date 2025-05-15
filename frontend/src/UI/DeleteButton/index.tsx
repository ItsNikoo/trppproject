import axios from "axios";
import {useQueryClient} from "@tanstack/react-query";
import styles from "./DeleteButton.module.css"

export default function DeleteButton({id}: { id: number }) {
    const queryClient = useQueryClient();

    async function deleteItem() {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/items/${id}/`)
            console.log(`Вещь с ID ${id} удалена`);
            queryClient.invalidateQueries({queryKey: ['products']});
        } catch (error) {
            console.error('Ошибка удаления:', error);
            alert('Что-то пошло не так');
        }
    }

    return <button className={styles.Button} onClick={deleteItem}>Удалить</button>
}