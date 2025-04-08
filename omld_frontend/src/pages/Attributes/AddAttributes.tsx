import React, { createRef, FormEvent, useRef, useState } from "react";
import DefaultLayout from "../../layout/DefaultLayout";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import FileUpload from "../../components/Forms/FileUpload";
import Button1 from "../../components/UiElements/Button1";
import PageTitle from "../../components/PageTitle";
import Button2 from "../../components/UiElements/Button2";
import AlertsRed from "../../components/UiElements/AlertsRed";
import axiosClient from "../../axios-client";
import Papa from 'papaparse';

const AddAttributes = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string[]>([]);
    const allowedExtensions = ["csv", "xlsx"];
    const [messages, setMessages] = useState<string[]>([]);
    const [data, setData] = useState<Array<any>>([]);

    const handleFileChange = () => {
        const files = fileInputRef.current?.files;
        // check file length
        if (files && files.length > 0) {
            const selectedFile = files[0];
            const fileExtension = selectedFile.name
                .split(".")
                .pop()
                ?.toLowerCase();
            // check valid file extension
            if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
                error.push("Invalid file type. Only csv & xlsx are allowed.");
                setFile(null);
                fileInputRef.current.value = "";
                setError(error);
            }
            //set file
            setFile(selectedFile);
            //read file data
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target && event.target.result) {
                    Papa.parse(event.target.result as string, {
                        header: true,
                        skipEmptyLines: true,
                        complete: (results) => {
                          // set data
                            setData(results.data);
                        },
                        error: (error) => {
                            console.error("Error while parsing CSV:", error);
                        },
                    });
                }
            };
            reader.readAsText(selectedFile);
        }
    };

    // insert attributes
    const handleUpload = () => {
        axiosClient
            .post("/addAttributes", data)
            .then(({ data }) => {
                const response = data;
                console.log(data);
                console.log(response.status);
                if (response && response.status == 200) {
                    setMessages([response.message]);
                }
            })
            .catch((err) => {
                const response = err.response;
                if (response && response.status === 422) {
                    setMessages([response.data.message]);
                }
            });
    };

    const handleErrorClose = () => {
        setError([]);
    };

    const handleCancel = () => {
        setFile(null);
        setData([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Add Attributes" />
            {messages && messages.length > 0 && <AlertsRed
                            errors={messages}
                            onClick={handleErrorClose}
                        />}
            <form
                onSubmit={(e) => e.preventDefault()}
                encType="multiple/form-data"
            >
                <PageTitle title="Add Attributes" />
                <FileUpload
                    id="add-attributes-csv"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".csv, .xlsx"
                />
                {error.length > 0 && (
                    <AlertsRed errors={error} onClick={handleErrorClose} />
                )}
                <div className="md:p-6  flex flex-wrap gap-5 xl:gap-10">
                    <Button1 title="Add Attributes" onClick={handleUpload} />
                    <Button2 title="Cancel" onClick={handleCancel} />
                </div>
            </form>
        </DefaultLayout>
    );
};

export default AddAttributes;
