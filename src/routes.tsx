import {
  createBrowserRouter,
  Navigate,
  Outlet,
  useNavigate,
  useParams,
} from "react-router-dom";
import LayoutlClinet from "./components/Layouts/LayoutlClinet";
import LayoutAdmin from "./components/Layouts/LayoutAdmin";
import Home from "./pages/client/Home";
import Listproduct from "./pages/admin/product/Listproduct";
import Addproduct from "./pages/admin/product/add";
import EditProduct from "./pages/admin/product/edit";
import ListKhoaHoc from "./pages/client/List_khoa_hoc";
import Contact from "./pages/client/Contact";
import Boughted from "./pages/client/Boughted";
import Signin from "./components/Layouts/Signin";
import Signup from "./components/Layouts/Signup";
import Listcategory from "./pages/admin/category";
import Addcategory from "./pages/admin/category/add";
import Editcategory from "./pages/admin/category/edit";
import ProductDetail from "./pages/client/detail";
import Pay from "./pages/client/Pay";
import Orderdetail from "./pages/admin/product/Oderdetail";
import Lesson_video from "./pages/client/Lesson_video";
import User from "./pages/admin/User/User";
import EditUser from "./pages/admin/User/EditUser";
import Blog from "./pages/admin/Blog/Blog";
import AddBlog from "./pages/admin/Blog/AddBlog";
import EditBlog from "./pages/admin/Blog/EditBlog";
import BlogDetail from "./pages/admin/Blog/detailBlog";
import Addlesson from "./pages/admin/lesson/add";
import EditLesson from "./pages/admin/lesson/edit";
import Detaillesson from "./pages/admin/lesson/Detaillesson";
import Addquizz from "./pages/admin/quizz/add";
import EditQuizz from "./pages/admin/quizz/edit";
import Videodetail from "./pages/client/Video";
import Detailproduct from "./pages/admin/product/Detailproduct";
import RatingProduct from "./pages/admin/product/ratingProduct";
import CommentProduct from "./pages/admin/product/commentProduct";
import ChangePassword from "./components/Layouts/changePassword";
import ProfileUser from "./pages/admin/User/profileUser";
import ListOrder from "./pages/admin/order/oderList";
import EditProfile from "./pages/admin/User/editProfile";
import LT from "./pages/client/Lotrinh/LT";
import LT_FE from "./pages/client/Lotrinh/LT_FE";
import LT_BE from "./pages/client/Lotrinh/LT_BE";
import Thong_tin_thanhtoan from "./pages/client/Thong_tin_thanhtoan";
import PaymentSuccess from "./pages/client/PaymentSuccess";
import ThanhToan from "./pages/client/ThanhToan";
import ForgotPassword from "./components/Layouts/forgotPassword";
import Blogs from "./pages/client/blogs";
import CreateBlog from "./pages/client/createBlogs";
import Dashboard from "./pages/admin/Dashboard/Dashboard";
import { useGetOneUserQuery } from "./Api/userApi";
import { useEffect, useState } from "react";
import { useGetProductsQuery } from "./Api/productApi";
import Vouche from "./pages/admin/Voucher/vouche";
import EditVouche from "./pages/admin/Voucher/editVouche";
import AddVouche from "./pages/admin/Voucher/addVouche";
import OderId from "./pages/admin/order/OderId";
const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
const isAdmin =
  userInfo && userInfo.userData && userInfo.userData.role === "admin";
