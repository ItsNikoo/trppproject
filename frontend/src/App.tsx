import './App.module.css'
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import {Route, Routes, useLocation} from "react-router";
import GlobalPage from "./Components/Pages/GlobalPage";
import AboutUsPage from "./Components/Pages/AboutUsPage";
import AdminPanel from "./Components/Admin/AdminPanel";
import AddItemPage from "./Components/Admin/AddItemPage";
import UpdateItemPage from "./Components/Admin/UpdateItemPage";
import ItemPage from "./Components/Pages/ItemPage";
import AddCategoryPage from "./Components/Admin/AddCategoryPage";
import UpdateCategoryPage from "./Components/Admin/UpdateCategoryPage";
import {useEffect} from "react";
import CatalogPage from "./Components/Pages/CatalogPage";
import styles from "./App.module.css";

function PageWrapper({children}: { children: React.ReactNode }) {
    return (
        <div className={styles.MainContainer}>
            {children}
        </div>
    )
}

function App() {
    const location = useLocation()

    useEffect(() => {
        switch (location.pathname) {
            case '/admin':
                document.title = 'Admin Panel'
                break
            default:
                document.title = 'Homme + Less'
        }

    }, [location]);

    return (
        <>
            <Header/>
            <PageWrapper>
                <Routes>
                    <Route path={'/admin'} element={<AdminPanel/>}/>
                    <Route path={'/admin/add'} element={<AddItemPage/>}/>
                    <Route path={"admin/add_category"} element={<AddCategoryPage/>}/>
                    <Route path={"/admin/update_category/:id"} element={<UpdateCategoryPage/>}/>
                    <Route path={'/admin/update/:id'} element={<UpdateItemPage/>}/>
                    <Route index element={<GlobalPage/>}/>
                    <Route path={"/catalog"} element={<CatalogPage/>}/>
                    <Route path="/:categorySlug/:itemSlug" element={<ItemPage/>}/>
                    <Route path={'/about'} element={<AboutUsPage/>}/>
                </Routes>
            </PageWrapper>
            <Footer/>
        </>
    )
}

export default App
