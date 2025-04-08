import React, { useEffect, useState } from 'react';
import axiosClient from '../../axios-client';


const Categories = () => {
    const [messages, setMessages] = useState<string[]>([]);
    const [categories, setCategories] = useState<
        { key: string | number; value: string | number }[]
    >([]);
    
    const [category, setCategory] = useState<string>("");
    const fetchCategories = async () => {
        await axiosClient
        .get("/getCategories")
        .then(({ data }) => {
            console.log(data);
            setCategories(data);
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

    return (
    <div>
      Categories section
    </div>
  );
};

export default Categories;