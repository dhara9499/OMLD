import {createBrowserRouter, Navigate} from "react-router-dom";
import DefaultLayout from "./components/DefaultLayout/DefaultLayout.jsx";
import GuestLayout from "./components//GuestLayout/GuestLayout.jsx";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Signup from "./pages/Signup";
import Home from './pages/Home/Home.jsx';
import AddNewProducts from './pages/Product/AddNewProducts.jsx';
import ProductsGrid from './pages/Product/ProductsGrid.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <DefaultLayout/>,
    children: [
      {
        path: '/dashboard',
        element: <Home/>
      },
      {
        path: '/products/addNewProducts',
        element: <AddNewProducts/>
      },
      {
        path: '/products/manageProducts',
        element: <ProductsGrid/>
      },
      {
        path: '/products',
        element: <ProductsGrid/>
      },
      {
        path: '/',
        element: <Home/>
      }
    ]
  },
  {
    path: '/',
    element: <GuestLayout/>,
    children: [
      {
        path: '/login',
        element: <Login/>
      },
      {
        path: '/signup',
        element: <Signup/>
      }
    ]
  },
  {
    path: "*",
    element: <NotFound/>
  }
])

export default router;
