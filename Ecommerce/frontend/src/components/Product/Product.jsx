import React, { useContext, useEffect, useState } from "react";
import Layout from "../common/Layout";
import { Link,  useParams } from "react-router";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { apiUrl, getAuthToken, UserToken } from "../common/Http";
import { toast } from "react-toastify";
import { CartContext } from "../context/Cart";
import striptags from "striptags";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import ReviewSection from "../common/ReviewSection";
import Loader from "../common/Loader";
import ChatLauncher from "../../chatbot/ChatLauncher";
import ChatModal from "../../chatbot/ChatModal";

dayjs.extend(relativeTime);

function Product() {
  const [chatOpen, setChatOpen] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [product, setProduct] = useState(null);
  const [productImages, setProductImages] = useState([]);
  const [productSizes, setProductSizes] = useState([]);
  const [sizeSelected, setSizeSelected] = useState(null);
  const [activeTab, setActiveTab] = useState("");
  const { addToCart } = useContext(CartContext);

  // fetchComments from db
  const { id } = useParams();

  // LIKES
  const [likes, setLikes] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const token = getAuthToken();
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


  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);


  if (!product) {
    return (
      <Layout>
        <div className="text-center py-20 text-xl font-semibold">
          <Loader />
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

  // handlelikes
  // const submitComment = async (data) => {
  //   console.log(data);
  //   try {
  //     const res = await fetch(`${apiUrl}/comment/${id}`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Accept: "application/json",
  //         Authorization: `Bearer ${UserToken()}`,
  //       },
  //       body: JSON.stringify(data),
  //     });

  //     const result = await res.json();

  //     console.log("API Show Result:", result);

  //     if (result.status === 200) {
  //       toast.success(result.message);
  //       navigate(`/product/${id}`);
  //     } else {
  //       console.log("Something went wrong!");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     toast.error(result.message);
  //   }
  // };
  // deletecomment
  // const deleteComment = async (id) => {
  //   if (!window.confirm("Are you sure you want to delete this comment?"))
  //     return;

  //   const res = await fetch(`${apiUrl}/comment/${id}`, {
  //     method: "DELETE",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Accept: "application/json",
  //       Authorization: `Bearer ${UserToken()}`,
  //     },
  //   });
  //   const result = await res.json();

  //   if (result.status == 200) {
  //     toast.success(result.message);
  //     setComment((prev) => prev.filter((com) => com.id !== id));
  //   } else {
  //     console.log("Something went wrong!");
  //   }
  // };

  // handleLikesproduct
  const handleLikes = async () => {
    try {
      const res = await fetch(`${apiUrl}/product/${id}/like`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("401res:", res.status)

      const result = await res.json();
      if (res.status === 401) {
        toast.error("Authentication required. Please log in.");
      }

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

  //     const res = await fetch(`${apiUrl}/comment/${commentId}/like`, {
  //       method: "POST",
  //       headers: {
  //         Accept: "application/json",
  //         Authorization: `Bearer ${UserToken()}`,
  //       },
  //     });

  //     const result = await res.json();

  //     if (result.status === 200) {
  //       setComment((prev) =>
  //         prev.map((c) =>
  //           c.id === commentId
  //             ? {
  //               ...c,
  //               likes_count: result.totalLikes,
  //               liked: result.liked,
  //             }
  //             : c,
  //         ),
  //       );

  //       toast.success(result.message);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     toast.error("Something went wrong!");
  //   }
  // };

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

            {/* price */}
            <div className="text-2xl pb-3 py-3">
              Rs {product?.price}
              <span className="text-gray-400 ps-3">
                Rs {product?.compare_price}
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
            {/* addtocart */}
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
          </ul>

          <div className="mt-4">
            {activeTab === "description" && (
              <div>{striptags(product?.description)}</div>
            )}
            {/* reviews */}
            {activeTab === "reviews" && <ReviewSection />}

            {/* Floating Chat Icon */}
            <ChatLauncher onClick={() => setChatOpen(true)} />

            {/* Modal with AI Chat */}
            <ChatModal isOpen={chatOpen} onClose={() => setChatOpen(false)} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
export default Product;
