import React, { useEffect, useState } from "react";
import DefaultLayout from "../../layout/DefaultLayout";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import TableThree from "../../components/Tables/TableThree";
import Button1 from "../../components/UiElements/Button1";
import axiosClient from "../../axios-client";

const ManageAttributes: React.FC = () => {
    const [messages, setMessages] = useState<string[]>([]);
    const [data, setData] = useState<any[]>([]);
    const [displayColumns, setDisplayColumns] = useState<any[]>([]);
    const [columnsTitle, setColumnsTitle] = useState<any[]>([]);

    useEffect(() => {
        const getAttributes = async () => {
            await axiosClient
                .get("/getAttributes")
                .then(({ data }) => {
                    console.log(data);
                    setData(data);
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
                    const response = err.response;
                    if (response && response.status === 422) {
                        setMessages([response.data.message]);
                    }
                });
        };

        // Call the async function
        getAttributes();
        // fetchOptions();
    }, []); // Empty dependency array ensures this effect runs only once

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
                data={data}
                displayColumns={displayColumns}
                columnsTitle={columnsTitle}
            />
        </DefaultLayout>
    );
};

export default ManageAttributes;
