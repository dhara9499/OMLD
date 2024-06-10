import React from "react";
import DefaultLayout from "../../layout/DefaultLayout";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import TableThree from "../../components/Tables/TableThree";
import Button1 from "../../components/UiElements/Button1";


const ManageProducts = () => {

  const handleAddNewProduct = () => {
    console.log("add new");
  }

    return (
        <DefaultLayout>
      <Breadcrumb pageName="Manage Products" />
      <div className="flex justify-end mb-2">
        <Button1 title="Add New Product" onClick={handleAddNewProduct}/>
      </div>
      <TableThree/>
      </DefaultLayout>
    );
};

export default ManageProducts;