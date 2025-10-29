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


const AddProducts = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string[]>([]);
    const allowedExtensions = ["csv", "xlsx"];
    const [messages, setMessages] = useState<string[]>([]);
    const [data, setData] = useState<Array<any>>([]);

    const handleFileChange = () => {
        const files = fileInputRef.current?.files;
        const validCsvHeader = 'sku';
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
                            const headers = results.meta.fields;
                            console.log(headers);
                            if (headers.includes(validCsvHeader)) {
                                setData(results.data);
                            } else {
                                setFile(null);
                                if (fileInputRef.current) {
                                    fileInputRef.current.value = '';
                                }

                                setError(["Invalid file. Download sample csv file for reference."]);
                            }

                            console.log(data);
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

    // insert products
    const handleUpload = () => {
        console.log(data);
        axiosClient
            .post("/addProducts", data)
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
    }

    const handleCancel = () => {
        setFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }

    const handleDownloadCSV = async () => {
        try {
            const response = await axiosClient
                .get("/downloadProductSampleCsv", {
                    responseType: 'blob'
                });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'productSampleCsv.csv');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        catch (error) {
            setMessages([error]);
        }
    }

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Add Products" />
            <form onSubmit={(e) => e.preventDefault()} encType="multiple/form-data">
                <PageTitle title="Add Products" />
                <FileUpload id="add-products-csv" ref={fileInputRef} onChange={handleFileChange} accept=".csv, .xlsx" />
                {error.length > 0 && <AlertsRed errors={error} onClick={handleErrorClose} />}
                <div className="md:p-6  flex flex-wrap gap-5 xl:gap-10">
                    <Button1 title="Add Products" onClick={handleUpload} />
                    <Button2 title="Cancel" onClick={handleCancel} />
                    <Button1 title="Download Sample Csv" onClick={handleDownloadCSV} />
                </div>

            </form>
        </DefaultLayout>
    );
};

export default AddProducts;