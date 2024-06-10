import React from "react";
import DefaultLayout from "../../layout/DefaultLayout";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import TableThree from "../../components/Tables/TableThree";
import Button1 from "../../components/UiElements/Button1";
import { Navigate, NavLink, useNavigate } from "react-router-dom";


const ManageAttributes:  React.FC  = () => {

    return (
        <DefaultLayout>
          <Breadcrumb pageName="Manage Attributes" />
          <div className="flex justify-end mb-2">
            <Button1 title="Add New Attribute" path="/attributes/add-attribute"/>
          </div>
          <TableThree/>
      </DefaultLayout>
    );
};

export default ManageAttributes;