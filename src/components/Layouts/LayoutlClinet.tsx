import { Link, useNavigate, useParams } from "react-router-dom";
import { Outlet } from "react-router-dom";
import "./client.css";
import {
  AiOutlineUserAdd,
  AiFillHome,
  AiFillPhone,
  AiOutlineMail,
  AiFillCaretRight,
} from "react-icons/ai";
import Swal from "sweetalert2";
import { useEffect } from "react";
import { useGetProductsQuery } from "@/Api/productApi";
import { IProduct } from "@/interface/products";
import { useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { useGetAllBlogQuery } from "@/Api/Blog";
import { IBlog } from "@/interface/Blog";
import { FaRegCircleUser } from "react-icons/fa6";
import { Button, Drawer, Input, List } from "antd";
import {
  BsFacebook,
  BsGithub,
  BsYoutube,
  BsInstagram,
  BsPinAngleFill,
} from "react-icons/bs";
import { Spin } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { IUsers } from "@/interface/user";
import { useGetOneUserQuery, useUpdateUserMutation } from "@/Api/userApi";
type UserType = {
  id: number;
  name: string;
  img: string | number;
  email: string;
  // ... other properties if any
} | null;
const LayoutlClinet = () => {
  const idc = localStorage.getItem('userInfo')
  const r = JSON.parse(idc)
  console.log(r)
  const { data: productData, error, isLoading } = useGetProductsQuery();
  const { data: BlogData } = useGetAllBlogQuery();
  const { idUser } = useParams<{ idUser: string }>();
  const { data: DataUser } = useGetOneUserQuery(r?.userData?._id || "");
  console.log(DataUser,"l")
  const navigate = useNavigate();
  const dataSource = BlogData?.map((Blog: IBlog) => ({
    key: Blog._id,
    name: Blog.name,
    img: Blog.img,
    description: Blog.description,
  }));
  const [updateUser] = useUpdateUserMutation();
  const [searchTerm, setSearchTerm] = useState("");
  const [delayedSearchTerm, setDelayedSearchTerm] = useState("");
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [showLoading, setShowLoading] = useState(false);
  useEffect(() => {
    if (timer) clearTimeout(timer);

    setShowLoading(true); // Hiển thị biểu tượng loading

    const newTimer = setTimeout(() => {
      setDelayedSearchTerm(searchTerm);
      setShowLoading(false); // Ẩn biểu tượng loading sau 1,5 giây
    }, 1500);

    setTimer(newTimer);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [searchTerm]);

  // ================ của trường xin đấy đừng động vào ===========================
  const headerClass = "bg-emerald-50";
  useEffect(() => {
    const header = document.querySelector(".fixed");

    if (header) {
      const handleScroll = () => {
        if (window.scrollY > 10) {
          // Kiểm tra xem lớp đã được áp dụng chưa
          const hasClass = header.classList.contains(headerClass);
          if (!hasClass) {
            header.classList.add(headerClass);
          }
        } else {
          header.classList.remove(headerClass);
        }
      };

      // Gọi handleScroll ngay khi effect được gắn kết
      handleScroll();

      window.addEventListener("scroll", handleScroll);

      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [headerClass]);
  // =============================================================================

  const [userInfo, setUserInfo] = useState<UserType>(null);
  useEffect(() => {
    const savedUser = localStorage.getItem("userInfo");
    if (savedUser) {
      setUserInfo(JSON.parse(savedUser));
    }
  }, []);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    // Xóa tất cả dữ liệu từ localStorage
    localStorage.clear();

    // Navigate to the home page
    navigate("/", { replace: true });

    // Tải lại trang
    window.location.reload(); // This might not be necessary if you're navigating away
  };
  return (
    <>
      {/* <!-- HEADER --> */}
      <header
        className={`mx-auto flex justify-between items-center py-6 px-20 mb-4 mt-0 transition-all w-[100%] z-50 fixed ${headerClass}  `}
      >
        <div className="flex items-center w-[100px] ">
          <img src="../../../public/img/logo.png" alt="" />
        </div>
        <nav className="text-lg text-[#0B7077] font-bold  hidden lg:flex">
          <ul className="flex space-x-12">
            <li className="relative group">
              <a href="/" className=" group-hover:text-[#FD661F]">
                Trang Chủ
              </a>
            </li>
            <li className="relative group">
              <a href="/blog" className=" group-hover:text-[#FD661F]">
                Tin Tức
              </a>
            </li>
            <li className="relative group">
              <a href="/khoahoc" className="group-hover:text-[#FD661F]">
                Khóa Học
              </a>
            </li>

            <li className="relative group">
              <a href="/lotrinh" className=" group-hover:text-[#FD661F]">
                Lộ trình
              </a>
            </li>
            <li className="relative group">
              <a href="/contact" className=" group-hover:text-[#FD661F]">
                Liên Hệ
              </a>
            </li>
          </ul>
        </nav>
        <button className="block lg:hidden ml-[70%] rounded focus:outline-none hover:bg-gray-200 group ">
          <div className="w-5 h-1 bg-gray-600 mb-1"></div>
          <div className="w-5 h-1 bg-gray-600 mb-1"></div>
          <div className="w-5 h-1 bg-gray-600 "></div>
          <div className="absolute top-0 right-0  w-[30%] bg-white border opacity-0 group-focus:right-0 group-focus:opacity-100 transition-all duration-1000">
            <ul className="place-content-start flex flex-col items-center w-full text-base cursor-pointer pt-10">
              <div
                onMouseEnter={() => setIsMenuOpen(true)}
                onMouseLeave={() => setIsMenuOpen(false)}
              >
                <div className="text-center">
                  <FaRegCircleUser
                    style={{ fontSize: "32px", marginLeft: "15px" }}
                  />
                </div>
                {isMenuOpen && (
                  <div
                    className="border rounded-xl"
                    style={{
                      position: "absolute",
                      backgroundColor: "white",
                      boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <Link
                      to={`/profile/${
                        userInfo &&
                        (userInfo.data
                          ? userInfo.data._id
                          : userInfo.userData._id)
                      }`}
                    >
                      {" "}
                      <div
                        className="hover:bg-[#0B7077] hover:text-white  rounded-xl"
                        style={{ padding: "10px 20px" }}
                      >
                        Profile
                      </div>
                    </Link>

                    <Link to="/changePassword">
                      {" "}
                      <div
                        className="hover:bg-[#0B7077] hover:text-white  rounded-xl"
                        style={{ padding: "10px 20px" }}
                      >
                        Đổi mật khẩu
                      </div>
                    </Link>
                    <button
                      className="hover:bg-[#0B7077]  hover:text-white   rounded-xl"
                      style={{ padding: "10px 20px" }}
                      onClick={handleLogout}
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
                <span>
                  {userInfo
                    ? userInfo.data
                      ? userInfo.data.name
                      : userInfo?.userData
                      ? userInfo.userData.name
                      : ""
                    : ""}
                </span>
              </div>
              <div className="line"></div>
              <a href="/">
                <li className=" hover:bg-[#0B7077] hover:text-white rounded-2xl py-4 px-6 w-full">
                  Trang Chủ
                </li>
              </a>
              <a href="/khoahoc">
                <li className=" hover:bg-[#0B7077] hover:text-white rounded-2xl py-4 px-6 w-full">
                  Khóa Học
                </li>
              </a>
              <a href="/blog">
                <li className=" hover:bg-[#0B7077] hover:text-white rounded-2xl py-4 px-6 w-full">
                  Tin Tức
                </li>
              </a>
              <a href="/lotrinh">
                <li className=" hover:bg-[#0B7077] hover:text-white rounded-2xl py-4 px-6 w-full">
                  Lộ Trình
                </li>
              </a>
              <a href="/contact">
                <li className=" hover:bg-[#0B7077] hover:text-white rounded-2xl py-4 px-6 w-full">
                  Liên Hệ
                </li>
              </a>
            </ul>
          </div>
        </button>
        <div className="items-center space-x-4 flex hidden lg:flex">
          <div className="relative ">
            <Input
              className="text-white w-[200px] rounded-full border border-[#0B7077] hover:border-blue-500 text-sm"
              placeholder="Tìm kiếm"
              prefix={
                showLoading ? (
                  <Spin />
                ) : (
                  <SearchOutlined className="text-[18px]  mr-2 text-gray-500 " />
                )
              }
              onChange={(event) => {
                setSearchTerm(event.target.value);
              }}
            />

            <div className="absolute bg-white mt-2 w-full rounded-lg z-10  ">
              {/* Hiển thị kết quả tìm kiếm của blog */}
              {delayedSearchTerm &&
                dataSource &&
                dataSource.filter((val: any) =>
                  val.name
                    .toLowerCase()
                    .includes(delayedSearchTerm.toLowerCase())
                ).length > 0 && (
                  <>
                    <p className="text-xl ml-2">Blog</p>
                    {dataSource
                      ?.filter((val: any) => {
                        if (
                          val.name
                            .toLowerCase()
                            .includes(delayedSearchTerm.toLowerCase())
                        ) {
                          return val;
                        }
                      })
                      .map((item: any) => (
                        <div
                          key={item.key}
                          className="bg-white rounded-lg hover:border hover:shadow-md overflow-hidden  hover:scale-105 transition ease-out duration-500 "
                        >
                          <div
                            key={item._id}
                            className="border-none rounded-lg"
                          >
                            <Link to={`/blogDetail/${item.key}`} className=" ">
                              <div className="p-2 flex ">
                                <img
                                  className="w-[50px] h-[50px] rounded-full"
                                  src={item.img}
                                  alt=""
                                />
                                <h2 className="text-base   text-center  ml-2">
                                  {item.name}
                                </h2>
                              </div>
                            </Link>
                          </div>
                        </div>
                      ))}
                  </>
                )}

              {/* Hiển thị kết quả tìm kiếm của sản phẩm */}
              {delayedSearchTerm &&
                productData &&
                productData.data.filter((val) =>
                  val.name
                    .toLowerCase()
                    .includes(delayedSearchTerm.toLowerCase())
                ).length > 0 && (
                  <>
                    <p className="text-xl ml-2">Sản phẩm</p>
                    {productData.data
                      .filter((val) => {
                        if (
                          val.name
                            .toLowerCase()
                            .includes(delayedSearchTerm.toLowerCase())
                        ) {
                          return val;
                        }
                      })
                      .map((product: IProduct) => (
                        <div
                          key={product._id}
                          className="bg-white rounded-lg hover:border hover:shadow-md overflow-hidden  hover:scale-105 transition ease-out duration-500"
                        >
                          <Link to={`/detail/${product._id}`} className=" ">
                            <div className="p-2 flex ">
                              <img
                                className="w-[50px] h-[50px] rounded-full"
                                src={product.img}
                                alt=""
                              />
                              <h2 className="text-base text-center  ml-2">
                                {product.name}
                              </h2>
                            </div>
                          </Link>
                        </div>
                      ))}
                  </>
                )}

              {/* Thông báo khi không tìm thấy kết quả */}
              {delayedSearchTerm &&
                dataSource &&
                productData &&
                dataSource.filter((val: any) =>
                  val.name
                    .toLowerCase()
                    .includes(delayedSearchTerm.toLowerCase())
                ).length === 0 &&
                productData.data.filter((val) =>
                  val.name
                    .toLowerCase()
                    .includes(delayedSearchTerm.toLowerCase())
                ).length === 0 && (
                  <p className=" p-4">
                    Không tìm thấy kết quả cho từ khóa bạn tìm.
                  </p>
                )}
            </div>
          </div>
          {userInfo ? (
            <>
              <div
                onMouseEnter={() => setIsMenuOpen(true)}
                onMouseLeave={() => setIsMenuOpen(false)}
              >
                <div className="text-center">
                  {DataUser?.img ? (
                    <img
                      src={`${DataUser?.img}`}
                      alt="Avatar"
                      className="avatar-image w-[45px] h-[45px]"
                    />
                  ) : (
                    <FaRegCircleUser
                      style={{ fontSize: "32px", marginLeft: "15px" }}
                    />
                  )}
                  <span className="ml-12">
                  {userInfo
                    ? userInfo.data
                      ? userInfo.data.name
                      : userInfo?.userData
                      ? userInfo.userData.name
                      : ""
                    : ""}
                </span>
                </div>
                {isMenuOpen && (
                  <div
                    className="border rounded-xl"
                    style={{
                      position: "absolute",
                      backgroundColor: "white",
                      boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <Link
                      to={`/profile/${
                        userInfo &&
                        (userInfo.data
                          ? userInfo.data._id
                          : userInfo.userData._id)
                      }`}
                    >
                      {" "}
                      <div
                        className="hover:bg-[#0B7077] hover:text-white  rounded-xl"
                        style={{ padding: "10px 20px" }}
                      >
                        Profile
                      </div>
                    </Link>

                    <Link to="/changePassword">
                      {" "}
                      <div
                        className="hover:bg-[#0B7077] hover:text-white  rounded-xl"
                        style={{ padding: "10px 20px" }}
                      >
                        Đổi mật khẩu
                      </div>
                    </Link>
                    <button
                      className="hover:bg-[#0B7077]  hover:text-white   rounded-xl"
                      style={{ padding: "10px 20px" }}
                      onClick={handleLogout}
                    >
                      Đăng xuất
                    </button>

                    <Link to="/createBlog">
                      {" "}
                      <div
                        className="hover:bg-[#0B7077] hover:text-white  rounded-xl"
                        style={{ padding: "10px 20px" }}
                      >
                        Tạo Bài Viết
                      </div>
                    </Link>
                  </div>
                )}
                
              </div>
            </>
          ) : (
            <>
              <Link to="signin">
                <button className="bg-white text-[#0B7077] px-4 py-2 rounded-[10px] hover:bg-[#0B7077] hover:text-white">
                  Đăng nhập
                </button>
              </Link>
              <Link to="signup">
                <button className="bg-[#0B7077] text-white px-4 py-2 rounded-[10px] hover:bg-[#0B7077] hover:text-white">
                  Đăng Ký
                </button>
              </Link>
            </>
          )}
        </div>
      </header>

      {/* =========================== */}
      <Outlet />
      {/* =========================== */}

      {/* <!-- FOOTEER --> */}
      {/* <footer className="relative text-white h-[330px]  bg-cover bg-center bg-[#D2E6E4] ">
        <div className="absolute inset-0 flex mt-14 justify-center w-[100%] ">
          <div className=" flex space-x-40 text-[#0B7077]">
            <div className="">
              <p className="text-xl font-bold">Thông tin liên hệ</p>
              <p className="text-[15px] mt-4 flex ">
                <AiFillHome className="mt-1 text-[14px] mr-1 text-[#0B7077]" />
                Address: Số 1 Phố Trịnh Văn Bô - Nam Từ Liêm - Hà Nội{" "}
              </p>
              <p className="flex">
                <AiOutlineMail className="mt-2 text-[13px] mr-1 text-[#0B7077]" />{" "}
                Email: son01679580054@gmail.com
              </p>
              <p className="flex">
                <AiFillPhone className="mt-1 text-[15px] mr-1 text-[#0B7077]" />
                Hotline: 1800000
              </p>
              <p className="text-xl mt-2 font-bold">
                Đăng ký để nhận thông tin mới nhất
              </p>
              <form className="mt-4">
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="w-full py-2 px-3 rounded-sm focus:outline-none focus:ring focus:border-blue-300"
                />
                <button
                  type="submit"
                  className="mt-2 bg-[#0B7077] hover:bg-yellow-500 text-white py-2 px-4 rounded-full"
                >
                  Đăng ký
                </button>
              </form>
            </div>

            <div className="">
              <p className="text-xl font-bold">Liên kết nhanh</p>
              <p className="mt-4 flex ">
                <a href="/" className="flex">
                  <BsPinAngleFill className="mt-1.5 text-[14px] mr-1 text-[#0B7077]" />
                  Trang chủ
                </a>
              </p>
              <p className="flex ">
                <a href="/khoahoc" className="flex">
                  <BsPinAngleFill className="mt-1.5 text-[14px] mr-1 text-[#0B7077]" />
                  Khóa học
                </a>
              </p>
              <p className="flex">
                <a href="#" className="flex">
                  <BsPinAngleFill className="mt-1.5 text-[14px] mr-1 text-[#0B7077]" />
                  Dịch vụ
                </a>
              </p>
              <p className="flex">
                <a href="/contact" className="flex">
                  <BsPinAngleFill className="mt-1.5 text-[14px] mr-1 text-[#0B7077]" />
                  Liên hệ
                </a>
              </p>
            </div>
            <div className="">
              <p className="text-xl font-bold">Theo dõi chúng tôi</p>
              <p className="mt-4">
                <a
                  href="https://www.facebook.com/photo.php?fbid=546379440492747&set=pb.100053620882304.-2207520000&type=3"
                  className="flex "
                >
                  <BsFacebook className="mt-1.5 text-[14px] mr-1 text-[#0B7077]" />
                  Facebook
                </a>
              </p>
              <p>
                <a href="" className="flex">
                  <BsGithub className="mt-1.5 text-[14px] mr-1 text-[#0B7077]" />
                  Github
                </a>
              </p>
              <p>
                <a href="" className="flex">
                  <BsYoutube className="mt-2 text-[14px] mr-1 text-[#0B7077]" />
                  Youtobe
                </a>
              </p>
              <p>
                <a href="" className="flex">
                  <BsInstagram className="mt-1.5 text-[14px] mr-1 text-[#0B7077]" />
                  Instagram
                </a>
              </p>
            </div>
            <div className="">
              <p className="text-xl font-bold">Phương thức thanh toán</p>
              <p>Thanh toán qua Momo, Zalopay</p>
              <div className="flex mt-2 mb-2">
                <img
                  className="w-10 mr-4"
                  src="../../../public/img/momo.png"
                  alt=""
                />
                <img
                  className="w-10"
                  src="../../../public/img/zalopay.png"
                  alt=""
                />
              </div>
              <p>Thanh toán qua ngân hàng nội địa</p>
              <div className="flex mt-2">
                <img
                  className="w-20 h-10 mt-2 mr-2"
                  src="../../../public/img/vcb.png"
                  alt=""
                />
                <img
                  className="w-20 h-10 mt-2 mr-2"
                  src="../../../public/img/mb.png"
                  alt=""
                />
                <img
                  className="w-20 h-10 "
                  src="../../../public/img/vietin.png"
                  alt=""
                />
              </div>
              <div className="flex">
                <img
                  className="w-20 mr-2"
                  src="../../../public/img/tech.png"
                  alt=""
                />
                <img
                  className="w-20 h-4 mt-6 mr-2"
                  src="../../../public/img/agr.png"
                  alt=""
                />
                <img
                  className="w-20 h-4 mt-5 mr-2"
                  src="../../../public/img/bidv.png"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
        <img
          src="../../../public/img/anh2.svg"
          alt=""
          className="absolute bottom-0 right-0"
        />
        <div className="text-center  text-[#0B7077] absolute inset-x-0 bottom-0  mb-4">
          &copy; Strong Code "Code của tôi - Học là do bạn!".
        </div>
      </footer> */}
      <footer className="relative text-white bg-cover bg-center bg-[#D2E6E4] py-10 sm:py-12 md:py-16 lg:py-20">
        <div className="container mx-auto">
          <div className=" ml-[10%] flex  flex-col sm:flex-row space-y-8 sm:space-y-0 sm:space-x-12 md:space-x-16 lg:space-x-20 text-[#0B7077] ">
            <div className="w-full sm:w-1/4 md:w-1/6 ">
              <p className="text-xl font-bold">Thông tin liên hệ</p>
              <p className="text-sm mt-4 flex items-center">
                <AiFillHome className=" text-[14px] mr-1" />
                Address: Số 1 Phố Trịnh Văn Bô
              </p>
              <p className="text-sm flex items-center">
                <AiOutlineMail className=" text-[13px] mr-1" />
                Email: strongcode@gmail.com
              </p>
              <p className="text-sm flex items-center">
                <AiFillPhone className="text-[15px] mr-1" />
                Hotline: 1800000
              </p>
              <p className="text-xl mt-2 font-bold">
                Đăng ký để nhận thông tin mới nhất
              </p>
              <form className="mt-4">
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="w-[200px] py-2 px-3 rounded-sm focus:outline-none focus:ring focus:border-blue-300"
                />
                <button
                  type="submit"
                  className="mt-2 ml-5 bg-[#0B7077] hover:bg-yellow-500 text-white py-2 px-4 rounded-full"
                >
                  Đăng ký
                </button>
              </form>
            </div>

            <div className="w-full sm:w-1/4 md:w-1/6 ">
              <p className="text-xl font-bold">Liên kết nhanh</p>
              <p className="mt-4 text-sm">
                <a href="/" className="flex items-center">
                  <BsPinAngleFill className="mt-1.5 text-[14px] mr-1" />
                  Trang chủ
                </a>
              </p>
              <p className="text-sm">
                <a href="/khoahoc" className="flex items-center">
                  <BsPinAngleFill className="mt-1.5 text-[14px] mr-1" />
                  Khóa học
                </a>
              </p>
              <p className="text-sm">
                <a href="#" className="flex items-center">
                  <BsPinAngleFill className="mt-1.5 text-[14px] mr-1" />
                  Dịch vụ
                </a>
              </p>
              <p className="text-sm">
                <a href="/contact" className="flex items-center">
                  <BsPinAngleFill className="mt-1.5 text-[14px] mr-1" />
                  Liên hệ
                </a>
              </p>
            </div>

            <div className="w-full sm:w-1/4 md:w-1/6 ">
              <p className="text-xl font-bold">Theo dõi chúng tôi</p>
              <p className="mt-4 text-sm">
                <a
                  href="https://www.facebook.com/photo.php?fbid=546379440492747&set=pb.100053620882304.-2207520000&type=3"
                  className="flex items-center"
                >
                  <BsFacebook className="mt-1.5 text-[14px] mr-1" />
                  Facebook
                </a>
              </p>
              <p className="text-sm">
                <a href="" className="flex items-center">
                  <BsGithub className="mt-1.5 text-[14px] mr-1" />
                  Github
                </a>
              </p>
              <p className="text-sm">
                <a href="" className="flex items-center">
                  <BsYoutube className="mt-2 text-[14px] mr-1" />
                  Youtube
                </a>
              </p>
              <p className="text-sm">
                <a href="" className="flex items-center">
                  <BsInstagram className="mt-1.5 text-[14px] mr-1" />
                  Instagram
                </a>
              </p>
            </div>

            <div className="w-full sm:w-1/4 md:w-1/6 ">
              <p className="text-xl font-bold">Phương thức thanh toán</p>
              <p>Thanh toán qua QrCode, VnPay</p>
              <div className="flex mt-2 mb-2">
                <img
                  className="w-10 mr-4"
                  src="../../../public/img/grcode.jpg"
                  alt=""
                />
                <img
                  className="w-10"
                  src="../../../public/img/vnpay.png"
                  alt=""
                />
              </div>
              {/* <p>Thanh toán qua ngân hàng nội địa</p>
              <div className="flex mt-2">
                <img className="w-20 h-10 mt-2 mr-2" src="../../../public/img/vcb.png" alt="" />
                <img className="w-20 h-10 mt-2 mr-2" src="../../../public/img/mb.png" alt="" />
                <img className="w-20 h-10" src="../../../public/img/vietin.png" alt="" />
              </div>
              <div className="flex">
                <img className="w-20 mr-2" src="../../../public/img/tech.png" alt="" />
                <img className="w-20 h-4 mt-6 mr-2" src="../../../public/img/agr.png" alt="" />
                <img className="w-20 h-4 mt-5 mr-2" src="../../../public/img/bidv.png" alt="" />
              </div> */}
            </div>
          </div>
        </div>
        <img
          src="../../../public/img/anh2.svg"
          alt=""
          className="absolute bottom-0 right-0"
        />
        <div className="text-center text-[#0B7077] mt-8">
          &copy; Strong Code - Kiến tạo tương lai.
        </div>
      </footer>
    </>
  );
};

export default LayoutlClinet;