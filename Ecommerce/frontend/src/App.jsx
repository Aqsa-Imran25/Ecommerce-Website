import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Shop from "./components/Shop";
import Product from "./components/Product/Product";
import Cart from "./components/Cart/Cart";
import Checkout from "./components/Cart/Checkout/Checkout";
import Contact from "./components/Contact";
import Login from "./components/Admin/Login";
import { ToastContainer } from "react-toastify";
import Dashboard from "./components/Admin/Dashboard";
import { Adminrequireauth } from "./components/Admin/Adminrequireauth";
import ShowCategory from "./components/Admin/Category/ShowCategory";
import CreateCategory from "./components/Admin/Category/CreateCategory";
import EditCategory from "./components/Admin/Category/EditCategory";
import Showbrand from "./components/Admin/Brand/Showbrand";
import Createbrand from "./components/Admin/Brand/Createbrand";
import Editbrand from "./components/Admin/Brand/Editbrand";
import ProductCreate from "./components/Admin/Product/ProductCreate";
import ProductShow from "./components/Admin/Product/ProductShow";
import ProductEdit from "./components/Admin/Product/ProductEdit";
import Register from "./components/Register";
import { Userrequireauth } from "./components/User/Userrequireauth";
import UserDashboard from "./components/User/UserDashboard";
import OrderConfirmation from "./components/User/OrderConfirmation";
import ShowOrder from "./components/Admin/Order/ShowOrder";
import OrderDetail from "./components/Admin/Order/OrderDetail";
import UserOrder from "./components/User/UserOrder";
import UserOrderDetail from "./components/User/UserOrderDetail";
import Shipping from "./components/Admin/Shipping/Shipping";
import Profile from "./components/User/Profile";
import CreateSize from "./components/Admin/Sizes/CreateSize";
import ShowSize from "./components/Admin/Sizes/ShowSize";
import EditSize from "./components/Admin/Sizes/EditSize";
import ShowUser from "./components/Admin/User/ShowUser";
import AIChat from "./chatbot/AIChat";
import Store from "./components/Vendor/Store";
import { Vendorrequireauth } from "./components/Vendor/Vendorrequireauth";


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/ai-chat" element={<AIChat />} />
          {/* user routes */}
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/user/dashboard"
            element={
              <Userrequireauth>
                <UserDashboard />
              </Userrequireauth>
            }
          />
          {/* vendor */}
 <Route
            path="/vendor/dashboard"
            element={
              <Vendorrequireauth>
                <Dashboard />
              </Vendorrequireauth>
            }
          />

          <Route
            path="/vendor"
            element={
              <Userrequireauth>
                <Store />
              </Userrequireauth>
            }
          />

          {/* profile */}
          <Route
            path="/myaccount"
            element={
              <Userrequireauth>
                <Profile />
              </Userrequireauth>
            }
          />

          {/* checkout */}
          <Route
            path="/checkout"
            element={
              <Userrequireauth>
                <Checkout />
              </Userrequireauth>
            }
          />
          {/* confirmation */}
          <Route
            path="/order/confirmation/:id"
            element={
              <Userrequireauth>
                <OrderConfirmation />
              </Userrequireauth>
            }
          />

          {/* user order */}
          <Route
            path="/myorder"
            element={
              <Userrequireauth>
                <UserOrder />
              </Userrequireauth>
            }
          />
          {/* user order detail*/}
          <Route
            path="/myorder/:id"
            element={
              <Userrequireauth>
                <UserOrderDetail />
              </Userrequireauth>
            }
          />

          {/* admin routes */}
          <Route
            path="/admin/dashboard"
            element={
              <Adminrequireauth>
                <Dashboard />
              </Adminrequireauth>
            }
          />
          {/* category-Routes */}
          <Route
            path="/admin/categories"
            element={
              <Adminrequireauth>
                <ShowCategory />
              </Adminrequireauth>
            }
          />

          <Route
            path="/admin/categories/create"
            element={
              <Adminrequireauth>
                <CreateCategory />
              </Adminrequireauth>
            }
          />

          <Route
            path="/admin/categories/edit/:id"
            element={
              <Adminrequireauth>
                <EditCategory />
              </Adminrequireauth>
            }
          />
          {/* brand-Routes */}

          <Route
            path="/admin/brands"
            element={
              <Adminrequireauth>
                <Showbrand />
              </Adminrequireauth>
            }
          />
          <Route
            path="/admin/brands/create"
            element={
              <Adminrequireauth>
                <Createbrand />
              </Adminrequireauth>
            }
          />
          <Route
            path="/admin/brands/:id/edit"
            element={
              <Adminrequireauth>
                <Editbrand />
              </Adminrequireauth>
            }
          />
          {/* product-size-create
           */}
          <Route
            path="/admin/sizes/create"
            element={
              <Adminrequireauth>
                <CreateSize />
              </Adminrequireauth>
            }
          />
          {/* show size */}
          <Route
            path="/admin/sizes/"
            element={
              <Adminrequireauth>
                <ShowSize />
              </Adminrequireauth>
            }
          />
          {/* edit size */}
          <Route
            path="/admin/size/:id/edit"
            element={
              <Adminrequireauth>
                <EditSize />
              </Adminrequireauth>
            }
          />

          {/* product-Routes */}
          <Route
            path="/products"
            element={
              <Adminrequireauth>
                <ProductShow />
              </Adminrequireauth>
            }
          />
          <Route
            path="/products/create"
            element={
              <Adminrequireauth>
                <ProductCreate />
              </Adminrequireauth>
            }
          />
          <Route
            path="/products/:id/edit"
            element={
              <Adminrequireauth>
                <ProductEdit />
              </Adminrequireauth>
            }
          />
          {/* orders */}
          <Route
            path="/admin/orders"
            element={
              <Adminrequireauth>
                <ShowOrder />
              </Adminrequireauth>
            }
          />
          {/* order-detail */}
          <Route
            path="/admin/orders/:id"
            element={
              <Adminrequireauth>
                <OrderDetail />
              </Adminrequireauth>
            }
          />

          {/* SHIPPING */}
          <Route
            path="/admin/shipping"
            element={
              <Adminrequireauth>
                <Shipping />
              </Adminrequireauth>
            }
          />
          {/* users */}
          <Route
            path="/admin/users"
            element={
              <Adminrequireauth>
                <ShowUser />
              </Adminrequireauth>
            }
          />

        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </>
  );
}

export default App;
