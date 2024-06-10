<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\EntityType;
use http\Env\Response;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\SignupRequest;

class AttributeController extends Controller
{
    public function getEntityTypeOptions() {
        $options = EntityType::all(); // Fetch all options from the database
        return response()->json($options);
    }
} 