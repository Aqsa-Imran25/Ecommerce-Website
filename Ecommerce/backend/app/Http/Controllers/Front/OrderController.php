<?php

namespace App\Http\Controllers\Front;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;


class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        $order = Order::with(['user', 'items.product'])
            ->where('user_id', Auth::id())
            ->get();

        return response()->json([
            'status' => 200,
            'data' => $order,
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
        $validator = Validator::make($request->all(), [
            'cart' => 'required|array|min:1',
            'sub_total' => 'required|numeric|min:0',
            'shipping' => 'required|numeric|min:0',
            'grand_total' => 'required|numeric|min:0',
            // 'payment_status' => ['required', Rule::in(['paid', 'not paid'])],
            'status' => ['required', Rule::in(['pending', 'delivered', 'shipped', 'cancelled'])],

        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        $order = Order::create([
            'user_id' => Auth::id(),
            'sub_total' => $request->sub_total,
            'shipping' => $request->shipping,
            'grand_total' => $request->grand_total,
            'discount' => $request->discount,
            'status' => $request->status,

        ]);

        foreach ($request->cart as $item) {
            OrderItem::create([
                'store_id' => $item['store_id'],
                'product_id' => $item['product_id'],
                'order_id'   => $order->id,
                'size'       => $item['size'] ?? null,
                'unit_price'  => $item['price'],
                'qty'        => $item['qty'],
                'price'      => $item['price'] * $item['qty'],
            ]);
        }

        return response()->json([
            'status' => 200,
            'message' => "Order placed successfully",
            'id' => $order->id,
            'data' => $order
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $order = Order::with(['items.product', 'user'])->where('user_id', Auth::id())->findOrFail($id);

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
