<?php

use App\Http\Controllers\admin\BrandController;
use App\Http\Controllers\admin\CategoryController;
use App\Http\Controllers\admin\OrderController as AdminOrderController;
use App\Http\Controllers\admin\ProductController;
use App\Http\Controllers\admin\ProfileController;
use App\Http\Controllers\admin\ShippingChargeController;
use App\Http\Controllers\admin\SizeController;
use App\Http\Controllers\admin\UserController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use Illuminate\Http\Request;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Front\OrderController;
use App\Http\Controllers\Front\ProducController;
use App\Http\Controllers\Front\ShippingController;
use App\Http\Controllers\front\UserController as FrontUserController;
use App\Http\Controllers\TempController;
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
// Route::post('/login', [RegisteredUserController::class, 'login']);
Route::post('/login', [AuthenticatedSessionController::class, 'store']);
// comment
Route::get('/comment/{productId}', [FrontUserController::class, 'index']);

Route::get('/getProduct/{id}', [ProducController::class, 'getProduct']);

Route::get('/product/{id}/reviews', [FrontUserController::class, 'getReviews']);


Route::group([
    'middleware' => [
        'auth:sanctum',
        'checkUserRole'
    ]
], function () {

    // product purchase
    Route::get('/purchaseproduct', [ProducController::class, 'index']);



    Route::resource('/order', OrderController::class);
    // productlike
    Route::post('/product/{id}/like', [FrontUserController::class, 'toggleProductLike']);

    // COMMENTlike
    Route::post('/comment/{id}/like', [FrontUserController::class, 'toggleCommentLike']);

    // ratings
    Route::post('/product/{id}/reviews', [FrontUserController::class, 'storeReviews']);


    // profile
    Route::post('/myaccount', [ProfileController::class, 'store']);
    Route::get('/myaccount', [ProfileController::class, 'show']);


    // shipping
    Route::get('/customer-shipping', [ShippingController::class, 'getShippedUser']);

    // comment
    //  Route::resource('/comment',FrontUserController::class);

    Route::post('/comment/{productId}', [FrontUserController::class, 'store']);


    Route::delete('/comment/{productId}', [FrontUserController::class, 'destroy']);



    // user
    Route::get('/getUser', function (Request $request) {

        return response()->json([
            'status' => 200,
            'data' => $request->user()
        ]);
    });
});





// Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
//     return $request->user();
// });
Route::group(
    ['middleware' => [
        'auth:sanctum',
        'checkAdminRole'
    ]],
    function () {
        Route::get('/admin/categories', [CategoryController::class, 'index']);
        Route::get('/admin/categories/{id}', [CategoryController::class, 'show']);
        Route::post('/admin/categories', [CategoryController::class, 'store']);
        Route::get('/admin/categories/edit/{id}', [CategoryController::class, 'edit']);
        Route::put('/admin/categories/{id}', [CategoryController::class, 'update']);
        Route::delete('/admin/categories/{id}', [CategoryController::class, 'destroy']);

        // brands
        Route::resource('/admin/brands', BrandController::class);

        // sizes
        Route::resource('/sizes', SizeController::class);

        // product
        Route::resource('/products', ProductController::class);

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
