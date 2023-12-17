import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AiOutlineCheck } from "react-icons/ai";
import { useGetOneBlogQuery } from "@/Api/Blog";
import { FiEdit } from "react-icons/fi"; // Import biểu tượng "Edit" từ Feather Icons
import { Button } from "antd";
import { useGetAllUserQuery, useGetOneUserQuery } from "@/Api/userApi";
import { IUsers } from "@/interface/user";
import "./index.css";
import { FaCheck } from "react-icons/fa";
import { FaSpinner } from "react-icons/fa";
import { FaMoneyBillAlt } from "react-icons/fa";
import { FaUserTie } from "react-icons/fa";
import { FaBookOpen } from "react-icons/fa";
import { FaRunning } from "react-icons/fa";
import { FaUserEdit } from "react-icons/fa";
import { RaceBy } from "@uiball/loaders";
const ProfileUser = () => {
  type UserType = {
    id: number;
    name: string;
    img: string | number;
    email: string;
    // ... other properties if any
  } | null;
  const { idBlog } = useParams<{ idBlog: string }>();
  const {
    data: BlogData,
    isLoading: blogIsLoading,
    isError,
  } = useGetOneBlogQuery(idBlog || "");
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<UserType | null>(null);
  const { idUser } = useParams<{ idUser: string }>();
  const {
    data: DataUser,
    isLoading: vvv,
    isFetching,
  } = useGetOneUserQuery(idUser || "");
  console.log("get on 1", DataUser?.product);
  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);
  useEffect(() => {
    // Lấy thông tin người dùng từ Local Storage khi trang tải
    const savedUser = localStorage.getItem("userInfo");
    if (savedUser) {
      setUserInfo(JSON.parse(savedUser));
    }
  }, []);
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

  if (isError) {
    return <div>Error loading product data.</div>;
  }

  if (!BlogData) {
    return <div>No product data available.</div>;
  }
  if (vvv || isFetching) return <p>loading .....</p>;
  return (
    <>
      <div className=" flex justify-center">
        <div className=" pt-[88px] w-4/5    ">
          <div className="profile  ">
            <div className="w-full bg-[#D2E6E4] rounded rounded-tl-lg rounded-tr-lg ">
              <div>
                <h1 className="text-5xl font-bold text-[#0B7077]  pt-14  pl-40 ">
                  Welcome To Profile Of <br /> {DataUser?.name}{" "}
                </h1>
              </div>
              <img
                className=" w-64 mt-2 mr-20 float-right"
                src="../../../public/img/sinhvien.png"
                alt=""
              />
            </div>
          </div>
          <div className=" ">
            <div className="flex justify-center  gap-14  pt-10   ">
              <div className=" bg-white p-8  mb-20 rounded mt-6">
                <div className="flex gap-2 justify-center items-center mb-4 -mt-20 ml-[-500px]">
                  <h1 className="text-3xl font-bold mr-2">{DataUser?.name}</h1>
                  <Link className="" to={`/profile/edit/${DataUser?._id}`}>
                    <div className="text-3xl">
                      {" "}
                      <FaUserEdit />
                    </div>
                  </Link>
                </div>
                <div className="">
                  <div className="">
                    <div className="">
                      <div className="flex gap-2 mt-16">
                        <div className="w-[40%] ">
                          <div className="mb-8 pl-5 custom-card gap-2 h-20 bg-white rounded-lg border shadow-md overflow-hidden hover:shadow-lg hover:shadow-blue-300 hover:scale-105 transition ease-out duration-500 flex flex-col items-start justify-start">
                            <div className="font-semibold text-lg ">
                              Giới Thiệu
                            </div>
                            <div className="flex gap-1 text-sm items-center">
                              <div className="text-xl mr-1">
                                <FaUserTie />
                              </div>

                              <div>Thành viên của</div>
                              <div className="font-bold">
                                {" "}
                                Strong Code - Học lập trình để đi làm{" "}
                              </div>
                            </div>
                          </div>
                          <div className="custom-card mt-[-13px] pl-5 gap-2 h-20 bg-white rounded-lg border shadow-md overflow-hidden hover:shadow-lg hover:shadow-blue-300 hover:scale-105 transition ease-out duration-500 flex flex-col items-start justify-start">
                            <div className="font-semibold text-lg ">
                              Các hoạt động gần đây
                            </div>
                            <div className="flex gap-1 text-sm items-center">
                              <div className="text-2xl mr-1">
                                <FaRunning />
                              </div>

                              <div>Chưa có hoạt động nào gần đây</div>
                            </div>
                          </div>
                        </div>

                        <div className="w-[60%] custom-card pl-5 gap-2 h-full bg-white rounded-lg border overflow-hidden  hover:scale-105 transition ease-out duration-500 flex flex-col items-start justify-start shadow-2xl ">
                          <div className="font-semibold text-lg ">
                            Các khóa học đã tham gia
                          </div>
                          <div className="w-[100%] border-b-2 border-[#ccc] rounded-md shadow-2xl">
                            {DataUser?.product
                              ?.filter((iten) => iten.price)
                              .map((items) => {
                                return (
                                  <div className="">
                                    <Link to={`/detail/${items._id}`}>
                                      <div
                                        className="border-b border-[#ccc]"
                                        key={items._id}
                                      >
                                        <div className="flex gap-8 mb-3">
                                          <div className="w-[40%] ">
                                            <img
                                              className="w-full my-3 rounded-3xl"
                                              src={items?.img}
                                            />
                                            {items.lessons ? "" : ""}
                                          </div>
                                          <div className="w-[60%] mt-2">
                                            <p>{items?.name}</p>
                                            <p className="line-clamp-3">{items?.description}</p>
                                          </div>
                                        </div>
                                      </div>
                                    </Link>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileUser;
