import React, { useEffect, useRef, useState } from "react";
import Dropdown from "../../components/UiElements/Dropdown";
import TextBox from "../../components/UiElements/TextBox";
import Button1 from "../../components/UiElements/Button1";
import axiosClient from "../../axios-client";

const FinalDetails = (props: any) => {
    const [messages, setMessages] = useState<string[]>([]);
    const [discountType, setDiscountType] = useState<string>("1");
    const discountRef = useRef<HTMLInputElement>(null);
    const [grandTotal, setGrandTotal] = useState(0);
    const [discountGrandTotal, setDiscountGrandTotal] = useState(0);
    const [discount, setDiscount] = useState(0);
    let total = 0;

    const updateValue = (newValue, id) => {
        setDiscountType(newValue);
    };

    const updateGrandTotal = (discount) => {
        console.log(discountGrandTotal);
        if (discountGrandTotal) {
            setDiscountGrandTotal(0);
        }
        setDiscountGrandTotal(grandTotal - discount);
        setDiscount(discount);
    };

    useEffect(() => {
        // Accumulate the grand total in a local variable

        // Update the grand total after the loop completes
        setGrandTotal(total);
    }, [total]);

    const discountTypeOptions = [
        { key: "1", value: "Amount" },
        { key: "2", value: "Percentage" },
    ];

    const placeOrder = () => {
        console.log(props.custData);
        console.log(props.productData);
        console.log(discountGrandTotal);
        console.log(discount);
        console.log(discountType);
        const data = {
            custData: props.custData,
            productData: props.productData,
            grandTotal: discountGrandTotal ? discountGrandTotal : grandTotal,
            subTotal: grandTotal,
            discount: discount,
            discountType: discountType,
        };
        axiosClient
            .post("/addOrder", data)
            .then(({ data }) => {
                const response = data;
                console.log(data);
                console.log(response.status);
                if (response && response.status == 200) {
                    setMessages([response.message]);
                    console.log(response.orderData);
                    props.setOrderData(response.orderData);
                    console.log(69);
                    props.setActiveSection(3);
                }
            })
            .catch((err) => {
                const response = err.response;
                if (response && response.status === 422) {
                    setMessages([response.data.message]);
                }
            });
    };

    return (
        <div>
            <h2>Product Information</h2>

            <table className="border border-gray-300">
                <thead>
                    <tr>
                        {/* Dynamically creating headers */}
                        {Object.keys(props.productData[0]).map((key, index) => {
                            if (
                                !["id", "attributeId", "basePrice"].includes(
                                    key
                                )
                            ) {
                                return (
                                    <th
                                        className="border border-gray-300"
                                        key={index}
                                    >
                                        {key.charAt(0).toUpperCase() +
                                            key.slice(1)}
                                    </th>
                                );
                            }
                        })}
                    </tr>
                </thead>
                {/* <tbody>
            {
                props.productData.map((product, index) => {
                    const rowTotal = product.sellingPrice * product.qty;
                    total += rowTotal;
                    
                
                    return(   
                        <tr key={index}>
                            {Object.entries(product).map(([key, value]) => {
                                if(['id', 'attributeId', 'basePrice'].includes(key)) {
                                    return null;
                                }
                                if (value) {
                                    return <td className='border border-gray-300' key={key}>{String(value)}</td>;
                                }
                                return <td className='border border-gray-300'></td>;
                            })}
                            
                            <td key="rowTotal">{product.sellingPrice * product.qty}</td>
                        </tr>
                    
                    );
                })}
                <tr><td>{total}</td></tr>
            </tbody>  */}

                <tbody>
                    {(() => {
                        const rows = props.productData.map((product, index) => {
                            const rowTotal = product.sellingPrice * product.qty;
                            total += rowTotal;

                            return (
                                <tr key={index}>
                                    {Object.entries(product).map(
                                        ([key, value]) => {
                                            if (
                                                [
                                                    "id",
                                                    "attributeId",
                                                    "basePrice",
                                                ].includes(key)
                                            ) {
                                                return null;
                                            }
                                            if (value) {
                                                return (
                                                    <td
                                                        className="border border-gray-300"
                                                        key={key}
                                                    >
                                                        {String(value)}
                                                    </td>
                                                );
                                            }
                                            return (
                                                <td className="border border-gray-300"></td>
                                            );
                                        }
                                    )}
                                    <td key="rowTotal">
                                        {product.sellingPrice * product.qty}
                                    </td>
                                </tr>
                            );
                        });

                        return rows;
                    })()}
                    <tr>
                        <td>{total}</td>
                    </tr>
                </tbody>
            </table>

            <h2>Customer Information</h2>
            <p>
                {"Name: " +
                    props.custData.firstname +
                    " " +
                    props.custData.lastname}
            </p>
            <p>{"Email: " + props.custData.email}</p>

            <Dropdown
                id="discountType"
                value={discountType}
                updateValue={updateValue}
                label="Discount Type"
                options={discountTypeOptions}
            />

            <TextBox
                id="discount"
                label="Discount"
                ref={discountRef}
                placeholder="Enter Discount"
                onChange={(e) => {
                    updateGrandTotal(e.target.value);
                }}
            />

            <label>Grand Total:</label>
            <span>{discountGrandTotal ? discountGrandTotal : grandTotal}</span>

            <Button1 title="Place Order" onClick={placeOrder}></Button1>
        </div>
    );
};

export default FinalDetails;
