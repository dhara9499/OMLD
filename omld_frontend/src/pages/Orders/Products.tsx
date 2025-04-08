import React, { useEffect, useState } from "react";
import axiosClient from "../../axios-client";
import CheckboxTwo from "../../components/Checkboxes/CheckboxTwo";
import Button1 from "../../components/UiElements/Button1";

const Products = (props: any) => {
    const [messages, setMessages] = useState<string[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [checkedProducts, setCheckedProducts] = useState<any[]>([]);
    const [selectedIds, setSelectedIds] = useState<any[]>([]);

    // console.log(props.productData);
    // console.log(props.productIds);

    const updateValue = (id, isChecked) => {
        if (isChecked) {
            if (props.productIds) {
                setSelectedIds(selectedIds.concat(props.productIds));
            }

            setSelectedIds((prevSelectedIds) => {
                if (prevSelectedIds.includes(id)) {
                    // Remove the element if it already exists
                    return prevSelectedIds.filter(
                        (selectedId) => selectedId !== id
                    );
                } else {
                    // Add the new element
                    return [...prevSelectedIds, id];
                }
            });
        } else {
            setSelectedIds((prevSelectedIds) =>
                prevSelectedIds.filter((selectedId) => selectedId !== id)
            );
        }
    };

    const updateSelectedProducts = () => {
        const updatedProducts = selectedIds.map((id) => {
            return products.find((product) => product.id === id);
        });
        console.log(updatedProducts);
        props.setProductIds(selectedIds);
        props.setProductData(updatedProducts);
    };

    useEffect(() => {
        const getProducts = async () => {
            await axiosClient
                .get("/getProducts")
                .then(({ data }) => {
                    setProducts(data);
                    console.log(data);
                })
                .catch((err) => {
                    const response = err.response;
                    if (response && response.status === 422) {
                        setMessages([response.data.message]);
                    }
                });
        };

        // Call the async function
        getProducts();
    }, []);

    const handleOnClick = async () => {
        await updateSelectedProducts();
        props.setActiveSection(1);
        console.log(checkedProducts);
    };

    // useEffect(() => {
    //   console.log("Updated checkedProducts:", checkedProducts);

    // }, [checkedProducts]);

    return (
        <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
            <Button1 title="Add Products" onClick={handleOnClick}></Button1>
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>Name</th>
                        <th>SKU</th>
                        <th>Price</th>
                        <th>Qty</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {products &&
                        products.length > 0 &&
                        products.map((product) => (
                            <tr className="text-left">
                                <td className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                                    <CheckboxTwo
                                        id={product.id}
                                        updateValue={updateValue}
                                        defaultChecked={
                                            props.productIds.includes(
                                                product.id
                                            )
                                                ? true
                                                : false
                                        }
                                    />
                                </td>
                                <td className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                                    {product.name}
                                </td>
                                <td>{product.sku}</td>
                                <td>{product.sellingPrice}</td>
                                <td>{product.qty}</td>
                                <td></td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
};

export default Products;
