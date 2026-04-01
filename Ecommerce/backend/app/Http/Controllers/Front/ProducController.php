<?php

namespace App\Http\Controllers\Front;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;


class ProducController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $product = Product::with('user')->get();
        // with('user')->where('user_id', Auth::id())->get();
        dd($product);

        return response()->json([
            'status' => 200,
            'data' => $product,
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

    // latestproduct
    public function latestProduct()
    {
        $latestProduct = Product::orderBy('id', 'ASC')->where('status', 1)
            ->limit(3)
            ->get();

        return response()->json([
            'status' => 200,
            'data' => $latestProduct,
        ]);
    }
    // featured
    public function featuredProduct()
    {
        $featuredProduct = Product::orderBy('created_at', 'DESC')->where('status', 1)->where('is_Featured', 'yes')->limit(6)->get();

        return response()->json([
            'status' => 200,
            'data' => $featuredProduct,
        ]);
    }
    // getcategories
    public function getCategories()
    {
        $categories = Category::orderBy('created_at', 'DESC')->where('status', 1)->get();

        return response()->json([
            'status' => 200,
            'data' => $categories,
        ]);
    }

    // getbrand
    public function getBrands()
    {
        $brand = Brand::orderBy('created_at', 'DESC')->where('status', 1)->get();

        return response()->json([
            'status' => 200,
            'data' => $brand,
        ]);
    }

    // getproduct
    public function getProducts(Request $request)
    {
        $products = Product::orderBy('created_at', 'DESC')->where('status', 1);
        // filter by category
        if (!empty($request->category)) {
            $catArray = explode(',', $request->category);
            $products = $products->whereIn('category_id', $catArray);
        }
        // filter by brands
        if (!empty($request->brand)) {
            $brandArray = explode(',', $request->brand);
            $products = $products->whereIn('brand_id', $brandArray);
        }
        $products = $products->get();

        return response()->json([
            'status' => 200,
            'data' => $products,
        ]);
    }

    // SINGLEPRODUCT
    public function getProduct($id)
    {
        $product = Product::with(['product_images', 'product_sizes', 'vendor'])
            ->withCount('likes')
            ->findOrFail($id);

        $user = auth('sanctum')->user();

        $liked = false;

        if ($user) {
            $liked = $product->likes()
                ->where('user_id', $user->id)
                ->exists();
        }

        return response()->json([
            'status' => 200,
            'data' => $product,
            'liked' => $liked,
            'likes_count' => $product->likes_count,
        ]);
    }

    // product-search

    public function search(Request $request)
    {
        $query = $request->input('query');

        $products = Product::where('title', 'LIKE', "%$query%")
            ->orWhere('description', 'LIKE', "%$query%")
            ->orWhere('price', 'LIKE', "%$query%")
            ->get();

        return response()->json($products);
    }
}
