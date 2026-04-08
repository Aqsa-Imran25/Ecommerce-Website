<?php

namespace App\Http\Controllers;

use App\Models\Order;
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
        } else if (auth()->user()->hasRole(['vendor', 'user'])) {
            $stores = Store::orderBy('created_at', 'ASC')->where("user_id", Auth::id())
                // ->where('status','active')
                ->get();
            return response()->json([
                'status' => 200,
                'data' => $stores,
            ]);
        }
    }

    public function activeStore()
    {
        if (auth()->user()->hasRole('admin')) {
            $stores = Store::orderBy('created_at', 'ASC')->where('status', 'active')->get();
            return response()->json([
                'status' => 200,
                'data' => $stores,
            ]);
        } else if (auth()->user()->hasRole(['vendor', 'user'])) {
            $stores = Store::orderBy('created_at', 'ASC')->where("user_id", Auth::id())
                ->where('status', 'active')
                ->get();
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

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'logo' => 'nullable|image|mimes:jpg,jpeg,png,gif|max:2048',

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
                'user_id' => auth()->id(),
                'name' => $request->name,
                'status' => 'pending',
                'logo' => $logoImage,
                'slug' => Str::slug($request->name),

            ]
        );

        return response()->json([
            'status' => 200,
            'message' => 'Your Store created, waiting for admin approval',
            'data' => $vendor,
        ], 200);
    }
    // approve-store

    public function approvedStore($id)
    {
        $store = Store::findOrFail($id);
        $store->status = 'active';
        $store->save();

        $user = $store->user;
        $user->syncRoles(['vendor']);

        return response()->json([
            'status' => 200,
            'user' => $user,
            'message' => 'Store approved and vendor role assigned'
        ]);
    }

    // method
    private function updateStatus($id, $status, $message)
    {
        $store = Store::findOrFail($id);
        $store->status = $status;
        $store->save();

        return response()->json([
            'status' => 200,
            'message' => $message,
        ], 200);
    }


    public function rejectedStore($id)
    {
        return $this->updateStatus($id, 'rejected', 'Store rejected successfully!');
    }

    public function pendingStore($id)
    {
        return $this->updateStatus($id, 'pending', 'Store set to pending!');
    }

    // store-status
    public function statusStore($id)
    {
        $store = Store::where('id', $id)
            ->where('user_id', auth()->id())
            ->firstOrFail();
        if ($store->status !== 'active') {
            return response()->json([
                'success' => false,
                'status' => $store->status,
                'message' => 'Store not approved'
            ], 403);
        }

        return response()->json([
            'success' => true,
            'status' => $store->status,
            'message' => 'Store is active'
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
            'status' => 200,
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
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        $logoImage = $store->logo;

        if ($request->hasFile('logo')) {
            if ($store->logo) {
                $this->deleteImage($store->logo, 'logo-image');
            }

            $logoImage = $this->tempImage($request->file('logo'), 'logo-image');
        }

        $store->update([
            'name' => $request->name,
            'user_id' => auth()->id(),
            'status' => 'pending',
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

    // productimagedelete
    public function imageDelete($id)
    {
        $store = Store::findOrFail($id);

        if (!$store) {
            return response()->json([
                'status' => 404,
                'message' => "Store Not Found!",
            ], 404);
        }

        if ($store->logo) {
            $this->deleteImage($store->logo, 'logo-image');
        }

        $store->update([
            'logo' => null
        ]);

        return response()->json([
            'status' => 200,
            'message' => "Logo Deleted Successfully!",
        ]);
    }
    // count-vendor-dashboard
    public function dashboardCount()
    {
        $user = auth()->user();
        $store = \App\Models\Store::where('user_id', $user->id)->count();
        $storeIds = \App\Models\Store::where('user_id', $user->id)->pluck('id');
        $products = \App\Models\Product::whereIn('store_id', $storeIds)->count();
        $orders = Order::whereHas('items.product', function ($q) use ($storeIds) {
            $q->whereIn('store_id', $storeIds);
        })->count();

        return response()->json([
            'status' => 200,
            'stores' => $store,
            'products' => $products,
            'orders' => $orders,
        ]);
    }
}
