<?php

namespace App\Http\Controllers;

use App\Models\Store;
use App\Traits\ImageUpload;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class VendorController extends Controller
{

    use ImageUpload;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        if (auth()->user()->hasRole('admin')) {
            $stores = Store::orderBy('created_at', 'ASC')->get();
            return response()->json([
                'status' => 200,
                'data' => $stores,
            ]);
        } else {
            $stores = Store::orderBy('created_at', 'ASC')->where("user_id", Auth::id())->get();
            return response()->json([
                'status' => 200,
                'data' => $stores,
            ]);
        }
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
        $user = auth()->user();
        if ($user->store()->exists()) {
            return response()->json([
                'status' => 400,
                'message' => 'You already have a store'
            ], 200);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'logo' => 'nullable|image|mimes:jpg,jpeg,png,gif|max:2048',
            'status' => 'required|in:active,inactive',

        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->errors()
            ], 422);
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
                'slug' => Str::slug($request->name),
                'logo' => $logoImage,
                'is_approved' => 'pending',

            ]
        );
        if (!$user->hasRole('vendor')) {
            $user->syncRoles(['vendor']);
        }

        return response()->json([
            'status' => 200,
            'message' => 'Store created, waiting for admin approval',
            'data' => $vendor,
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $store = Store::findOrFail($id);

        if ($store == null) {
            return response()->json([
                'status' => 404,
                'message' => "Store Not Found!",
                'data' => []
            ], 404);
        }
        return response()->json([
            'status' => 200,
            'data' => $store,
        ], 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $store = Store::findOrFail($id);
        return response()->json([
            'data' => $store,
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $store = Store::findOrFail($id);

        if ($store == null) {
            return response()->json([
                'status' => 404,
                'message' => "Store Not Found!",
                'data' => []
            ], 404);
        }
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'logo' => 'nullable|image|mimes:jpg,jpeg,png,gif|max:2048',
            'status' => 'required|in:active,inactive',
            'slug' => 'required|string|unique:stores,slug,' . $id,
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

        $store->update([
            'name' => $request->name,
            'user_id' => auth()->id(),
            'status' => $request->status,
            'slug' => Str::slug($request->name),
            'logo' => $logoImage,
        ]);

        return response()->json([
            'status' => 200,
            'message' => "Store Updated Successfully!",
            'data' => $store,
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $store = Store::findOrFail($id);
        $store->delete();
        return response()->json([
            'status' => 200,
            'message' => "Store Deleted Successfully!",

        ], 200);
    }
}
