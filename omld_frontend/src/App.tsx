import { useEffect, useState } from "react";
import {
    Route,
    Routes,
    useLocation,
    BrowserRouter as Router,
} from "react-router-dom";

import Loader from "./common/Loader";
import PageTitle from "./components/PageTitle";
import SignIn from "./pages/Authentication/SignIn";
import SignUp from "./pages/Authentication/SignUp";
import ECommerce from "./pages/Dashboard/ECommerce";
import FormElements from "./pages/Form/FormElements";
import FormLayout from "./pages/Form/FormLayout";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Tables from "./pages/Tables";
import Alerts from "./pages/UiElements/Alerts";
import Buttons from "./pages/UiElements/Buttons";
import React from "react";
import AddProducts from "./pages/Products/AddProducts";
import { useStateContext } from "./context/ContextProvider";
import ManageProducts from "./pages/Products/ManageProducts";
import AddAttributes from "./pages/Attributes/AddAttributes";
import ManageAttributes from "./pages/Attributes/ManageAttributes";
import AddAttribute from "./pages/Attributes/AddAttribute";

function App() {
    const [loading, setLoading] = useState<boolean>(true);
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    useEffect(() => {
        setTimeout(() => setLoading(false), 1000);
    }, []);

    // const { token, setToken } = useStateContext();

    // setToken(token);

    return loading ? (
        <Loader />
    ) : (
        <>
            <Routes>
                <Route
                    index
                    element={
                        <>
                            <PageTitle title="eCommerce Dashboard | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                            <ECommerce />
                        </>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <>
                            <PageTitle title="Profile | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                            <Profile />
                        </>
                    }
                />

                {/* products */}
                <Route
                    path="/products/add-products"
                    element={
                        <>
                            <PageTitle title="Add Products | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                            <AddProducts />
                        </>
                    }
                />
                <Route
                    path="/products/manage-products"
                    element={
                        <>
                            <PageTitle title="Add Products | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                            <ManageProducts />
                        </>
                    }
                />
                {/* products */}

                {/* attributes */}
                <Route
                    path="/attributes/add-attributes"
                    element={
                        <>
                            <PageTitle title="Add attributes | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                            <AddAttributes />
                        </>
                    }
                />
                <Route
                    path="/attributes/add-attribute"
                   Component={AddAttribute}
                />
                <Route
                    path="/attributes/manage-attributes"
                    element={
                        <>
                            <PageTitle title="Add attributes | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                            <ManageAttributes />
                        </>
                    }
                />
                {/* attributes */}

                <Route
                    path="/forms/form-elements"
                    element={
                        <>
                            <PageTitle title="Form Elements | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                            <FormElements />
                        </>
                    }
                />
                <Route
                    path="/forms/form-layout"
                    element={
                        <>
                            <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                            <FormLayout />
                        </>
                    }
                />
                <Route
                    path="/tables"
                    element={
                        <>
                            <PageTitle title="Tables | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                            <Tables />
                        </>
                    }
                />
                <Route
                    path="/settings"
                    element={
                        <>
                            <PageTitle title="Settings | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                            <Settings />
                        </>
                    }
                />
                
                <Route
                    path="/ui/alerts"
                    element={
                        <>
                            <PageTitle title="Alerts | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                            <Alerts />
                        </>
                    }
                />
                <Route
                    path="/ui/buttons"
                    element={
                        <>
                            <PageTitle title="Buttons | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                            <Buttons />
                        </>
                    }
                />
                <Route
                    path="/auth/signin"
                    element={
                        <>
                            <PageTitle title="Signin | Om Lights & Decor" />
                            <SignIn />
                        </>
                    }
                />
                <Route
                    path="/auth/signup"
                    element={
                        <>
                            <PageTitle title="Signup | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                            <SignUp />
                        </>
                    }
                />
            </Routes>
        </>
    );
}

export default App;
