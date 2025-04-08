import React, {
    createRef,
    FormEvent,
    useRef,
    useState,
    useEffect,
} from "react";
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

const AddAttribute: React.FC = () => {
    const attributeCodeRef = useRef<HTMLInputElement>(null);
    const frontendLabelRef = useRef<HTMLInputElement>(null);
    const defaultValueRef = useRef<HTMLInputElement>(null);
    const [messages, setMessages] = useState<string[]>([]);
    const [entityTypeOptions, setEntityTypeOptions] = useState<
        { key: string | number; value: string | number }[]
    >([]);
    const [rows, setRows] = useState<any>([]); //when frontend type option selected
    const [entityTypeOption, setEntityTypeOption] = useState<string>("");
    const [backendTypeOption, setBackendTypeOption] = useState<string>("");
    const [frontendTypeOption, setFrontendTypeOption] = useState<string>("");
    const [isRequiredOption, setIsRequiredOption] = useState<string>("");
    const [isEditing, setIsEditing] = useState<boolean>(false);

    const updateValue = (newValue, id) => {
        if (id == "entityType") {
            setEntityTypeOption(newValue);
        } else if (id == "backendType") {
            setBackendTypeOption(newValue);
        } else if (id == "frontendType") {
            setFrontendTypeOption(newValue);
            setRows([]);
        } else if (id == "isRequired") {
            setIsRequiredOption(newValue);
        }
    };

    const backendTypeOptions = [
        { key: "varchar", value: "Varchar" },
        { key: "text", value: "Text" },
        { key: "int", value: "Integer" },
        { key: "decimal", value: "Decimal" },
        { key: "datetime", value: "Datetime" },
    ];

    const frontendTypeOptions = [
        { key: "text", value: "Text" },
        { key: "int", value: "Integer" },
        { key: "decimal", value: "Decimal" },
        { key: "datetime", value: "Datetime" },
        { key: "select", value: "Select" },
    ];

    const isRequiredOptions = [
        { key: "no", value: "No" },
        { key: "yes", value: "Yes" },
    ];

    const addAttribute = () => {
        if (!attributeCodeRef.current?.value) {
            messages.push("Attribute code is required");
            setMessages(messages);
            return;
        }

        if (!frontendLabelRef.current?.value) {
            messages.push("Label is required");
            setMessages(messages);
            return;
        }

        const postData = {
            attributeCode: attributeCodeRef.current.value,
            frontendLabel: frontendLabelRef.current.value,
            entityTypeId: entityTypeOption,
            backendType: backendTypeOption,
            frontendType: frontendTypeOption,
            isRequired: isRequiredOption,
            defaultValue: defaultValueRef.current?.value,
            options: rows.map((row) => ({
                Value: row.Value,
                defaultValue: row.defaultValue,
            })),
        };

        console.log(postData);

        axiosClient
            .post("/addAttribute", postData)
            .then(({ data }) => {
                const response = data;
                console.log(data);
                console.log(response.status);
                if (response && response.status == 200) {
                    setMessages([response.message]);
                } else {
                    clearFields();
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
        setMessages([]);
    };

    const clearFields = () => {
        if (attributeCodeRef.current) attributeCodeRef.current.value = '';
        if (frontendLabelRef.current) frontendLabelRef.current.value = '';
        if (defaultValueRef.current) defaultValueRef.current.value = '';
        setEntityTypeOption('');
        setBackendTypeOption('');
        setFrontendTypeOption('');
        setIsRequiredOption('');

    }

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

    const addOption = () => {
        if (rows.length > 0) {
            rows.push([{ OptionLabel: "", Value: "", defaultValue: false }]);
            setRows(rows);
        } else {
            setRows([{OptionLabel: "", Value: "", defaultValue: false }]);
        }
    };

    const handleInputChange = (index, field, value) => {
        const newRows = [...rows];
        newRows[index][field] = value;
        setRows(newRows);
    };

    const handleRadioChange = (index) => {
        const newRows = rows.map((row, i) => ({
            ...row,
            defaultValue: i === index,
        }));
        setRows(newRows);
    };

    const deleteRow = (index, event) => {
        event.preventDefault();
        event.stopPropagation();
        const newRows = rows.filter((_, i) => i !== index);
        setRows(newRows);
    };

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Add Attribute" />
            <PageTitle title="Add Attribute" />
            <div className="flex justify-end">
                <BackLink to="/attributes/manage-attributes"></BackLink>
            </div>
            <form
                onSubmit={(e) => e.preventDefault()}
                encType="multiple/form-data"
            >
                <div className="p-6.5">
                    {/* attribute code */}
                    <TextBox
                        ref={attributeCodeRef}
                        id="attruibuteCode"
                        label="Attribute Code"
                        placeholder="Enter attribute code"
                        required={true}
                    />

                    {/* attribute code */}
                    {/* frontend label */}
                    <TextBox
                        id="frontendLabel"
                        label="Frontend Label"
                        ref={frontendLabelRef}
                        placeholder="Enter Frontend Label"
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

                    {/*
                        //  {/* backend type */}
                    <Dropdown
                        id="backendType"
                        value={backendTypeOption}
                        updateValue={updateValue}
                        label="Backend Type"
                        placeholder="Select Backend Type"
                        options={backendTypeOptions}
                    />

                    {/* frontend type */}
                    <Dropdown
                        id="frontendType"
                        value={frontendTypeOption}
                        updateValue={updateValue}
                        label="Frontend Type"
                        placeholder="Select frontend Type"
                        options={frontendTypeOptions}
                    />
                    {/* frontend type */}

                    {frontendTypeOption == "select" && (
                        <div className="container mx-auto p-4">
                            <table
                                className="min-w-full divide-y divide-gray-200"
                                id="attribute_options"
                            >
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Option Label
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Value
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Is Default
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            <Button1
                                                title="Add Option"
                                                onClick={addOption}
                                            />
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {rows.length > 0 &&
                                        rows.map((row, index) => (
                                            <tr key={index}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    <input
                                                        type="text"
                                                        value={row.OptionLabel}
                                                        onChange={(e) =>
                                                            handleInputChange(
                                                                index,
                                                                "OptionLabel",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="border px-2 py-1"
                                                    />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    <input
                                                        type="text"
                                                        value={row.Value}
                                                        onChange={(e) =>
                                                            handleInputChange(
                                                                index,
                                                                "Value",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="border px-2 py-1"
                                                    />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    <input
                                                        type="radio"
                                                        checked={
                                                            row.defaultValue
                                                        }
                                                        onChange={() =>
                                                            handleRadioChange(
                                                                index
                                                            )
                                                        }
                                                        className="border"
                                                    />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        onClick={(e) =>
                                                            deleteRow(index, e)
                                                        }
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* is Required  */}
                    <Dropdown
                        id="isRequired"
                        value={isRequiredOption}
                        updateValue={updateValue}
                        label="Is Required"
                        options={isRequiredOptions}
                    />
                    {/* is Required  */}

                    {/* default value */}
                    <TextBox
                        id="defaultValue"
                        label="Default Value"
                        ref={defaultValueRef}
                        placeholder="Enter Default value"
                    />
                    {/* default value */}

                    {messages.length > 0 && (
                        <AlertsRed
                            errors={messages}
                            onClick={handleErrorClose}
                        />
                    )}
                    <div className="flex justify-center mt-2">
                        <Button1 title="Add" onClick={addAttribute} />
                    </div>
                </div>
            </form>
        </DefaultLayout>
    );
};

export default AddAttribute;
