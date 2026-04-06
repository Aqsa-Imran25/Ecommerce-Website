import React, { useState, useRef, useMemo, useEffect } from 'react';
import JoditEditor from 'jodit-react';
import Sample from '../../common/Sample';
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import { adminToken, apiUrl, getAuthToken, getUserRole } from '../../common/Http';
import { useNavigate, useParams } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'; // Specific icon import


function ProductEdit({ placeholder }) {
  const editor = useRef(null);
  const [description, setDescription] = useState('');
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const navigate = useNavigate();
  // 
  const params = useParams();

  // oldimages in db
  const [oldImages, setOldImages] = useState([]);

  // new-image create
  const [newImages, setNewImages] = useState([]);
  // sizes
  const [sizes, setSizes] = useState([]);
  const token = getAuthToken();
  const role = getUserRole();



  const config = useMemo(() => ({
    readonly: false,
    placeholder: placeholder || ''
  }), [placeholder]);

  // update
  const updatedProduct = async (data) => {
    console.log("Form Data before sending:", data);

    try {
      const formData = new FormData();

      formData.append("title", data.title);
      formData.append("category_id", parseInt(data.category_id));
      if (data.brand_id) {
        formData.append("brand_id", data.brand_id);
      }

      formData.append("status", data.status);
      formData.append("short_description", data.short_description || "");
      formData.append("description", description || "");
      formData.append("price", data.price);
      if (data.compare_price) {
        formData.append("compare_price", data.compare_price);
      }
      formData.append("sku", data.sku || "");
      formData.append("barcode", data.barcode || "");
      formData.append("qty", Number(data.qty));
      formData.append("is_Featured", data.is_Featured || "no");
      // old-imgs id send to backend
      oldImages.forEach(img => formData.append("old_image_ids[]", img.id));
      // new-images file
      newImages.forEach(img => formData.append("new_images[]", img.file));
      // sizes array
      // Append sizes to FormData
      if (data.sizes && data.sizes.length > 0) {
        data.sizes.forEach(sizeId => formData.append('sizes[]', sizeId));
      }

      // backend update
      formData.append('_method', "PUT");

      // const token = getAuthToken();

      const res = await fetch(`${apiUrl}/products/${params.id}`, {
        method: "POST",
        headers: {

          "Authorization": `Bearer ${token}`,
        },
        body: formData
      });
      //convert into js obj or arr 
      const result = await res.json();
      console.log("Result:", result);

      // const result = JSON.parse(text);

      if (res.ok) {
        toast.success("Product Updated Successfully");
        navigate("/products");
      } else {
        toast.error(result.message || "Something went wrong");
      }

    } catch (error) {
      console.error(error);

      console.log("API URL:", apiUrl);

      toast.error("Unexpected server error");
    }
  };


  // fetchSinglePRODUCT for edit page
  const fetchSingleProduct = async () => {
    try {
      const res = await fetch(`${apiUrl}/products/${params.id}`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });
      const result = await res.json();
      if (result.status == 200) {
        const product = result.data;
        reset({
          ...product,
          sizes: product.product_sizes
            ? product.product_sizes.map(size => String(size.id))
            : []
        })

        // description
        setDescription(product.description)
        // old-images
        setOldImages(product.product_images || [])
      }
    }
    catch (error) {
      console.error("Fetch error:", error);
      toast.error("Something Went Wrong!");
    }
  }

  // fetchcategory
  const fetchCategory = async () => {
    try {
      const res = await fetch(`${apiUrl}/admin/categories`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });
      const result = await res.json();
      if (result.status === 200) setCategories(result.data);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Something Went Wrong!");
    }
  };

  // fetchbrand
  const fetchBrand = async () => {
    try {
      const res = await fetch(`${apiUrl}/admin/brands`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });
      const result = await res.json();
      if (result.status === 200) setBrands(result.data);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Something Went Wrong!");
    }
  };

  // fetchsizes
  const fetchSizes = async () => {
    try {
      const res = await fetch(`${apiUrl}/sizes`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });
      const result = await res.json();
      console.log("Sizes",result)
      if (result.status === 200) setSizes(result.data);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Something Went Wrong!");
    }
  };


  // deleteImage
  const deleteImage = async (type, id) => {
    try {
      const res = await fetch(`${apiUrl}/productimg-delete/${id}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });
      const result = await res.json();
      console.log(result)
      if (result.status === 200)
        try {
          if (type === 'old') {
            setOldImages(prev => prev.filter(value => value.id != id));

          } else {
            setNewImages(newImages.filter(img => img.id != id));
          }
          toast.success(result.message);
        }
        catch (error) {
          toast.error(result.message);

        }

    } catch (error) {
      console.error("Fetch error:", error);
      toast.error(result.message);

    }
  }


  useEffect(() => {
    fetchCategory();
    fetchBrand();
    fetchSingleProduct();
    fetchSizes();
  }, []);




  return (

    <>
      <Sample title='Product-Edit' btnText='Back' to='/products'>
        <form onSubmit={handleSubmit(updatedProduct)}>
          {/* Title */}

          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-black text-xs font-bold mb-2">Title</label>
              <input
                {...register("title", { required: "The title field is required." })}
                className="appearance-none block w-full text-black border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                type="text"
                placeholder="Product Title"
              />
              {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
            </div>
          </div>

          {/* Category & Brand */}
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6">
              <label className="block uppercase tracking-wide text-black text-xs font-bold mb-2">Category</label>

              <div className='relative'>
                <select {...register("category_id", { required: "Please select a category." })}
                  className="block appearance-none w-full border border-gray-200 text-black py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                  <option value="">Select a Category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
              {errors.category_id && <p className="text-red-500 text-sm">{errors.category_id.message}</p>}
            </div>
            <div className="w-full md:w-1/2 px-3 mb-6">
              <label className="block uppercase tracking-wide text-black text-xs font-bold mb-2">Brand</label>
              <div className='relative'>
                <select {...register("brand_id")}
                  className="block appearance-none w-full border border-gray-200 text-black py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                  <option value="">Select a Brand</option>
                  {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Short Description */}
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-black text-xs font-bold mb-2">Short Description</label>
              <textarea {...register("short_description")} rows="4"
                className="appearance-none block w-full text-black border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white">
              </textarea>
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-black text-xs font-bold mb-2">Description</label>
              <JoditEditor
                ref={editor}
                value={description}
                config={config}
                tabIndex={1}
                onBlur={newContent => setDescription(newContent)}
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6">
              <label className="block uppercase tracking-wide text-black text-xs font-bold mb-2">Price</label>
              <input {...register("price", { required: "The price field is required." })}
                className="appearance-none block w-full text-black border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" type="text" />
              {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
            </div>
            <div className="w-full md:w-1/2 px-3 mb-6">
              <label className="block uppercase tracking-wide text-black text-xs font-bold mb-2">Discounted Price</label>
              <input {...register("compare_price")}
                className="appearance-none block w-full text-black border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" type="text" />
            </div>
          </div>

          {/*qty and sku*/}
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6">
              <label className="block uppercase tracking-wide text-black text-xs font-bold mb-2">Qty</label>
              <input {...register("qty", { required: "The qty field is required." })}
                className="appearance-none block w-full text-black border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" type="text" />
            </div>
            <div className="w-full md:w-1/2 px-3 mb-6">
              <label className="block uppercase tracking-wide text-black text-xs font-bold mb-2">Sku</label>
              <input {...register("sku", { required: "The sku code is required." })}
                className="appearance-none block w-full text-black border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" type="text" />
              {errors.sku && <p className="text-red-500 text-sm">{errors.sku.message}</p>}
            </div>
          </div>
          {/* status */}
          {
            role === "admin" &&
            <div className="flex flex-wrap -mx-3 mb-6">

              <div className="w-full px-3 mb-6">
                <label className="block uppercase tracking-wide text-black text-xs font-bold mb-2">Status</label>
                <div className="relative">
                  <select
                    {...register("status", { required: "Please select a status." })}
                    className="block appearance-none w-full border border-gray-200 text-black py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  >
                    <option value="">Select a Status</option>
                    <option value="1">Active</option>
                    <option value="0">Block</option>
                  </select>

                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
                {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>}
              </div>
            </div>
          }
          {/* featured */}
          {
            role === "admin" &&

            <div className="flex flex-wrap -mx-3 mb-6">

              <div className="w-full px-3 mb-6">
                <label className="block uppercase tracking-wide text-black text-xs font-bold mb-2">Featured</label>
                <div className="relative">
                  <select
                    {...register("is_Featured", { required: "Please select a status." })}
                    className="block appearance-none w-full border border-gray-200 text-black py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  >

                    <option value="">Select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>

                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
                {errors.is_Featured && <p className="text-red-500 text-sm mt-1">{errors.is_Featured.message}</p>}
              </div>
            </div>
          }

          {/* CHECKOX */}
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="px-3 mb-6 w-full">
              <label className="block uppercase tracking-wide text-black text-xs font-bold mb-2">
                Size
              </label>

              <div className="flex flex-wrap -mx-2">
                {sizes.map((size) => (
                  <label
                    key={size.id}
                    className="flex items-center px-2 mb-2 w-full sm:w-1/2 md:w-1/3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      value={size.id}
                      className="md:w-5 md:h-5 w-3 h-3 mx-2"
                      {...register("sizes")}
                    />
                    <span>{size.name}</span>
                  </label>
                ))}
              </div>

              {errors.sizes && (
                <p className="text-red-500 text-sm mt-1">{errors.sizes.message}</p>
              )}
            </div>
          </div>
          {/* Images */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">Product Images</h3>

            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-400 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition">
              <span className="text-gray-600 text-sm font-medium">Choose Files</span>
              <span className="text-gray-500 text-xs mt-1">or drag and drop images here</span>
              <input
                type="file"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files);
                  const preview = files.map(file => ({
                    file,
                    preview: URL.createObjectURL(file)
                  }));
                  setNewImages(prev => [...prev, ...preview]);
                }}
                className="hidden"
              />
            </label>

            {/* Existing Images */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
              {oldImages.map((img) => (
                <div className='w-full' key={img.id}>
                  <div className="relative group rounded-xl shadow-md">
                    <img src={`http://backend.test/storage/product/${img.name}`}
                      alt="old"
                      className="w-full h-32 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => deleteImage('old', img.id)}
                      className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
                    >
                      <FontAwesomeIcon icon={faCircleXmark} className="text-red-500 text-lg" />
                    </button>
                  </div>

                </div>
              ))}
            </div>

            {/* New Images */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
              {newImages.map((img, index) => (
                <div className='w-full'>
                  <div key={index} className="relative group rounded-xl overflow-hidden shadow-md">
                    <div>
                      <img
                        src={img.preview}
                        alt="new"
                        className="w-full h-32 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => deleteImage('new', img.id)}
                        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
                      >
                        <FontAwesomeIcon icon={faCircleXmark} className="text-red-500 text-lg" />
                      </button>
                    </div>
                  </div>


                </div>
              ))}
            </div>
          </div>
          <button type="submit"
            className='rounded-md bg-[#007595] py-2 px-6 mt-5 text-white hover:bg-[#005f66]'>
            Update
          </button>
        </form >
      </Sample >
    </>
  )
}

export default ProductEdit