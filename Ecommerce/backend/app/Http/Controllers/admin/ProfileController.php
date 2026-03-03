<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ProfileController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index() {}

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'phone_num' => 'required|string',
            'city'      => 'required|string|max:255',
            'state'     => 'required|string|max:255',
            'zip'       => 'required|string|max:10',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        Profile::updateOrCreate(
            ['user_id' => Auth::id()],
            [
                'phone_num' => $request->phone_num,
                'city' => $request->city,
                'state' => $request->state,
                'zip' => $request->zip,
            ]
        );

        return response()->json([
            'status' => 200,
            'message' => "Profile Updated successfully",

        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show()
    {
        $profile = Profile::where('user_id', Auth::id())->first();

        if (!$profile) {
            return response()->json([
                'status' => 404,
                'message' => "Profile Not Found!",
                'data' => []
            ], 404);
        }
        return response()->json([
            'status' => 200,
            'data' => $profile,
        ], 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
