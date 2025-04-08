<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use App\Models\Product;
use App\Models\Attribute;
use ReflectionObject;
use Illuminate\Database\Eloquent\Model;

class ProductController extends Controller
{
    public function addProducts(Request $request)
    {
        $response = [];
        try {
            $products = $request->all();
           

            $productAttributes = DB::table('attribute')
                                ->select('attributeCode', 'backendType', 'attributeId')
                                ->where('entityTypeId', '4')->get()->toArray();
            $attributeBackendTypes = array_combine(array_column($productAttributes, 'attributeCode'), array_column($productAttributes, 'backendType'));
            $attributeIds = array_combine(array_column($productAttributes, 'attributeCode'), array_column($productAttributes, 'attributeId'));
 
            foreach($products as $productData) {
               
                if(!(isset($productData['sku']) && $productData['sku'])) {
                    continue;
                }
                $product = new Product();
                foreach($productData as $key => $value) {
                    
                    if($key == 'sku') {
                        $product->sku = $value;
                        $product->entityTypeId = 4;
                        $product->save();
                    }
                    if(isset($attributeBackendTypes[$key])) {
                        $backendType = ($attributeBackendTypes[$key]);
                        $tableName = "product_" . $backendType;
                        DB::table($tableName)->insert([
                            'productId' => $product->productId,
                            'attributeId' => $attributeIds[$key],
                            'entityTypeId' => DB::raw(4),
                            'value' => $value,
                        ]);
                        
                    }
                }
            }
            $response = ['status' => 200,
                    'message' => 'Products added successfully.'
                ];
        } catch(Error $e) {
            $response['message'] = $e->getMessage();
        }

        return response()->json($response);
        
    }

    public function getProducts() {
    
        $attributes = Attribute::all()
                    ->where('entityTypeId', 4)
                    ->pluck('attributeCode', 'attributeId')
                    ->toArray();

        $products = Product::with(['productInt.attribute','productDecimal.attribute','productVarchar.attribute', 'productText.attribute'])->get();

        $productData = [];

        foreach ($products as $product) {
            $tempProduct = [];
            $tempProduct['id'] = $product->productId;
            
            foreach ($product->productInt as $productInt) {
                // $tempProduct['attributeId'] = $productInt->attribute->attributeId;
                $tempProduct[$attributes[$productInt->attribute->attributeId]] = $productInt->value;
            }

            foreach ($product->productDecimal as $productDecimal) {
                // $tempProduct['attributeId'] = $productDecimal->attribute->attributeId;
                $tempProduct[$attributes[$productDecimal->attribute->attributeId]] = $productDecimal->value;
            }

            foreach ($product->productVarchar as $productVarchar) {
                // $tempProduct['attributeId'] = $productVarchar->attribute->attributeId;
                $tempProduct[$attributes[$productVarchar->attribute->attributeId]] = $productVarchar->value;
            }

            foreach ($product->productText as $productText) {
                // $tempProduct['attributeId'] = $productText->attribute->attributeId;
                $tempProduct[$attributes[$productText->attribute->attributeId]] = $productText->value;
            }
            $productData[] = $tempProduct;
        }
        return response()->json($productData);
    }
}
