import React, { useContext, useState } from "react";
import Layout from "../common/Layout";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { apiUrl } from "../common/Http";
import { toast } from "react-toastify";
import { AdminAuthContext } from "../context/AdminAuth";
import { UserAuthContext } from "../context/UserAuth";
import { VendorAuthContext } from "../context/VendorAuth";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { login: adminLogin } = useContext(AdminAuthContext);
  const { login: vendorLogin } = useContext(VendorAuthContext);
  const { login: userLogin } = useContext(UserAuthContext);

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);



  const onHandleSubmit = async (data) => {
    try {
      setLoading(true);

      const response = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.role === "admin") {
        localStorage.removeItem("userInfo");
        localStorage.removeItem("vendorInfo");
      }

      if (result.role === "user") {
        localStorage.removeItem("adminInfo");
        localStorage.removeItem("vendorInfo");
      }

      if (result.role === "vendor") {
        localStorage.removeItem("userInfo");
        localStorage.removeItem("adminInfo");
      }

      if (result.status === 200) {
        const userData = {
          token: result.token,
          name: result.user.name,
          role: result.role,
        };

        if (result.role === "admin") {
          data.remember
            ? localStorage.setItem("adminInfo", JSON.stringify(userData))
            : sessionStorage.setItem("adminInfo", JSON.stringify(userData));

          adminLogin(userData);
          navigate("/admin/dashboard");
          toast.success("Admin Login Successful!");
        } else if (result.role === "vendor") {
          if (!result.token && result.user) {
            toast.success("Invalid Vendor Data!");
            return;
          }
          data.remember
            ? localStorage.setItem("vendorInfo", JSON.stringify(userData))
            : sessionStorage.setItem("vendorInfo", JSON.stringify(userData));

          vendorLogin(userData);
          navigate("/vendor/dashboard");
          toast.success("Vendor Login Successful!");
        } else {
          data.remember
            ? localStorage.setItem("userInfo", JSON.stringify(userData))
            : sessionStorage.setItem("userInfo", JSON.stringify(userData));

          userLogin(userData);
          navigate("/user/dashboard");
          toast.success("User Login Successful!");
        }
      } else {
        if (result.errors) {
          Object.keys(result.errors).forEach((field) => {
            toast.error(result.errors[field].join(" "));
          });
        } else {
          toast.error(result.message || "Login failed");
        }
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-4">
        <form
          onSubmit={handleSubmit(onHandleSubmit)}
          className="w-full max-w-md bg-gray-50 p-8 rounded-2xl shadow-xl transform transition-all duration-500 hover:shadow-2xl"
        >
          <h2 className="text-3xl font-bold text-center text-[#007595] mb-8 animate-fadeIn">
            Login Account
          </h2>
          {/* Email */}
          <div className="mb-5">
            <label className="block mb-2 text-sm text-slate-600">
              Email
            </label>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value:
                    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              type="email"
              className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="mb-5">
            <label className="block mb-2 text-sm text-slate-600">
              Password
            </label>
            <input


              {...register("password", {
                required: "Password is required",
              })}
              type="password"
              className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
              placeholder="Enter password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#007595] text-white py-2 rounded-lg font-semibold transition-all duration-300 
            hover:bg-slate-900 hover:scale-[1.02] active:scale-95 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Sign In"}
          </button>

          <p className="text-center text-sm mt-6">
            Don&apos;t have an account?{" "}

            <Link
              to="/register"
              className="text-[#007595] font-semibold hover:underline"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </Layout>
  );
}

export default Login;

