import React, { useEffect, useRef, useState } from 'react';
import TextBox from '../../components/UiElements/TextBox';
import Button1 from '../../components/UiElements/Button1';
import Dropdown from '../../components/UiElements/Dropdown';
import axiosClient from '../../axios-client';
import AlertsRed from '../../components/UiElements/AlertsRed';

const General = (props: any) => {

    const skuRef = useRef<HTMLInputElement>(null);
    const nameRef = useRef<HTMLInputElement>(null);
    const [messages, setMessages] = useState<string[]>([]);
    const [skuExists, setSkuExists] = useState(true);
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

    const handleSkuChange = async (e) => {
        e.preventDefault();
        console.log("called");
        if (skuRef.current?.value) {
            try {
                const response = await axiosClient.post('/checkSkuExists', { sku: skuRef.current.value });
                if (response.data.exists) {
                    setMessages(['Sku already exists.']);
                    setSkuExists(true);
                    if (skuRef.current) {
                        skuRef.current.value = '';
                    }
                } else {
                    setMessages([]);
                    setSkuExists(false);
                }
            } catch (error) {
                console.error('Error checking SKU:', error);
                setMessages(['An error occurred while checking the SKU.']);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (skuRef.current?.value && skuExists) {
            try {
                const response = await axiosClient.post('/checkSkuExists', { sku: skuRef.current.value });
                if (response.data.exists) {
                    setMessages(['Sku already exists.']);
                    setSkuExists(true);
                    if (skuRef.current) {
                        skuRef.current.value = '';
                    }
                } else {
                    setMessages([]);
                    setSkuExists(false);
                }
            } catch (error) {
                console.error('Error checking SKU:', error);
                setMessages(['An error occurred while checking the SKU.']);
            }
        } else {
            props.setGeneralData({
                name: nameRef.current?.value,
                sku: skuRef.current?.value
            });
            props.handleSectionChange(1);
        }

        // try {
        //     if (skuExists) {
        //         setMessages(['Sku already exists.']);
        //     } else {
        //         props.setGeneralData({
        //             name: nameRef.current?.value,
        //             sku: skuRef.current?.value
        //         });
        //         props.handleSectionChange(1);
        //     }
        // } catch (error) {
        //     console.error('Error checking SKU:', error);
        //     setMessages(['An error occurred while checking the SKU.']);
        // }
    }

    const handleErrorClose = () => {
        setMessages([]);
    }

    return (
        <div>
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
                {!skuExists && (
                    <>
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
                    </>)}
                {/* entity type */}
                <Button1 title={'Next'} onClick={handleSubmit} />
            </div>
            {messages.length > 0 && <AlertsRed errors={messages} onClick={handleErrorClose} />}
        </div>

    );
};

export default General;