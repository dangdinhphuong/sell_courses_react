import { Button, Drawer, Table, Input, Select, DatePicker } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { IoTrashOutline } from "react-icons/io5";
import { AiOutlineEdit } from "react-icons/ai";
import { FaPlus, FaSearch } from "react-icons/fa";
import Swal from 'sweetalert2';
import { formatNumber } from "@/utils/formats";
import moment from "moment";

const Vouche = ({ check }: any) => {
  console.log(check);
  const [query, setQuery] = useState({})

  const [queryParameters] = useSearchParams();
  const iduser: string | null = queryParameters.get("userId");
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const [dataVouche, setDataVouche] = useState<any[]>([]);
  useEffect(() => {
    const handelFetchVouche = async () => {
      const params = new URLSearchParams(query)?.toString();
      const { data } = await axios.get(`http://localhost:8088/api/vouchers?${params}`);
      setDataVouche(data);
      console.log(dataVouche);
    };
    handelFetchVouche();
  }, [query]);
  const onChangeSearchName = (e) => {
    console.log(e.target.value);
    setQuery((prev) => {
      return { ...prev, q: e.target.value }
    })
  }
  const onChangeSelect = (val) => {
    setQuery((prev) => {
      return { ...prev, isActive: val }
    })
  }
  const handleSearchDate = val => {
    console.log("val________", val)

    if (val) {
      const startDate = moment(val[0].$d).format("YYYY-MM-DDTHH:mm:ss.SSSZ")
      const endDate = moment(val[1].$d).format("YYYY-MM-DDTHH:mm:ss.SSSZ")
      console.log(startDate, endDate)
      setQuery(prev => {
        return { ...prev, startDate: startDate, endDate: endDate }
      })
    } else {
      setQuery(prev => {
        delete prev.startDate
        delete prev.endDate
        return { ...prev }
      })
    }


  }
  const handleFilter = async () => {

  };
  const handelDelete = async (id: string) => {
    // Confirm before deleting
    Swal.fire({
      title: 'Bạn chắc chắn muốn xóa chứ?',
      text: 'Lưu ý: Bạn sẽ không thể hủy nếu đồng ý!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Đồng Ý',
      cancelButtonText: 'Thoát',
    }).then((result) => {
      if (result.isConfirmed) {
        // If confirmed, proceed with the deletion
        axios.delete(`http://localhost:8088/api/voucher/${id}`)
          .then(() => {
            // Reload the page or update state as needed
            window.location.reload();
          })
          .catch((error) => {
            console.error('Error deleting voucher:', error);
            // Handle error as needed
          });
      }
    });
  };
  const dataSource = dataVouche?.data?.docs.map((items) => ({
    key: items._id,
    code: items.code,
    sale: items.sale,
    start: items.startDate,
    isActive: items.isActive,
    end: items.endDate,
    type: items.type
  }));
  const handelSendVouche = async (id: string) => {
    await axios.get(`http://localhost:8088/api/voucher/${iduser}/${id}`);
    alert("Gửi Thành Công !");
  };
  const columns = [
    {
      title: "Mã",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      render: (b) => {
        return (
          <p className={`${b == true ? "text-green-500" : "text-red-500"}`}>
            {b ? "Hoạt động" : "Đã sử dụng"}
          </p>
        );
      },
    },
    {
      title: "Giảm ",
      dataIndex: "sale",
      key: "sale",
      render: (price, obj) => {
        return <p>{obj.type == 1 ? `${price}%` : `${formatNumber(price)}đ`}</p>;
      },
    },
    {
      title: "Thời gian bắt đầu",
      dataIndex: "start",
      key: "start",
      render: (data) => {
        return <p>{data.split("T")[0]}</p>;
      },
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "end",
      key: "end",
      render: (data) => {
        return <p>{data.split("T")[0]}</p>;
      },
    },
    {
      title: "Thao tác",
      render: ({ key: id }: { key: string }) => {
        return (
          <>
            {check ? (
              <div>
                <Button onClick={() => handelSendVouche(id)}>Gửi</Button>
              </div>
            ) : (
              <div className="space-x-2">
                <Button
                  onClick={() => handelDelete(id)}
                  className="w-9 h-8 pl-2 ml-2"
                  type='default'
                >
                  <IoTrashOutline className="text-xl" />
                </Button>
                <Button className='w-9 h-8 pl-2 ml-2' type='default' >
                  <Link to={`/admin/vouche/${id}`}><AiOutlineEdit className="text-xl" /></Link>
                </Button>

              </div>
            )}
          </>
        );
      },
    },
  ];

  return (
    <div>
      <header className="mb-4 flex justify-between items-center">
        <h2 className="font-bold text-2xl">Quản Lý Mã Giảm Giá</h2>
        <button className="bg-green-700 hover:bg-green-600 hover:text-white text-white font-bold py-1 px-4 border border-green-600 rounded flex items-center gap-2 " >
          <FaPlus ></FaPlus>
          <Link to="/admin/create-vouche" className="flex items-center space-x-2  hover:text-white">
            Thêm mã
          </Link>
        </button>
      </header>
      <div className="flex mb-5 mt-10">
        <div className="mr-5">
          <Input onChange={onChangeSearchName} allowClear style={{ width: 300 }}
            placeholder="Tìm kiếm mã giảm giá" />
        </div>
        <div className="mr-5">
          <Select
            onChange={onChangeSelect}
            placeholder="Trạng thái"
            style={{ width: 300 }}
            options={[
              { value: '1', label: 'Tất cả' },
              { value: '2', label: 'Hoạt động' },
              { value: '3', label: 'Đã sử dụng' },
            ]}
          />
        </div>
        <div className="mr-5">
          <DatePicker.RangePicker onChange={handleSearchDate} />
        </div>
        <button onClick={handleFilter} className="bg-green-700 hover:bg-green-600 hover:text-white  text-white font-bold py-1 px-4 border border-green-600 rounded flex items-center">
          <FaSearch></FaSearch>
          <span className="ml-1">Tìm kiếm</span>
        </button>
      </div>
      <Table dataSource={dataSource} columns={columns} />

    </div>
  );
};

export default Vouche;
