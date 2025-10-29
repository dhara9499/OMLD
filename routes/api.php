<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AttributeController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\OrderController;

// Route::get('/user', function (Request $request) {
//     Route::post('/addNewProducts', [AuthController::class, 'addNewProducts']);
//     return $request->user();
// })->middleware('auth:sanctum');


Route::middleware('auth:sanctum')->group(function () {
    Route::post('/addNewProducts', [AuthController::class, 'addNewProducts']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/getEntityTypeOptions', [AttributeController::class, 'getEntityTypeOptions']);
    Route::post('/addAttribute', [AttributeController::class, 'addAttribute']);
    Route::post('/addAttributes', [AttributeController::class, 'addAttributes']);
    Route::get('/getAttributes', [AttributeController::class, 'getAttributes']);
    Route::get('/downloadAttributeSampleCsv', [AttributeController::class, 'downloadSampleCsv']);
    Route::get('/getAttribute/{id}', [AttributeController::class, 'getAttribute']);
    Route::put('/updateAttribute/{id}', [AttributeController::class, 'updateAttribute']);
    Route::post('/deleteAttribute/{id}', [AttributeController::class, 'deleteAttribute']);
    Route::get('/getCategories', [CategoryController::class, 'getCategories']);
    Route::get('/getProducts', [ProductController::class, 'getProducts']);
    Route::post('/addProducts', [ProductController::class, 'addProducts']);
    Route::post('/addProduct', [ProductController::class, 'addProduct']);
    Route::post('/checkIsCustomerAdded', [CustomerController::class, 'checkIsCustomerAdded']);
    Route::post('/addCustomer', [CustomerController::class, 'addCustomer']);
    Route::post('/addOrder', [OrderController::class, 'addOrder']);
    Route::get('/getOrders', [OrderController::class, 'getOrders']);
    Route::get('/downloadProductSampleCsv', [ProductController::class, 'downloadSampleCsv']);
    Route::get('/getProductAttributes', [ProductController::class, 'getProductAttributes']);
    Route::post('/checkSkuExists', [ProductController::class, 'checkSkuExists']);
});

Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/test', [AuthController::class, 'test']);

