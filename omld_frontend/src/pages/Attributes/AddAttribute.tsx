import React, { createRef, FormEvent, useRef, useState, useEffect } from "react";
import DefaultLayout from "../../layout/DefaultLayout";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import Button1 from "../../components/UiElements/Button1";
import PageTitle from "../../components/PageTitle";
import BackLink from "../../components/UiElements/BackLink";
import TextBox from "../../components/UiElements/TextBox";
import Dropdown from "../../components/UiElements/Dropdown";
import AlertsRed from "../../components/UiElements/AlertsRed";
import axios from "axios";
import axiosClient from "../../axios-client";


// export interface entityTypeOptions {
//     key: string | number;
//     value: any;
//   }

//   interface entityTypeProps {
//     options: entityTypeOptions[];
//   }


const AddAttribute: React.FC = () => {
    const [attributeCode, setAttributeCode] = useState('');
    const attributeCodeRef = useRef<HTMLInputElement>(null);
    const [messages, setMessages] = useState<string[]>([]);

    let entityTypeOptions: { key: string | number, value: string | number }[] = [];
    // const [entityTypeOptions, setEntityTypeOptions] = useState([]);
    
    const backendTypeOptions = [
        { key: 'varchar', value: 'Varchar' },
        { key: 'text', value: 'Text' },
        { key: 'int', value: 'Integer' },
        { key: 'decimal', value: 'Decimal' },
        { key: 'datetime', value: 'Datetime' },
    ]

    const frontendTypeOptions = [
        { key: 'varchar', value: 'Varchar' },
        { key: 'text', value: 'Text' },
        { key: 'int', value: 'Integer' },
        { key: 'decimal', value: 'Decimal' },
        { key: 'datetime', value: 'Datetime' },
        { key: 'select', value: 'Select' },
    ]

    const isRequiredOptions = [
        { key: 'no', value: 'No' },
        { key: 'yes', value: 'Yes' }
    ]

    const addAttribute = () => {
        if(!attributeCodeRef.current?.value) {
            messages.push('Attribute code is required');
            setMessages(messages);
            return;
        }
        
    }

    const handleErrorClose = () => {
        setMessages([]);
      }

    const fetchOptions = async () => {
        axiosClient.get('/getEntityTypeOptions')
        .then(({ data }) => {
        entityTypeOptions = data;
        console.log("73");
          console.log(entityTypeOptions);

        })
        .catch((err) => {
          const response = err.response;
          console.log("78");
          if (response && response.status === 422) {
            setMessages([response.data.message]);
          }
        });
    }

    useEffect(() => {
        fetchOptions();
      }, []);

     
        return (
            <DefaultLayout>
                <Breadcrumb pageName="Add Attribute" />
                <PageTitle title="Add Attribute" />
                <div className="flex justify-end">
                <BackLink to="/attributes/manage-attributes" ></BackLink>
                </div>
                <form
                    onSubmit={(e) => e.preventDefault()}
                    encType="multiple/form-data"
                >
                    <div className="p-6.5">
                        {/* attribute code */}
                        <TextBox id="attruibuteCode" label="Attribute Code" placeholder="Enter attribute code"  onChange={(e) => setAttributeCode(e.target.value)} ref={attributeCodeRef} required = {true}/> 
                        
                        {/* attribute code */}
    
                        {/* entity type */}
                        
                        <Dropdown id="entityType" label="Entity Type" placeholder="Select Entity Type" options={entityTypeOptions} />
                        {/* entity type */}
    
                        {/* backend type */}
                        <Dropdown id="backendType" label="Backend Type" placeholder="Select Backend Type" options={backendTypeOptions} />
                        {/* backend type */}
    
                        {/* frontend type */}
                        <Dropdown id="frontendType" label="Frontend Type" placeholder="Select frontend Type" options={frontendTypeOptions} />
                        {/* frontend type */}
    
    
                        {/* is Required  */}
                        <Dropdown id="isRequired" label="Is Required"  options={isRequiredOptions} />
                        {/* is Required  */}
    
                         {/* default value */}
                         <TextBox id="defaultValue" label="Default Value" placeholder="Enter Default value"  onChange={(e) => setAttributeCode(e.target.value)}/> 
                        {/* default value */}
    
                        {messages.length > 0 && <AlertsRed errors={messages} onClick={handleErrorClose}/>}
                        <div className="flex justify-center mt-2">
                            <Button1 title="Add" onClick={addAttribute}/>
                        </div>
    
                        
                    </div>
                </form>
            </DefaultLayout>
        );
    
  
};

export default AddAttribute;
