<?php

namespace App\Http\Controllers\Front;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Payment_setting;
use App\Models\Vendor_earnings;
use Illuminate\Foundation\Console\ObserverMakeCommand;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;




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
            'phone_num' => 'required',
            'city' => 'required',
            'state' => 'required',
            'zip' => 'required',
            'payment' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ]);
        }

        DB::beginTransaction();

        try {

            // Create Order
            $orderNumber = 'ORD-' . now()->format('Ymd') . '-' . strtoupper(Str::random(5));

            $order = Order::create([
                'user_id' => Auth::id(),
                'order_number' => $orderNumber,
                'sub_total' => $request->sub_total,
                'shipping' => $request->shipping,
                'grand_total' => $request->grand_total,
                'discount' => $request->discount ?? 0,
                'status' => 'pending',
                'phone_num' => $request->phone_num,
                'city' => $request->city,
                'state' => $request->state,
                'zip' => $request->zip,
            ]);

            foreach ($request->cart as $item) {

                $amount = $item['price'] * $item['qty'];

                OrderItem::create([
                    'store_id' => $item['store_id'],
                    'product_id' => $item['product_id'],
                    'order_id' => $order->id,
                    'size' => $item['size'] ?? null,
                    'unit_price' => $item['price'],
                    'qty' => $item['qty'],
                    'price' => $amount,
                ]);

                $setting = Payment_setting::where('store_id', $item['store_id'])->first();

                if (!$setting) {
                    $setting = Payment_setting::whereNull('store_id')->first();
                }

                $commissionRate = $setting ? $setting->commission : 10;


                $commission = ($amount * $commissionRate) / 100;
                $net_amount = $amount - $commission;

                Vendor_earnings::create([
                    'store_id' => $item['store_id'],
                    'order_id' => $order->id,
                    'amount' => $amount,
                    'commission' => $commission,
                    'net_amount' => $net_amount,
                ]);
            }


            $payment = Payment::create([
                'order_id' => $order->id,
                'method' => $request->payment,
                'status' => 'pending',
                'amount' => $request->grand_total,
            ]);

            DB::commit();

            return response()->json([
                'status' => 200,
                'message' => 'Order placed successfully',
                'order' => $order,
                'payment' => $payment
            ]);
        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'status' => 500,
                'error' => $e->getMessage()
            ]);
        }
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

    // vendorEarnings
    public function vendorEarnings()
    {
        $storeId = auth()->user()->store->id;

        $earnings = Vendor_earnings::where('store_id', $storeId)
            ->with(['order', 'store'])
            ->latest()
            ->get();

        return response()->json([
            'status' => 200,
            'data' => $earnings
        ]);
    }
}
