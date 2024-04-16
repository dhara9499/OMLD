import './App.css';
import Footer from './pages/Footer/footer.jsx';
import Home from './pages/Home/Home.jsx';
import AddNewProducts from './pages/Product/AddNewProducts.jsx';
import {useStateContext} from "./context/ContextProvider.jsx";
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";

function App() {

  const {setToken} = useStateContext();
  const token = '3|LRIgNsLHdWmppohNXXdpifQwJHVGdzZROpOll9tp3b8c7fe0';

  setToken(token);

  return (
    <>
      <div>
      <Router>
          
          <div class="content">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path='/products/addNewProducts' element={<AddNewProducts />}/>
            </Routes>
          </div>
        </Router>
        <div class="footer">
          <Footer/>
        </div>
      </div>
    </>
  )
}

export default App
