import React, {
    createRef,
    FormEvent,
    useRef,
    useState,
    useEffect,
    act,
} from "react";
import DefaultLayout from "../../layout/DefaultLayout";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import Button1 from "../../components/UiElements/Button1";
import PageTitle from "../../components/PageTitle";
import BackLink from "../../components/UiElements/BackLink";
import TextBox from "../../components/UiElements/TextBox";
import Dropdown from "../../components/UiElements/Dropdown";
import AlertsRed from "../../components/UiElements/AlertsRed";
import axios from "axios";
import axiosClient from "../../axios-client";
import Sidebar from "../../components//Product/SideBar";
import Products from "./Products";
import Customers from "./Customers";
import Details from "./FinalDetails";
import PrintOrder from "./PrintOrder";

const AddOrder: React.FC = () => {
    const [messages, setMessages] = useState<string[]>([]);

    const [rows, setRows] = useState<any>([]);

    const handleErrorClose = () => {
        setMessages([]);
    };

    const [activeSection, setActiveSection] = useState(0);
    const [productData, setProductData] = useState<any>(null);
    const [productIds, setProductIds] = useState<any[]>([]);
    const [custData, setCustData] = useState<any>(null);
    const [orderData, setOrderData] = useState<any>(null);

    const renderSection = () => {
        switch (activeSection) {
            case 0:
                return (
                    <Products
                        setActiveSection={setActiveSection}
                        productData={productData}
                        setProductData={setProductData}
                        custData={custData}
                        setCustData={setCustData}
                        productIds={productIds}
                        setProductIds={setProductIds}
                    />
                );
            case 1:
                return (
                    <Customers
                        setActiveSection={setActiveSection}
                        custData={custData}
                        setCustData={setCustData}
                        productData={productData}
                        setProductData={setProductData}
                        productIds={productIds}
                        setProductIds={setProductIds}
                    />
                );
            case 2:
                return (
                    <Details
                        setActiveSection={setActiveSection}
                        productData={productData}
                        setProductData={setProductData}
                        custData={custData}
                        setCustData={setCustData}
                        productIds={productIds}
                        setProductIds={setProductIds}
                        orderData={orderData}
                        setOrderData={setOrderData}
                    />
                );
            case 3:
                return (
                    <PrintOrder
                        setActiveSection={setActiveSection}
                        orderData={orderData}
                        setOrderData={setOrderData}
                    />
                );
            default:
                return (
                    <Products
                        setActiveSection={setActiveSection}
                        productData={productData}
                        setProductData={setProductData}
                        custData={custData}
                        setCustData={setCustData}
                        productIds={productIds}
                        setProductIds={setProductIds}
                    />
                );
        }
    };

    console.log(activeSection);

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Add Order" />
            <PageTitle title="Add Order" />
            <div className="flex justify-end">
                <BackLink to="/orders/manage-orders"></BackLink>
            </div>
            <div className="flex h-screen overflow-hidden border">
                {/* Form */}
                <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
                    {renderSection()}
                </div>
            </div>
        </DefaultLayout>
    );
};

export default AddOrder;
