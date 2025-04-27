import './App.css'
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import {Route, Routes} from "react-router";
import GlobalPage from "./Components/GlobalPage";
import AboutUsPage from "./Components/AboutUsPage";
import AdminPanel from "./Components/Admin/AdminPanel";
import AddItemPage from "./Components/Admin/AddItemPage";
import UpdateItemPage from "./Components/Admin/UpdateItemPage";

function App() {

    return (
        <>
            <Header/>
            <Routes>
                <Route path={'/admin'} element={<AdminPanel/>} />
                <Route path={'/admin/add'} element={<AddItemPage/>} />
                <Route path={'/admin/update/:id'} element={<UpdateItemPage />} />
                <Route index element={<GlobalPage/>}/>
                <Route path={'/about'} element={<AboutUsPage/>}/>
            </Routes>
            <Footer/>
        </>
    )
}

export default App
