import React, { useEffect, useRef, useState } from 'react';
import axiosClient from '../../axios-client';
import Button1 from '../../components/UiElements/Button1';
import Dropdown from '../../components/UiElements/Dropdown';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { useNavigate } from "react-router-dom";

const Attributes = (props: any) => {
  const [attributes, setAttributes] = useState<any[]>([]);
  const [groupedAttributes, setGroupedAttributes] = useState<any>({});
  const [selectedAttributes, setSelectedAttributes] = useState<String[]>([]);
  const [attributeOptions, setAttributeOptions] = useState<
    { key: string | number; value: string | number }[]
  >([]);
  const [messages, setMessages] = useState<string[]>([]);
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const navigate = useNavigate();

  const fetchProductAttributes = async () => {
    await axiosClient
      .get("/getProductAttributes")
      .then(({ data }) => {
        setAttributes(data);
        const grouped = data.reduce((acc, attribute) => {
          const { backendType } = attribute;
          if (!acc[backendType]) {
            acc[backendType] = [];
          }
          acc[backendType].push(attribute);
          return acc;
        }, {});
        setGroupedAttributes(grouped);
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
          // setMessages([response.data.message]);
        }
      });
  }

  useEffect(() => {
    fetchProductAttributes();
  }, []);

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setSelectedAttributes((prevSelected: any) => checked
      ? [...prevSelected, value]
      : prevSelected.filter((id) => id !== value)
    );
  };

  const updateValue = (newValue, id) => {
    if (id == "attributeOptions") {
      setAttributeOptions(newValue);
    }
  };

  const renderInputField = (attribute: any) => {
    const inputProps = {
      name: attribute.attributeCode,
      ref: (el) => {
        if (el) {
          inputRefs.current[attribute.attributeCode] = el;
        } else {
          delete inputRefs.current[attribute.attributeCode];
        }
      },
    };
    switch (attribute.frontendType) {
      case 'text':
        return <input type="text" {...inputProps} />;
      case 'decimal':
        return <input type="number" step="0.01" {...inputProps} />;
      case 'varchar':
        return <input type="text" {...inputProps} />;
      case 'integer':
        return <input type="number" pattern="^[1-9]\d*$"  {...inputProps} />;
      case 'select':
        return <Dropdown
          id="attributeOptions"
          value={attribute.options}
          updateValue={updateValue}
          placeholder="Select Discount Type"
          options={attribute.options}
        />
      default:
        return null;
    }
  };

  const handleSave = async () => {
    const inputs = Object.values(inputRefs.current) as HTMLInputElement[];
    const attributeData: Record<string, any> = {};
    inputs.forEach(input => {
      const name = input.name;
      const value = input.value;
      attributeData[name] = value;
    });

    props.setAttributesData(attributeData);

    const productData = {
      ...props.productData,
      categories: props.categoriesData,
      attributes: attributeData,
    };

    await axiosClient
      .post("/addProduct", productData)
      .then(({ data }) => {
        const response = data;
        if (response && response.status == 200) {
          navigate("/products/manage-products");
          setMessages([response.message]);
        }

      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
          setMessages([response.data.message]);
        }
      });

  }


  return (
    <div className="p-6.5">
      <h2 className="text-2xl font-bold mb-4">Please Select Attributes to Add</h2>
      {Object.keys(groupedAttributes).map((backendType) => (
        (<Disclosure key={backendType} as="div" className="mb-4">
          {({ open }) => (
            <>
              <DisclosureButton className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                <span>{backendType.charAt(0).toUpperCase() + backendType.slice(1)}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`${open ? 'transform rotate-180' : ''} w-5 h-5 text-gray-500`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </DisclosureButton>
              <DisclosurePanel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                {groupedAttributes[backendType].map((attribute: any) => (
                  <div key={attribute.attributeId} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={attribute.attributeCode}
                      value={attribute.attributeCode}
                      onChange={handleCheckboxChange}
                      className="mr-2"
                    />
                    <label htmlFor={attribute.attributeCode}>{attribute.attributeCode}</label>
                    {selectedAttributes.includes(attribute.attributeCode) && (
                      <div className="ml-4">
                        <label htmlFor={`${attribute.attributeCode}-value`} className="mr-2">Value:</label>
                        {renderInputField(attribute)}
                      </div>
                    )}
                  </div>
                ))}
              </DisclosurePanel>
            </>
          )}
        </Disclosure>)
      ))}
      <Button1 title='Save' onClick={handleSave} />
    </div>
  );
};

export default Attributes;
