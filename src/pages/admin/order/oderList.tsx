import { useGetOrderByIdQuery, useGetOrdersQuery } from "@/Api/order";
import { IOrder } from "@/interface/order";
import { Table, Skeleton, Button, Drawer } from "antd";
import { AiOutlineEye, AiFillEye } from "react-icons/ai";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { exportToExcel } from "@/pages/admin/Dashboard/Dashboard";

const ListOrder = () => {
  const { data: orderData, isLoading } = useGetOrdersQuery();
  const [dataSource, setDataSource] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [statusText, setStatusText] = useState("");
  const [open, setOpen] = useState(false);
  const [free, setFree] = useState(true);
console.log(orderData?.data);
useEffect(() => {
  if (!orderData?.data) {
    return; // Exit early if there's no data
  }
  const filteredData = free
    ? orderData.data.filter((item) => item.payment.paymentAmount !== '0')
    : orderData.data.filter((item) => item.payment.paymentAmount === '0');
  const formattedData = filteredData.map(({ _id, course, user, orderStatus, orderDate, payment }: IOrder) => ({
    key: _id,
    courseName: course?.name,
    userName: user?.name,
    userEmail: user?.email,
    userPhoneNumber: user?.phoneNumber,
    orderStatus,
    paymentMethod: payment?.paymentMethod,
    paymentAmount: payment?.paymentAmount,
    orderDate,
    orderId: _id,
  }));

  setDataSource(formattedData);
}, [orderData, free]);


  const getSatusColor = (orderStatus: string) => {
    switch (orderStatus) {
      case "Done":
        return {
          color: "green",
          displayText: "Thành công",
        };
      case "Thất bại":
        return {
          color: "red",
          displayText: "Thất bại",
        };
      default:
        return {
          color: "blue",
          displayText: orderStatus,
        };
    }
  };

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const columns = [
    {
      title: "Tên khóa học",
      dataIndex: "courseName",
      key: "courseName",
    },
    {
      title: "Tên người đăt hàng",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Đơn giá",
      dataIndex: "paymentAmount",
      key: "paymentAmount",
    },
    {
      title: "Phương thức thanh toán",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
    },
    {
      title: "Ngày đặt hàng",
      dataIndex: "orderDate",
      key: "orderDate",
      render: (data) => {
        return <p>{data.split("T")[0]}</p>;
      },
    },
    {
      title: "Trạng thái đặt hàng",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: (text: any, record: any) => {
        const { color, displayText } = getSatusColor(text);
        const finalDisplayText = text === selectedStatus ? statusText : displayText;
        return (
          <span
            style={{ color }}
            className="font-bold flex items-center space-y-2"
          >
            {finalDisplayText}
          </span>
        );
      },
    },
    {
      title: "Thao tác",
      render: ({ key: id }: { key: string }) => (
        <Button
          style={{ paddingLeft: "4px" }}
          className=" w-7 h-7  mr-2"
          type="default"
        >
          <Link to={`/admin/orders/${id}`} onClick={showDrawer}>
            <AiOutlineEye className="text-xl text-primary text-black" />
          </Link>
        </Button>
      ),
    },
  ];
  return (
    <div>
      <div className="flex justify-end">
      <Button onClick={() => exportToExcel(orderData?.data, "allOrder")} className="mb-3">
        Xuất Excel
      </Button>
      </div>
      <div className="space-x-5 mb-5">
      <Button onClick={()=>setFree(false)}>Miễn phí</Button>
      <Button onClick={()=>setFree(true)}>Có phí</Button>
      </div>
      {isLoading ? (
        <Skeleton />
      ) : (
        <Table dataSource={dataSource} columns={columns} />
      )}
    </div>
  );
};

export default ListOrder;
