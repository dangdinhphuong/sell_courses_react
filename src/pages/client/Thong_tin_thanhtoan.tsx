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

const Thong_tin_thanhtoan = () => {
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
  const [infoVoucherUse, setInfoVoucherUse] = useState(Object);
  const [vorcherUse , setVorcherUse] = useState('');
  const [open, setOpen] = useState(false);
  const vouche: string | null = queryParameters.get("vouche");
  const voucheId: string | null = queryParameters.get("voucheId");
  const done: string | null = queryParameters.get("vnp_ResponseCode");
  const showDrawer = () => {
    setOpen(true);
  };
  const queryConfig = useQueryParams();
  const onClose = () => {
    setOpen(false);
  };

  const data: any = localStorage.getItem("userInfo");
  const orderId: any = localStorage.getItem("orderId");
  const navigate = useNavigate();
  const checkUser = JSON.parse(data).userData;
  const dataPageQuery: string | null = queryParameters.get(
    "vnp_ResponseCode=00"
  );
  const handleDiscount = (voucher: any , index: any) => {
    if(voucher.type){
      let discountCal = (voucher.sale / 100) * productData?.data.price;
      setDisCount(discountCal);
      setVorcherUse(voucher?._id);
      setInfoVoucherUse({voucher , discountCal: discountCal,voucherId: voucher?._id})
    }else{
      setDisCount(voucher.sale);
      setVorcherUse(voucher?._id);
      setInfoVoucherUse({voucher , discountCal: voucher.sale,voucherId: voucher?._id})
    }
  }

  const handleRemoveDiscount = () => {
    setVorcherUse('');
    setDisCount(0);
  }

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
  const { data: dataUSer } = useGetOneUserQuery(checkUser._id);

  useEffect(() => {
    if (done) {
      axios.put(`http://localhost:8088/api/order/${orderId}`, {
        orderStatus: "Done",
      });
    }
  }, [done, orderId]);

  const handelPayMentVNPay = async () => {
    const orderId = localStorage.getItem("orderId")?? "";
    await axios
      .post(`http://localhost:8088/api/create-payment-vnpay`, {
        user: checkUser?._id as string,
        name: checkUser?.name,
        od: "done",
        id:orderId,
        voucheId: infoVoucherUse.voucher ? infoVoucherUse.voucher._id : "", 
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
    if(infoVoucherUse){
      localStorage.setItem('infoVorcher', JSON.stringify(infoVoucherUse));
    }else{
      localStorage.setItem('infoVorcher', JSON.stringify({"discountCal": 0 }));
    }
    
    const orderPayment = {
      paymentMethod: "Ví điện tử",
      course: idProduct,
      user: checkUser._id,
      orderStatus: !done ? "Chờ xử lý" : "Done",
      payment: {},
      vouche: vouche || "",
      voucheId: infoVoucherUse.voucher ? infoVoucherUse.voucher._id : "",
      paymentAmount: vouche
        ? String(productData?.data.price - disCount)
        : String(productData?.data.price), // Make sure to convert to string
      bankName: "NCB",
    };
    // const data = await addOrder({
    //   paymentMethod: "Ví điện tử",
    //   course: idProduct,
    //   user: checkUser._id,
    //   orderStatus: !done ? "Chờ xử lý" : "Done",
    //   payment: {},
    //   vouche: vouche || "",
    //   paymentAmount: vouche
    //     ? String(productData?.data.price - disCount)
    //     : productData?.data.price,
    //   bankName: "NCB",
    // });
    localStorage.setItem("order", JSON.stringify(orderPayment));
    handelCheckVouche();
    // handelUpdateVouche();
   return handelPayMentVNPay();
  };

  return (
    <div
      className="h-screen bg-cover bg-no-repeat bg-fixed bg-center"
      style={backgroundStyle}
    >
      <div className=" px-6 py-6 lg:p-24 mx-auto lg:w-[1200px] h-full">
        <div className="text-center text-[30px] font-bold mb-10">
          <h1 className="text-white ">Mở khóa toàn bộ khóa học</h1>
        </div>
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="col-span-8">
            <p className="text-white mb-4">
              Sở hữu khóa học HTML CSS đầy đủ và chi tiết nhất bạn có thể tìm
              thấy trên Internet 🙌
            </p>
            <p className="text-white">
              Có tới{" "}
              <span className="text-[#5ebbff]">
                hàng trăm bài tập thực hành{" "}
              </span>
              sau mỗi bài học và bạn sẽ được{" "}
              <span className="text-[#5ebbff]">làm 8 dự án thực tế</span>
              trong khóa học này. Với{" "}
              <span className="text-[#5ebbff]">1000+ bài học</span>
              (bao gồm video, bài tập, thử thách, flashcards, v.v) sẽ giúp bạn
              nắm kiến thức nền tảng vô cùng chắc chắn.
            </p>
            <div className="mt-4">
              {dataUSer?.voucher?.map((items: any , index: any) => (
              <div key={items?._id}>
                <div className={vorcherUse && vorcherUse != items?._id ? 'opacity-75 flex items-center justify-between bg-gray-100 hover:bg-gray-200 cursor-pointer rounded-md mb-2' : 'flex items-center justify-between bg-gray-100 hover:bg-gray-200 cursor-pointer rounded-md mb-2'}>
                  <p className="p-3 bg-red-600 text-white rounded-md m-3">{items.code} - {items.type ?  items.sale + '%' 
                  : new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(Number(items.sale))}</p>
                  <div className="flex">
                    <Button
                      disabled={vorcherUse}
                      onClick={() => {
                        handleDiscount(items, index);
                      }}
                      className="mr-3"
                    >
                      <span className="font-bold">{vorcherUse == items?._id ? 'Đã sử dụng' : 'Sử dụng'}</span>
                    </Button>
                    <Button
                      onClick={() => {
                        handleRemoveDiscount();
                      }}
                      className={vorcherUse != items?._id ? 'hidden mr-3' : 'mr-3'}
                    >
                      <span className="font-bold">Bỏ voucher</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            </div>
            <div className="bg-[#202425] p-4 rounded-lg mt-6 space-y-4 ">
              <p className="ml-2 text-white ">
                Giá bán:{" "}
                <span className="text-[#52eeee] text-[18px] font-bold ml-10">
                  {vouche ? (
                    <p>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(Number(productData?.data.price - disCount))}
                    </p>
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
              <p className="ml-2 border-[1px] text-white border-[#333c6d] border-b-0 border-r-0 border-l-0">
                Tổng tiền:{" "}
                <span className="text-[#52eeee] text-[18px] font-bold ml-10">
                  {vouche ? (
                    <p>
                     {new Intl.NumberFormat("vi-VN", {
                       style: "currency",
                       currency: "VND",
                     }).format(Number(productData?.data.price - disCount))}
                   </p>
                  ) : (
                    <p>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(productData?.data.price-disCount)}
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
                onClick={() => !isRequesting && checkPaymen()}
                style={{ width: "100%" }}
              >
                <button className="bg-gradient-to-b from-[#8951ff] to-[#21a2ff] text-white py-2 px-6 rounded-md font-bold">
                  Thanh toán Vnpay
                </button>
              </p>
            </div>
          </div>
          <div className="col-span-4 mt-10 md:mt-0  text-white p-0.5  rounded-lg">
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
export default Thong_tin_thanhtoan;
