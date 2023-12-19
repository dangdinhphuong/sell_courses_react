import { useGetOrderByIdQuery, useGetOrdersQuery } from "@/Api/order";
import { IOrder } from "@/interface/order";
import { Table, Skeleton, Button, Drawer, Input, Select } from "antd";
import { AiOutlineEye, AiFillEye } from "react-icons/ai";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { exportToExcel } from "@/pages/admin/Dashboard/Dashboard";
import {  FaSearch } from "react-icons/fa";
import { formatNumber } from "@/utils/formats"

const ListOrder = () => {
  const [dataSource, setDataSource] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [statusText, setStatusText] = useState("");
  const [filltername, setName] = useState("");
  const [open, setOpen] = useState(false);
  const [free, setFree] = useState(null);
  const [codePay,setCodePay] = useState(null)
  const [query, setQuery] = useState({})
  const { data: orderData, isLoading, refetch: refetchOrderData } = useGetOrdersQuery(query);
useEffect(() => {
  if (!orderData?.data) {
    return; // Exit early if there's no data
  }
  let filteredData = orderData?.data
  if (filltername) {
    // Reassign the result back to filteredData
    filteredData = filteredData.filter((item) => item.course.name == filltername);
  }
  if(free) {
    if(free == '2') {
      filteredData = orderData.data.filter((item) => item.payment.paymentAmount === '0')
    }else if(free == '3') {
      filteredData = orderData.data.filter((item) => item.payment.paymentAmount !== '0')
    }
  }
  if(codePay) {
    filteredData = filteredData.filter((item) => item.paymentCode == codePay);
  }
  console.log('orderData',filltername,filteredData);
  const formattedData = filteredData.map(({ _id, course, user, orderStatus,paymentCode, orderDate, payment }: IOrder) => ({
    key: _id,
    courseName: course?.name,
    userName: user?.name,
    userEmail: user?.email,
    userPhoneNumber: user?.phoneNumber,
    orderStatus,
    paymentCode,
    paymentMethod: payment?.paymentMethod,
    paymentAmount: payment?.paymentAmount,
    orderDate,
    orderId: _id,
  }));

  setDataSource(formattedData);
}, [orderData, free, filltername, codePay]);

const onChangeSearchName = (e) => {
  setName(e.target.value.trim())
}
const onChangeCodePay = (e) => {
  setCodePay(e.target.value.trim())
}
const onChangeSelect = (val) => {
  setFree(val)
}
const handleFilter = () => {
  refetchOrderData()
}
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
      render: (data) => {
        return <p>{formatNumber(data)} đ</p>;
      },
    },
    {
      title: "Phương thức thanh toán",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
    },
    {
      title: "Mã thanh toán",
      dataIndex: "paymentCode",
      key: "paymentCode"
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
      {/* <div className="space-x-5 mb-5">

      <Button onClick={()=>setFree(false)}>Miễn phí</Button>
      <Button onClick={()=>setFree(true)}>Có phí</Button>
        <input type="text" onChange ={(e)=>setName(e.target.value)} placeholder="Tên khóa học"></input>
      </div> */}
      <div className="flex mb-5 ">
        <div className="mr-5">
          <Input allowClear onChange={onChangeSearchName} style={{ width: 300 }}
            placeholder="Tìm kiếm khóa học" />
        </div>
        <div className="mr-5">
          <Input allowClear onChange={onChangeCodePay} style={{ width: 300 }}
            placeholder="Tìm kiếm theo mã thanh toán" />
        </div>
        <div className="mr-5">
          <Select
            onChange={onChangeSelect}
            placeholder="Loại khóa học"
            style={{ width: 300 }}
            options={[
              { value: '1', label: 'Tất cả' },
              { value: '2', label: 'Miễn Phí' },
              { value: '3', label: 'Có phí' },
            ]}
          />
        </div>
        <button onClick={handleFilter} className="bg-green-700 hover:bg-green-600 hover:text-white  text-white font-bold py-1 px-4 border border-green-600 rounded flex items-center">
          <FaSearch></FaSearch>
          <span className="ml-1">Tìm kiếm</span>
        </button>
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
