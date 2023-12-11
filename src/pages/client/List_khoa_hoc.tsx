import { useGetProductsQuery } from "@/Api/productApi";
import { PiListDashesBold } from "react-icons/pi";
import { useGetCategorysQuery } from "@/Api/categoryApi";
import { IProduct } from "@/interface/products";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Category } from "@/interface/categorys";
import { RaceBy } from '@uiball/loaders'
import { useMediaQuery } from '@react-hook/media-query';
const ListKhoaHoc = () => {
  const { data: productData, error, isLoading: productIsLoading, } = useGetProductsQuery();
  const [showFullDescription, setShowFullDescription] = useState(false);
  const { data: categoryData } = useGetCategorysQuery();
  const [selectedCategory, setSelectedCategory] = useState<string | number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [filterOption, setFilterOption] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  // const itemsPerPage = 12;
  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);
  const [showCategoryButtons, setShowCategoryButtons] = useState(false);


  const renderCourseList = () => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const isTablet = useMediaQuery('(max-width: 1024px)');
    const [itemsPerPage, setItemsPerPage] = useState(12);

    useEffect(() => {
      if (isMobile) {
        setItemsPerPage(4);
      } else if (isTablet) {
        setItemsPerPage(8);
      } else {
        setItemsPerPage(12);
      }
    }, [isMobile, isTablet]);
    if (isLoading) {
      return <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
        <RaceBy size={100} lineWeight={6} speed={1.4} color="#47d1d1" />
        <div className="mt-2 text-black font-medium" style={{ color: '#70dbdb' }}>Loading</div>
      </div>
    }

    if (error) {
      return <p>Error</p>;
    }

    if (!productData || !productData.data || productData.data.length === 0) {
      return <p>No courses available</p>;
    }
    const isLoggedIn = !!localStorage.getItem('userToken');
    const handlePurchase = () => {
      const isLoggedIn = !!localStorage.getItem('userToken');
      if (!isLoggedIn) {
        // Show a message that user needs to login
        alert('Bạn cần đăng nhập để tiếp tục mua hàng!');
        window.location.href = '/signin';
        return;
      }

      // ... your purchase logic here (if the user is logged in)
    }

    const filteredProducts = productData?.data?.filter(product => {
      // Filter by category if it's selected
      const byCategory = selectedCategory ? product.categoryId?._id === selectedCategory : true;

      // Filter by price
      if (filterOption === "free") {
        return byCategory && product.price === "0";
      }
      else if (filterOption === "paid") {
        return byCategory && product.price > 0;
      }
      return byCategory;
    });
    // Tính chỉ số của sản phẩm cuối cùng và đầu tiên để hiển thị trên trang hiện tại
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    let currentProducts = filteredProducts?.slice(indexOfFirstItem, indexOfLastItem);
    // if (window.innerWidth <= 768) {
    //   currentProducts = currentProducts?.slice(0, 3); // Chỉ hiển thị 3 sản phẩm khi màn hình nhỏ hơn hoặc bằng md
    // }else if(window.innerWidth <= 1024){
    //   currentProducts = currentProducts?.slice(0, 8);
    // }
    return (
      <section className="content mx-auto py-[88px] lg:max-w-7xl  h-[1300px] mb-[500px]">
        <div className=" bg-white px-5 md:px-20 h-[100%] ">


          {/* ====================================== */}
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 ">
            {/* ====================================== */}

            <div className="  lg:hidden  ">
              <PiListDashesBold
                className="lg:hidden"
                onClick={() => setShowCategoryButtons(!showCategoryButtons)}
              />
              {showCategoryButtons && (
                <div className=" lg:hidden   rounded ">
                  {categoryData?.data?.map((category) => (
                    <button
                      key={category._id}
                      className="rounded-lg text-[#0B7077] font-bold hover:bg-[#D2E6E4] py-2 pl-3 w-full text-left "
                      onClick={() => setSelectedCategory(category._id)}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="col-span-2 hidden lg:block ">
             
              <div className="mt-10">
                {categoryData?.data?.map((category) => (
                  <button
                    key={category._id}
                    className="rounded-lg hover:text-[#0B7077] font-semibold hover:bg-[#D2E6E4] py-2 pl-3 w-full text-left whitespace-normal break-words"
                    onClick={() => setSelectedCategory(category._id)}
                  >
                    {category.name}
                  </button>
                ))}
              </div>

            </div>

            {/* ========================================= */}
            <div className="col-span-10 ">
              <div className="relative inline-flex ">
                <svg
                  className="w-2 h-2 absolute top-0 right-0 m-4 pointer-events-none mt-16"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 412 232"
                >
                  <path
                    d="M206 171.144L42.678 7.822c-9.763-9.763-25.592-9.763-35.355 0-9.763 9.764-9.763 25.592 0 35.355l181 181c4.88 4.882 11.279 7.323 17.677 7.323s12.796-2.441 17.678-7.322l181-181c9.763-9.764 9.763-25.592 0-35.355-9.763-9.763-25.592-9.763-35.355 0L206 171.144z"
                    fill="#648299"
                    fillRule="nonzero"
                  />
                </svg>
                <select
                  className=" mb-20 border rounded-lg hover:scale-105 duration-200 border-gray-300 font-normal text-gray-900 mt-12 h-10 pl-5 pr-10 bg-gradient-to-r hover:border-gray-400 focus:outline-none appearance-none"
                  onChange={(e) => setFilterOption(e.target.value)}
                >
                  <option value="all">Tất cả</option>
                  <option value="free">Miễn phí</option>
                  <option value="paid">Trả phí</option>
                </select>
              </div>

              <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3  gap-x-8 m-auto mb-8 max-w-7xl">
                {currentProducts?.map((product: any) => (
                  <div
                    key={product._id}
                    className="group bg-white rounded-lg lg:max-w-[296px] transition-transform transform hover:scale-95 hover:shadow-xl border-gray-200"
                  >
                    <Link to={`/detail/${product._id}`} className="">
                      <div className="block relative">
                        <div className="rounded-t-lg overflow-hidden">
                          <img
                            src={product.img}
                            alt={product.name}
                            className="w-[600px] md:w-full text-[10px] h-[200px] object-cover rounded-t-lg transform group-hover:opacity-80 transition-opacity rounded-lg"
                          />

                          <div className="absolute top-0 left-0 w-full h-full bg-black opacity-0 group-hover:opacity-60 transition-opacity rounded-lg"></div>
                        </div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full text-center">
                          <button className="w-40 h-10 bg-white  opacity-0 group-hover:opacity-100 transition-opacity rounded-full ">
                            Xem khóa học
                          </button>

                        </div>
                      </div>
                      <div className="p-2">
                        <h2 className="text-[20px] font-bold mt-4 text-center text-[#0B7077]">
                          {product.name.length <= 25
                            ? product.name
                            : product.name.slice(0, 25) + " ..."}
                        </h2>
                        <div className="flex mt-2 justify-center max-w-[278px]">
                          <div className="flex gap-2 text-base pl-2 font-bold mt-1">
                            <p className="text-[#F05123] text-[15px]">
                              {product.price === "0" ? 'Miễn phí' : `${parseFloat(product.price).toLocaleString('vi-VN')}đ`}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>

                  </div>

                ))}
              </div>
              {/* Điều khiển phân trang */}
              <div className="flex justify-between">
                <button
                  className="text-[15px] text-[#0C356A] p-4 px-7 border-2 hover:scale-105 duration-500 hover:border-blue-300 rounded-lg  bg-[#D2E6E4] hover:bg-emerald-50 font-medium"
                  onClick={() => {
                    if (currentPage > 1) {
                      setCurrentPage(currentPage - 1);
                    }
                  }}
                  disabled={currentPage === 1}
                >
                  Trước
                </button>

                <button
                  className="text-[15px] text-[#0C356A] p-4 px-7 border-2 hover:scale-105 duration-500 hover:border-blue-300 rounded-lg  bg-[#D2E6E4] hover:bg-emerald-50 font-medium"
                  onClick={() => {
                    if (currentProducts.length === itemsPerPage) {
                      setCurrentPage(currentPage + 1);
                    }
                  }}
                  disabled={currentProducts.length !== itemsPerPage}
                >
                  Sau
                </button>
              </div>





            </div>
            {/* ====================================== */}
          </div>
        </div>
      </section>

    );
  };

  return <>{renderCourseList()}</>;
};

export default ListKhoaHoc;