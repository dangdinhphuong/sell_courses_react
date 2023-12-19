import React, { useEffect, useState } from "react";
import { useGetProductByIdQuery } from "@/Api/productApi";
import { useNavigate, useParams } from "react-router-dom";
import {
  AiFillCode,
  AiFillDatabase,
  AiFillClockCircle,
  AiOutlineAntCloud,
  AiOutlineCheck,
  AiOutlinePlus,
} from "react-icons/ai";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { IoIosStar } from "react-icons/io";
import {
  useAddCourseprogressMutation,
  useCheckCourseAndReturnMessageQuery,
  useGetCourseprogressByIdQuery
} from "@/Api/CourseProgress";
import { useGetOneUserQuery } from "@/Api/userApi";
import { Link } from "react-router-dom";
import { RaceBy } from "@uiball/loaders";
import axios from "axios";
import { useAddOrderMutation } from "@/Api/order";
import { isEmpty } from "@/utils/validate"
const ProductDetail = () => {
  const data: any = localStorage.getItem("userInfo") ?? false;
  const orderId: any = localStorage.getItem("orderId");
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const idUser = userInfo.userData?._id || "";
  console.log(userInfo);

  const { idProduct } = useParams<{ idProduct: string }>();
  const {
    data: productData,
    isLoading: productIsLoading,
    isError,
  } = useGetProductByIdQuery(idProduct || "");
  console.log(productData);
  const { data: Courseprogress } =
    useGetCourseprogressByIdQuery({
      productId: idProduct || "",
      userId: idUser || "",
    });
  console.log("Courseprogress", Courseprogress);

  const ratings = productData?.data?.rating
    .filter((hidel) => hidel?.hidden == false)
    .map((rating) => parseFloat(rating?.rating));
  const totalRatings = ratings?.reduce(
    (accumulator, rating) => accumulator + rating,
    0
  );
  const averageRating = (totalRatings / ratings?.length).toFixed(1);
  const starIcons = [];
  const fullStars = Math.floor(averageRating);
  const halfStar = averageRating - fullStars >= 0.5;
  for (let i = 0; i < fullStars; i++) {
    starIcons.push(
      <IoIosStar className="text-yellow-400" key={i} />
    );
  }
  if (halfStar) {
    starIcons.push(
      <FaStarHalfAlt
        className="text-yellow-400"
        key={fullStars}
      />
    );
  }
  const { data: userDb } = useGetOneUserQuery(idUser || "");
  const userHasPurchasedCourse = userDb?.product?.some(
    (product) => product._id === idProduct
  );
  console.log("userDb", userDb);
  console.log("userHasPurchasedCourse", userHasPurchasedCourse);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [addCourseProgress] = useAddCourseprogressMutation();

  const { data: check } = useCheckCourseAndReturnMessageQuery({
    productId: idProduct,
    userId: idUser,
  });
  console.log("check", check)
  const [showMore, setShowMore] = useState(false);
  const maxLines = 10;

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  const content = productData?.data.paymentContent;

  // Lấy số dòng thực sự của nội dung
  const lineCount = content?.split("\n").length;
  const [courseStatusData, setCourseStatusData] = useState("");
  const [addOrder] = useAddOrderMutation();

  useEffect(() => {
    setCourseStatusData(check?.message);
  }, [check?.message]);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);
  // Sử dụng useEffect để gọi lại kiểm tra khi trang được tải lại
  useEffect(() => { }, []);
  const handleStartCourse = async () => {

    if (isEmpty(Courseprogress)) {
      const courseData = {
        productId: idProduct,
        userId: idUser,
      };
      await addCourseProgress(courseData);
    }
    const idOfLesson0 = productData?.data?.lessons[0]?._id;
    navigate(`/video/${productData?.data._id}/lesson/${idOfLesson0}/${idUser}`);
  };

  const onFinish = async () => {
    if (!data) {
      alert("Bạn phải đăng nhập tài khoản để đăng ký khóa học");
      navigate("/signin");
    } else {
      const courseData = {
        productId: idProduct,
        userId: idUser,
      };
      if (courseStatusData === "Khóa học đã được đăng ký") {
        handleStartCourse();
      } else {
        try {
          await addCourseProgress(courseData);
          handleStartCourse();
        } catch (error) {
          console.error("Đăng ký khóa học thất bại:", error);
        }
      }
    }
  };
  const onThanhToan = async () => {
    if (!idUser) {
      alert("Bạn phải đăng nhập tài khoản để mua khóa học");
      navigate("/signin");
    } else {
      navigate(`/Thongtinthanhtoan/${productData?.data._id}`);
      // navigate('/khoahoc');
    }
  };

  const checkPaymen = async () => {
    const data = await addOrder({
      paymentMethod: "free",
      course: idProduct,
      user: checkUser._id,
      orderStatus: "Done",
      payment: {},
      vouche: "",
      paymentAmount: "0",
      bankName: "",
    });
  };

  const renderActionButton = () => {
    if (courseStatusData === "Khóa học đã được đăng ký") {
      return (
        <button
          className="bg-[#FD661F] text-white ml-16 mt-4 px-4 w-48 py-2 rounded-full hover:bg-white border-2 border-[#FD661F] hover:border-solid hover:border-2 hover:border-[#FD661F] hover:text-[#FD661F] text-center font-bold"
          onClick={() => {
            handleStartCourse();
          }}
        >
          HỌC NGAY
        </button>
      );
    } else {
      return (
        <button
          className="bg-[#FD661F] text-white ml-16 mt-4 px-4 w-48 py-2 rounded-full hover:bg-white border-2 border-[#FD661F] hover:border-solid hover:border-2 hover:border-[#FD661F] hover:text-[#FD661F] text-center font-bold"
          onClick={onFinish}
        >
          ĐĂNG KÝ HỌC
        </button>
      );
    }
  };
  console.log(productData?.data.paymentContent);
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
        <RaceBy size={100} lineWeight={6} speed={1.4} color="#47d1d1" />
        <div
          className="mt-2 text-black font-medium"
          style={{ color: "#70dbdb" }}
        >
          Loading
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center pt-[88px] bg-white relative">
      <div className="bg-[#D2E6E4] h-[106px] w-full absolute top-0 "></div>
      <div className=" bg-white mb-20 pl-10">
        <div className="flex gap-4 w-full max-w-[1000] pt-20  ">
          <div className=" bg-white p-8 w-[1000px]">
            <h1 className="text-3xl font-bold mb-4">
              {productData?.data.name}
            </h1>
            <h1 className="text-2xl font-bold mb-4 mt-8">Nội dung khóa học</h1>

            <div className="p-2">
              <div className="items-center bg-gray-100 p-4 border border-gray-200 rounded overflow-hidden">
                <div
                  style={{
                    wordBreak: "break-word",
                    whiteSpace: showMore ? "pre-line" : "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxHeight: showMore ? "none" : `calc(${maxLines} * 1.5em)`,
                  }}
                  dangerouslySetInnerHTML={{
                    __html: productData?.data.paymentContent,
                  }}
                />
                {showMore && (
                  <div className="flex justify-end mt-3">
                    <button onClick={toggleShowMore} className="text-blue-500">
                      <u>Ẩn đi</u>
                    </button>
                  </div>
                )}
                {!showMore && (
                  <div className="flex justify-end mt-3">
                    <button onClick={toggleShowMore} className="text-blue-500">
                      <u>Xem thêm</u>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="">
              <h1 className="text-xl font-bold mb-4 mt-8">
                Bạn sẽ học được gì?
              </h1>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <ul className="my-4">
                    <li className="flex items-center space-x-2">
                      <AiOutlineCheck className="text-[#FD661F]" />
                      <span>Các kiến thức cơ bản, nền móng của ngành IT</span>
                    </li>
                    <li className="flex items-center space-x-2 mt-4">
                      <AiOutlineCheck className="text-[#FD661F]" />
                      <span>
                        Các mô hình, kiến trúc cơ bản khi triển khai ứng dụng
                      </span>
                    </li>
                  </ul>
                </div>
                <div>
                  <ul className="my-4">
                    <li className="flex items-center space-x-2">
                      <AiOutlineCheck className="text-[#FD661F]" />
                      <span>
                        Các khái niệm, thuật ngữ cốt lõi khi triển khai ứng dụng
                      </span>
                    </li>
                    <li className="flex items-center space-x-2 mt-4">
                      <AiOutlineCheck className="text-[#FD661F]" />
                      <span>
                        Hiểu hơn về cách internet và máy vi tính hoạt động
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <h3 className="text-xl font-bold mb-4 mt-8">Mô tả khóa học</h3>
            <p>{productData?.data.description}</p>
          </div>
          {/* <div className="bg-white shadow-lg rounded-lg relative group overflow-hidden w-80">
              <div className="block relative">
                <div className="rounded-t-lg overflow-hidden">
                  <img
                    src={productData?.data.img}
                    alt={productData?.data.name}
                    className="w-full h-[200px] object-cover rounded-t-lg transform group-hover:opacity-80 transition-opacity rounded-lg"
                  />
                  <div className="absolute top-0 left-0 w-full h-full bg-black opacity-0 group-hover:opacity-60 transition-opacity rounded-lg"></div>
                </div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full text-center">
                  <button className="w-40 h-10 bg-white  opacity-0 group-hover:opacity-100 transition-opacity rounded-full ">
                    Tìm hiểu khóa học
                  </button>

                </div>
              </div>
              </div> */}
          <div className="pt-4">
            <div className="bg-white shadow-lg rounded-lg relative group overflow-hidden w-80">
              <div className="block relative">
                <div className="rounded-t-lg overflow-hidden">
                  <img
                    src={productData?.data.img}
                    alt={productData?.data.name}
                    className="w-full h-[200px] object-cover rounded-t-lg transform group-hover:opacity-80 transition-opacity rounded-lg"
                  />

                  <div className="absolute top-0 left-0 w-full h-full bg-black opacity-0 group-hover:opacity-60 transition-opacity rounded-lg"></div>
                </div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full text-center">
                  <button className="w-40 h-10 bg-white  opacity-0 group-hover:opacity-100 transition-opacity rounded-full ">
                    Tìm hiểu khóa học
                  </button>
                </div>

              </div>
              <div className="text-2xl">
                {(productData?.data?.rating && productData?.data?.rating.length !== 0) ?
                  <div className="flex items-center justify-center">
                    {starIcons ? starIcons : ""}
                    <span className="ml-2 text-yellow-400">
                    </span>
                  </div>
                  : ""
                }
              </div>
              {userHasPurchasedCourse === true ? (
                <button
                  className="bg-[#FD661F] text-white ml-16 mt-4 px-4 w-48 py-2 rounded-full border-2 border-[#FD661F] transition-all duration-300 hover:bg-white hover:border-solid hover.border-2 hover.border-[#FD661F] hover:text-[#FD661F] text-center font-bold"
                  onClick={handleStartCourse}
                >
                  HỌC NGAY
                </button>
              ) : productData?.data.price === "0" ? (
                renderActionButton() // Hiển thị nút "Học ngay" chỉ khi giá khác 0
              ) : (
                <Link to={``}>
                  {productData?.data.price !== "0" ? ( // Kiểm tra nếu giá khác 0 thì hiển thị nút thanh toán
                    <button
                      onClick={onThanhToan}
                      className="bg-[#FD661F] text-white ml-16 mt-4 px-4 w-48 py-2 rounded-full border-2 border-[#FD661F] transition-all duration-300 hover:bg-white hover:border-solid hover.border-2 hover.border-[#FD661F] hover:text-[#FD661F] text-center font-bold"
                    >
                      THANH TOÁN
                    </button>
                  ) : null}{" "}
                  {/* Nếu giá bằng 0 thì không hiển thị nút */}
                </Link>
              )}

              <h1 className="text-center mt-4 text-2xl font-medium text-[#FD661F] ">
                {productData?.data.price === "0"
                  ? "Miễn phí"
                  : `${parseFloat(productData?.data.price).toLocaleString(
                    "vi-VN"
                  )}đ`}
              </h1>
              <ul className="flex flex-col space-y-4 mt-4 ml-14">
                <li className="flex items-center space-x-2">
                  <AiFillCode />
                  <span>Trình độ cơ bản</span>
                </li>
                <li className="flex items-center space-x-2">
                  <AiFillDatabase />
                  <span>
                    Tổng số <strong>{productData?.data.lessons.length}</strong>{" "}
                    bài học
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <AiFillClockCircle />
                  <span>
                    Thời lượng{" "}
                    <strong>{productData?.data.lessons.video}</strong>
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <AiOutlineAntCloud />
                  <span>Học mọi lúc, mọi nơi</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
