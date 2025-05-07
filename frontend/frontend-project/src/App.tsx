import './App.css'
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import {Route, Routes} from "react-router";
import GlobalPage from "./Components/Pages/GlobalPage";
import AboutUsPage from "./Components/AboutUsPage";
import AdminPanel from "./Components/Admin/AdminPanel";
import AddItemPage from "./Components/Admin/AddItemPage";
import UpdateItemPage from "./Components/Admin/UpdateItemPage";
import ItemPage from "./Components/Pages/ItemPage";
import AddCategoryPage from "./Components/Admin/AddCategoryPage";
import UpdateCategoryPage from "./Components/Admin/UpdateCategoryPage";

function App() {

    return (
        <>
            <Header/>
            <Routes>
                <Route path={'/admin'} element={<AdminPanel/>}/>
                <Route path={'/admin/add'} element={<AddItemPage/>}/>
                <Route path={"admin/add_category"} element={<AddCategoryPage/>}/>
                <Route path={"/admin/update_category/:id"} element={<UpdateCategoryPage />} />
                <Route path={'/admin/update/:id'} element={<UpdateItemPage/>}/>
                <Route index element={<GlobalPage/>}/>
                <Route path="/:categorySlug/:itemSlug" element={<ItemPage/>}/>
                <Route path={'/about'} element={<AboutUsPage/>}/>
            </Routes>
            <Footer/>
        </>
    )
}

export default App
