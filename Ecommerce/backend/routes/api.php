<?php

use App\Http\Controllers\admin\BrandController;
use App\Http\Controllers\admin\CategoryController;
use App\Http\Controllers\admin\OrderController as AdminOrderController;
use App\Http\Controllers\admin\ProductController;
use App\Http\Controllers\admin\ProfileController;
use App\Http\Controllers\admin\ShippingChargeController;
use App\Http\Controllers\admin\SizeController;
use App\Http\Controllers\admin\UserController;
use App\Http\Controllers\AIController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use Illuminate\Http\Request;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Front\OrderController;
use App\Http\Controllers\Front\ProducController;
use App\Http\Controllers\Front\ShippingController;
use App\Http\Controllers\front\UserController as FrontUserController;
use App\Http\Controllers\TempController;
use App\Http\Controllers\VendorController;
use Illuminate\Support\Facades\Route;


// latest
Route::get('/latestProduct', [ProducController::class, 'latestProduct']);
// featured
Route::get('/featuredProduct', [ProducController::class, 'featuredProduct']);
// getcategories
Route::get('/getCategories', [ProducController::class, 'getCategories']);
// getbrands
Route::get('/getBrands', [ProducController::class, 'getBrands']);
// getproducts
Route::get('/getProducts', [ProducController::class, 'getProducts']);
// getproductsingle
// register
Route::post('/register', [RegisteredUserController::class, 'store']);
// login
Route::post('/login', [AuthenticatedSessionController::class, 'store']);
// comment
Route::get('/comment/{productId}', [FrontUserController::class, 'index']);

Route::get('/getProduct/{id}', [ProducController::class, 'getProduct']);

Route::get('/product/{id}/reviews', [FrontUserController::class, 'getReviews']);

// navbar-product-search 
Route::get('/products/search', [ProducController::class, 'search']);



Route::group([
    'middleware' => [
        'auth:sanctum',
        'checkUserRole'
    ]
], function () {

    // chatbot
    Route::post('/ai/ask', [AIController::class, 'askAI']);
    Route::post('/ai/chat', [AIController::class, 'chat']);
    // vendor store
    Route::post('/vendors', [VendorController::class, 'store'])
        ->middleware(['auth:sanctum', 'checkProfile']);
    // product purchase
    Route::get('/purchaseproduct', [ProducController::class, 'index']);



    // productlike
    Route::post('/product/{id}/like', [FrontUserController::class, 'toggleProductLike']);

    // COMMENTlike
    Route::post('/comment/{id}/like', [FrontUserController::class, 'toggleCommentLike']);

    // ratings
    Route::post('/product/{id}/reviews', [FrontUserController::class, 'storeReviews']);

    // shipping
    Route::get('/customer-shipping', [ShippingController::class, 'getShippedUser']);

    // comment
    //  Route::resource('/comment',FrontUserController::class);

    Route::post('/comment/{productId}', [FrontUserController::class, 'store']);


    Route::delete('/comment/{productId}', [FrontUserController::class, 'destroy']);
});

// vendor AND ADMIN ROLE
Route::group(
    [
        'middleware' => [
            'auth:sanctum',
            'checkVendorRole'
        ]
    ],
    function () {

        Route::resource('/admin/stores', VendorController::class);
        Route::get('/admin/categories', [CategoryController::class, 'index']);
        Route::get('/admin/brands', [BrandController::class, 'index']);
        // sizes
        Route::get('/sizes', [SizeController::class, 'index']);
        // PRODUCTS
        Route::get('/products', [ProductController::class, 'index']);
        Route::get('/products/{id}', [ProductController::class, 'show']);
        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products/{id}', [ProductController::class, 'update']);
        Route::delete('/products/{id}', [ProductController::class, 'destroy']);
        Route::get('/products/{id}/edit', [ProductController::class, 'edit']);
    }

);

// USER AND VENDOR
// vendor
Route::group(
    [
        'middleware' => [
            'auth:sanctum',
            'CheckUserVendor'
        ]
    ],
    function () {
        // profile
        Route::post('/myaccount', [ProfileController::class, 'store']);
        Route::get('/myaccount', [ProfileController::class, 'show']);
        // user
        Route::get('/getUser', function (Request $request) {

            return response()->json([
                'status' => 200,
                'data' => $request->user()
            ]);
        });
        // order
        Route::resource('/order', OrderController::class);
    }

);



// Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
//     return $request->user();
// });


Route::group(
    ['middleware' => [
        'auth:sanctum',
        'checkAdminRole'
    ]],
    function () {
        // store-status-update
        Route::post('/admin/approvedStore/{id}', [VendorController::class, 'approvedStore']);
        Route::post('/admin/rejectedStore/{id}', [VendorController::class, 'rejectedStore']);
        Route::post('/admin/pendingStore/{id}', [VendorController::class, 'pendingStore']);

        // categories
        Route::get('/admin/categories/{id}', [CategoryController::class, 'show']);
        Route::post('/admin/categories', [CategoryController::class, 'store']);
        Route::get('/admin/categories/edit/{id}', [CategoryController::class, 'edit']);
        Route::put('/admin/categories/{id}', [CategoryController::class, 'update']);
        Route::delete('/admin/categories/{id}', [CategoryController::class, 'destroy']);

        // brands
        // Route::resource('/admin/brands', BrandController::class);
        Route::get('/admin/brands/{id}', [BrandController::class, 'show']);
        Route::post('/admin/brands', [BrandController::class, 'store']);
        Route::get('/admin/brands/edit/{id}', [BrandController::class, 'edit']);
        Route::put('/admin/brands{id}', [BrandController::class, 'update']);
        Route::delete('/admin/brands/{id}', [BrandController::class, 'destroy']);

        // sizes
        // Route::resource('/sizes', SizeController::class);
        Route::get('/sizes/{id}', [SizeController::class, 'show']);
        Route::post('/sizes', [SizeController::class, 'store']);
        Route::get('/sizes/edit/{id}', [SizeController::class, 'edit']);
        Route::put('/sizes/{id}', [SizeController::class, 'update']);
        Route::delete('/sizes/{id}', [SizeController::class, 'destroy']);
        // temp-img
        Route::post('/temp-image', [TempController::class, 'store']);

        // product-img
        Route::get('/defaultImage', [ProductController::class, 'defaultImage']);

        // product-img-del
        Route::delete('/productimg-delete/{id}', [ProductController::class, 'imageDelete']);

        // order
        Route::resource('/orders', AdminOrderController::class);

        //  shipping-charge-get
        Route::get('/admin/getCharge', [ShippingChargeController::class, 'getShipped']);

        //  save shipping cost
        Route::put('/admin/saveCharge', [ShippingChargeController::class, 'getUpdate']);

        // users
        Route::resource('/admin/users', UserController::class);

        // COUNTS
        Route::get('/dashboard-count', function () {

            $users = \App\Models\User::count();
            $products = \App\Models\Product::count();
            $orders = \App\Models\Order::count();

            return response()->json([
                'status' => 200,
                'users' => $users,
                'products' => $products,
                'orders' => $orders,
            ]);
        });
    }



);
