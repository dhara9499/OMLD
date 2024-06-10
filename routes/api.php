<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AttributeController;

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
});

Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/test', [AuthController::class, 'test']);

