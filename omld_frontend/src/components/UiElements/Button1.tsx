import { Link } from 'react-router-dom';

import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import React, { forwardRef, HTMLProps, InputHTMLAttributes } from 'react';

interface ButtonProps extends HTMLProps<HTMLInputElement> {
    title: string;
    onClick?: (event: InputHTMLAttributes<HTMLInputElement>) => void;
    path?: string
  }

  const Button1 = forwardRef<HTMLInputElement, ButtonProps>((props)  => {
    const { title, onClick, path}:any = props;

  return (
      <Link
          to={path}
          onClick={onClick}
          className= {["inline-flex items-center justify-center gap-2.5 rounded-full bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-8"].join(' ')}  
      >
          {title}
      </Link>
  );
});

export default Button1;
