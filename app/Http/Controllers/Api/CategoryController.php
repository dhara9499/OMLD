<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Attribute;
use Illuminate\Support\Facades\DB;
use App\Models\Category;

class CategoryController extends Controller
{

    public function orderedCategoryTree($categories, $categoriesName = [])
    {
        $flat = [];
        foreach ($categories as $category) {
            $id = $category['categoryId'];
            $name = ($categoriesName && isset($categoriesName[$id])) ? $categoriesName[$id] : '';
            $item = [
                'id' => $id,
                'name' => $name,
                'parent_id' => $category['parentId'],
                'level' => $category['level'],
            ];

            $flat[] = $item;

            if (!empty($category['children'])) {
                $flat = array_merge($flat, $this->orderedCategoryTree($category['children'], $categoriesName));
            }
        }

        return $flat;
    }

    public function getCategories() {

        $response = [];
        try {
            $categoriesName = DB::table('catalog_category_varchar as ccv')
                            ->pluck('ccv.value as name', 'ccv.categoryId');
            $categories = Category::where('parentId', '=', 0)->with('children')->get();

            $categoryData = $this->orderedCategoryTree($categories, $categoriesName);;
            
            // echo "<pre>";
            // print_r($categoryData);

            $response = ['status' => 200,
                'categories' => $categoryData
            ];
        } catch(Error $e) {
            print_r($e->getMessage());
            $response['message'] = $e->getMessage();
        }
        return response()->json($response);
    }
}
