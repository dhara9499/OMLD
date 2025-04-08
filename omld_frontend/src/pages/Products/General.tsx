import React, { useEffect, useRef, useState } from 'react';
import TextBox from '../../components/UiElements/TextBox';
import Button1 from '../../components/UiElements/Button1';
import Dropdown from '../../components/UiElements/Dropdown';
import axiosClient from '../../axios-client';

const General = () => {

    const skuRef = useRef<HTMLInputElement>(null);
    const nameRef = useRef<HTMLInputElement>(null);
    const [messages, setMessages] = useState<string[]>([]);
    const [entityTypeOptions, setEntityTypeOptions] = useState<
        { key: string | number; value: string | number }[]
    >([]);
    const [entityTypeOption, setEntityTypeOption] = useState<string>("");
    const updateValue = (newValue, id) => {
        if (id == "entityType") {
            setEntityTypeOption(newValue);
        } 
    };


    const fetchOptions = async () => {
        await axiosClient
            .get("/getEntityTypeOptions")
            .then(({ data }) => {
                setEntityTypeOptions(data);
            })
            .catch((err) => {
                const response = err.response;
                if (response && response.status === 422) {
                    setMessages([response.data.message]);
                }
            });
    };
    useEffect(() => {
        fetchOptions();
    }, []);
  return (
    <div>
      <form
                onSubmit={(e) => e.preventDefault()}
                encType="multiple/form-data"
            >
                <div className="p-6.5">
                    {/* sku */}
                    <TextBox
                        ref={skuRef}
                        id="sku"
                        label="Sku"
                        placeholder="Enter sku"
                        onChange={(e) => skuRef}
                        required={true}
                    />

                    {/* sku */}
                    {/* name */}
                    <TextBox
                        id="name"
                        label="Name"
                        ref={nameRef}
                        placeholder="Enter Name"
                        onChange={(e) => nameRef}
                        required={true}
                    />
                    {/* frontend label */}

                    {/* entity type */}

                    <Dropdown
                        id="entityType"
                        value={entityTypeOption}
                        updateValue={updateValue}
                        label="Entity Type"
                        placeholder="Select Entity Type"
                        options={entityTypeOptions}
                    />
                    {/* entity type */}
                </div>
            </form>
    </div>
  );
};

export default General;