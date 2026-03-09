import React, { useContext, useEffect, useState } from "react";
import Layout from "../common/Layout";
import { Link, useNavigate, useParams } from "react-router";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import StarRating from "../common/StarRating";
import { apiUrl, UserToken } from "../common/Http";
import { toast } from "react-toastify";
import { CartContext } from "../context/Cart";
import striptags from "striptags";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import ReviewSection from "../common/ReviewSection";

dayjs.extend(relativeTime);

function Product() {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [product, setProduct] = useState(null);
  const [productImages, setProductImages] = useState([]);
  const [productSizes, setProductSizes] = useState([]);
  const [sizeSelected, setSizeSelected] = useState(null);
  const [activeTab, setActiveTab] = useState("");
  const { addToCart } = useContext(CartContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  // fetchComments from db
  const [comment, setComment] = useState([]);
  const { id } = useParams();

  // LIKES
  const [likes, setLikes] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  // like count

  // time
  const timeAgo = (date) => {
    return dayjs(date).fromNow();
  };
  // fetchcategory
  const fetchProduct = async () => {
    try {
      const res = await fetch(`${apiUrl}/getProduct/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${UserToken()}`,
        },
      });
      const result = await res.json();
      if (result.status === 200) {
        setProduct(result.data);

        setProductImages(result.data.product_images);

        setProductSizes(result.data.product_sizes);

        setLikes(result.liked);

        console.log("Product-like", result.liked)
        console.log("Product-totalCount", result.likes_count)

        setLikesCount(result.likes_count);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Something Went Wrong!");
    }
  };

  // getComment
  const fetchComment = async () => {
    try {
      const res = await fetch(`${apiUrl}/comment/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      const result = await res.json();
      if (result.status === 200) {
        setComment(result.data);
      } else {
        console.error("Something Went Wrong!");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Something Went Wrong!");
    }
  };

  useEffect(() => {
    if (id) {
      fetchProduct();
      fetchComment();
    }
  }, [id]);


  if (!product) {
    return (
      <Layout>
        <div className="text-center py-20 text-xl font-semibold">
          Loading Product...
        </div>
      </Layout>
    );
  }

  const handleCart = () => {
    if (productSizes.length > 0 && !sizeSelected) {
      toast.error("Please Select Size !");
      return;
    } else {
      const selectedSize = productSizes.length > 0 ? sizeSelected : null;
      addToCart(product, selectedSize);
      toast.success("Product Successfully Add To Cart!");
    }
  };

  // handlecomment
  const submitComment = async (data) => {
    console.log(data);
    try {
      const res = await fetch(`${apiUrl}/comment/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${UserToken()}`,
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      console.log("API Show Result:", result);

      if (result.status === 200) {
        toast.success(result.message);
        navigate(`/product/${id}`);
      } else {
        console.log("Something went wrong!");
      }
    } catch (error) {
      console.log(error);
      toast.error(result.message);
    }
  };
  // deletecomment
  const deleteComment = async (id) => {
    if (!window.confirm("Are you sure you want to delete this comment?"))
      return;

    const res = await fetch(`${apiUrl}/comment/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${UserToken()}`,
      },
    });
    const result = await res.json();

    if (result.status == 200) {
      toast.success(result.message);
      setComment((prev) => prev.filter((com) => com.id !== id));
    } else {
      console.log("Something went wrong!");
    }
  };

  // handleLikesproduct
  const handleLikes = async () => {
    try {
      const res = await fetch(`${apiUrl}/product/${id}/like`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${UserToken()}`,
        },
      });

      const result = await res.json();

      if (result.status === 200) {
        console.log("like", result.liked)
        setLikes(result.liked);
        setLikesCount(result.totalLikes);
        console.log("total-like", result.totalLikes)
        toast.success(result.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

  // handleLikesComment
  const likeComment = async (commentId) => {
    try {
      const res = await fetch(`${apiUrl}/comment/${commentId}/like`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${UserToken()}`,
        },
      });

      const result = await res.json();

      if (result.status === 200) {
        setComment((prev) =>
          prev.map((c) =>
            c.id === commentId
              ? {
                ...c,
                likes_count: result.totalLikes,
                liked: result.liked,
              }
              : c,
          ),
        );

        toast.success(result.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-2 md:px-4 py-2 mb-5">
        <nav aria-label="breadcrumb" className="w-max my-4">
          <ol className="flex flex-wrap items-center rounded-md px-4 py-2">
            <li className="flex items-center text-sm text-slate-500 hover:text-[#007595]">
              <Link to="/" className="text-black hover:text-[#007595]">
                Home
              </Link>
              <span className="pointer-events-none mx-2 text-black">/</span>
            </li>
            <li className="flex items-center text-sm text-[#007595]">
              {product?.title}
            </li>
          </ol>
        </nav>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-2/5">
            <div className="bg-white rounded-2xl shadow-xl p-3">
              <Swiper
                spaceBetween={10}
                navigation
                thumbs={{ swiper: thumbsSwiper }}
                modules={[FreeMode, Navigation, Thumbs]}
                className="rounded-xl mb-4"
              >
                {productImages.length > 0 &&
                  productImages.map((img, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={img?.image_url}
                        alt="Img-single"
                        className="w-full h-[420px] object-cover rounded-xl  relative"
                      />
                      <button
                        type="button"
                        onClick={() => handleLikes()}
                        className="absolute top-3 right-3"
                      >
                        <FontAwesomeIcon
                          icon={faHeart}
                          className={likes ? "text-red-500" : "text-gray-200"}
                          size="2x"
                        />
                      </button>
                      <span className="text-gray-500 text-sm">
                        {likesCount} Likes
                      </span>
                    </SwiperSlide>
                  ))}
              </Swiper>
              <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={12}
                slidesPerView={4}
                freeMode
                watchSlidesProgress
                modules={[FreeMode, Thumbs]}
                className="cursor-pointer"
              >
                {productImages.length > 0 &&
                  productImages.map((img, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={img?.image_url}
                        alt="Img-pro"
                        className="h-24 w-full object-cover rounded-lg border hover:border-[#007595] transition"
                      />
                    </SwiperSlide>
                  ))}
              </Swiper>
            </div>
          </div>
          <div className="w-full md:w-3/5 rounded-2xl ms-7 px-5">
            <h1 className="text-4xl font-bold"> {product?.title}</h1>
            <div className="flex gap-2 py-3">
              <StarRating />
              <span className="text-red-400">10 Reviews</span>
            </div>
            {/* price */}
            <div className="text-2xl pb-3">
              ${product?.price}
              <span className="text-gray-400 ps-3">
                ${product?.compare_price}
              </span>
            </div>
            {/* description */}
            <div>{product?.short_description}</div>
            {/* sizes */}
            {productSizes.length > 0 && (
              <div className="mt-6 pb-3">
                <h3 className="text-2xl font-bold text-slate-900">Sizes</h3>
                <div className="flex flex-wrap gap-4 mt-4">
                  {productSizes.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => setSizeSelected(size.name)}
                      className={`rounded-sm w-12 h-11 cursor-pointer 
            ${sizeSelected === size.name ? "bg-[#007595] text-white" : "bg-gray-200 hover:bg-gray-300"} 
            flex items-center justify-center shrink-0`}
                    >
                      {size.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {/* addtocrat */}
            <button
              onClick={() => handleCart()}
              className="bg-[#007595] mt-3 hover:bg-gray-900 text-white font-bold py-4 px-6 rounded inline-flex items-center"
            >
              <FontAwesomeIcon
                icon={faShoppingCart}
                className="
                            pe-2"
              />
              <span>Add To Cart</span>
            </button>
            <hr className="text-gray-200 py-3 mt-5" />
            <div className="flex">
              <h3 className="text-2xl font-bold text-black">
                SKU:
                <span className="text-gray-900 px-3"> {product?.sku}</span>
              </h3>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <ul className="flex border-b border-gray-500 mt-5">
            <li className="-mb-px mr-1">
              <button
                onClick={() => setActiveTab("description")}
                className={`inline-block py-2 px-4 font-semibold cursor-pointer ${activeTab === "description"
                  ? "border-b-2 border-[#007595] text-[#007595]"
                  : "text-gray-600"
                  }`}
              >
                Description
              </button>
            </li>

            <li className="mr-1">
              <button
                onClick={() => setActiveTab("reviews")}
                className={`inline-block py-2 px-4 font-semibold cursor-pointer ${activeTab === "reviews"
                  ? "border-b-2 border-[#007595] text-[#007595]"
                  : "text-gray-600"
                  }`}
              >
                Reviews
              </button>
            </li>

            {/* comments */}
            <li className="mr-1">
              <button
                onClick={() => setActiveTab("comments")}
                className={`inline-block py-2 px-4 font-semibold cursor-pointer ${activeTab === "comments"
                  ? "border-b-2 border-[#007595] text-[#007595]"
                  : "text-gray-600"
                  }`}
              >
                Comments {comment && comment.length > 0 ? comment.length : ""}
              </button>
            </li>
          </ul>

          <div className="mt-4">
            {activeTab === "description" && (
              <div>{striptags(product?.description)}</div>
            )}
            {/* reviews */}
            {activeTab === "reviews" && <ReviewSection />}

            {activeTab === "comments" && (
              <div>
                <section className=" relative">
                  <div className="w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto">
                    <div className="w-full flex-col justify-start items-start lg:gap-14 gap-7 inline-flex">
                      <h2 className="w-full text-gray-900 text-4xl font-bold font-manrope leading-normal">
                        Comments
                      </h2>
                      <form
                        onSubmit={handleSubmit(submitComment)}
                        className="w-full"
                      >
                        <div className="w-full flex-col justify-start items-start gap-5 flex">
                          <div className="w-full rounded-3xl justify-start items-start gap-3.5 inline-flex">
                            <img
                              className="w-10 h-10 object-cover"
                              src="https://pagedone.io/asset/uploads/1710225753.png"
                              alt="John smith image"
                            />
                            <textarea
                              {...register("comment", {
                                required: "The comment field not be empty.",
                              })}
                              name="comment"
                              rows="5"
                              className="w-full px-5 py-3 rounded-2xl border border-gray-300 shadow-[0px_1px_2px_0px_rgba(16,_24,_40,_0.05)] resize-none focus:outline-none placeholder-gray-400 text-gray-900 text-lg font-normal leading-7"
                              placeholder="Write a your thoughts here...."
                            ></textarea>
                          </div>
                          {errors.comment && (
                            <p className="text-red-500 text-sm">
                              {errors.comment.message}
                            </p>
                          )}
                          <button className="px-5 py-2.5 bg-[#007595] hover:bg-slate-900 transition-all duration-700 ease-in-out rounded-xl shadow-[0px_1px_2px_0px_rgba(16,_24,_40,_0.05)] justify-center items-center flex">
                            <span className="px-2 py-px text-white text-base font-semibold leading-relaxed">
                              Post your comment
                            </span>
                          </button>
                        </div>
                      </form>
                      <div className="w-full flex-col justify-start items-start gap-8 flex">
                        <div className="w-full pb-6 border-b border-gray-300 justify-start items-start gap-2.5 inline-flex">
                          <img
                            className="w-10 h-10 rounded-full object-cover"
                            src="https://pagedone.io/asset/uploads/1710226776.png"
                            alt="Mia Thompson image"
                          />

                          {comment.map((com) => (
                            <div
                              key={com.id}
                              className="w-full flex-col justify-start items-start gap-3.5 inline-flex"
                            >
                              <div className="w-full justify-start items-start flex-col flex gap-1">
                                <div className="w-full justify-between items-start gap-1 inline-flex">
                                  <h5 className="text-gray-900 text-sm font-semibold leading-snug">
                                    {com.user?.name}
                                  </h5>
                                  <span className="text-right text-gray-500 text-xs font-normal leading-5">
                                    {timeAgo(com.created_at)}
                                  </span>
                                </div>
                                <h5 className="text-gray-800 text-sm font-normal leading-snug">
                                  {com.comment}
                                </h5>
                              </div>
                              <div className="justify-start items-start gap-5 inline-flex">
                                <Link
                                  to=""
                                  className="w-5 h-5 flex items-center justify-center group"
                                >
                                  <svg
                                    className="text-[#007595] group-hover:text-gray-800 transition-all duration-700 ease-in-out"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 18 18"
                                    fill="none"
                                  >
                                    <path
                                      d="M8.57084 0.140905C8.77176 -0.0157322 9.04438 -0.0441704 9.2733 0.067628C9.50221 0.179426 9.6474 0.411912 9.6474 0.666672V4.007C11.5347 4.11302 13.0359 4.67225 14.2134 5.55105C15.5204 6.52639 16.3797 7.85847 16.9418 9.28015C18.0571 12.1006 18.0478 15.3937 17.9706 17.3595C17.9563 17.7223 17.6544 18.007 17.2913 17.9999C16.9283 17.9927 16.6378 17.6964 16.6378 17.3333C16.6378 17.2088 16.599 16.9855 16.4876 16.6619C16.3796 16.3485 16.2165 15.978 16.0015 15.572C15.5714 14.7597 14.9518 13.8391 14.207 12.9928C13.4603 12.1445 12.6071 11.3927 11.716 10.8938C11.0208 10.5045 10.3252 10.2811 9.6474 10.2644V13.6296C9.6474 13.8844 9.50221 14.1169 9.2733 14.2287C9.04438 14.3405 8.77176 14.312 8.57084 14.1554L0.257105 7.67392C0.095068 7.5476 0.000331879 7.35361 0.000331879 7.14815C0.000331879 6.94269 0.095068 6.74871 0.257105 6.62239L8.57084 0.140905Z"
                                      fill="currentColor"
                                    />
                                  </svg>
                                </Link>
                                <button
                                  onClick={() => likeComment(com.id)}
                                  className="w-5 h-5 flex items-center justify-center group"
                                >
                                  {com.liked ? (
                                    <svg
                                      className="text-red-500 group-hover:text-gray-800 transition-all duration-700 ease-in-out"
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="18"
                                      height="18"
                                      viewBox="0 0 18 18"
                                      fill="none"
                                    >
                                      <path
                                        d="M1.62629 2.43257C3.64001 0.448687 6.82082 0.311339 8.99614 2.02053C11.1723 0.311339 14.3589 0.448687 16.3726 2.43257L16.3734 2.43334C18.5412 4.57611 18.5412 8.04382 16.3804 10.1867L16.378 10.1891L9.46309 16.9764C9.20352 17.2312 8.78765 17.2309 8.52844 16.9758L1.62629 10.1821C-0.542748 8.04516 -0.542748 4.56947 1.62629 2.43257Z"
                                        fill="currentColor"
                                      />
                                    </svg>
                                  ) : (
                                    <svg
                                      className="text-[#007595] group-hover:text-gray-800 transition-all duration-700 ease-in-out"
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="18"
                                      height="18"
                                      viewBox="0 0 18 18"
                                      fill="none"
                                    >
                                      <path
                                        d="M1.62629 2.43257C3.64001 0.448687 6.82082 0.311339 8.99614 2.02053C11.1723 0.311339 14.3589 0.448687 16.3726 2.43257L16.3734 2.43334C18.5412 4.57611 18.5412 8.04382 16.3804 10.1867L16.378 10.1891L9.46309 16.9764C9.20352 17.2312 8.78765 17.2309 8.52844 16.9758L1.62629 10.1821C-0.542748 8.04516 -0.542748 4.56947 1.62629 2.43257Z"
                                        fill="currentColor"
                                      />
                                    </svg>
                                  )}
                                </button>
                                <span className="text-xs text-gray-500">
                                  {com.likes_count}
                                </span>
                                <Link
                                  onClick={() => deleteComment(com.id)}
                                  to=""
                                  className="w-5 h-5 flex items-center justify-center group"
                                >
                                  <svg
                                    className="text-[#007595] group-hover:text-gray-800 transition-all duration-700 ease-in-out"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 18 18"
                                    fill="none"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      clipRule="evenodd"
                                      d="M4.5835 3.16634V3.83301H1.50016C1.13197 3.83301 0.833496 4.13148 0.833496 4.49967C0.833496 4.86786 1.13197 5.16634 1.50016 5.16634L2.33356 5.16642L2.33356 11.5482C2.33354 12.6855 2.33352 13.6065 2.43103 14.3318C2.5325 15.0865 2.75042 15.7283 3.26105 16.2389C3.77168 16.7495 4.4135 16.9675 5.16821 17.0689C5.89348 17.1665 6.81445 17.1664 7.9518 17.1664H10.0486C11.186 17.1664 12.107 17.1665 12.8322 17.0689C13.5869 16.9675 14.2288 16.7495 14.7394 16.2389C15.25 15.7283 15.4679 15.0865 15.5694 14.3318C15.6669 13.6065 15.6669 12.6856 15.6669 11.5483V5.16642L16.5002 5.16634C16.8684 5.16634 17.1668 4.86786 17.1668 4.49967C17.1668 4.13148 16.8684 3.83301 16.5002 3.83301H13.4168V3.16634C13.4168 1.87768 12.3722 0.833008 11.0835 0.833008H6.91683C5.62817 0.833008 4.5835 1.87768 4.5835 3.16634ZM6.91683 2.16634C6.36455 2.16634 5.91683 2.61406 5.91683 3.16634V3.83301H12.0835V3.16634C12.0835 2.61406 11.6358 2.16634 11.0835 2.16634H6.91683ZM7.50014 7.58303C7.86833 7.58303 8.16681 7.8815 8.16681 8.24969L8.16681 12.7497C8.16681 13.1179 7.86833 13.4164 7.50014 13.4164C7.13195 13.4164 6.83348 13.1179 6.83348 12.7497L6.83348 8.24969C6.83348 7.8815 7.13195 7.58303 7.50014 7.58303ZM11.1669 8.24969C11.1669 7.8815 10.8684 7.58303 10.5002 7.58303C10.132 7.58303 9.83356 7.8815 9.83356 8.24969V12.7497C9.83356 13.1179 10.132 13.4164 10.5002 13.4164C10.8684 13.4164 11.1669 13.1179 11.1669 12.7497L11.1669 8.24969Z"
                                      fill="currentColor"
                                    />
                                  </svg>
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
export default Product;
