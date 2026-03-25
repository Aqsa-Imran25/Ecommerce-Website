import React, { useEffect, useState } from 'react'
import Layout from './common/Layout';
import Breadcrum from './common/Breadcrum';
import { apiUrl } from './common/Http';
import { Link, useSearchParams } from 'react-router';
import striptags from "striptags";
import ChatLauncher from '../chatbot/ChatLauncher';
import ChatModal from '../chatbot/ChatModal';

function Shop() {
  const [chatOpen, setChatOpen] = useState(false);

  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [categoriesChecked, setCategoriesChecked] = useState(() => {
    const category = searchParams.get('category');
    return category ? category.split(',') : [];
  });

  const [brandChecked, setBrandChecked] = useState(() => {
    const brand = searchParams.get('brand');
    return brand ? brand.split(',') : [];
  });

  const [products, setProducts] = useState([]);

  //   fetchProduct
  const fetchProducts = async () => {
    // search
    console.log('catechecked=', categoriesChecked);
    console.log('brandchecked=', brandChecked);

    try {
      let search = [];
      let params = '';
      // categorychecked
      if (categoriesChecked.length > 0) {
        search.push(['category', categoriesChecked]);
      }
      // brandchecked
      if (brandChecked.length > 0) {
        search.push(['brand', brandChecked]);
      }

      if (search.length > 0) {
        params = new URLSearchParams(search);
        setSearchParams(params)
      }
      else {
        setSearchParams([]);
      }
      const res = await fetch(`${apiUrl}/getProducts?${params}`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          "Accept": "application/json",
        },
      });
      const result = await res.json();
      if (result.status === 200)
        console.log("products", result)
      setProducts(result.data);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Something Went Wrong!");
    }
  };
  // fetchgetcategory
  const fetchCategory = async () => {
    try {
      const res = await fetch(`${apiUrl}/getCategories`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          "Accept": "application/json",
        },
      });
      const result = await res.json();
      if (result.status === 200)
        setCategories(result.data);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Something Went Wrong!");
    }
  };

  // fetchbrand
  const fetchBrand = async () => {
    try {
      const res = await fetch(`${apiUrl}/getBrands`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          "Accept": "application/json",
        },
      });
      const result = await res.json();
      if (result.status === 200)
        setBrands(result.data);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Something Went Wrong!");
    }
  };

  // handleCategory
  const handleCategory = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setCategoriesChecked(prev => [...prev, value]);
    } else {
      setCategoriesChecked(categoriesChecked.filter(id => id !== value));
    }

  }

  // handleBrand
  const handleBrand = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setBrandChecked(prev => [...prev, value]);
    }
    else {
      setBrandChecked(brandChecked.filter(id => id !== value));
    }
  }

  useEffect(() => {
    fetchCategory();
    fetchBrand();
    fetchProducts();

  }, [categoriesChecked, brandChecked])
  return (
    <Layout>
      <div className='container mx-auto px-2 md:px-4 py-2'>
        <Breadcrum bread="Shop" />
        <div className='flex flex-col md:flex-row gap-4'>

          <div className='w-full md:w-1/5 flex flex-col gap-4'>

            <div className='text-black p-6 shadow-2xl rounded-sm'>
              <h1 className='mb-2 font-bold'>Categories</h1>
              <ul>
                {
                  categories && categories.map((cat) => (
                    <div key={cat.id}>
                      <li className='flex mb-2'>
                        <input
                          id={`cat-${cat.id}`}
                          defaultChecked={searchParams.get('category') ?
                            searchParams.get('category').includes(cat.id)
                            : false
                          }
                          value={cat.id}
                          onClick={handleCategory}
                          type="checkbox" className="h-4 w-4 border-2 border-gray-300 rounded-lg
             checked:bg-gray-200 checked:border-gray-500
             focus:outline-none 
             transition-all duration-200 cursor-pointer" />
                        <label htmlFor="cat1" className="ps-4 text-sm
                        ">{cat.name}</label>
                      </li>
                    </div>

                  ))
                }
              </ul>
            </div>

            <div className='text-black p-6 shadow-2xl rounded-sm'>
              <h1 className='mb-2 font-bold'>Brands</h1>
              <ul>
                {
                  brands && brands.map((brand) => (
                    <div key={brand.id}>
                      <li className='flex mb-2'>
                        <input type="checkbox"
                          value={brand.id}
                          defaultChecked={searchParams.get('brand') ?
                            searchParams.get('brand').includes(brand.id)
                            : false
                          }
                          onClick={handleBrand}
                          id={`brand-${brand.id}`}
                          className="h-4 w-4 border-2 border-gray-300 rounded-lg
             checked:bg-gray-200 checked:border-gray-500
             focus:outline-none 
             transition-all duration-200 cursor-pointer" />
                        <label htmlFor="cat1" className="ps-4 text-sm
                        ">{brand.name}</label>
                      </li>
                    </div>

                  ))
                }
              </ul>
            </div>

          </div>

          {/* Floating Chat Icon */}
          <ChatLauncher onClick={() => setChatOpen(true)} />

          {/* Modal with AI Chat */}
          <ChatModal isOpen={chatOpen} onClose={() => setChatOpen(false)} />

          <div className='w-full md:w-4/5 rounded-2xl'>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="relative flex flex-col bg-white shadow-sm border border-slate-200 rounded-lg w-full max-w-sm mx-auto transition delay-150 duration-300 ease-in-out hover:-translate-y-1"
                >
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Link to={`/product/${product.id}`}>
                      <img
                        src={product.image_url}
                        alt={product.title}
                        className="h-60 w-full object-cover"
                      />
                    </Link>
                  </div>

                  <div className="p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-slate-800 text-lg font-semibold">
                        {product.title}
                      </p>
                      <p className="text-cyan-600 text-lg font-semibold">
                        ${product.price}
                      </p>
                    </div>

                    <p className="text-slate-600 text-sm leading-normal font-light">
                      {striptags(product.description)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </Layout>
  )
}

export default Shop;
