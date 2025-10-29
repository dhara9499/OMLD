import React, { useEffect, useState } from "react";
import DefaultLayout from "../../layout/DefaultLayout";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import TableThree from "../../components/Tables/TableThree";
import Button1 from "../../components/UiElements/Button1";
import axiosClient from "../../axios-client";
import { useNavigate } from "react-router-dom";

const ManageAttributes: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [displayColumns, setDisplayColumns] = useState<any[]>([]);
    const [columnsTitle, setColumnsTitle] = useState<any[]>([]);
    const [filters, setFilters] = useState<any>({});
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [paginatedData, setPaginatedData] = useState<any[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const getAttributes = async () => {
            await axiosClient
                .get("/getAttributes")
                .then(({ data }) => {
                    setData(data);
                    setFilteredData(data);
                    setDisplayColumns([
                        "frontendLabel",
                        "entityTypeCode",
                        "frontendType",
                        "backendType",
                        "defaultValue",
                    ]);
                    setColumnsTitle([
                        "Attribute Code",
                        "Entity",
                        "Frontend Type",
                        "Backend Type",
                        "Default Value",
                    ]);
                })
                .catch((err) => {
                    console.error(err);
                });
        };
        getAttributes();
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

    const handleEdit = (attribute: any) => {
        navigate(`/attributes/add-attribute/${attribute.attributeId}`);
    };

    const handleDelete = async (attribute: any) => {
        if (window.confirm(`Are you sure you want to delete attribute: ${attribute.frontendLabel}?`)) {
            try {
                await axiosClient.post(`/deleteAttribute/${attribute.attributeId}`);
                // Refresh data after deletion
                const getAttributes = async () => {
                    await axiosClient
                        .get("/getAttributes")
                        .then(({ data }) => {
                            setData(data);
                            setFilteredData(data);
                        })
                        .catch((err) => {
                            console.error(err);
                        });
                };
                console.log(data);
                getAttributes();
            } catch (error) {
                console.error("Error deleting attribute:", error);
                alert("Failed to delete attribute.");
            }
        }
    };

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Manage Attributes" />
            <div className="flex justify-end mb-2">
                <Button1
                    title="Add New Attribute"
                    path="/attributes/add-attribute"
                />
            </div>
            <TableThree
                data={paginatedData}
                displayColumns={displayColumns}
                columnsTitle={columnsTitle}
                filters={filters}
                handleFilterChange={handleFilterChange}
                onEditClick={handleEdit}
                onDeleteClick={handleDelete}
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

export default ManageAttributes;
