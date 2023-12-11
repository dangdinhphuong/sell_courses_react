import { useGetOrderByIdQuery } from "@/Api/order";
import { exportToExcel } from "@/pages/admin/Dashboard/Dashboard";
import { Button, Table } from "antd";
import React from "react";
import { useParams } from "react-router-dom";

const OderId = () => {
  const { id } = useParams();
  const { data: orderDataId } = useGetOrderByIdQuery(id as string);
  console.log(orderDataId);
  return (
    <div>
      <div className="flex justify-end mb-5">
      <Button onClick={()=> exportToExcel([orderDataId], "details")}> Xuất Excel </Button>
      </div>

        <div className="">
        <div className="bg-white w-auto py-5">
        <h2 className="h2 text-center text-2xl font-bold mb-3">Chi Tiết Đơn Hàng</h2>
        <div className="flex items-center justify-center">
        <table className="border-collapse border border-slate-400 w-2/3 mt-5">
  <tbody>
  <tr>
      <td className ="border border-slate-300 text-center font-bold"><p>Tên khóa</p></td>
      <td className ="border border-slate-300 w-2/3 p-3"><p className="w-[100px] col-span-2"> {orderDataId?.data?.course.name}</p></td>
    </tr>
    <tr>
      <td className ="border border-slate-300 text-center font-bold"><p>Ảnh khóa học</p></td>
      <td className ="border border-slate-300 w-2/3 p-3"><img className="w-[100px] col-span-2" src={`${orderDataId?.data?.course.img}`} /></td>
    </tr>
    
    <tr>
      <td className ="border border-slate-300 text-center font-bold"> <p>Nội dung khóa học</p></td>
      <td className ="border border-slate-300 w-2/3 p-3"><p className="col-span-2"> {orderDataId?.data?.course.description}</p></td>
    </tr>
    <tr>
      <td className ="border border-slate-300 text-center font-bold"><p>Tên người mua</p></td>
      <td className ="border border-slate-300 w-2/3 p-3"><p className="col-span-2"> {orderDataId?.data?.user.name}</p></td>
    </tr>
    <tr>
      <td className ="border border-slate-300 text-center font-bold"><p>Email người mua</p></td>
      <td className ="border border-slate-300 w-2/3 p-3"><p className="col-span-2"> {orderDataId?.data?.user.email}</p></td>
    </tr>
    <tr>
      <td className ="border border-slate-300 text-center font-bold"><p>SĐT người mua</p></td>
      <td className ="border border-slate-300 w-2/3 p-3"><p className="col-span-2"> {orderDataId?.data?.user.phoneNumber}</p></td>
    </tr>
    <tr>
      <td className ="border border-slate-300 text-center font-bold"> <p>Giá đơn hàng</p></td>
      <td className ="border border-slate-300 w-2/3 p-3"><p className="col-span-2"> {orderDataId?.data?.payment.paymentAmount}</p></td>
    </tr>
    <tr>
      <td className ="border border-slate-300 text-center font-bold"><p>Phương thức thanh toán</p></td>
      <td className ="border border-slate-300 w-2/3 p-3"><p className="col-span-2"> {orderDataId?.data?.payment.paymentMethod}</p></td>
    </tr>
    <tr>
      <td className ="border border-slate-300 text-center font-bold"><p>Ngày thanh toán</p></td>
      <td className ="border border-slate-300 w-2/3 p-3"><p className="col-span-2">{new Date(orderDataId?.data?.payment.paymentDate).toLocaleDateString('en-GB')}</p></td>
    </tr>
    <tr >
      <td className ="border border-slate-300 text-center font-bold"> <p>Trạng thái đơn hàng</p></td>
      <td className="border border-slate-300 w-2/3 p-3">
  <p className={`col-span-2 ${orderDataId?.data.orderStatus === 'Done' ? 'text-green-500' : orderDataId?.data.orderStatus === 'Thất bại' ? 'text-red-500' : 'text-blue-500'}`}>
  {orderDataId?.data.orderStatus === 'Done' ? 'Thành công' : orderDataId?.data.orderStatus}
  </p>
</td>    </tr>
   
  </tbody>
          </table>
        </div>
          
        </div>
        </div>
        
     
    </div>
  );
};

export default OderId;
