import React, { useState, useEffect, useRef, LegacyRef, RefObject, ChangeEvent, InputHTMLAttributes } from 'react';
import { forwardRef, Ref, HTMLProps } from 'react';

interface FileUploadProps  extends HTMLProps<HTMLInputElement> {
    id: string;
    accept: string;
    onChange: (event: InputHTMLAttributes<HTMLInputElement>) => void;
  }
  
  const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>((props, ref)  => {
    const { id, accept, onChange } = props;
    return <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
                File upload
            </h3>
        </div>
        <div className="flex flex-col gap-5.5 p-6.5">
            <div>
                <label className="mb-3 block text-black dark:text-white">
                    Attach file
                </label>
                <input
                    type="file"
                    id= {id}
                    accept={accept}
                    ref={ref}
                    onChange={onChange}
                    className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary" />
            </div>
        </div>
    </div>;
});

export default FileUpload;