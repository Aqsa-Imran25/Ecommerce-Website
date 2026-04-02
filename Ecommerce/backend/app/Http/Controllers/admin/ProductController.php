<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImg;
use App\Models\ProductSize;
use App\Models\Store;
use App\Models\TempImg;
use App\Traits\ImageUpload;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Mews\Purifier\Facades\Purifier;

class ProductController extends Controller
{
    use ImageUpload;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = auth()->user();

        $query = Product::with(['product_images', 'product_sizes'])
            ->orderBy('created_at', 'ASC');

        if ($user->hasRole('admin')) {
            $products = $query->get();
        } else if ($user->hasRole('vendor')) {
            $storeId = Store::where('user_id', $user->id)->value('id');

            if (!$storeId) {
                return response()->json([
                    'status' => 200,
                    'data' => []
                ]);
            }

            $products = $query->where('store_id', $storeId)->get();
        }

        return response()->json([
            'status' => 200,
            'data' => $products,
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
            'title' => 'required|min:3',
            'description' => 'nullable',
            'short_description' => 'nullable',
            'price' => 'required|numeric',
            'compare_price' => 'nullable|numeric',
            'category_id' => 'required|exists:categories,id',
            'brand_id' => 'nullable|exists:brands,id',
            'store_id' => 'nullable|exists:stores,id',
            'qty' => 'nullable|integer',
            'sku' => 'required|unique:products,sku',
            'gallery' => 'nullable|array',
            'sizes' => 'nullable|array',
            'sizes.*' => 'integer|exists:sizes,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }
        $clean = Purifier::clean($request->description);

        $product = Product::create([
            'user_id' => Auth::id(),
            'title' => $request->title,
            'description' => $clean,
            'short_description' => $request->short_description,
            'price' => $request->price,
            'compare_price' => $request->compare_price,
            'category_id' => $request->category_id,
            'brand_id' => $request->brand_id,
            'store_id' => $request->store_id,
            'qty' => $request->qty,
            'sku' => $request->sku,
            'is_approved'=>'pending',
            'status' => 0,
            'is_Featured' => 'no',
        ]);
        // sizes array
        if (!empty($request->sizes)) {
            foreach ($request->sizes as $sizeId) {
                ProductSize::create([
                    'product_id' => $product->id,
                    'size_id' => $sizeId,
                ]);
            }
        }
        // Handle gallery images
        if (!empty($request->gallery) && is_array($request->gallery)) {
            foreach ($request->gallery as $key => $tempId) {
                $tempImg = TempImg::find($tempId);
                if (!$tempImg) continue;

                $imageName = time() . '_' . uniqid() . '_' . $tempImg->image;
                $oldPath = $tempImg->image; // just filename
                $newPath = 'product/' . $imageName;

                // Move using 'public' disk
                if (Storage::disk('public')->exists('temp/' . $oldPath)) {
                    Storage::disk('public')->move('temp/' . $oldPath, $newPath);

                    ProductImg::create([
                        'product_id' => $product->id,
                        'name' => $imageName
                    ]);

                    // Set first image as main product image
                    if (!$product->image && $key === 0) {
                        $product->image = $imageName;
                        $product->save();
                    }

                    // Delete temp record
                    $tempImg->delete();
                }
            }
        }

        return response()->json([
            'status' => 200,
            'message' => 'Product submitted for approval',
            'data' => $product
        ]);
    }

    // 


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $product = Product::with(['product_images', 'product_sizes'])->findOrFail($id);

        $productSize = $product->product_sizes()->pluck('size_id');
        return response()->json([
            'status' => 200,
            'data' => $product,
            'productSize' => $productSize,
        ], 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $product = Product::with(['product_images', 'product_sizes'])->findOrFail($id);
        return response()->json([
            'status' => 200,
            'data' => $product,
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'title' => 'required|min:3',
            'description' => 'nullable',
            'short_description' => 'nullable',
            'price' => 'required|numeric',
            'compare_price' => 'nullable|numeric',
            'category_id' => 'required|exists:categories,id',
            'brand_id' => 'nullable|exists:brands,id',
            'sku' => 'required|unique:products,sku,' . $id,
            'qty' => 'nullable|integer',
            'status' => 'required|integer',
            'is_Featured' => 'required|in:yes,no',
            'new_images.*' => 'nullable|image|mimes:jpg,jpeg,png,gif|max:2048',
            'old_image_ids' => 'nullable|array',
            'old_image_ids.*' => 'integer|exists:product_imgs,id',
            'sizes' => 'nullable|array',
            'sizes.*' => 'integer|exists:sizes,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->errors()
            ]);
        }

        $product->update([
            'user_id' => Auth::id(),
            'title' => $request->title,
            'description' => $request->description,
            'short_description' => $request->short_description,
            'price' => $request->price,
            'compare_price' => $request->compare_price,
            'category_id' => $request->category_id,
            'brand_id' => $request->brand_id,
            'qty' => $request->qty,
            'sku' => $request->sku,
            'status' => $request->status,
            'is_Featured' => $request->is_Featured,
        ]);


        if ($request->old_image_ids) {
            ProductImg::where('product_id', $id)
                ->whereNotIn('id', $request->old_image_ids)
                ->get()
                ->each(function ($img) {
                    $path = storage_path('app/public/product/' . $img->name);
                    if (file_exists($path)) unlink($path);
                    $img->delete();
                });
        } else {
            ProductImg::where('product_id', $id)->get()->each(function ($img) {
                $path = storage_path('app/public/product/' . $img->name);
                if (file_exists($path)) unlink($path);
                $img->delete();
            });
        }


        if ($request->hasFile('new_images')) {
            foreach ($request->file('new_images') as $file) {
                $imageName = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                $file->storeAs('product', $imageName, 'public');

                ProductImg::create([
                    'product_id' => $product->id,
                    'name' => $imageName
                ]);
            }
        }


        $firstImage = ProductImg::where('product_id', $product->id)->first();
        if ($firstImage) {
            $product->image = $firstImage->name;
            $product->save();
        }


        if (!empty($request->sizes)) {
            ProductSize::where('product_id', $product->id)->delete();
            foreach ($request->sizes as $sizeId) {
                ProductSize::create([
                    'product_id' => $product->id,
                    'size_id' => $sizeId,
                ]);
            }
        }

        return response()->json([
            'status' => 200,
            'message' => "Product Updated Successfully",
            'data' => $product
        ]);
    }



    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $product = Product::findOrFail($id);

        if ($product == null) {
            return response()->json([
                'status' => 404,
                'message' => "Product Not Found!",
                'data' => []
            ], 404);
        }
        $product->delete();
        return response()->json([
            'status' => 200,
            'message' => "Product Deleted Successfully!",

        ], 200);
    }
    //    defaultimageproduct
    public function defaultImage(Request $request)
    {
        $product = Product::findOrFail($request->product_id);
        $product->image = $request->image;
        $product->save();
        return response()->json([
            'status' => 200,
            'message' => "Product Default Image Successfully Set!",

        ], 200);
    }


    // productimagedelete
    public function imageDelete($id)
    {
        $productImg = ProductImg::findOrFail($id);

        if ($productImg == null) {
            return response()->json([
                'status' => 404,
                'message' => "Product Not Found!",
                'data' => []
            ], 404);
        }

        $this->deleteImage($productImg->name, 'product');
        $productImg->delete();
        return response()->json([
            'status' => 200,
            'message' => "Product Deleted Successfully!",

        ], 200);
    }
}
