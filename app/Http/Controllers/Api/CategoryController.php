<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Attribute;
use Illuminate\Support\Facades\DB;

class CategoryController extends Controller
{
    public function getCategories() {

        $response = [];
        try {
            $attributeId = Attribute::where('attributeCode', 'name')->where('entityTypeId', '3')->value('attributeId');

            $categories = DB::table('category as cat')
            ->join('catalog_category_varchar as ccv',function ($join) use ($attributeId) {
                $join->on('cat.categoryId', '=', 'ccv.categoryId')
                    ->on('ccv.attributeId', '=', DB::raw($attributeId));
            })
            ->select('cat.categoryId', 'ccv.value as name' , 'cat.parentId', 'cat.path')
            // ->orderBy('cat.level', 'desc')
            ->get();

            $categoriesName = DB::table('category as cat')
            ->join('catalog_category_varchar as ccv',function ($join) use ($attributeId) {
                $join->on('cat.categoryId', '=', 'ccv.categoryId')
                    ->on('ccv.attributeId', '=', DB::raw($attributeId));
            })
            ->pluck('ccv.value as name', 'cat.categoryId');

            $count = 0;
            // $categories = array('Accessories/Apron' ,
            //     'Accessories/Banners',
            //     'Accessories/Belts',
            //     'Brand/Brand1',
            //     'Brand/Brand2',
            //     'Apparel/Men/Belts',
            //     'Apparel/Men/Socks',
            //     'Apparel/Women/Leggings'
            // );
            $categoryData = [];
            foreach($categories as $category) {
                echo "round " . $category->path;
                // echo "<br>";
                // echo "----------------------------------";
                // echo "<br>";
                // echo $category;
                $levels = explode('/', $category->path);
                // $levels = explode('/', $category);
                // $category_name = $levels[0];
                $category_name =  $categoriesName[$levels[0]];
                array_shift($levels);
                echo "<pre>";
                print_r($levels);

                // // if(!array_key_exists($category_name,$categories)) {
                // //     $categoryData[$category_name] = array();
                // // }
                if(!array_key_exists($category_name,$categoryData)) {
                    $categoryData[$category_name] = [];
                }
                // // echo $category_name;
                // // echo "<br>";
                $tmp = &$categoryData[$category_name];
                // // echo "<br>......tmp";
                // // print_r($tmp);
                    
                foreach($levels as $index => $val){
                    // echo "index ". $index;
                    // echo "<br>";
                    // echo "val ".$categoriesName[$val];
                    echo "val ".$val;
                    echo "<br>";
                    if($index + 1 === count($levels) ){
                        echo "if";
                        echo "<br>";
                        // $tmp[$val] = $categoriesName[$val];
                        $tmp[] = $val;
                        // print_r($tmp);
                    } 
                    else {
                        print_r($tmp);
                        echo "val: " . $val;
                        if($preadd= array_search($val, $tmp)) {
                            unset($tmp[$preadd]);
                        }
                         
                        $i = $this->find_index($tmp , $val);
                        echo "i:  " . $i;
                        echo "<br>....count: ";
                        echo count($tmp);
                        try {
                            var_dump($i == count($tmp));
                            echo $val;
                            ini_set('display_errors', 1);
                            error_reporting(E_ALL);
                            if( $i == count($tmp) ) { // object not found , we create a new sub array
                                echo "<pre>";
                                var_dump($val);
                                if(!$val || !$tmp) {
                                    echo "EROOR,,,,,,,,,,,,,,,,,";
                                    break;
                                }
                                // error_log('Before adding to $tmp: ' . print_r($tmp, true));
                                // $tmp[] = array($val => array());
                                // error_log('After adding to $tmp: ' . print_r($tmp, true));
                            }
                            // $tmp = &$tmp[$i][$val];
                        } catch(Exception $e) {
                            echo $e->getMessage();
                        }
                        
                        
                    }
                    if($index > 4) {
                        break;
                    }
                    echo "<pre>";
                    print_r($categoryData);
                }
                // echo "<br>";
                // print_r($tmp);
            //    if($count > 1) {
            //     break;
            //    }
            //    $count++;
            }
            
            // print_r($categoryData);
            $response = ['status' => 200,
                'categories' => $categories
            ];
        } catch(Error $e) {
            print_r($e->getMessage());
            $response['message'] = $e->getMessage();
        }
        return response()->json($response);
    }


    public function find_index($array , $key) {
        print_r($array);
        echo "<br>...key ";
        echo $key;
        echo "<br>";
        foreach($array as $i => $val ) {
            echo "<pre>......";
            var_dump(is_array($val));
            if(is_array($val) && array_key_exists($key , $val) ){
                return $i ;
            }
        }
        return count($array);
    }
}
