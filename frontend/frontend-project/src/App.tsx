import './App.css'
import Header from "./Components/Header";
import GeneralSlider from "./Components/GeneralSlider";
import CardsContainer from "./Components/CardsContainer";
import Footer from "./Components/Footer";

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

function App() {

    return (
        <>
            <Header/>
            <GeneralSlider slides={slides} />
            <CardsContainer/>
            <Footer/>
        </>
    )
}

export default App
