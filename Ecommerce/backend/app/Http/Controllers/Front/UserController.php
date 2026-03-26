<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\Like;
use App\Models\Product;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index($productId)
    {
        $product = Product::findOrFail($productId);
        $comments = Comment::where('product_id', $product->id)->with('user')->orderBy('created_at', 'ASC')->get();
        return response()->json([
            'status' => 200,
            'data' => $comments,
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
    public function store(Request $request, $productId)
    {
        $product = Product::findOrFail($productId);

        if (!$product) {
            return response()->json([
                'status' => 404,
                'message' => "Product Not Found!",
                'data' => []
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'comment' => 'required',

        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }
        $comment = Comment::create(
            [
                'comment' => $request->comment,
                'user_id' => auth()->id(),
                'product_id' => $product->id,
                'status' => 'active',
            ]
        );
        return response()->json([
            'status' => 200,
            'message' => "Comment Added Successfully!",
            'data' => $comment,
        ], 200);
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
        $comment = Comment::findOrFail($id);

        if ($comment == null) {
            return response()->json([
                'status' => 404,
                'message' => "Comment Not Found!",
                'data' => []
            ], 404);
        }
        $comment->delete();
        return response()->json([
            'status' => 200,
            'message' => "Comment Deleted Successfully!",

        ], 200);
    }

    public function toggleProductLike($id)
    {

        $user = auth()->user();

        $product = Product::findOrFail($id);

        // existing
        $like = Like::where('user_id', $user->id)
            ->where('likeable_id', $product->id)
            ->where('likeable_type', Product::class)
            ->first();

        if ($like) {
            $like->delete();
            $liked = false;
            $message = "UnLike Successfully!";
        } else {
            Like::create([
                'user_id' => auth()->id(),
                'likeable_id' => $product->id,
                'likeable_type' => Product::class,
            ]);
            $liked = true;
            $message = "Like Successfully!";
        }
        // total likes
        $totalLikes = Like::where('likeable_id', $product->id)
            ->where('likeable_type', Product::class)
            ->count();
        return response()->json([
            'status' => 200,
            'liked' => $liked,
            'totalLikes' => $totalLikes,
            'message' => $message,

        ], 200);
    }

    // commentLike
    public function toggleCommentLike($id)
    {
        $user = auth()->user();

        $comment = Comment::findOrFail($id);

        // existing
        $like = Like::where('user_id', $user->id)
            ->where('likeable_id', $comment->id)
            ->where('likeable_type', Comment::class)
            ->first();

        if ($like) {
            $like->delete();
            $liked = false;
            $message = "UnLike Successfully!";
        } else {
            Like::create([
                'user_id' => auth()->id(),
                'likeable_id' => $comment->id,
                'likeable_type' => Comment::class,
            ]);
            $liked = true;
            $message = "Like Successfully!";
        }
        // total likes
        $totalLikes = Like::where('likeable_id', $comment->id)
            ->where('likeable_type', Comment::class)
            ->count();
        return response()->json([
            'status' => 200,
            'liked' => $liked,
            'totalLikes' => $totalLikes,
            'message' => $message,

        ], 200);
    }

    // ratingStore
    public function storeReviews(Request $request, string $id)
    {

        $validator = Validator::make($request->all(), [
            'review' => 'nullable|string',
            'rate' => 'required|integer|min:1|max:5',

        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }
        $review = Review::updateOrCreate(
            [
                'user_id' => auth()->id(),
                'product_id' => $id
            ],
            [
                'review' => $request->review,
                'rate' => $request->rate,
            ]
        );
        return response()->json([
            'status' => 200,
            'message' => "Review Submit Successfully!",
            'data' => $review,
        ], 200);
    }

    // getRating
    public function getReviews($id)
    {
        $reviews = Review::with('user')
            // ->where('user_id', auth()->id())
            ->where('product_id', $id)
            ->where('status', 'active')
            ->latest()
            ->get();
        $avgRating = $reviews->avg('rate');
        $totalReviews = $reviews->count();

        return response()->json([
            'status' => 200,
            'data' =>
            [
                'reviews' => $reviews,
                'avgRating' => $avgRating,
                'totalReviews' => $totalReviews,
            ]
        ], 200);
    }

    // 
   
}
// 
