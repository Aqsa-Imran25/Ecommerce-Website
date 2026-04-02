<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Vendor_earnings;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $orders = Order::with(['items', 'user.profile'])->orderBy('created_at', 'ASC')->paginate(5);

        return response()->json([
            'status' => 200,
            'data' => $orders,
        ]);
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $order = Order::with(['items', 'items.product', 'user.profile'])->findOrFail($id);

        if (!$order) {
            return response()->json([
                'status' => 404,
                'message' => "Order Not Found!",
                'data' => []
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'data' => [
                'order' => $order,
                'items' => $order->items
            ]
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
        $order = Order::findOrFail($id);
        if (!$order) {
            return response()->json([
                'status' => 404,
                'message' => "Order Not Found!",
                'data' => []
            ], 404);
        }
        $order->status = $request->status;
        $order->save();
        return response()->json([
            'status' => 200,
            'message' => "Order Updated Successfully!",
            'data' => $order
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function totalCommission()
    {
        $total = Vendor_earnings::sum('commission');

        return response()->json([
            'status' => 200,
            'total_commission' => $total
        ]);
    }
    public function allEarnings()
    {
        $earnings = Vendor_earnings::with(['store', 'order'])->get();

        return response()->json([
            'status' => 200,
            'data' => $earnings
        ]);
    }
}
