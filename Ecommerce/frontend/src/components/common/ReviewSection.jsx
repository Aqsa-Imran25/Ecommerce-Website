import React, { useEffect, useState } from "react";
import StarRating from "./StarRating";
import { apiUrl, UserToken } from "./Http";
import { toast } from "react-toastify";
import { useParams } from "react-router";
import dayjs from "dayjs";

function ReviewSection() {
  const { id } = useParams();

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);

  useEffect(() => {
    if (id) {
      fetchReviews();
    }
  }, [id]);

  // submit review
  const submitReview = async () => {
    if (!UserToken()) {
      toast.error("Login required!");
      return;
    }
    if (rating === 0) {
      toast.error("Please select rating!");
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/product/${id}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${UserToken()}`,
        },
        body: JSON.stringify({
          rate: rating,
          review: review,
        }),
      });

      const result = await res.json();

      if (result.status === 200) {
        toast.success(result.message);

        setReview("");
        setRating(0);

        setReviews([result.data, ...reviews]);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  // fetch reviews
  const fetchReviews = async () => {
    try {
      const res = await fetch(`${apiUrl}/product/${id}/reviews`);

      const result = await res.json();

      if (result.status === 200) {
        setReviews(result.data.reviews);
        console.log("Reviews", result.data.reviews);

        console.log("avg", result.data.avgRating);
        setAvgRating(result.data.avgRating);
      }
    } catch (error) {
      toast.error("Error fetching reviews");
    }
  };

  return (
    <div>
      {/* average rating */}

      <div className="flex items-center gap-2">
        <h3 className="text-3xl font-bold">{avgRating?.toFixed(1)}</h3>

        <StarRating rating={Math.round(avgRating)} setRating={() => { }} />

        <span className="text-gray-500">{reviews.length} Reviews</span>
      </div>

      <hr className="my-5" />

      {/* review form */}

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Write Review</h3>

        <StarRating rating={rating} setRating={setRating} />

        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          className="border w-full p-3 mt-3"
          placeholder="Write your review"
        />

        <button
          onClick={submitReview}
          className="bg-[#007595] text-white px-4 py-2 mt-3"
        >
          Submit Review
        </button>
      </div>

      {/* reviews list */}

      <div>
        {reviews.map((rev) => (
          <div key={rev.id} className="border-b py-4">
            <div className="flex items-center gap-2">
              <strong>{rev.user?.name}</strong>

              <StarRating rating={rev.rate} setRating={() => { }} />
            </div>

            <p className="text-gray-600 text-sm">
              {dayjs(rev.created_at).fromNow()}
            </p>

            <p className="mt-2">{rev.review}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReviewSection;
