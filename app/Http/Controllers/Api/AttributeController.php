<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\EntityType;
use App\Models\Attribute;
use App\Models\AttributeOption;
use App\Models\AttributeOptionValue;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\SignupRequest;
use Illuminate\Support\Facades\DB;


class AttributeController extends Controller
{
    public function getEntityTypeOptions() {
        $options = EntityType::select('entityTypeId as key', 
        DB::raw("CONCAT(UPPER(LEFT(REPLACE(entityTypeCode, '_', ' '), 1)), LOWER(SUBSTRING(REPLACE(entityTypeCode, '_', ' '), 2))) as value"))
        ->orderBy('entityTypeId', 'asc')
        ->get();
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
    
    public function downloadSampleCsv() {
        $filePath = storage_path('app/public/sampleCsvFiles/attributeSample.csv');
        return Response::download($filePath);
    }

    public function getAttribute($id) {
        try {
            $attribute = Attribute::with(['options.values'])->find($id);
            
            if (!$attribute) {
                return response()->json(['status' => 404, 'message' => 'Attribute not found'], 404);
            }

            $attributeData = $attribute->toArray();
            
            if ($attribute->options) {
                $attributeData['options'] = $attribute->options->map(function($option) {
                    return [
                        'optionLabel' => $option->values->optionLabel,
                        'value' => $option->values->value,
                        'isDefault' => $option->optionId == $attribute->defaultValue ? 1 : 0
                    ];
                });
            }

            return response()->json($attributeData);
        } catch (\Exception $e) {
            return response()->json(['status' => 500, 'message' => $e->getMessage()], 500);
        }
    }

    public function updateAttribute(Request $request, $id) {
        try {
            $attribute = Attribute::find($id);
            
            if (!$attribute) {
                return response()->json(['status' => 404, 'message' => 'Attribute not found'], 404);
            }

            $posts = $request->all();

            // Check if attribute code already exists for another attribute
            $attributeExists = DB::table('attribute')
                                ->where('attributeCode', $posts['attributeCode'])
                                ->where('entityTypeId', $posts['entityTypeId'])
                                ->where('attributeId', '!=', $id)
                                ->first();

            if($attributeExists) {
                return response()->json([
                    'status' => 409,
                    'message' => 'Attribute code already exists.'
                ]);
            }

            // Update attribute fields
            $attribute->attributeCode = strtolower($posts['attributeCode']);
            $attribute->entityTypeId = $posts['entityTypeId'];
            $attribute->backendType = $posts['backendType'];
            $attribute->frontendType = $posts['frontendType'];
            $attribute->frontendLabel = $posts['frontendLabel'];
            $attribute->defaultValue = $posts['defaultValue'] ?? null;
            $attribute->isRequired = $posts['isRequired'] ?? false;
            $attribute->save();

            // Delete existing options
            if ($attribute->options) {
                foreach ($attribute->options as $option) {
                    $option->values()->delete();
                    $option->delete();
                }
            }

            // Add new options
            if(isset($posts['options']) && is_array($posts['options'])) {
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

            return response()->json([
                'status' => 200,
                'message' => 'Attribute updated successfully.'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 500, 
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function deleteAttribute($id) {
        try {
            
            $attribute = Attribute::findOrFail($id);
            $attribute->productText()->delete();
            $attribute->delete();

            return response()->json([
                'status' => 200,
                'message' => 'Attribute deleted successfully.'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 500, 
                'message' => $e->getMessage()
            ], 500);
        }
    }
}