import React, { useEffect, useState } from "react";
import { useGetProductByIdQuery } from "@/Api/productApi";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  AiFillCode,
  AiFillDatabase,
  AiFillClockCircle,
  AiOutlineAntCloud,
  AiOutlineCheck,
  AiOutlinePlus,
  AiFillRobot,
} from "react-icons/ai";
import { useGetAllBlogQuery, useGetOneBlogQuery } from "@/Api/Blog";
import { IBlog } from "@/interface/Blog";
import ReactPaginate from "react-paginate";
import { MdCheck } from "react-icons/md";
import "./index.css";
import { useGetOneUserQuery } from "@/Api/userApi";
import { RaceBy } from "@uiball/loaders";
const Blogs = () => {
  const { data: BlogDatas, error, isLoading: blogIsLoading } = useGetAllBlogQuery();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);
  console.log("blog:", BlogDatas);
  const dataSource = BlogDatas?.map((Blog: IBlog) => ({
    key: Blog?._id,
    name: Blog?.name,
    img: Blog?.img,
    languages: Blog?.language,
    description: Blog?.description,
    imgUser: Blog?.imgUser,
    nameUser: Blog?.nameUser

  }));

  const [currentPage, setCurrentPage] = useState(1);

  // Tính toán số trang và dữ liệu của mỗi trang

  // Xử lý sự kiện thay đổi trang
  const handlePageClick = (data: any) => {
    setCurrentPage(data.selected + 1);
  };

  const { idBlog } = useParams<{ idBlog: string }>();
  const {
    data: BlogData,
    isError,
  } = useGetOneBlogQuery(idBlog || "");

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
  const itemsPerPage = 3;
  const totalItems = dataSource?.length; // Thay yourData bằng dữ liệu thực tế
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const offset = (currentPage - 1) * itemsPerPage;
  const currentItems = dataSource?.slice(offset, offset + itemsPerPage);
  return (
    <div className="pt-[88px] lg:max-w-7xl mx-auto lg:flex lg:justify-between items-center">
      <div className="">
        <div className="flex justify-center  pt-10 lg:ml-20">
          <div className="bg-white p-8 w-[870px] rounded">
            <div className="mb-20 flex flex-col">
              <h1 className="text-4xl font-bold">Bài viết nổi bật</h1>
              <div className="text-base font-normal mt-2">Tổng hợp các bài viết chia sẻ về kinh nghiệm tự học lập trình online và các kỹ thuật lập trình web.</div>
            </div>
            <div className="flex flex-col space-y-4">
              <div>
                {isLoading ? (
                  <p>Loading...</p>
                ) : error ? (
                  <p>Error fetching data</p>
                ) : (
                  <div>
                    <ul className="grid grid-cols-1 gap-7">
                      {currentItems.map((item: any) => (
                        <li
                          key={item.key}
                          className="bg-white rounded-lg border shadow-md overflow-hidden hover:shadow-lg hover:shadow-blue-300 hover:scale-105 transition ease-out duration-500"
                        >

                          <div className=" ">
                            <div className="py-2 ">
                              <div className="flex items-center"></div>
                              <div className="flex justify-between items-center ">
                                <div className="w-3/5 ">
                                  <div className="flex items-center ml-3">
                                    <div className="flex justify-center items-center gap-1 ">
                                      <div className="">
                                        <img
                                          className="border-bicolor "
                                          src={item.imgUser}
                                          alt="avatar"
                                        />
                                      </div>
                                      <div className="font-sans text-xs p-1  flex items-center gap-1">
                                        {item.nameUser}
                                        <div className="text-white text-xs border rounded-full bg-blue-400">
                                          <MdCheck className="font-bold" />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex flex-col  ml-2 -mb-6">
                                    <a
                                      href={`/blogDetail/${item.key}`}
                                      className="font-semibold text-2xl leading-6 text-gray-700 mt-2"
                                    >
                                      {item.name.length > 50
                                        ? `${item.name.slice(0, 50)} ...`
                                        : item.name}
                                    </a>
                                    <div className=" font-thin mt-1 mb-[30px] columnss-cell" dangerouslySetInnerHTML={{ __html: item.description.length > 120 ? `${item.description.slice(0, 120)} ...` : item.description }} />

                                  </div>
                                  <div className="mb-2 text-base -mt-3 bg-gray-300 rounded  w-1/5 ml-2 py-1  text-center">
                                    {item.languages}
                                  </div>
                                </div>
                                <a href={`/blogDetail/${item.key}`}>
                                  <img
                                    className="object-cover rounded-2xl w-64 h-36 mr-4 hidden lg:block"
                                    src={item.img}
                                    alt="Blog Image"
                                  />
                                </a>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className=" flex justify-center pt-4 pr-[130px]">
                {isLoading && (
                  <div className="loading-overlay">
                    <p>Loading...</p>
                  </div>
                )}
                {!isLoading && totalPages > 1 && (
                  <ReactPaginate
                    previousLabel={"<<"}
                    nextLabel={">>"}
                    breakLabel={"..."}
                    pageCount={totalPages}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageClick}
                    containerClassName={"pagination"}
                    activeClassName={"active"}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden lg:block">
        <div className=" w-[600px]">
          <img
            className="w-full"
            src="../../../public/img/sinhvien2.png"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default Blogs;