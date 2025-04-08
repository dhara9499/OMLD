import React, { useEffect, useState } from "react";

import DefaultLayout from "../../layout/DefaultLayout";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import TableThree from "../../components/Tables/TableThree";
import Button1 from "../../components/UiElements/Button1";
import axiosClient from "../../axios-client";

// Status badge component
const StatusBadge = () => {
    let bgColor = "";
    let textColor = "text-white";

    return (
        <span
            className={`${bgColor} ${textColor} text-xs font-medium px-3 py-1 rounded-full`}
        >
            Delivered
        </span>
    );
};

const OrderItem = ({ item }) => {
    return (
        <div className="py-2 border-b border-gray-200 flex justify-between items-center">
            <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{item.name}</p>
            </div>
            <p className="text-sm text-gray-600 mr-4">x{item.qty}</p>
            <p className="text-sm font-medium text-gray-800">{item.rowTotal}</p>
        </div>
    );
};

const ManageOrders = () => {
    const [messages, setMessages] = useState<string[]>([]);
    const [data, setData] = useState<any[]>([]);
    const [displayColumns, setDisplayColumns] = useState<any[]>([]);
    const [columnsTitle, setColumnsTitle] = useState<any[]>([]);

    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    useEffect(() => {
        const getProducts = async () => {
            await axiosClient
                .get("/getOrders")
                .then(({ data }) => {
                    setData(data);
                    setFilteredOrders(data);
                    setDisplayColumns(["sku", "name", "qty", "sellingPrice"]);
                    setColumnsTitle(["Sku", "Name", "Qty", "Price"]);
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
        // fetchOptions();
    }, []);

    // useEffect(() => {
    //     console.log(filteredOrders);
    //     const results = filteredOrders.filter((order) => {
    //         // var orderId = order.orderId.toString();
    //         // console.log("Order Id : " + orderId);
    //         // console.log("search query : " + searchQuery);
    //         // console.log("condition : " + orderId.includes(searchQuery));
    //         return String(order.orderId).includes(searchQuery);
    //     });
    //     console.log(results);
    //     setFilteredOrders(results);
    //     setCurrentPage(1);
    // }, [searchQuery]);

    const indexOfLastOrder = currentPage * itemsPerPage;
    const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;

    console.log(filteredOrders);
    console.log(data);
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const currentOrders = filteredOrders.slice(
        indexOfFirstOrder,
        indexOfLastOrder
    );

    // Handle order expansion
    const toggleOrderExpansion = (orderId) => {
        setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
    };

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Manage Orders" />
            <div className="flex justify-end mb-2">
                <Button1 title="Add New Order" path="/orders/add-order" />
            </div>

            <div className="bg-gray-100 min-h-screen">
                {/* Header */}
                <div className="bg-white px-4 py-4 shadow-sm">
                    <h1 className="text-xl font-bold text-gray-800 mb-2">
                        Orders
                    </h1>

                    {/* Search bar */}
                    <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                        <input
                            type="text"
                            className="flex-1 ml-2 bg-transparent focus:outline-none text-gray-800"
                            placeholder="Search by customer or order #"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Order list */}
                <div className="p-4">
                    {currentOrders.length === 0 ? (
                        <div className="flex items-center justify-center py-8">
                            <p className="text-gray-500">No orders found</p>
                        </div>
                    ) : (
                        currentOrders.map((order: any) => (
                            <div
                                key={order.orderId}
                                className="mb-4 bg-white rounded-lg shadow-sm overflow-hidden"
                            >
                                {/* Order header */}
                                <div
                                    onClick={() =>
                                        toggleOrderExpansion(order.orderId)
                                    }
                                    className="flex items-center justify-between p-4 bg-white cursor-pointer"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center mb-1">
                                            <span className="text-lg font-bold text-gray-800 mr-2">
                                                #{order.orderId}
                                            </span>
                                            <StatusBadge />
                                        </div>
                                        {/* <p className="text-sm text-gray-600">{order.customer}</p> */}
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-gray-800">
                                            {order.grandTotal}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {order.created_at}
                                        </p>
                                    </div>
                                    <div className="ml-2">
                                        {expandedOrderId === order.orderId ? (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 text-gray-500"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M5 15l7-7 7 7"
                                                />
                                            </svg>
                                        ) : (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 text-gray-500"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 9l-7 7-7-7"
                                                />
                                            </svg>
                                        )}
                                    </div>
                                </div>

                                {/* Order items (expandable) */}
                                {expandedOrderId === order.orderId && (
                                    <div className="px-4 pb-4 bg-gray-50">
                                        <div className="py-2 border-t border-gray-200">
                                            <p className="text-xs font-medium uppercase text-gray-500 mb-2">
                                                Order Items
                                            </p>
                                            {order.orderItems.map((item) => (
                                                <OrderItem
                                                    key={item.id}
                                                    item={item}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between bg-white px-4 py-3 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                        Showing{" "}
                        {filteredOrders.length > 0 ? indexOfFirstOrder + 1 : 0}-
                        {Math.min(indexOfLastOrder, filteredOrders.length)} of{" "}
                        {filteredOrders.length}
                    </div>
                    <div className="flex items-center">
                        <button
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`p-2 rounded-l-md border border-gray-300 ${
                                currentPage === 1
                                    ? "bg-gray-100 cursor-not-allowed"
                                    : "bg-white hover:bg-gray-50"
                            }`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={`h-5 w-5 ${
                                    currentPage === 1
                                        ? "text-gray-300"
                                        : "text-gray-500"
                                }`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </button>

                        <span className="px-3 py-2 border-t border-b border-gray-300 bg-white">
                            {currentPage}
                        </span>

                        <button
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={
                                currentPage === totalPages || totalPages === 0
                            }
                            className={`p-2 rounded-r-md border border-gray-300 ${
                                currentPage === totalPages || totalPages === 0
                                    ? "bg-gray-100 cursor-not-allowed"
                                    : "bg-white hover:bg-gray-50"
                            }`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={`h-5 w-5 ${
                                    currentPage === totalPages ||
                                    totalPages === 0
                                        ? "text-gray-300"
                                        : "text-gray-500"
                                }`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default ManageOrders;
