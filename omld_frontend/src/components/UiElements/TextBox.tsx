import React, { forwardRef, HTMLProps } from 'react';
import Label from './Label';

interface TextBoxProps extends HTMLProps<HTMLInputElement> {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const TextBox = forwardRef<HTMLInputElement, TextBoxProps>((props, ref) =>  { 
  const {
    label,
    id,
    type = 'text',
    placeholder = '',
    value,
    onChange,
    required = false,
    disabled = false,
    error,
    onBlur
  } = props;
  return (
    <div className="mb-4.5 flex flex-col p-4">
      <div className="flex items-center gap-4">
        <Label id={id} label={label} required={required} />
        <input
          type={type}
          id={id}
          placeholder={placeholder}
          value={value}
          ref={ref}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          disabled={disabled}
          className={`w-full flex-1 rounded border-[1.5px] ${error ? 'border-danger' : 'border-stroke'} bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
        />
      </div>
      {error && (
        <div className="mt-1 text-danger text-sm">{error}</div>
      )}
    </div>
  );
});

export default TextBox;