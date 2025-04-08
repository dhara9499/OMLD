<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Customer;
use App\Models\Attribute;
use Illuminate\Support\Facades\Log;

class CustomerController extends Controller
{

    public function checkIsCustomerAdded(Request $request) {
        $response = [];
        try {
            $posts = $request->all();
            $email = $posts['email'] ?? $posts['email'];

            $isCustomerAdded = DB::table('customer')
                                ->where('email', $email)
                                ->first();
            
            if(!$isCustomerAdded) {

               
                $response = ['status' => 200,
                    'message' => 'customer not available',
                    'isCustomerAdded' => false
                ];
            } else {
                $attributes = Attribute::all()
                    ->where('entityTypeId', 1)
                    ->whereIn('attributeCode', ['firstname', 'lastname', 'mobilenumber'])
                    ->pluck('attributeCode', 'attributeId')
                    ->toArray();
                $customers = Customer::with(['customerVarchar.attribute'])->get();
                
                $customerData['customerId'] = $isCustomerAdded->customerId;
                $customerData['email'] = $email;

                foreach($customers as $customer) {
                    foreach ($customer->customerVarchar as $customerVarchar) {
                        $customerData[$attributes[$customerVarchar->attribute->attributeId]] = $customerVarchar->value;
                    }
                }

                $response = ['status' => 200,
                    'message' => 'customer already exists.',
                    'customerData' => $customerData,
                    'isCustomerAdded' => true
                ];
            }
        } catch(Error $e) {
            $response['message'] = $e->getMessage();
        }

        return response()->json($response);
    }


    public function addCustomer(Request $request) {
        $response = [];
        try {
            $posts = $request->all();
        
            $email = $posts['email'];
            $customer = new Customer();
            $customer->email = $email;
            $customer->entityTypeId = 1;
            
            $customer->save();

            unset($posts['email']);
            
            $customerAttributes = DB::table('attribute')
                                ->select('attributeCode', 'backendType', 'attributeId')
                                ->where('entityTypeId', '1')->get()->toArray();
            $attributeBackendTypes = array_combine(array_column($customerAttributes, 'attributeCode'), array_column($customerAttributes, 'backendType'));
            $attributeIds = array_combine(array_column($customerAttributes, 'attributeCode'), array_column($customerAttributes, 'attributeId'));

            foreach($posts as $key => $value) {
                if(isset($attributeBackendTypes[$key])) {
                    $backendType = ($attributeBackendTypes[$key]);
                    $tableName = "customer_" . $backendType;
                    DB::table($tableName)->insert([
                        'customerId' => $customer->customerId,
                        'attributeId' => $attributeIds[$key],
                        'entityTypeId' => DB::raw(1),
                        'value' => $value,
                    ]);
                }
            }            
            
            $response = ['status' => 200,
                    'message' => 'Customer added successfully.'
                ];
        } catch(Error $e) {
            $response['message'] = $e->getMessage();
        }

        return response()->json($response);

    }
}
