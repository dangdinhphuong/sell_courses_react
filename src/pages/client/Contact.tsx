import { AiFillHome, AiFillPhone, AiOutlineMail } from "react-icons/ai";
import React, { useEffect, useState } from "react";
import App from "@/App.css";
import { RaceBy } from '@uiball/loaders'


import { Empty } from 'antd';

const Contact = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Mặc định isLoading là true và sau 3 giây, nó sẽ chuyển thành false.
  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const [position, setPosition] = useState(0);

  useEffect(() => {
    const animateText = () => {
      setPosition((prevPosition) => prevPosition + 1);
    };

    const interval = setInterval(animateText, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
          <RaceBy size={100} lineWeight={6} speed={1.4} color="#47d1d1" />
          <div className="mt-2 text-black font-medium" style={{ color: '#70dbdb' }}>Loading</div>
        </div>
      ) : null}
      {isLoading ? null : (
        <section className="content pt-[89px] bg-[#D2E6E4]">
          {/* <!-- component --> */}
          <div className="text-gray-600  relative  bg-white">
            <div className="App">
            </div>
            <div className="container px-4 sm:px-10 py-8 sm:py-16 mx-auto flex flex-col sm:flex-row">
              <div className="bg-[#fff] rounded-lg px-4 sm:px-10 w-full sm:w-[850px] text-[#0B7077]">
                <p className="text-2xl sm:text-3xl font-bold py-3 sm:py-5 text-[#0B7077]">
                  Thông tin liên hệ:
                </p>
                <hr className="my-2 sm:my-4 md:w-[300px] lg:w-full" />
                <p className="py-2 md:w-[350px] lg:w-full">
                  Nếu gặp bất kỳ vấn đề gì trong quá trình sử dụng dịch vụ của StrongCOde,
                  Quý khách hàng vui lòng liên hệ với chúng tôi thông qua email,
                  hotline hoặc trực tiếp tại trụ sở Công ty. StrongCOde cam kết sẽ phản
                  hồi khách hàng nhanh nhất có thể. Chúng tôi luôn quan tâm tới ý
                  kiến của Quý khách hàng và cam kết hỗ trợ thông tin để đem lại
                  sự hài lòng tối đa cho khách hàng khi sử dụng dịch vụ của J4.
                </p>
                <p className="text-2xl sm:text-3xl font-bold py-3 sm:py-5 text-[#0B7077]">
                  Phương thức liên hệ:
                </p>
                <hr className="my-2 sm:my-4 md:w-[300px] lg:w-full" />
                <div className="md:w-[350px] lg:w-full">
                  <a className="text-lg sm:text-xl text-gray-500 py-2 flex" href="">
                    <AiFillHome className="ml-2 mr-2 pt-1 text-[20px] text-[#0B7077]" />
                    Address: Tòa nhà FPT Polytechnic, P. Trịnh Văn Bô, Xuân
                    Phương, Nam Từ Liêm, Hà Nội
                  </a>

                  <a className="text-lg sm:text-xl text-gray-500 py-2 flex" href="">
                    <AiFillPhone className="ml-2 mr-2 pt-1 text-[20px] text-[#0B7077]" />
                    Hotline: 082626999
                  </a>

                  <a className="text-lg sm:text-xl text-gray-500 py-2 flex" href="">
                    <AiOutlineMail className="ml-2 mr-2 pt-1 text-[20px] text-[#0B7077]" />
                    Email: cskhJ4@gmail.com
                  </a>
                </div>
                <img
                  src="../../../public/img/cskh.png"
                  alt=""
                  className="lg:w-[500px] sm:w-[500px] h-[250px] py-3 sm:ml-[100px] md:w-[300px] md:ml-[30px]"
                />
              </div>
              <div className="lg:w-1/2 md:w-1/2 md:w-[500px] lg:ml-[100px] bg-white rounded-lg p-4 sm:p-10 flex flex-col md:ml-auto w-full mt-4 sm:mt-10 md:mt-0 relative z-10 shadow-md border-2">
                <h2 className="text-[#0B7077] text-2xl sm:text-3xl mb-1 font-medium title-font">
                  Phản Hồi
                </h2>
                <p className="leading-relaxed mb-5 text-gray-600">
                  Phản hồi về trải nghiệm của bạn cho chúng tôi!.
                </p>
                <form action="https://formspree.io/f/xrgwyanv" method="POST">
                  <div className="relative mb-4">
                    <label className="leading-7 text-base sm:text-sm text-gray-600">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="Name"
                      required
                      className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    />
                  </div>
                  <div className="relative mb-4">
                    <label className="leading-7 text-base sm:text-sm text-gray-600">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    />
                  </div>
                  <div className="relative mb-4">
                    <label className="leading-7 text-base sm:text-sm text-gray-600">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                  >
                    Gửi
                  </button>
                  <p className="text-base sm:text-xs text-gray-500 mt-3">
                    Cảm ơn quý khách đã sử dụng dịch vụ của chúng tôi. Quý khách
                    vui lòng đợi phản hồi trong giây lát!
                  </p>
                </form>
              </div>
            </div>

            <div className="mx-auto max-w-screen-xl">
              <div className="aspect-w-4 aspect-h-3">
                <iframe
                  className="w-full h-full"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.919897260996!2d105.74627993415311!3d21.035890878423363!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313455f097562a6f%3A0xc1df36ba25eab7e0!2zVHLGsOG7nW5nIENhbyDEkeG6s25nIEZQVCBQb2x5dGVjaG5pYw!5e0!3m2!1svi!2s!4v1690736722793!5m2!1svi!2s"
                  loading="lazy"
                ></iframe>
              </div>
            </div>

          </div>
        </section>
      )}
    </>
  );
};

export default Contact;
