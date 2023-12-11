import React from 'react'
import { useGetProductsQuery } from "@/Api/productApi";
import { Link } from "react-router-dom";
import {
  FaCrown
} from "react-icons/fa";
const LT_BE = () => {
  const { data: productData, error } = useGetProductsQuery();
   // Tìm sản phẩm 1 sản phẩm trong danh sách sản phẩm
   const kien_thuc_nhap_mon_lap_trinh = productData?.data.find((product) => product.name === "Kiến thức nhập môn IT");
   const html_css = productData?.data.find((product) => product.name === "HTML CSS từ Zero đến Hero");
   const responsive_voi_grid_system = productData?.data.find((product) => product.name === "Responsive Với Grid System");
   const lap_trinh_javaScript_coban = productData?.data.find((product) => product.name === "Lập Trình JavaScript Cơ Bản");
   const lap_trinh_javaScript_nangcao = productData?.data.find((product) => product.name === "Lập Trình JavaScript Nâng Cao");
   const Terminal_Ubuntu= productData?.data.find((product) => product.name === "Làm việc với Terminal & Ubuntu");
   const  Libraries_Frameworks= productData?.data.find((product) => product.name === "Node & ExpressJS");
   // Nếu không có sản phẩm, chọn một sản phẩm ngẫu nhiên từ danh sách
   const randomProduct = productData?.data[Math.floor(Math.random() * productData.data.length)];
   // Sử dụng sản phẩm  nếu có hoặc sản phẩm ngẫu nhiên nếu không có
   const selectedProduct1 = kien_thuc_nhap_mon_lap_trinh || randomProduct;
   const selectedProduct2 = html_css || randomProduct;
   const selectedProduct3 = responsive_voi_grid_system || randomProduct;
   const selectedProduct4 = lap_trinh_javaScript_coban || randomProduct;
   const selectedProduct5 = lap_trinh_javaScript_nangcao || randomProduct;
   const selectedProduct6 = Terminal_Ubuntu || randomProduct;
   const selectedProduct7 = Libraries_Frameworks || randomProduct;
   
  return (
    <div>
       
        <div className='content py-40 '>
        <div className='lg:w-[1200px] mx-auto px-4'>
            <div className='lg:px-10 '>
                <div className='mb-24'>
                  <h2 className='font-bold text-[20px] lg:text-[40px]'>Lộ trình học Back-End</h2>
                  <p className='text-[14px] lg:text-[16px] md:leading-7 text-justify'>Hầu hết các websites hoặc ứng dụng di động đều có 2 phần là Front-end
                  và Back-end. Front-end là phần giao diện người dùng nhìn thấy và có thể tương tác,
                  đó chính là các ứng dụng mobile hay những website bạn đã từng sử dụng. Vì vậy, nhiệm 
                  vụ của lập trình viên Front-end là xây dựng các giao diện đẹp, dễ sử dụng và tối ưu trải nghiệm người dùng.
                  Tại Việt Nam, <a className='text-[#e74c3c] font-bold' href="https://jobsgo.vn/muc-luong-lap-trinh-frontend/ha-noi.html">lương trung bình</a>  cho lập trình viên front-end vào khoảng <span className='font-bold'>19.000.000đ</span> / tháng.
                  Dưới đây là các khóa học F8 đã tạo ra dành cho bất cứ ai theo đuổi sự nghiệp trở thành một lập trình viên Front-end.
                  </p>
                </div>
                <div className='lg:grid lg:grid-cols-12 lg:gap-8'>
                <div className='lg:col-span-9'>
                  <div className='mb-4'>
                    <h2 className='font-bold text-[20px] lg:text-[30px] mb-2 md:mb-4'>1. Tìm hiểu về ngành IT</h2>
                    <p className='mb-4 text-justify'>Để theo ngành IT - Phần mềm cần rèn luyện những kỹ năng nào? Bạn đã có sẵn tố chất phù hợp với ngành chưa?
                         Cùng thăm quan các công ty IT và tìm hiểu về văn hóa,
                         tác phong làm việc của ngành này nhé các bạn.</p>
                    <div className='rounded-xl border-2 p-6'>
                      <div className='md:flex md:mx-auto md:space-x-10 '>

                          <img className='md:w-[300px] rounded-xl h-[180px] mb-2 md:mb-0  w-full' src={selectedProduct1?.img} alt="" />
                       
                        <div className='content'>
                          <h2 className='font-bold text-[20px]'>{selectedProduct1?.name}</h2>
                          <p className=' line-clamp-2'>
                            {selectedProduct1?.description && selectedProduct1?.description.length > 150
                              ? selectedProduct1.description.slice(0, 150) + '...'
                              : selectedProduct1?.description}
                          </p>

                          <p className='text-[#e74c3c] font-bold mb-4 text-[20px]'> {selectedProduct1?.price === "0" ? 'Miễn phí' : `${selectedProduct1?.price} VNĐ`}</p>
                          <div className="text-center md:text-left py-2  w-full bg-[#e74c3c] md:bg-white rounded-2xl">
                          <a className=' text-white md:bg-[#e74c3c] bg-none  md:px-4 py-3 md:py-2  rounded-2xl' href={`/detail/${selectedProduct1?._id}`}>Xem chi tiết</a>
                          </div>
                        </div>
                      </div> 
                    </div> 
                  </div>
                  <div className='mb-4'>
                    <h2 className='font-bold text-[20px] lg:text-[30px] mb-2 md:mb-4'>2. HTML và CSS</h2>
                    <p className='mb-4 text-justify'>Để học web Front-end chúng ta luôn bắt đầu với ngôn ngữ HTML và CSS, đây là 2 ngôn ngữ có mặt trong mọi website trên internet.
                     Trong khóa học này F8 sẽ chia sẻ từ những kiến thức cơ bản nhất. Sau khóa học này bạn sẽ tự làm được 2 giao diện websites là The Band và Shopee.</p>
                    <div className='rounded-xl border-2 p-6'>
                      <div className='md:flex mx-auto md:space-x-10 '>
                          <img className='md:w-[300px] rounded-xl h-[180px] mb-2 md:mb-0  w-full' src={selectedProduct2?.img} alt="" />
                        <div className='content'>
                          <h2 className='font-bold text-[20px]'>{selectedProduct2?.name}</h2>
                          <p className='line-clamp-2'>
                            {selectedProduct2?.description && selectedProduct2?.description.length > 150
                              ? selectedProduct2.description.slice(0, 150) + '...'
                              : selectedProduct2?.description}
                          </p>
                          <p className='text-[#e74c3c] font-bold mb-4 text-[20px]'> {selectedProduct2?.price === "0" ? 'Miễn phí' : `${selectedProduct2?.price} VNĐ`}</p>
                          <div className="text-center md:text-left py-2  w-full bg-[#e74c3c] md:bg-white rounded-2xl">
                          <a className=' text-white md:bg-[#e74c3c] bg-none  md:px-4 py-3 md:py-2  rounded-2xl' href={`/detail/${selectedProduct2?._id}`}>Xem chi tiết</a>
                          </div>
                        </div>
                      </div> 
                    </div>
                    <div className='rounded-xl border-2 p-6 mt-6'>
                      <div className='md:flex mx-auto  md:space-x-10 '>
                          <img className='md:w-[300px] rounded-xl h-[180px] mb-2 md:mb-0  w-full' src={selectedProduct3?.img} alt="" />
                        <div className='content'>
                          <h2 className='font-bold text-[20px]'>{selectedProduct3?.name}</h2>
                          <p  className=' line-clamp-2'>
                            {selectedProduct3?.description && selectedProduct3?.description.length > 150
                              ? selectedProduct3.description.slice(0, 150) + '...'
                              : selectedProduct3?.description}
                          </p>
                          <p className='text-[#e74c3c] font-bold mb-4 text-[20px]'> {selectedProduct3?.price === "0" ? 'Miễn phí' : `${selectedProduct3?.price} VNĐ`}</p>
                          <div className="text-center md:text-left py-2  w-full bg-[#e74c3c] md:bg-white rounded-2xl">
                          <a className=' text-white md:bg-[#e74c3c] bg-none  md:px-4 py-3 md:py-2  rounded-2xl' href={`/detail/${selectedProduct3?._id}`}>Xem chi tiết</a>
                          </div>
                        </div>
                      </div> 
                    </div> 
                  </div>
                  <div className='mb-4'>
                    <h2 className='font-bold text-[20px] lg:text-[30px] mb-2 md:mb-4'>3. JavaScript</h2>
                    <p className='mb-4 text-justify'>Với HTML, CSS bạn mới chỉ xây dựng được các websites tĩnh, chỉ bao gồm phần giao diện và gần như chưa có xử lý tương tác gì.
                     Để thêm nhiều chức năng phong phú và tăng tính tương tác cho website bạn cần học Javascript.</p>
                    <div className='rounded-xl border-2 p-6'>
                      <div className='md:flex mx-auto  md:space-x-10 '>
                          <img className='md:w-[300px] rounded-xl h-[180px] mb-2 md:mb-0  w-full' src={selectedProduct4?.img} alt="" />
                        <div className='content'>
                          <h2 className='font-bold text-[20px]'>{selectedProduct4?.name}</h2>
                          <p className=' line-clamp-2'>
                            {selectedProduct4?.description && selectedProduct4?.description.length > 150
                              ? selectedProduct4.description.slice(0, 150) + '...'
                              : selectedProduct4?.description}
                          </p>
                          <p className='text-[#e74c3c] font-bold mb-4 text-[20px]'> {selectedProduct4?.price === "0" ? 'Miễn phí' : `${selectedProduct4?.price} VNĐ`}</p>
                          <div className="text-center md:text-left py-2  w-full bg-[#e74c3c] md:bg-white rounded-2xl">
                          <a className=' text-white md:bg-[#e74c3c] bg-none  md:px-4 py-3 md:py-2  rounded-2xl' href={`/detail/${selectedProduct4?._id}`}>Xem chi tiết</a>
                          </div>
                        </div>
                      </div> 
                    </div> 
                    <div className='rounded-xl border-2 p-6 mt-6'>
                      <div className='md:flex mx-auto  md:space-x-10 '>
                          <img className='md:w-[300px] rounded-xl h-[180px] mb-2 md:mb-0  w-full' src={selectedProduct5?.img} alt="" />
                        <div className='content'>
                          <h2 className='font-bold text-[20px]'>{selectedProduct5?.name}</h2>
                          <p className=' line-clamp-2'>
                            {selectedProduct5?.description && selectedProduct5?.description.length > 150
                              ? selectedProduct5.description.slice(0, 150) + '...'
                              : selectedProduct5?.description}
                          </p>
                          <p className='text-[#e74c3c] font-bold mb-4 text-[20px]'> {selectedProduct5?.price === "0" ? 'Miễn phí' : `${selectedProduct5?.price} VNĐ`}</p>
                          <div className="text-center md:text-left py-2  w-full bg-[#e74c3c] md:bg-white rounded-2xl">
                          <a className=' text-white md:bg-[#e74c3c] bg-none  md:px-4 py-3 md:py-2  rounded-2xl' href={`/detail/${selectedProduct5?._id}`}>Xem chi tiết</a>
                          </div>
                        </div>
                      </div> 
                    </div> 
                  </div>
                  <div className='mb-4'>
                    <h2 className='font-bold text-[30px] mb-4'>4. Sử dụng Ubuntu/Linux</h2>
                    <p className='mb-4 '>Cách làm việc với hệ điều hành Ubuntu/Linux qua Windows Terminal & WSL.
                     Khi đi làm, nhiều trường hợp bạn cần nắm vững các dòng lệnh cơ bản của Ubuntu/Linux.</p>
                    <div className='rounded-xl border-2 p-6'>
                      <div className='md:flex mx-auto  md:space-x-10 '>
                          <img className='md:w-[300px] rounded-xl h-[180px] mb-2 md:mb-0  w-full' src={selectedProduct6?.img} alt="" />
                        <div className='content'>
                          <h2 className='font-bold text-[20px]'>{selectedProduct6?.name}</h2>
                          <p className=' line-clamp-2'>
                            {selectedProduct6?.description && selectedProduct6?.description.length > 150
                              ? selectedProduct6.description.slice(0, 150) + '...'
                              : selectedProduct6?.description}
                          </p>
                          <p className='text-[#e74c3c] font-bold mb-4 text-[20px]'> {selectedProduct6?.price === "0" ? 'Miễn phí' : `${selectedProduct6?.price} VNĐ`}</p>
                          <div className="text-center md:text-left py-2  w-full bg-[#e74c3c] md:bg-white rounded-2xl">
                          <a className=' text-white md:bg-[#e74c3c] bg-none  md:px-4 py-3 md:py-2  rounded-2xl' href={`/detail/${selectedProduct6?._id}`}>Xem chi tiết</a>
                          </div>
                        </div>
                      </div> 
                    </div> 
                  </div>
                  <div className='mb-4'>
                    <h2 className='font-bold text-[30px] mb-4'>5. Libraries and Frameworks</h2>
                    <p className='mb-4'>Một websites hay ứng dụng hiện đại rất phức tạp, chỉ sử dụng HTML, CSS, Javascript theo cách code thuần 
                    (tự code từ đầu tới cuối) sẽ rất khó khăn. Vì vậy các Libraries, Frameworks ra đời nhằm đơn giản hóa,
                     tiết kiệm chi phí và thời gian để hoàn thành một sản phẩm website hoặc ứng dụng mobile.</p>
                    <div className='rounded-xl border-2 p-6'>
                      <div className='md:flex mx-auto  md:space-x-10 '>
                          <img className='md:w-[300px] rounded-xl h-[180px] mb-2 md:mb-0  w-full' src={selectedProduct7?.img} alt="" />
                        <div className='content'>
                          <h2 className='font-bold text-[20px]'>{selectedProduct7?.name}</h2>
                          <p className=' line-clamp-2'>
                            {selectedProduct7?.description && selectedProduct7?.description.length > 150
                              ? selectedProduct7.description.slice(0, 150) + '...'
                              : selectedProduct7?.description}
                          </p>
                          <p className='text-[#e74c3c] font-bold mb-4 text-[20px]'> {selectedProduct7?.price === "0" ? 'Miễn phí' : `${selectedProduct7?.price} VNĐ`}</p>
                          <div className="text-center md:text-left py-2  w-full bg-[#e74c3c] md:bg-white rounded-2xl">
                          <a className=' text-white md:bg-[#e74c3c] bg-none  md:px-4 py-3 md:py-2  rounded-2xl' href={`/detail/${selectedProduct7?._id}`}>Xem chi tiết</a>
                          </div>
                        </div>
                      </div> 
                    </div> 
                  </div>
                  <div>
                  <div className='flex items-center'>
                  <p className='font-bold mt-10 mb-5 text-[18px] md:text-[25px]'>Các khóa học Pro tại StrongCode</p>
                    <span ><FaCrown className="text-yellow-500 ml-2 mt-2 text-[30px] lg:text-[45px]" /></span>
                  </div>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                {productData?.data.filter((product: any) => parseFloat(product.price) > 0).slice(0, 6)
                  .map((product: any) => (
                    <div
                      key={product._id}
                      className="   w-full lg:w-[400px] lg:h-[220px] "
                    >
                      <Link to={`/detail/${product._id}`} className=" ">
                          <img
                            src={product.img}
                            alt={product.name}
                            className="w-full  lg:w-[250px] lg:h-[150px] rounded-lg"
                          />
                          <div className="text-center">
                          <div className="mt-4  text-center max-w-[278px]">
                            <h2 className="text-xl font-bold mt-4 text-[#0B7077]  line-clamp-1">
                              {product.name}
                            </h2>
                                <p className="text-red-500 font-bold text-[20px]">
                                  {product.price === "0" ? 'Miễn phí' : `${product.price} VNĐ`}
                                </p>

                            </div>
                          </div>
                      </Link>
                    </div>
                  ))}
                  </div>
                  </div>
                </div>


                <div className='hidden lg:block lg:col-span-3'>
                {productData?.data.slice(0,3).map((product: any) => (
             <div
                key={product._id}
                className="group bg-white rounded-lg shadow-lg  max-w-[296px]  transition-transform transform hover:scale-95 hover:shadow-xl w-[296px] h-[428px] border border-gray-200"
              >
            <Link to={`/detail/${product._id}`} className=" ">
              <img
                src={product.img}
                alt={product.name}
                className="object-cover object-center  w-full h-[230px] rounded-t-lg"
              />
              <div className="p-2">
                <h2 className="text-xl font-bold mt-4 text-center text-[#0B7077]">
                  {product.name}
                </h2>
                <div className="flex mt-4 justify-between px-5 max-w-[278px]">
                  <div className="flex gap-2 text-base pl-2 font-bold mt-1">
                    <p className="text-red-500">
                      {product.price === "0" ? 'Miễn phí' : `${product.price} VNĐ`}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
                  ))}
                </div>
                </div>
            </div>
            
        </div>
    </div>
       
    </div>
    
  )
}

export default LT_BE