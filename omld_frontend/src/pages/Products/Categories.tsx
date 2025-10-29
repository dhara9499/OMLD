import React, { useEffect, useState } from 'react';
import axiosClient from '../../axios-client';
import CategoryTree from './CategoryTree';
import Button1 from '../../components/UiElements/Button1';

const Categories = ({ setCategoriesData, categoriesData, productData }) => {
    const [messages, setMessages] = useState<string[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<any[]>(categoriesData || []);

    const fetchCategories = async () => {
        await axiosClient
            .get("/getCategories")
            .then(({ data }) => {
                setCategories(data.categories);
            })
            .catch((err) => {
                const response = err.response;
                if (response && response.status === 422) {
                    setMessages([response.data.message]);
                }
            });
    }

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setCategoriesData(selectedCategories);
    };

    return (
        <div className='p-6'>
            <CategoryTree data={categories} selectedCategories={selectedCategories} setSelectedCategories={setSelectedCategories} />
            <Button1 title={'Next'} onClick={handleSubmit} />
        </div>
    );
};

export default Categories;


