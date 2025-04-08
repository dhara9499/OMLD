import React, { useEffect, useRef, useState } from "react";
import TextBox from "../../components/UiElements/TextBox";
import Button1 from "../../components/UiElements/Button1";
import Dropdown from "../../components/UiElements/Dropdown";
import axiosClient from "../../axios-client";
import AlertsRed from "../../components/UiElements/AlertsRed";

const Customers = (props: any) => {
    const [messages, setMessages] = useState<string[]>([]);
    const emailRef = useRef<HTMLInputElement>(null);
    const firstnameRef = useRef<HTMLInputElement>(null);
    const lastnameRef = useRef<HTMLInputElement>(null);
    const mobileNumberRef = useRef<HTMLInputElement>(null);
    const [isDisabled, setIsDisabled] = useState<boolean>(true);
    const [title, setTitle] = useState<string>("Add Customer Email");
    const [action, setAction] = useState("checkEmailExists");

    // console.log(props.productData);
    // console.log(props.productIds);

    const checkEmailExists = async () => {
        var email = emailRef.current?.value;

        if (!email) {
            messages.push("Please enter email to proceed");
            setMessages(messages);
            return;
        }

        await axiosClient
            .post("/checkIsCustomerAdded", { email: email })
            .then(({ data }) => {
                if (data && !data.isCustomerAdded) {
                    setIsDisabled(false);
                    setTitle("Add Customer");
                    setAction("addCustomer");
                } else {
                    props.setActiveSection(2);
                    props.setCustData(data.customerData);
                }
            })
            .catch((err) => {
                const response = err.response;
                if (response && response.status === 422) {
                    setMessages([response.data.message]);
                }
            });
    };

    const handleInputChange = () => {};

    const addCustomer = () => {
        const postData = {
            email: emailRef.current?.value,
            firstname: firstnameRef.current?.value,
            lastname: lastnameRef.current?.value,
            mobilenumber: mobileNumberRef.current?.value,
        };

        console.log(postData);

        axiosClient
            .post("/addCustomer", postData)
            .then(({ data }) => {
                const response = data;
                console.log(data);
                console.log(response.status);
                if (response && response.status == 200) {
                    setMessages([response.message]);
                    props.setActiveSection(2);
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
        setMessages([]);
    };

    return (
        <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
            <Button1
                title={title}
                onClick={
                    action === "addCustomer" ? addCustomer : checkEmailExists
                }
            ></Button1>
            <form
                onSubmit={(e) => e.preventDefault()}
                encType="multiple/form-data"
            >
                <div className="p-6.5">
                    <TextBox
                        ref={emailRef}
                        id="email"
                        label="Email"
                        placeholder="Enter email"
                        value="d.j.parekh99@gmail.com"
                        onChange={(e) => handleInputChange()}
                        required={true}
                    />

                    {messages.length > 0 && (
                        <AlertsRed
                            errors={messages}
                            onClick={handleErrorClose}
                        />
                    )}

                    {!isDisabled && (
                        <>
                            <TextBox
                                ref={firstnameRef}
                                id="firstname"
                                label="First Name"
                                placeholder="Enter First Name"
                                required={true}
                                disabled={isDisabled}
                            />

                            <TextBox
                                ref={lastnameRef}
                                id="lastname"
                                label="Last Name"
                                placeholder="Enter last name"
                                // onChange={(e) => setAttributeCode(e.target.value)}
                                required={true}
                                disabled={isDisabled}
                            />

                            <TextBox
                                id="mobileNumber"
                                label="Mobile Number"
                                placeholder="Enter Mobile Number"
                                ref={mobileNumberRef}
                                // onChange={(e) => setAttributeCode(e.target.value)}
                                disabled={isDisabled}
                            />
                        </>
                    )}
                </div>
            </form>
        </div>
    );
};

export default Customers;
