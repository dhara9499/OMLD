import React, { createRef, FormEvent, useRef, useState } from "react";
import DefaultLayout from "../../layout/DefaultLayout";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import FileUpload from "../../components/Forms/FileUpload";
import Button1 from "../../components/UiElements/Button1";
import PageTitle from "../../components/PageTitle";
import Button2 from "../../components/UiElements/Button2";
import AlertsRed from "../../components/UiElements/AlertsRed";


const AddAttributes = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [file, setFile ] = useState(null);
    const [error, setError] = useState<string[]>([]);
    const allowedExtensions = ['csv', 'xlsx'];

    const handleFileChange = () => {
        const files = fileInputRef.current?.files;
        if (files && files.length > 0) {
          const selectedFile = files[0];
          const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
          if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
            error.push('Invalid file type. Only csv & xlsx are allowed.');
            setFile(null);
            fileInputRef.current.value = '';
            setError(error);
          }
          setFile(file);
        }
    }

    const handleUpload = () => {
        console.log("success");
    }

    const handleErrorClose = () => {
        setError([]);
    }

    const handleCancel =  () => {
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Add Attributes" />
            <form onSubmit={(e) => e.preventDefault()} encType="multiple/form-data">
            <PageTitle title="Add Attributes" />
            <FileUpload id="add-attributes-csv" ref={fileInputRef} onChange={handleFileChange} accept=".csv, .xlsx"/>
            {error.length > 0 && <AlertsRed errors={error} onClick={handleErrorClose}/>}
              <div className="md:p-6  flex flex-wrap gap-5 xl:gap-10">
                <Button1 title="Add Attributes" onClick={handleUpload}/>
                <Button2 title="Cancel" onClick={handleCancel} />
              </div>
            
            </form>
        </DefaultLayout>
    );
};

export default AddAttributes;