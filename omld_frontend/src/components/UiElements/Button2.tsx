import { Link } from 'react-router-dom';

import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import React, {forwardRef, InputHTMLAttributes} from 'react';

interface ButtonProps {
    title: string;
    onClick: (event: InputHTMLAttributes<HTMLInputElement>) => void;
  }

const Button2 = forwardRef<HTMLInputElement, ButtonProps>((props)  => {
  const { title, onClick } = props;
  return (
    // <div className="mb-10 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
    //     <div className="p-4 md:p-6 xl:p-9">
    //         <div className="flex flex-wrap gap-5 xl:gap-7.5">
                
            <Link
              to="#"
              onClick={onClick}
              className="inline-flex items-center justify-center rounded-full bg-red-600 py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-6 md-4"
            >
              {title}
            </Link>
    //         </div>
    //     </div>
    // </div>
  );
});

export default Button2;
