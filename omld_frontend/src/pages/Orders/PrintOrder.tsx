import React, { useRef } from "react";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "../../layout/DefaultLayout";
import Button1 from "../../components/UiElements/Button1";

const PrintOrder = (props: any) => {
    const invoiceRef = useRef<HTMLDivElement | null>(null);
    const printOrder = () => {
        
        if (invoiceRef.current) {
            // Ensure the ref is not null before accessing its innerHTML
            const printContents = invoiceRef.current.innerHTML;
            const originalContents = document.body.innerHTML;
      
            document.body.innerHTML = printContents;
            window.print();
            document.body.innerHTML = originalContents;
      
            window.location.reload(); // Reload to restore the page content
          } else {
            console.error("Invoice content not found for printing.");
          }
      };

    return ( 
        <div className="flex justify-end mb-2">
            <div ref={invoiceRef} className="max-w-2xl mx-auto p-4 bg-white shadow-md border rounded-md">
                <div className="text-center mb-4">
                {/* <h1 className="text-2xl font-bold text-red-600">OM Lights & Decor</h1> */}
                <p className="text-sm">All Kind of Decorative Lights and Home Decor Items</p>
                <p className="text-sm">At Pancheshwar Tower Jamnagar, Gujarat (INDIA)</p>
                <p className="text-sm">
                    M: +91 75678 91115 | M: +91 90909 00038 | M: +91 98248 36580 | M: +91 81538 93653
                </p>
                </div>
            
                <div className="flex justify-between mb-4">
                    <div>
                        <p className="font-bold">M/s: <span className="font-normal">{props.orderData.name}</span></p>
                        <p className="font-bold">Address: <span className="font-normal"></span></p>
                        <p className="font-bold">GSTIN: <span className="font-normal"></span></p>
                    </div>
                    <div>
                        <p className="font-bold">Invoice No: <span className="font-normal">{props.orderData.InvoiceId}</span></p>
                        <p className="font-bold">Date: <span className="font-normal">09/03/2024</span></p>
                    </div>
                </div>
            
                <div className="border rounded-md overflow-hidden mb-4">
                    <table className="table-auto w-full text-left border-collapse">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="border px-4 py-2">No.</th>
                            <th className="border px-4 py-2">Particulars</th>
                            <th className="border px-4 py-2 text-center">Qty</th>
                            <th className="border px-4 py-2 text-right">Rate</th>
                            <th className="border px-4 py-2 text-right">Amount Rs.</th>
                        </tr>
                        </thead>
                        <tbody>
                        {props.orderData.products && props.orderData.products.map((product, index) => (
                            <tr key={index}>
                                <td className="border px-4 py-2">{index + 1}</td> {/* Serial Number */}
                                <td className="border px-4 py-2">{product.name}</td>
                                <td className="border px-4 py-2 text-center">{product.qty}</td>
                                <td className="border px-4 py-2 text-right">{product.productTotal}</td>
                                <td className="border px-4 py-2 text-right">{product.rowTotal}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            
                <div className="text-right">
                    <div className="mb-2">
                        <span className="font-bold">Total:</span>
                        <span>{props.orderData.total}</span>
                    </div>
                    <div className="mb-2">
                        <span className="font-bold">Discount:</span>
                        <span>{props.orderData.discount}</span>
                    </div>
                    <div className="text-lg font-bold">
                        <span>G. Total:</span>
                        <span>{props.orderData.grandTotal}</span>
                    </div>
                </div>
            
                <div className="mt-4 text-sm text-center">
                    <p>E.&O.E.</p>
                    <p className="text-red-600 font-bold">No Return | No Refund</p>
                    <p>Conditions:</p>
                    <ul className="text-left list-disc list-inside">
                        <li>Subject to Jamnagar Jurisdiction Only.</li>
                        <li>Goods Once Sold Cannot Be Taken Back.</li>
                        <li>Payment within __ Days.</li>
                        <li>We Are Not Responsible for Breakage Theft or Damage.</li>
                        <li>Interest 21% Will Be Charged on All Unpaid Bills After 15 Days.</li>
                    </ul>
                    <p className="font-bold mt-2">For, OM Lights & Decor</p>
                    <p className="mt-1">Partner</p>
                </div>
            </div>

            <Button1 title={"Print Order"} onClick={printOrder}/>
      </div>
    );
};

export default PrintOrder;