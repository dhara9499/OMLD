<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItems;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function addOrder(Request $request)
    {
        $response = [];
        try {
            $data = $request->all();

            if(!$data['productData'] || !$data['custData']) {
                $response = [
                    'message' => 'Invalid Data.'
                ];
                return response()->json($response);
            }
            $customerName = (isset($data['custData']['firstname']) ? $data['custData']['firstname'] : '') . (isset($data['custData']['lastname']) ? $data['custData']['lastname'] : '');
            $discount = (isset($data['discount']) && $data['discount']) ? $data['discount'] : 0;
            $subTotal = (isset($data['subTotal']) && $data['subTotal']) ? $data['subTotal'] : 0;
            $grandTotal = (isset($data['grandTotal']) && $data['grandTotal']) ? $data['grandTotal'] : 0;
            
            $orderData = [
                'customerId' => (isset($data['custData']['customerId']) && $data['custData']['customerId']) ? $data['custData']['customerId'] : 0,
                'grandTotal' => (isset($data['grandTotal']) && $data['grandTotal']) ? $data['grandTotal'] : 0,
                'subTotal' => $subTotal,
                'taxAmount' => (isset($data['taxAmount']) && $data['taxAmount']) ? $data['taxAmount'] : 0,
                'shippingAddressId' => (isset($data['custData']['shippingAddressId']) && $data['custData']['shippingAddressId']) ? $data['custData']['shippingAddressId'] : 0,
                'discount' => $discount,
                'discountType' => (isset($data['discountType']) && $data['discountType']) ? $data['discountType'] : 1
            ];

            $order = Order::create($orderData);

            $productData = $data['productData'];

            foreach($productData as $product) {
                $productId = (isset($product['id']) && $product['id']) ? $product['id'] : null;
                
                if(!$productId) {
                    continue;
                }

                $productName = (isset($product['name']) && $product['name']) ? $product['name'] : '';
                $sku = (isset($product['sku']) && $product['sku']) ? $product['sku'] : '';
                $qty = (isset($product['qty']) && $product['qty']) ? $product['qty'] : 0;
                $productCost = (isset($product['sellingPrice']) && $product['sellingPrice']) ? $product['sellingPrice'] : 0;
                $productTax = (isset($product['productTax']) && $product['productTax']) ? $product['productTax'] : 0;
                $productTotal = $productCost + $productTax;
                $rowCost = ($productCost * $qty);
                $rowTax = ($productTax * $qty);
                $rowTotal = ($productTotal * $qty);

                $orderItems = [
                    'productId' => $productId,
                    'orderId' => $order->orderId,
                    'qty' => $qty,
                    'sku' => $sku,
                    'name' => $productName,
                    'productCost' => $productCost,
                    'productTax' => $productTax,
                    'productTotal' => $productTotal,
                    'rowCost' => $rowCost,
                    'rowTax' => $rowTax,
                    'rowTotal' => $rowTotal
                ];

                $orderItems  = OrderItems::create($orderItems);
                $products[] = ['name' => $sku,
                'qty' => $qty,
                'productTotal' => $productTotal,
                'rowTotal' => $rowTotal];
            }

            $orderData = ['InvoiceId' => $order->orderId,
             'name' => $customerName,
             'total' => $subTotal,
             'discount' => $discount,
             'grandTotal' => $grandTotal,
             'products' => $products
        ];
        
        //update qty   
        $response = ['status' => 200,
                'orderData' => $orderData,
                    'message' => 'Order added successfully.'
                ];
        } catch(Error $e) {
            $response['message'] = $e->getMessage();
        }

        return response()->json($response);
        
    }

    public function getOrders() {
    
        $orders = DB::table('orders')
                ->join('order_items', 'orders.orderId', '=', 'order_items.orderId')
                ->select('orders.*', 'order_items.*')
                ->get()->toArray();
        
        $orderData = [];
        foreach($orders as $order) {
            if(!isset($orderData[$order->orderId])) {
                $orderData[$order->orderId] = [
                    'orderId' => $order->orderId,
                    'grandTotal' => $order->grandTotal,
                    'subTotal' => $order->subTotal,
                    'taxAmount' => $order->taxAmount,
                    'discount' => $order->discount,
                    'discountType' => $order->discountType,
                    'created_at' => $order->created_at
                ];
            }
            
            $orderData[$order->orderId]['orderItems'][] = ['itemId' => $order->itemId,
                'productId' => $order->productId,
                'qty' => $order->qty,
                'sku' => $order->sku,
                'name' => $order->name,
                'productCost' => $order->productCost,
                'productTax' => $order->productTax,
                'productTotal' => $order->productTotal,
                'rowCost' => $order->rowCost,
                'rowTax' => $order->rowTax,
                'rowTotal' => $order->rowTotal     
            ];
        }
        return response()->json(array_values($orderData));
    }
}
