<?php

namespace App\Http\Controllers;

use App\Models\Chat_message;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class AIController extends Controller
{
    public function __construct()
    {
        set_time_limit(120);
    }

    public function askAI(Request $request)
    {
        $prompt = $request->prompt;

        $response = Http::timeout(300)
            ->retry(3, 1000)
            ->post('http://localhost:11434/api/generate', [
                "model" => "phi3",
                "prompt" => $prompt,
                "stream" => false,
                "keep_alive" => -1
            ]);

        $data = $response->json();

        return response()->json(
            ["response" => $data["response"] ?? "No response"]
        );
    }

    public function chat(Request $request)
    {
        $originalMessage = $request->message;
        $message = strtolower($originalMessage);

        $keywords = preg_split('/\s+/', $message, -1, PREG_SPLIT_NO_EMPTY);

        $products = Product::where(function ($q) use ($keywords) {
            foreach ($keywords as $word) {
                $q->orWhere('title', 'LIKE', "%{$word}%")
                  ->orWhere('description', 'LIKE', "%{$word}%");
            }
        })->get();

        if ($products->isEmpty()) {
            $reply = "No products found matching your request.";

            Chat_message::create([
                'user_id' => auth()->id(),
                'message' => $originalMessage,
                'response' => $reply,
            ]);

            return response()->json(["response" => $reply]);
        }

        $productText = "";
        foreach ($products as $product) {
            $productText .= "Id: {$product->id}\n";
            $productText .= "Title: {$product->title}\n";
            $productText .= "Price: {$product->price}\n";
            $productText .= "Description: {$product->description}\n";
            $productText .= "Image: {$product->image_url}\n\n";
        }

        $prompt = "
### PRODUCTS LIST
$productText

### USER REQUEST
$message

### OUTPUT FORMAT
You are a professional product recommender.
From the products above, output only matching product cards in this exact format:

Id: <product id>
Title: <product title>
Price: <product price>
Description: <product description>
Image: <product image_url>

Do NOT invent new products. Do NOT add any other text.
List all matching products.";

        $response = Http::timeout(300)->post('http://localhost:11434/api/generate', [
            "model" => "phi3",
            "prompt" => trim($prompt),
            "stream" => false
        ]);

        $data = $response->json();
        $reply = $data["response"] ?? "No response";

        Chat_message::create([
            'user_id' => auth()->id(),
            'message' => $originalMessage,
            'response' => $reply,
        ]);

        return response()->json(["response" => $reply]);
    }
}