function ProtectedElement({ children }) {
  const isLoggedIn = !!localStorage.getItem("userInfo");
  return isLoggedIn ? children : <Navigate to="/pay" />;
}
const CheckCourseUser = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const { idProduct } = useParams();
  const navigate = useNavigate();
  const idUser = userInfo.userData?._id;
  const { data: productData, isLoading: productDataLoading } =
    useGetProductsQuery();
  const {
    data: DataUser,
    isLoading: userDataLoading,
    isError,
  } = useGetOneUserQuery(idUser || "");
  useEffect(() => {
    if (!productDataLoading && !userDataLoading && !isError) {
      const freeCourseIds = productData?.data
        .filter((course) => course.price === "0")
        .map((course) => course._id);
      const userPurchasedCourses = DataUser?.product || [];
      const hasPurchasedOrFreeCourse =
        userPurchasedCourses.some((course) => course._id === idProduct) ||
        freeCourseIds.includes(idProduct);
      if (!hasPurchasedOrFreeCourse) {
        alert("bạn cần thanh toán để xem khoá học này ...!");
        navigate("/home");
      }
    }
  }, [
    productData,
    productDataLoading,
    DataUser,
    userDataLoading,
    isError,
    idProduct,
    navigate,
  ]);
  if (productDataLoading || userDataLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;
  return <Outlet />;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LayoutlClinet />,
    children: [
      {
        index: true,
        element: <Navigate to="home" />,
      },
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "blog",
        element: <Blogs />,
      },
      {
        path: "khoahoc",
        element: <ListKhoaHoc />,
      },
      {
        path: "detail/:idProduct",
        element: <ProductDetail />,
      },
      {
        path: "pay/:idProduct",
        element: (
          <ProtectedElement>
            <Pay />
          </ProtectedElement>
        ),
      },
      {
        path: "blogDetail/:idBlog",
        element: <BlogDetail />,
      },
      {
        path: "createBlog",
        element: <CreateBlog />,
      },
      {
        path: "profile/:idUser",
        element: <ProfileUser />,
      },
      {
        path: "profile/edit/:idUser",
        element: <EditProfile />,
      },

      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "boughted",
        element: <Boughted />,
      },
      {
        path: "lotrinh",
        element: <LT />,
      },
      {
        path: "lotrinh/FE",
        element: <LT_FE />,
      },
      {
        path: "lotrinh/BE",
        element: <LT_BE />,
      },
      {
        path: "video/:idProduct",
        element: <CheckCourseUser />,
        children: [
          {
            element: <Lesson_video />,
            children: [
              {
                index: true,
                path: "lesson/:idLesson/:idUser",
                element: <Videodetail />,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "signin",
    element: <Signin />,
  },
  {
    path: "forgotPassword",
    element: <ForgotPassword />,
  },
  {
    path: "signup",
    element: <Signup />,
  },
  {
    path: "Thongtinthanhtoan/:idProduct",
    element: <Thong_tin_thanhtoan />,
  },
   {
    path: "payment/status/:idProduct",
    element: <PaymentSuccess />,
  },
  {
    path: "ThanhToan/:idProduct",
    element: <ThanhToan />,
  },
  {
    path: "changePassword",
    element: <ChangePassword />,
  },
  {
    path: "/admin",
    element: (
      isAdmin ? <LayoutAdmin /> : <Navigate to="/" />  // Nếu không phải là admin, chuyển hướng về trang chính
    ),
    children: [
      {
        index: true,
        element: <Navigate to="dashboard" />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "vouche",
        element: <Vouche />,
      },
      {
        path: "vouche/:id",
        element: <EditVouche />,
      },
      {
        path: "create-vouche",
        element: <AddVouche />,
      },
      {
        path: "products",
        element: <Listproduct />,
      },
      {
        path: "product/add",
        element: <Addproduct />,
      },
      {
        path: "product/oderdetail",
        element: <Orderdetail />,
      },
      {
        path: "product/edit/:idProduct",
        element: <EditProduct />,
      },
      {
        path: "product/ratings/:idProduct",
        element: <RatingProduct />,
      },
      {
        path: "product/comments/:idProduct",
        element: <CommentProduct />,
      },
      {
        path: "user/edit/:idUser",
        element: <EditUser />,
      },
      {
        path: "user",
        element: <User />,
      },
      {
        path: "blog",
        element: <Blog />,
      },
      {
        path: "blog/add",
        element: <AddBlog />,
      },
      {
        path: "blog/edit/:idBlog",
        element: <EditBlog />,
      },
      {
        path: "categorys",
        element: <Listcategory />,
      },
      {
        path: "category/add",
        element: <Addcategory />,
      },
      {
        path: "category/edit/:idCategory",
        element: <Editcategory />,
      },
      {
        path: "product/detail/:idProduct",
        element: <Detailproduct />,
      },
      {
        path: "/admin/lesson/add/:idProduct",
        element: <Addlesson />,
      },
      {
        path: "/admin/lesson/edit/:idLesson",
        element: <EditLesson />,
      },
      {
        path: "/admin/lesson/detail/:idLesson",
        element: <Detaillesson />,
      },
      {
        path: "/admin/quizz/add/:idLesson",
        element: <Addquizz />,
      },
      {
        path: "/admin/quizz/edit/:idQuizz",
        element: <EditQuizz />,
      },
      {
        path: "orders",
        element: <ListOrder />,
      },
      {
        path: "orders/:id",
        element: <OderId />,
      },
    ],
  },
]);
