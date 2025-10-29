import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DefaultLayout from "../../layout/DefaultLayout";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import PageTitle from "../../components/PageTitle";
import BackLink from "../../components/UiElements/BackLink";
import Sidebar from "../../components/Product/SideBar";
import General from "./General";
import Categories from "./Categories";
import Attributes from "./Attributes";
import axiosClient from "../../axios-client";

const AddProduct: React.FC = () => {
    const { id } = useParams();
    const [messages, setMessages] = useState<string[]>([]);
    const [activeSection, setActiveSection] = useState(0);
    const [completedSections, setCompletedSections] = useState<boolean[]>([false, false, false]);
    const [generalData, setGeneralData] = useState<any>(null);
    const [categoriesData, setCategoriesData] = useState<any>(null);
    const [attributesData, setAttributesData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const sections = ['General', 'Categories', 'Attributes'];

    useEffect(() => {
        if (id) {
            fetchProductData();
        }
    }, [id]);

    const fetchProductData = async () => {
        setIsLoading(true);
        try {
            const response = await axiosClient.get(`/getProduct/${id}`);
            const productData = response.data;
            setGeneralData(productData.general);
            setCategoriesData(productData.categories);
            setAttributesData(productData.attributes);
            setCompletedSections([true, true, true]);
        } catch (error) {
            console.error('Error fetching product data:', error);
            setMessages(['Error loading product data']);
        }
        setIsLoading(false);
    };

    const handleSectionChange = (index: number) => {
        setActiveSection(index);
    };

    const handleGeneralSubmit = (data: any) => {
        setGeneralData(data);
        setCompletedSections([true, false, false]);
        setActiveSection(1);
    };

    const handleCategoriesSubmit = (data: any) => {
        setCategoriesData(data);
        setCompletedSections([true, true, false]);
        setActiveSection(2);
    };

    const handleAttributesSubmit = (data: any) => {
        setAttributesData(data);
        setCompletedSections([true, true, true]);
    };

    const renderSection = () => {
        if (isLoading) {
            return <div>Loading...</div>;
        }

        switch (activeSection) {
            case 0:
                return (
                    <General
                        setGeneralData={handleGeneralSubmit}
                        productData={generalData}
                        isEdit={!!id}
                    />
                );
            case 1:
                return (
                    <Categories
                        setCategoriesData={handleCategoriesSubmit}
                        categoriesData={categoriesData}
                        productData={generalData}
                    />
                );
            case 2:
                return (
                    <Attributes
                        setAttributesData={handleAttributesSubmit}
                        attributesData={attributesData}
                        productData={generalData}
                        categoriesData={categoriesData}
                        isEdit={!!id}
                    />
                );
            default:
                return (
                    <General
                        setGeneralData={handleGeneralSubmit}
                        productData={generalData}
                        isEdit={!!id}
                    />
                );
        }
    };

    return (
        <DefaultLayout>
            <Breadcrumb pageName={id ? "Edit Product" : "Add Product"} />
            <PageTitle title={id ? "Edit Product" : "Add Product"} />
            <div className="flex justify-end">
                <BackLink to="/products/manage-products"></BackLink>
            </div>
            <div className="flex h-screen overflow-hidden border">
                <Sidebar sections={sections} onSectionClick={handleSectionChange} completedSections={completedSections} />
                <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
                    <form
                        onSubmit={(e) => e.preventDefault()}
                        encType="multiple/form-data"
                    >
                        {renderSection()}
                    </form>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default AddProduct;
