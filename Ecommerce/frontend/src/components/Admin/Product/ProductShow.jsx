
import React, { useEffect, useState } from 'react';
import Sample from '../../common/Sample'
import Loader from '../../common/Loader';
import Empty from '../../common/Empty';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons'; // The solid style icon
import { faXmark } from '@fortawesome/free-solid-svg-icons'; // 'xmark' is the icon name
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { apiUrl, getAuthToken, } from '../../common/Http';
import AdminSample from '../../common/AdminSample';

function ProductShow() {
  const [products, setproducts] = useState([])
  const [loader, setLoader] = useState(false)
  // selectedcheckbox
  const [selectedProducts, setSelectedProducts] = useState([])


  // deleteproduct

  const deleteproduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    const res = await fetch(`${apiUrl}/products/${id}`, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
        "Accept": "application/json",
        "Authorization": `Bearer ${getAuthToken()}`
      },
    })
    const result = await res.json();
    console.log("API Show Result:", result.data);
    if (result.status == 200) {
      toast.success(result.message)
      setproducts(prevproducts => prevproducts.filter(products => products.id !== id));

    } else {
      console.log("Something went wrong!")
    }
  }

  const fetchproductApi = async () => {
    setLoader(true)
    const res = await fetch(`${apiUrl}/products`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        "Accept": "application/json",
        "Authorization": `Bearer ${getAuthToken()}`

      },
    })
    setLoader(false)
    const result = await res.json();

    console.log("API Show Result:", result.data);
    console.log("Token-Show:", getAuthToken());
    if (result.status == 200) {

      setproducts(result.data)

    } else {
      console.log("Something went wrong!")
    }
  }
  // selecteddeletecheckbox
  const deleteSelected = async () => {
    if (selectedProducts.length === 0) { toast.info("No Products Selected Yet!") }
    if (!window.confirm(`Are you sure you want to delete ${selectedProducts.length} product?`))
      return;
    for (const id of selectedProducts) {
      await deleteproduct(id);
    }
    setSelectedProducts([]);
  }

  useEffect(() => {
    fetchproductApi()
  }, [])
  return (
    <>
      <AdminSample title='Products' btnText='Create' to='/products/create'>

        <div className="relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base">
          {
            loader == true && <Loader />
          }{
            loader == false && products.length == 0 && <Empty text='products Are Empty!' />
          }

          {
            products && products.length > 0 &&
            (
              <>
                {
                  selectedProducts.length > 0 &&
                  (
                    <div className='mb-5 font-bold text-white'>
                      <button className='text-white text-sm font-bold bg-red-600 px-4 py-2 rounded-lg'
                        onClick={deleteSelected}
                      >
                        <FontAwesomeIcon icon={faXmark} className="font-bold" size='300' />
                        Delete Selected ({selectedProducts.length}) Product</button>
                    </div>
                  )
                }

                <table className="w-full text-sm text-left rtl:text-right text-body">
                  <thead className="bg-neutral-secondary-soft border-b border-gray-300">
                    <tr>
                      <th scope="col" className="px-6 py-3 font-medium">
                        <input
                          className="h-5 w-5 rounded border-2 border-gray-300
             checked:bg-gray-200 checked:border-gray-500
             focus:outline-none 
             transition-all duration-200 cursor-pointer"
                          type='checkbox'
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedProducts(products.map((p) => p.id))
                            }
                            else {
                              setSelectedProducts([])
                            }
                          }
                          }
                          checked={selectedProducts.length === products.length && products.length > 0}
                        />
                      </th>
                      <th scope="col" className="px-6 py-3 font-medium">
                        Id
                      </th>
                      <th scope="col" className="px-6 py-3 font-medium">
                        Title
                      </th>
                      <th scope="col" className="px-6 py-3 font-medium">
                        Price
                      </th>
                      <th scope="col" className="px-6 py-3 font-medium">
                        SKU
                      </th>
                      <th scope="col" className="px-6 py-3 font-medium">
                        Image
                      </th>
                      <th scope="col" className="px-6 py-3 font-medium">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 font-medium text-center">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      products.map((product, index) => (

                        <tr key={index} className="odd:bg-neutral-primary even:bg-neutral-secondary-soft border-b border-gray-300">
                          <td className="px-6 py-4">
                            <input
                              className="h-5 w-5 rounded border-2 border-gray-300
             checked:bg-gray-200 checked:border-gray-500
             focus:outline-none 
             transition-all duration-200 cursor-pointer"                              type='checkbox'
                              checked={selectedProducts.includes(product.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedProducts((prev) => [...prev, product.id]);
                                }
                                else {
                                  setSelectedProducts((prev) => prev.filter((id) =>
                                    id !== product.id
                                  ));
                                }
                              }
                              }
                            />
                          </td>
                          <th scope="row" className="px-6 py-4 font-medium text-heading whitespace-nowrap">
                            {product.id}
                          </th>
                          <td className="px-6 py-4">
                            {product.title}
                          </td>

                          <td className="px-6 py-4">
                            {product.price}
                          </td>
                          <td className="px-6 py-4">
                            {product.sku}
                          </td>
                          <td className="px-6 py-4">
                            <img
                              src={product.image_url || (product.product_images.length > 0 &&
                                `http://backend.test/storage/product/${product.product_images[0].name}`)}
                              width={50}
                              alt="Product"
                            />
                          </td>

                          <td className="px-6 py-4">
                            {product.status == 1 ?
                              <span className='text-white bg-green-700 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-full text-sm px-4 py-2 text-center leading-5'>Active</span>
                              :
                              <span className='text-white bg-red-500 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-full text-sm px-4 py-2 text-center leading-5'>Block</span>
                            }
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex justify-around">
                              <Link to={`/products/${product.id}/edit`} className="font-medium text-fg-product hover:underline text-blue-600">
                                <FontAwesomeIcon icon={faPencil} />
                              </Link>
                              <Link
                                onClick={() => deleteproduct(product.id)}
                                to="#" className="font-medium text-fg-product hover:underline text-red-600">
                                <FontAwesomeIcon icon={faTrash} />
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))
                    }

                  </tbody>
                </table>
              </>
            )
          }
        </div>
      </AdminSample>
    </>
  )
}

export default ProductShow
