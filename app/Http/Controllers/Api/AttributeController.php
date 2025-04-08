<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\EntityType;
use App\Models\Attribute;
use App\Models\AttributeOption;
use App\Models\AttributeOptionValue;
use http\Env\Response;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\SignupRequest;
use Illuminate\Support\Facades\DB;


class AttributeController extends Controller
{
    public function getEntityTypeOptions() {
        $options = EntityType::select('entityTypeId as key', 
        DB::raw("CONCAT(UPPER(LEFT(REPLACE(entityTypeCode, '_', ' '), 1)), LOWER(SUBSTRING(REPLACE(entityTypeCode, '_', ' '), 2))) as value"))->get();
     // Fetch all options from the database
        return response()->json($options);
    }

    public function addAttribute(Request $request) {
        $response = [];
        try {
            $posts = $request->all();
            $attributeCode = $posts['attributeCode'] ?? $posts['attributeCode'];
            $entityTypeId = $posts['entityTypeId'] ?? $posts['entityTypeId']; 
            $attributeExists = DB::table('attribute')
                                ->where('attributeCode', $attributeCode)
                                ->where('entityTypeId', $entityTypeId)
                                ->first();

            if($attributeExists) {
                $response = ['status' => 409,
                    'message' => 'Attribute Already exists.'
                ];

                return response()->json($response);
            }

            $attribute = new Attribute();
            $attribute->attributeCode = strtolower($attributeCode);
            $attribute->entityTypeId = $entityTypeId;
            $attribute->backendType = $posts['backendType'];
            $attribute->frontendType = $posts['frontendType'];
            $attribute->frontendLabel = $posts['frontendLabel'];
            if($posts['defaultValue']) {
                $attribute->defaultValue = $posts['defaultValue'];
            }
            if($posts['isRequired']) {
                $attribute->isRequired = $posts['isRequired'];
            }
            $attribute->save();
            
            if($posts['options']) {
                foreach($posts['options'] as $postOption) {
                    $options = AttributeOption::create([
                        'attributeId' => $attribute->attributeId
                    ]);
                    $values = AttributeOptionValue::create([
                        'optionId' => $options->optionId,
                        'optionLabel' => $postOption['OptionLabel'],
                        'value' => $postOption['Value']
                    ]);
                    if(isset($postOption['defaultValue']) && $postOption['defaultValue']) {
                        $attribute->defaultValue = $options->optionId;
                        $attribute->save();
                    }
                }
            }
            $response = ['status' => 200,
                    'message' => 'Attribute added successfully.'
                ];
        } catch(Error $e) {
            $response['message'] = $e->getMessage();
        }

        return response()->json($response);

    }


    public function getAttributes() {
        $attributes = Attribute::all();

        $attributesArray = $attributes->toArray();
        $options = EntityType::pluck('entityTypeCode','entityTypeId')->toArray();
        
        foreach($attributesArray as &$attributeArray) {
            $attributeArray['entityTypeCode'] = ucfirst($options[$attributeArray['entityTypeId']]);
        }
        // \Log::info($attributesArray);

        return response()->json($attributesArray);
    }

    public function addAttributes(Request $request)
    {
        $response = [];
        try {
            $attributes = $request->all();
            
            foreach($attributes as $key => $attributeData) {
                $attribute = new Attribute();
                $attribute->attributeCode = isset($attributeData['attributeCode']) ? $attributeData['attributeCode'] : '';
                $attribute->entityTypeId = $attributeData['entityTypeId'];
                $attribute->backendType = $attributeData['backendType'];
                $attribute->frontendType = $attributeData['frontendType'];
                $attribute->frontendLabel = $attributeData['frontendLabel'];
                if(isset($attributeData['defaultValue']) &&  $attributeData['defaultValue']) {
                    $attribute->defaultValue = $attributeData['defaultValue'];
                }
                if(isset($attributeData['isRequired']) && $attributeData['isRequired']) {
                    $attribute->isRequired = $attributeData['isRequired'];
                }
                $attribute->save();
            }
            $response = ['status' => 200,
                    'message' => 'Attributes added successfully.'
                ];
        } catch(Error $e) {
            $response['message'] = $e->getMessage();
        }

        return response()->json($response);
        
    }
} 