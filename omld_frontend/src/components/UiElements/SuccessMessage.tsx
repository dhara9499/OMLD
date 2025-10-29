import React, { forwardRef, InputHTMLAttributes } from 'react';

interface AlertsProps {
    successMessages: string[];
    onClick: (event: InputHTMLAttributes<HTMLInputElement>) => void;
}

const SuccessMessage = forwardRef<HTMLInputElement, AlertsProps>((props) => {
    const { successMessages, onClick } = props;

    return (
        <div className="flex w-full border-l-6 border-[#22C55E] bg-[#22C55E] bg-opacity-[15%] px-7 py-8 shadow-md dark:bg-[#1B1B24] dark:bg-opacity-30 md:p-4">
            <div
                onClick={onClick}
                className="mr-5 flex h-9 w-full max-w-[36px] items-center justify-center rounded-lg bg-[#22C55E]"
            >
                <svg
                    width="13"
                    height="13"
                    viewBox="0 0 13 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M5.00004 9.25L2.25004 6.5L1.33337 7.41667L5.00004 11.0833L12.0834 4.00001L11.1667 3.08334L5.00004 9.25Z"
                        fill="#ffffff"
                    />
                </svg>
            </div>
            <div className="w-full">
                <ul>
                    {successMessages.length > 0 &&
                        successMessages.map((message, index) => (
                            <li
                                key={index}
                                className="leading-relaxed text-[#22C55E] dark:text-[#A3E635]"
                            >
                                {message}
                            </li>
                        ))}
                </ul>
            </div>
        </div>
    );
});

export default SuccessMessage;