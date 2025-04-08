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
import Sidebar from "../../components//Product/SideBar";
import General from "./General";
import Categories from "./Categories";
import Attributes from "./Attributes";

const AddProduct: React.FC = () => {
    const [messages, setMessages] = useState<string[]>([]);
    const [categories, setCategories] = useState<
        { key: string | number; value: string | number }[]
    >([]);
    
    const [rows, setRows] = useState<any>([]);
    const [category, setCategory] = useState<string>("");
    
    const updateValue = (newValue, id) => {
        if (id == "category") {
            setCategories(newValue);
        }
    };

    const addAttribute = () => {
        // if (!attributeCodeRef.current?.value) {
        //     messages.push("Attribute code is required");
        //     setMessages(messages);
        //     return;
        // }

        // if (!frontendLabelRef.current?.value) {
        //     messages.push("Label is required");
        //     setMessages(messages);
        //     return;
        // }

        // const postData = {
        //     attributeCode: attributeCodeRef.current.value,
        //     frontendLabel: frontendLabelRef.current.value,
        //     entityTypeId: entityTypeOption,
        //     backendType: backendTypeOption,
        //     frontendType: frontendTypeOption,
        //     isRequired: isRequiredOption,
        //     defaultValue: defaultValueRef.current?.value,
        //     options: rows.map((row) => ({
        //         Value: row.Value,
        //         defaultValue: row.defaultValue,
        //     })),
        // };


        // axiosClient
        //     .post("/addAttribute", postData)
        //     .then(({ data }) => {
        //         const response = data;
        //         if (response && response.status == 200) {
        //             setMessages([response.message]);
        //         }
        //     })
        //     .catch((err) => {
        //         const response = err.response;
        //         if (response && response.status === 422) {
        //             setMessages([response.data.message]);
        //         }
        //     });
    };

    const handleErrorClose = () => {
        setMessages([]);
    };

    const fetchCategories = async () => {
        await axiosClient
        .get("/getCategories")
        .then(({ data }) => {
            setCategories(data);
        })
        .catch((err) => {
            const response = err.response;
            if (response && response.status === 422) {
                setMessages([response.data.message]);
            }
        });
    }


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

    const [activeSection, setActiveSection] = useState(0);

    const sections = ['General', 'Categories', 'Attributes']; // Add more sections as needed
  
    const renderSection = () => {
      switch (activeSection) {
        case 0:
          return <General />;
        case 1:
          return <Categories />;
        // Add more cases for other sections
        default:
          return <Attributes />;
      }
    };
  

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Add Product" />
            <PageTitle title="Add Product" />
            <div className="flex justify-end">
                <BackLink to="/products/manage-products"></BackLink>
            </div>
            <div className="flex h-screen overflow-hidden border">
            {/* sidebar */}
            <Sidebar sections={sections} onSectionClick={setActiveSection}/>
            {/* Form */}
                    <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
                {renderSection()}
            </div>
            </div>
        </DefaultLayout>
    );
};

export default AddProduct;
