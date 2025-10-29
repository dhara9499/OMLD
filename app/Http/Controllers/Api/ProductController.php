<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use App\Models\Product;
use App\Models\Attribute;
use ReflectionObject;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Response;


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
                    $response = ['status' => 500,
                    'Please enter valid columns. Try download sample csv'];
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
            if(count($response) === 0){
                $response = ['status' => 200,
                    'message' => 'Products added successfully.'
                ];
            }
            
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
            $tempProduct['sku'] = $product->sku;
            
            foreach ($product->productInt as $productInt) {
                $tempProduct[$attributes[$productInt->attribute->attributeId]] = $productInt->value;
            }

            foreach ($product->productDecimal as $productDecimal) {
                $tempProduct[$attributes[$productDecimal->attribute->attributeId]] = $productDecimal->value;
            }

            foreach ($product->productVarchar as $productVarchar) {
                $tempProduct[$attributes[$productVarchar->attribute->attributeId]] = $productVarchar->value;
            }

            foreach ($product->productText as $productText) {
                $tempProduct[$attributes[$productText->attribute->attributeId]] = $productText->value;
            }
            $productData[] = $tempProduct;
        }
        return response()->json($productData);
    }

    public function downloadSampleCsv() {
        $filePath = storage_path('app/public/sampleCsvFiles/productSample.csv');
        return Response::download($filePath);
    }

    public function getProductAttributes() {
        $productAttributes = DB::table('attribute')
                                ->select('attribute.attributeCode', 'attribute.backendType', 'attribute.attributeId','attribute.frontendType')
                                ->where('entityTypeId', '4')
                                ->whereNotIn('attributeCode', ['sku', 'name'])
                                ->get()
                                ->map(fn($item) => (array) $item)
                                ->toArray();

        
        foreach($productAttributes as $key => $productAttribute) {
            if($productAttribute['frontendType'] !== 'select') {
                continue;
            } 
            
            $options = DB::table('attribute_option')
                        ->select('attribute_option.optionId', 'attribute_option.attributeId', 'option_value.value as key','option_value.optionLabel as value')
                        ->join('attribute_option_value as option_value', 'attribute_option.optionId', '=', 'option_value.optionId')
                        ->where('attribute_option.attributeId', $productAttribute['attributeId'])
                        ->get()
                        ->toArray();

             $productAttributes[$key]['options'] = $options;           
// echo "<pre>";
//             print_r($options);

        }

        // echo "<pre>";
        
        // print_r($productAttributes);
        return response()->json($productAttributes);

    }

    public function checkSkuExists(Request $request)
    {
        $sku = $request->input('sku');
        $product = Product::where('sku', $sku)->first();

        if ($product) {
            return response()->json(['exists' => true]);
        }

        return response()->json(['exists' => false]);
    }

    public function addProduct(Request $request)
    {
        $response = [];
        try {
            $productData = $request->all();

            $productAttributes = DB::table('attribute')
                                ->select('attributeCode', 'backendType', 'attributeId')
                                ->where('entityTypeId', '4')->get()->toArray();
            $attributeBackendTypes = array_combine(array_column($productAttributes, 'attributeCode'), array_column($productAttributes, 'backendType'));
            $attributeIds = array_combine(array_column($productAttributes, 'attributeCode'), array_column($productAttributes, 'attributeId'));
 
            if(!(isset($productData['sku']) && $productData['sku'])) {
                $response = ['status' => 500,
                'SKU not found!'];
                return response()->json($response);
            }
            $product = new Product();
            $product->sku = $productData['sku'];
            $product->entityTypeId = 4;
            $product->save();

            if(isset($productData['name']) && $productData['name']) {
                $productData['attributes']['name'] = $productData['name'];
            }
            
            if((isset($productData['attributes']) && $productData['attributes'])) {
                foreach($productData['attributes'] as $key => $value) {
                    // echo "<pre>";
                    // print_r($attributeBackendTypes);
                    // echo $key;
                    if($product->productId && isset($attributeBackendTypes[$key])) {
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

            if((isset($productData['categories']) && $productData['categories'])) {

                foreach($productData['categories'] as $categoryId) {
                    $tableName = "catalog_category_product";
                    DB::table($tableName)->insert([
                    'productId' => $product->productId,
                    'categoryId' => $categoryId,
                    ]);
                }
            }
            if(count($response) === 0){
                $response = ['status' => 200,
                    'message' => 'Products added successfully.'
                ];
            }
            
        } catch(Error $e) {
            $response['message'] = $e->getMessage();
        }

        return response()->json($response);
        
    }
}
