import styles from "./CategoryCard.module.css"
import garbageicon from '../../../../assets/delete-circled-outline-svgrepo-com.svg';
import editicon from '../../../../assets/pen-svgrepo-com.svg';
import axios from "axios";
import {useQueryClient} from "@tanstack/react-query";
import {useNavigate} from "react-router";

interface Category {
    id: number;
    category: string;
    category_name: string;
}

export default function CategoryCard({category}: { category: Category }) {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    async function deleteCategory() {
        await axios.delete(`http://127.0.0.1:8000/api/categories/${category.id}/`)
        console.log(`Категория ${category.id} удалена`);
        queryClient.invalidateQueries({queryKey: ['categories']});
    }

    function redirect(){
        navigate(`/admin/update_category/${category.id}`)
    }

    return (
        <div key={category.id} className={styles.Card}>
            <div>
                <h2 className={styles.Title}>{category.category_name}</h2>
                <p className={styles.Slug}>{category.category}</p>
            </div>
            <button className={styles.Button} onClick={redirect}>
                <img src={editicon} width={25} height={25} alt=""/>
            </button>
            <button className={styles.Button} onClick={deleteCategory}>
                <img src={garbageicon} width={30} height={30} alt=""/>
            </button>
        </div>
    )

}