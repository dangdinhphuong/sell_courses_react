import React, { useEffect, useState } from "react";
import {
  AiOutlineCheck,
  AiOutlineWechat,
  AiOutlineCheckCircle,
  AiFillFileText,
} from "react-icons/ai";
import { GiTeacher } from "react-icons/gi";
import { PiChalkboardTeacherBold } from "react-icons/pi";
import { CiRepeat } from "react-icons/ci";
import { BsStars } from "react-icons/bs";
import {
  createSearchParams,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useGetProductByIdQuery } from "@/Api/productApi";
import { Link } from "react-router-dom";
import { useAddOrderMutation, useUpdateOrderStatusMutation } from "@/Api/order";
import { Button, Drawer } from "antd";
import { useGetOneUserQuery } from "@/Api/userApi";
import useQueryParams from "../customHook";
import axios from "axios";
import { Empty, notification } from "antd";
var count = 1;
const PaymentSuccess = () => {
  const backgroundStyle = {
    backgroundImage: "url(../../../public/img/bg.png)",
    backgroundSize: "cover", // Đảm bảo hình nền phủ đầy phần tử
    backgroundRepeat: "no-repeat", // Ngăn chặn hình nền lặp lại
    backgroundPosition: "center", // Đặt hình nền ở giữa
  };
  const { idProduct } = useParams<{ idProduct: string }>();
  const { data: productData }: any = useGetProductByIdQuery(idProduct || "");
  const [upadateStatusCode] = useUpdateOrderStatusMutation();
  const [disCount, setDisCount] = useState(0);
  const [isRequesting, setIsRequesting] = useState(false);
  const [queryParameters] = useSearchParams();
  const [open, setOpen] = useState(false);
  const vouche: string | null = queryParameters.get("vouche");
  const voucheId: string | null = queryParameters.get("voucheId");
  const done: string | null = queryParameters.get("vnp_ResponseCode");
  let paymentCode: string | null = '';
  let infoVorcher: any;

  if (JSON.parse(localStorage.getItem("infoVorcher")) &&
    typeof JSON.parse(localStorage.getItem("infoVorcher")) === 'object' &&
    Object.keys(JSON.parse(localStorage.getItem("infoVorcher"))).length !== 0) {
    infoVorcher = JSON.parse(localStorage.getItem("infoVorcher"));
  } else {
    localStorage.setItem('infoVorcher', JSON.stringify({ "discountCal": 0 }));
    infoVorcher = {
      "discountCal": 0
    }
  }
  console.log("infoVorcher", infoVorcher);
  const showDrawer = () => {
    setOpen(true);
  };
  const queryConfig = useQueryParams();
  const onClose = () => {
    setOpen(false);
  };
  // Now you can use the infoVorcher variable, and it still contains the value
  const data: any = localStorage.getItem("userInfo");
  const orderId: any = localStorage.getItem("orderId");
  const navigate = useNavigate();
  const checkUser = JSON.parse(data).userData;
  const dataPageQuery: string | null = queryParameters.get(
    "vnp_ResponseCode=00"
  );
  const handelCheckVouche = async () => {
    await axios.get(
      `http://localhost:8088/api/voucher/user/${checkUser?._id}/${voucheId}`
    );
  };
  const handelUpdateVouche = async () => {
    await axios.put(`http://localhost:8088/api/voucher/${voucheId}`, {
      isActive: false,
    });
  };
  const [addOrder] = useAddOrderMutation();
  useEffect(() => {
    if (done) {
      axios.put(`http://localhost:8088/api/order/${orderId}`, {
        orderStatus: "Done",
      });
    }
  }, [done, orderId]);
  const { data: dataUSer } = useGetOneUserQuery(checkUser._id);
  const handelPayMentVNPay = async () => {
    const orderId = localStorage.getItem("orderId");
    await axios
      .post(`http://localhost:8088/api/create-payment-vnpay`, {
        user: checkUser?._id as string,
        name: checkUser?.name,
        od: "done",
        orderId: orderId,
        total: vouche
          ? String(productData?.data.price - disCount)
          : productData?.data.price,
        paymentMethodId: "Ví điện tử",
        inforOrderShipping: {
          course: idProduct,
        },
      })
      .then((data) => {
        window.location.href = data.data.url
      });
  };

  const checkPaymen = async () => {
    let code = getParam('vnp_TxnRef');
    const dataOrer = {
      paymentMethod: "Ví điện tử tataaaaaa",
      course: idProduct,
      user: checkUser._id,
      orderStatus: !done ? "Chờ xử lý" : "Done",
      payment: {},
      paymentCode: code,
      vouche: vouche || "",
      paymentAmount: vouche
        ? String(productData?.data.price - disCount)
        : productData?.data.price,
      bankName: "NCB",
    }
    const data = await addOrder(dataOrer);
    handelCheckVouche();
    return handelUpdateVouche();
  };
  const getParam = (param = '') => {
    const queryParameters = new URLSearchParams(window.location.search);
    const dataPageQuery: string | null = queryParameters.get(param);
    return dataPageQuery
  };

  const removeUrlParameters = () => {
    const newUrl = window.location.origin + window.location.pathname;
    window.history.pushState({}, document.title, newUrl);
  };
  const checkPayment = async () => {
    if (getParam('vnp_ResponseCode') && getParam('vnp_ResponseCode') == "00") {

      await checkPaymen();
      notification.success({
        message: 'Success',
        description: 'Course payment successful!',
      });
      return true;

    } else {
      if (localStorage.getItem("infoVorcher")) {
        localStorage.removeItem("infoVorcher");
      } 

      // Lấy thông tin về URL hiện tại
          const currentUrl = window.location.href;

          // Tạo đường dẫn
          const pathReturn = "/Thongtinthanhtoan/" + idProduct;
          // Tạo URL mới từ domain của URL hiện tại và đường dẫn
          const newUrl = `${currentUrl.split('/')[0]}${pathReturn}`;

          // Load trang mới
          window.location.href = newUrl;
      notification.error({
        message: 'error',
        description: 'Thanh toán thất bại!',
      });
    }
  };

  if (count == 1) {
    checkPayment();
    //  removeUrlParameters();
  }

  count++;


  return (
    <div
      className="h-screen bg-cover bg-no-repeat bg-fixed bg-center"
      style={backgroundStyle}
    >
      <div className=" px-6 py-6 lg:p-24 mx-auto lg:w-[1200px] h-full">
        <Drawer
          width={400}
          title="Áp dụng mã giảm giá"
          placement="right"
          onClose={onClose}
          open={open}
        >
          {dataUSer?.voucher?.map((items: any) => (
            <div key={items?._id}>
              <div className="flex items-center justify-between bg-gray-100 hover:bg-gray-200 cursor-pointer rounded-md mb-2">
                <p className="p-3 bg-black text-white rounded-md m-3">{items.code}</p>
                <Button
                  onClick={() => {
                    setDisCount(items?.sale);
                    return navigate({
                      search: createSearchParams({
                        vouche: items?.sale,
                        voucheId: items?._id,
                      }).toString(),
                    });
                  }}
                  className="mr-3"
                >
                  <span className="font-bold">Sử dụng</span>
                </Button>
              </div>
            </div>
          ))}
        </Drawer>
        <div className="text-center text-[30px] font-bold mb-10">
          <h1 className="text-white ">Mua khóa học thành công </h1>
        </div>
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="col-span-8">
            <div className="bg-[#202425] p-4 rounded-lg mt-6 space-y-4 ">
              <p className="ml-2 text-white ">
                Khóa học:{" "}
                <span className="text-[#52eeee] text-[18px] font-bold ml-10">
                  <p>
                    {productData?.data.name}
                  </p>
                </span>
              </p>
              <p className="ml-2 text-white ">
                Giá bán:{" "}
                <span className="text-[#52eeee] text-[18px] font-bold ml-10">
                  {vouche ? (
                    Number(productData?.data.price - disCount)
                  ) : (
                    <p>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(productData?.data.price)}
                    </p>
                  )}
                </span>
              </p>
              <p className="ml-2 text-white">
                Voucher:{" "}
                {infoVorcher.voucher ? (
                  <p className="p-3 bg-red-600 text-white rounded-md m-3">
                    {infoVorcher.voucher.code} - {infoVorcher.voucher.type ? infoVorcher.voucher.sale + '%' : null}
                  </p>
                ) : null}
              </p>

              <p className="ml-2 text-white">
                Giảm giá:{" "}
                <span className="text-[#52eeee] text-[18px] font-bold ml-10">
                  {vouche ? (
                    Number(productData?.data.price - disCount)
                  ) : (
                    <p>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(infoVorcher.discountCal)}
                    </p>
                  )}
                </span>
              </p>
              <p className="ml-2 border-[1px] text-white border-[#333c6d] border-b-0 border-r-0 border-l-0">
                Tổng tiền:{" "}
                <span className="text-[#52eeee] text-[18px] font-bold ml-10">
                  {vouche ? (Number(productData?.data.price - infoVorcher.discountCal)) : (
                    <p>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(productData?.data.price - infoVorcher.discountCal)}
                    </p>
                  )}
                </span>
              </p>
            </div>

            <div className="mt-10 space-x-2 flex text-center  ">
              {/* <Link to={`/thanhtoan/${idProduct}`} style={{ width: "100%" }}>
                <button className="bg-gradient-to-b from-[#8951ff] to-[#21a2ff] text-white py-2 px-8 rounded-md font-bold">
                  Thanh toán QR
                </button>
              </Link> */}
              <p
                onClick={() => navigate("/")}
                style={{ width: "100%" }}
              >
                <button className="bg-gradient-to-b from-[#8951ff] to-[#21a2ff] text-white py-2 px-6 rounded-md font-bold">
                  Quay về trang chủ
                </button>
              </p>
            </div>
          </div>
          <div className="col-span-4 mt-10 md:mt-0  text-white p-0.5  rounded-lg bg-gradient-to-l from-[#8951ff] to-[#21a2ff]">
            <div className="bg-[#323c4a] p-4 rounded-lg">
              <div className="text-center font-bold text-[20px] ">
                <p className="mb-4">Bạn sẽ nhận được gì?</p>
              </div>
              <div className="space-y-4">
                <p className="flex items-center">
                  <AiOutlineCheck className="mr-1" />
                  Truy cập toàn bộ khóa
                </p>
                <div className="flex items-center">
                  <GiTeacher className="mr-2" />
                  Hơn 604 bài học
                </div>
                <div className="flex items-center">
                  <PiChalkboardTeacherBold className="mr-2" />
                  Hơn 493 bài tập và thử thách
                </div>
                <div className="flex items-center">
                  <AiFillFileText className="mr-2" />
                  Thực hành 8 dự án thực tế
                </div>
                <div className="flex items-center">
                  <AiOutlineWechat className="mr-2" />
                  Kênh hỏi đáp riêng tư
                </div>
                <div className="flex items-center">
                  <AiOutlineCheckCircle className="mr-2" />
                  Đáp án cho mọi thử thách
                </div>
                <div className="flex items-center">
                  <BsStars className="mr-2" />
                  Cập nhật khóa học trong tương lai
                </div>
                <div className="flex items-center">
                  <CiRepeat className="mr-2" />
                  Mua một lần, học mãi mãi
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PaymentSuccess;
