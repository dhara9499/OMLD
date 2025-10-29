import React, {
    useRef,
    useState,
    useEffect,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import DefaultLayout from "../../layout/DefaultLayout";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import Button1 from "../../components/UiElements/Button1";
import PageTitle from "../../components/PageTitle";
import BackLink from "../../components/UiElements/BackLink";
import TextBox from "../../components/UiElements/TextBox";
import Dropdown from "../../components/UiElements/Dropdown";
import AlertsRed from "../../components/UiElements/AlertsRed";
import axiosClient from "../../axios-client";
import Toast from "../../common/Toast";


const AddAttribute = () => {
    const { attributeId } = useParams();
    const navigate = useNavigate();
    const attributeCodeRef = useRef<HTMLInputElement>(null);
    const frontendLabelRef = useRef<HTMLInputElement>(null);
    const defaultValueRef = useRef<HTMLInputElement>(null);
    const [entityTypeOptions, setEntityTypeOptions] = useState<any[]>([]);
    const [entityTypeOption, setEntityTypeOption] = useState<string>("");
    const [backendTypeOption, setBackendTypeOption] = useState<string>("");
    const [frontendTypeOption, setFrontendTypeOption] = useState<string>("");
    const [isRequiredOption, setIsRequiredOption] = useState<string>("");
    const [rows, setRows] = useState<any[]>([]);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [attributeCodeError, setAttributeCodeError] = useState<string>("");
    const [frontLabelError, setFrontLabelError] = useState<string>("");
    const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);


    useEffect(() => {
        if (attributeId) {
            setIsEditing(true);
            fetchAttributeData();
        }
    }, [attributeId]);

    const fetchAttributeData = async () => {
        try {
            const { data } = await axiosClient.get(`/getAttribute/${attributeId}`);
            if (data) {
                if (attributeCodeRef.current) attributeCodeRef.current.value = data.attributeCode;
                if (frontendLabelRef.current) frontendLabelRef.current.value = data.frontendLabel;
                if (defaultValueRef.current) defaultValueRef.current.value = data.defaultValue || '';

                console.log(data.entityTypeId);
                setEntityTypeOption(data.entityTypeId);
                setBackendTypeOption(data.backendType);
                setFrontendTypeOption(data.frontendType);
                setIsRequiredOption(data.isRequired ? 'yes' : 'no');

                if (data.options && data.options.length > 0) {
                    setRows(data.options.map((option: any) => ({
                        OptionLabel: option.optionLabel,
                        Value: option.value,
                        defaultValue: option.isDefault === 1,
                    })));
                }
            }
        } catch (error) {
            console.error('Error fetching attribute data:', error);
            setToast({ type: "error", message: "Failed to fetch attribute data" });
        }
    };

    const updateValue = (newValue: string, id: string) => {
        console.log(newValue, id);
        if (id === "entityType") {
            console.log(newValue);
            setEntityTypeOption(newValue);
        } else if (id === "backendType") {
            setBackendTypeOption(newValue);
        } else if (id === "frontendType") {
            setFrontendTypeOption(newValue);
            setRows([]);
        } else if (id === "isRequired") {
            setIsRequiredOption(newValue);
        }
    };

    const backendTypeOptions = [
        { key: '', value: 'Select Backend Type' },
        { key: "varchar", value: "Varchar" },
        { key: "text", value: "Text" },
        { key: "int", value: "Integer" },
        { key: "decimal", value: "Decimal" },
        { key: "datetime", value: "Datetime" },
    ];

    const frontendTypeOptions = [
        { key: '', value: 'Select Frontend Type' },
        { key: "text", value: "Text" },
        { key: "int", value: "Integer" },
        { key: "decimal", value: "Decimal" },
        { key: "datetime", value: "Datetime" },
        { key: "select", value: "Select" },
    ];

    const isRequiredOptions = [
        { key: '', value: 'Select Is Required' },
        { key: "no", value: "No" },
        { key: "yes", value: "Yes" },
    ];

    const handleSubmit = async () => {
        if (!attributeCodeRef.current?.value) {
            setToast({ type: "error", message: "Attribute code is required" });
            return;
        }
        if (attributeCodeError) {
            setToast({ type: "error", message: "Attribute code must start with a letter and can only contain letters, numbers, hyphens, and underscores" });
            return;
        }

        if (!frontendLabelRef.current?.value) {
            setToast({ type: "error", message: "Label is required" });
            return;
        }

        if (frontLabelError) {
            setToast({ type: "error", message: "Frontend Label must start with alphabets." });
            return;
        }

        const payload = {
            attributeCode: attributeCodeRef.current.value,
            frontendLabel: frontendLabelRef.current.value,
            entityTypeId: entityTypeOption,
            backendType: backendTypeOption,
            frontendType: frontendTypeOption,
            isRequired: isRequiredOption === 'yes' ? 1 : 0,
            defaultValue: defaultValueRef.current?.value,
            options: rows.map((row) => ({
                optionLabel: row.OptionLabel,
                value: row.Value,
                isDefault: row.defaultValue ? 1 : 0,
            })),
        };

        try {
            let response;
            if (isEditing) {
                response = await axiosClient.put(`/updateAttribute/${attributeId}`, payload);
            } else {
                response = await axiosClient.post("/addAttribute", payload);
            }

            if (response.data.status === 200) {
                setToast({ type: "success", message: response.data.message });
                if (!isEditing) {
                    clearFields();
                } else {
                    navigate('/attributes/manage-attributes');
                }
            }
        } catch (error: any) {
            if (error.response?.status === 422) {
                setToast({ type: "error", message: error.response.data.message });
            } else {
                setToast({ type: "error", message: "An error occurred" });
            }
        }
    };



    const clearFields = () => {
        if (attributeCodeRef.current) attributeCodeRef.current.value = '';
        if (frontendLabelRef.current) frontendLabelRef.current.value = '';
        if (defaultValueRef.current) defaultValueRef.current.value = '';
        setEntityTypeOption('');
        setBackendTypeOption('');
        setFrontendTypeOption('');
        setIsRequiredOption('');
        setRows([]);
    };

    const fetchOptions = async () => {
        try {
            const { data } = await axiosClient.get("/getEntityTypeOptions");
            setEntityTypeOptions([{ value: 'Select Entity Type', key: '' }, ...data]);
        } catch (error: any) {
            if (error.response?.status === 422) {
                setToast({ type: "error", message: error.response.data.message });
            }
        }
    };

    useEffect(() => {
        fetchOptions();
    }, []);

    const addOption = () => {
        if (rows.length > 0) {
            setRows([...rows, { OptionLabel: "", Value: "", defaultValue: false }]);
        } else {
            setRows([{ OptionLabel: "", Value: "", defaultValue: false }]);
        }
    };

    const handleInputChange = (index: number, field: string, value: any) => {
        const newRows = [...rows];
        newRows[index][field] = value;
        setRows(newRows);
    };

    const handleRadioChange = (index: number) => {
        const newRows = rows.map((row, i) => ({
            ...row,
            defaultValue: i === index,
        }));
        setRows(newRows);
    };

    const deleteRow = (index: number, event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        const newRows = rows.filter((_, i) => i !== index);
        setRows(newRows);
    };

    console.log(toast);

    return (
        <DefaultLayout>
            <Breadcrumb pageName={isEditing ? "Edit Attribute" : "Add Attribute"} />
            <PageTitle title={isEditing ? "Edit Attribute" : "Add Attribute"} />
            <div className="flex justify-end">
                <BackLink to="/attributes/manage-attributes"></BackLink>
            </div>
            <form
                onSubmit={(e) => e.preventDefault()}
                encType="multiple/form-data"
            >
                <div className="p-6.5">
                    <TextBox
                        ref={attributeCodeRef}
                        id="attributeCode"
                        label="Attribute Code"
                        placeholder="Enter attribute code"
                        required={true}
                        disabled={isEditing}
                        error={attributeCodeError}
                        onChange={(e) => {
                            const value = e.target.value;
                            const attributeCodeRegex = /^[_a-zA-Z][a-zA-Z0-9_-]*$/;
                            if (value && !attributeCodeRegex.test(value)) {
                                setAttributeCodeError("Attribute code must start with a letter and can only contain letters, numbers, hyphens, and underscores");
                            } else {
                                setAttributeCodeError("");
                            }
                        }}
                    />

                    <TextBox
                        id="frontendLabel"
                        label="Frontend Label"
                        ref={frontendLabelRef}
                        placeholder="Enter Frontend Label"
                        required={true}
                        error={frontLabelError}
                        onChange={(e) => {
                            const value = e.target.value;
                            const frontendLabelRegex = /^[A-Za-z].*$/;
                            if (value && !frontendLabelRegex.test(value)) {
                                setFrontLabelError("Frontend Label must start with a alphabets.");
                            } else {
                                setFrontLabelError("");
                            }
                        }}
                    />

                    <Dropdown
                        id="entityType"
                        value={entityTypeOption}
                        updateValue={updateValue}
                        label="Entity Type"
                        options={entityTypeOptions}
                        required={true}
                    />

                    <Dropdown
                        id="backendType"
                        value={backendTypeOption}
                        updateValue={updateValue}
                        label="Backend Type"
                        options={backendTypeOptions}
                        required={true}
                    />

                    <Dropdown
                        id="frontendType"
                        value={frontendTypeOption}
                        updateValue={updateValue}
                        label="Frontend Type"
                        options={frontendTypeOptions}
                        required={true}
                    />

                    <Dropdown
                        id="isRequired"
                        value={isRequiredOption}
                        updateValue={updateValue}
                        label="Is Required"
                        options={isRequiredOptions}
                        required={true}
                    />

                    <TextBox
                        id="defaultValue"
                        label="Default Value"
                        ref={defaultValueRef}
                        placeholder="Enter Default Value"
                    />

                    {frontendTypeOption === "select" && (
                        <div className="mt-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium">Options</h3>
                                <button
                                    onClick={addOption}
                                    className="bg-primary text-white px-4 py-2 rounded-md"
                                >
                                    Add Option
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Option Label
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Value
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Is Default
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {rows.map((row, index) => (
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
                                                        checked={row.defaultValue}
                                                        onChange={() =>
                                                            handleRadioChange(index)
                                                        }
                                                        className="form-radio h-4 w-4 text-primary"
                                                    />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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
                        </div>
                    )}

                    {toast && (
                        <Toast
                            type={toast.type}
                            message={toast.message}
                            onClose={() => setToast(null)}
                        />
                    )}

                    <div className="md:p-6 flex flex-wrap gap-5 xl:gap-10">
                        <Button1
                            title={isEditing ? "Update Attribute" : "Add Attribute"}
                            onClick={handleSubmit}
                        />
                    </div>
                </div>
            </form>
        </DefaultLayout>
    );
};

export default AddAttribute;
