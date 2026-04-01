<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Payment_setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $payments = Payment_setting::with('store')->orderBy('created_at', 'ASC')->get();
        return response()->json([
            'status' => 200,
            'data' => $payments,
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
            'commission' => 'required|numeric|min:0',
            'currency' => 'required|string|max:3',
            'store_id' => 'nullable|exists:stores,id'

        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }
        $payment = Payment_setting::create(
            [
                'cod_enabled' => $request->cod_enabled ?? 0,
                'commission' => $request->commission,
                'currency' => $request->currency,
                'store_id' => $request->store_id,
            ]
        );
        return response()->json([
            'status' => 200,
            'message' => 'Payment Settings Saved',
            'data' => $payment,
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $payment = Payment_setting::findOrFail($id);

        if ($payment == null) {
            return response()->json([
                'status' => 404,
                'message' => "Category Not Found!",
                'data' => []
            ], 404);
        }
        return response()->json([
            'status' => 200,
            'data' => $payment,
        ], 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $payment = Payment_setting::findOrFail($id);
        return response()->json([
            'data' => $payment,
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $payment = Payment_setting::find($id);

        if (!$payment) {
            return response()->json([
                'status' => 404,
                'message' => "Payment Setting Not Found!",
                'data' => []
            ], 404);
        }

        // ✅ VALIDATION (same as store)
        $validator = Validator::make($request->all(), [
            'commission' => 'required|numeric|min:0',
            'currency' => 'required|string|max:3',
            'store_id' => 'nullable|exists:stores,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        // ✅ UPDATE DATA
        $payment->update([
            'cod_enabled' => $request->cod_enabled ?? 0,
            'commission' => $request->commission,
            'currency' => $request->currency,
            'store_id' => $request->store_id,
        ]);

        return response()->json([
            'status' => 200,
            'message' => "Payment Settings Updated Successfully!",
            'data' => $payment,
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $payment = Payment_setting::findOrFail($id);

        if ($payment == null) {
            return response()->json([
                'status' => 404,
                'message' => "Payment Not Found!",
                'data' => []
            ], 404);
        }
        $payment->delete();
        return response()->json([
            'status' => 200,
            'message' => "Payment Deleted Successfully!",

        ], 200);
    }
}
