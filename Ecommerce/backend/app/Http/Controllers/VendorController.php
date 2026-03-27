<?php

namespace App\Http\Controllers;

use App\Models\Store;
use App\Traits\ImageUpload;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class VendorController extends Controller
{

    use ImageUpload;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

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
            'name' => 'required|string|max:255',
            'logo' => 'nullable|image|mimes:jpg,jpeg,png,gif|max:2048',
            'status' => 'required|in:active,inactive',
            'slug' => 'required|string|unique:stores,slug',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }
        $logoImage = null;
        if ($request->hasFile('logo')) {
            $logoImage = $this->tempImage($request->file('logo'), 'logo-image');
        }
        $vendor = Store::create(
            [
                'name' => $request->name,
                'user_id' => auth()->id(),
                'status' => $request->status,
                'slug' => $request->slug,
                'logo' => $logoImage,

            ]
        );
        return response()->json([
            'status' => 200,
            'message' => "Store Created Successfully!",
            'data' => $vendor,
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
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
