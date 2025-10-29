import React, { useEffect, useState } from "react";
import DefaultLayout from "../../layout/DefaultLayout";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import Button1 from "../../components/UiElements/Button1";
import axiosClient from "../../axios-client";
import TableThree from "../../components/Tables/TableThree";

const ManageProducts = () => {
    const [messages, setMessages] = useState<string[]>([]);
    const [data, setData] = useState<any[]>([]);
    const [displayColumns, setDisplayColumns] = useState<any[]>([]);
    const [columnsTitle, setColumnsTitle] = useState<any[]>([]);
    const [filters, setFilters] = useState<any>({});
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [paginatedData, setPaginatedData] = useState<any[]>([]);

    useEffect(() => {
        const getProducts = async () => {
            await axiosClient
                .get(`/getProducts`)
                .then(({ data }) => {
                    setData(data);
                    setFilteredData(data);
                    setDisplayColumns(["sku", "name", "qty", "sellingPrice"]);
                    setColumnsTitle(["Sku", "Name", "Qty", "Price"]);
                })
                .catch((err) => {
                    const response = err.response;
                    if (response && response.status === 422) {
                        setMessages([response.data.message]);
                    }
                });
        };
        getProducts();
    }, []);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>, column: string) => {
        setFilters({
            ...filters,
            [column]: e.target.value,
        });
    };

    useEffect(() => {
        let filtered = data;
        Object.keys(filters).forEach((key) => {
            filtered = filtered.filter((item) =>
                item[key]?.toString().toLowerCase().includes(filters[key].toLowerCase())
            );
        });
        setFilteredData(filtered);
        setCurrentPage(1);
    }, [filters, data]);

    useEffect(() => {
        const totalPages = Math.ceil(filteredData.length / 10);
        setTotalPages(totalPages);
        const paginated = filteredData.slice((currentPage - 1) * 10, currentPage * 10);
        setPaginatedData(paginated);
    }, [filteredData, currentPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Manage Products" />
            <div className="flex justify-end mb-2">
                <Button1 title="Add New Product" path="/products/add-product" />
            </div>
            <TableThree
                data={paginatedData}
                displayColumns={displayColumns}
                columnsTitle={columnsTitle}
                filters={filters}
                handleFilterChange={handleFilterChange}
            />
            <div className="flex justify-between items-center mt-4">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border rounded-md"
                >
                    Previous
                </button>
                <span>
                    Page {currentPage} of {totalPages || 1}
                </span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="px-4 py-2 border rounded-md"
                >
                    Next
                </button>
            </div>
        </DefaultLayout>
    );
};

export default ManageProducts;
