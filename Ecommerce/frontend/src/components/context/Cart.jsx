import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { apiUrl, UserToken } from "../common/Http";

export const CartContext = createContext({
  cartData: [],
  addToCart: () => {},
  updateCartqty: () => {},
  removeItem: () => {},
  shipping: () => 0,
  subTotal: () => 0,
  grandTotal: () => 0,
});

export const CartProvider = ({ children }) => {
  const [shippingCost, setShippingCost] = useState(0);
  const [cartData, setCartData] = useState(() => {
    try {
      const cart = localStorage.getItem("cart");
      return cart ? JSON.parse(cart) : [];
    } catch (error) {
      console.error("Failed to parse cart from localStorage:", error);
      return [];
    }
  });
  // cart data
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cartData));
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  }, [cartData]);
  // shipping cost fetch
  useEffect(() => {
    const fetchApi = async () => {
      try {
        const token = UserToken();
        if (!token) {
          setShippingCost(0);
          return;
        }
        const res = await fetch(`${apiUrl}/customer-shipping`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await res.json();
        if (result.status == 200) {
          setShippingCost(result.data?.shipping_charge || 0);
        }
      } catch (error) {
        setShippingCost(0);
        console.error("Fetch error:", error);
        toast.error("Something Went Wrong!");
      }
    };
    fetchApi();
  }, []);

  const addToCart = (product, size = null) => {
    const existingItem = cartData.find(
      (item) => item.product_id === product.id && item.size === size,
    );

    if (existingItem) {
      const updatedCart = cartData.map((item) =>
        item.product_id === product.id && item.size === size
          ? { ...item, qty: item.qty + 1 }
          : item,
      );
      setCartData(updatedCart);
    } else {
      const newItem = {
        id: crypto.randomUUID(),
        product_id: product.id,
        title: product.title,
        image_url: product.image_url,
        qty: 1,
        size: size || "",
        price: product.price,
      };
      setCartData([...cartData, newItem]);
    }
  };
  // shipping
  const shipping = () => (subTotal() >= 5000 ? 0 : shippingCost);
  // subtotal
  const subTotal = () => {
    return cartData.reduce((total, item) => total + item.qty * item.price, 0);
  };
  // grandtotal
  const grandTotal = () => {
    return shipping() + subTotal();
  };

  const updateCartqty = (productId, qty, size = null) => {
    if (qty <= 0) {
      removeItem(productId);
      return;
    }
    setCartData(
      cartData.map((item) =>
        item.product_id === productId && item.size === size
          ? { ...item, qty }
          : item,
      ),
    );
  };

  const removeItem = (id) => {
    setCartData(cartData.filter((item) => item.id !== id));
    toast.success("Remove Item Successfully!");
  };

  // totalItems
  const totalItems = () => {
    return cartData.reduce((total, item) => total + item.qty, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartData,
        shippingCost,
        addToCart,
        shipping,
        totalItems,
        updateCartqty,
        subTotal,
        grandTotal,
        removeItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
