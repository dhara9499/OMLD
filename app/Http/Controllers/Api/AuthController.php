<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\AddNewProducts;
use App\Models\User;
use http\Env\Response;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\SignupRequest;

class AuthController extends Controller
{
    public function addNewProducts(Request $request)
    {
        $posts = $request->all();
        // echo "<pre>";
        // print_r($posts); 
        // die;
        return response()->json($posts);
    }

    public function signup(SignupRequest $request)
    {
        $data = $request->validated();
        /** @var \App\Models\User $user */
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
        ]);

        $token = $user->createToken('main')->plainTextToken;
        return response(compact('user', 'token'));
    }

    public function login(LoginRequest $request)
    {
       
        $credentials = $request->validated();
        
        
        if (!Auth::attempt($credentials)) {
            return response([
                'message' => 'Provided email or password is incorrect'
            ], 422);
        }

        /** @var \App\Models\User $user */
        $user = Auth::user();
        $token = $user->createToken('main')->plainTextToken;
        return response(compact('user', 'token'));
    }

    public function logout(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = $request->user();
        $user->currentAccessToken()->delete();
        return response('', 204);
    }

    // public function   test() {
    //     $user = User::find(2);
    //     echo "<pre>";
    //     print_r($user);
    //     die;
    // }
}
