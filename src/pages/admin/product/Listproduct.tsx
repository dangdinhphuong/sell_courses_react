import {
  useGetProductsQuery,
  useRemoveProductMutation,
  useUpdateProductShowWebMutation
} from "@/Api/productApi";
import { IProduct } from "@/interface/products";
import {
  Table,
  Skeleton,
  Alert,
  Image,
  Button,
  Dropdown,
  Space,
  Menu,
  Switch,
  Input,
  Select,
  notification
} from "antd";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import "../../../css/swidth.css";
import { IoTrashOutline } from "react-icons/io5";
import { AiOutlineEdit } from "react-icons/ai";
import { FaPlus, FaSearch } from "react-icons/fa";
import { AiOutlineEye, AiFillEye } from "react-icons/ai";
import { useState, useMemo, useEffect } from "react";
import { isEmpty } from "@/utils/validate"
import { formatNumber } from "@/utils/formats"
import "./index.css";
const Listproduct = () => {
  const [free, setFree] = useState(true);
  const [query, setQuery] = useState()
  const handleBulkDelete = () => {
    // Kiểm tra xem có ô trống nào được chọn không
    if (checkedIds.length === 0) {
      return;
    }

    // Hiển thị xác nhận xóa hàng loạt
    Swal.fire({
      title: "Bạn chắc chắn muốn xóa nhữ gì đã chọn chứ?",
      text: "Lưu ý : Bạn sẽ không thể hủy nếu đồng ý!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Đồng Ý",
      cancelButtonText: "Thoát", // Thay đổi chữ "Hủy" thành "Thoát"
      customClass: {
        popup: "swal2-popup swal2-modal swal2-icon-warning swal2-show",
      },
    }).then((result) => {
      if (result.isConfirmed && result.dismiss !== Swal.DismissReason.cancel) {
        // Lặp qua các ID đã chọn và xóa chúng
        checkedIds.forEach((id) => {
          removeProduct(id);
        });

        // Sau khi xóa xong, cập nhật lại danh sách checkedIds
        setCheckedIds([]);
      }
    });
  };
  const handleMenuItemClick = ({ key, _id }: any) => {
    if (key === "1") {
    } else if (key === "2") {
    }
  };
  const [checkedIds, setCheckedIds] = useState<number[]>([]);

  const handleCheckboxChange = (id: number) => {
    if (checkedIds.includes(id)) {
      // Nếu ID đã tồn tại trong mảng, loại bỏ nó
      setCheckedIds(checkedIds.filter((checkedId) => checkedId !== id));
    } else {
      // Nếu ID không tồn tại trong mảng, thêm nó vào
      setCheckedIds([...checkedIds, id]);
    }
    console.log("đã lấy được id:", id);
  };
  const onChangeShowWeb = (obj: any) => {
    const index = dataSource.findIndex(item => item._id == obj._id)
    console.log(dataSource);

    console.log("index", index);

    const objNew = { ...obj, isShowWeb: 1 }

    dataSource[index] = objNew
    console.log(obj);
  };
  const { data: productData, isLoading, refetch: refetchProductData } = useGetProductsQuery(query);
  const [updateProductShowWeb] = useUpdateProductShowWebMutation();

  console.log("productdata:", productData);
  const onChangeSearchName = (e) => {
    console.log(e.target.value);
    setQuery((prev) => {
      return { ...prev, q: e.target.value.trim() }
    })
  }
  const onChangeSelect = (val) => {
    setQuery((prev) => {
      return { ...prev, type: val }
    })
  }
  const [
    removeProduct,
    { isLoading: isRemoveLoading, isSuccess: isRemoveSuccess },
  ] = useRemoveProductMutation();

  const confirm = (id: number) => {
    Swal.fire({
      title: "Bạn chắc chắn muốn xóa chứ?",
      text: "Lưu ý : Bạn sẽ không thể hủy nếu đồng ý '!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: " Đồng ý",
      cancelButtonText: "Thoát", // Thay đổi chữ "Hủy" thành "Thoát"
      customClass: {
        popup: "swal2-popup swal2-modal swal2-icon-warning swal2-show", // Áp dụng quy tắc CSS trực tiếp
      },
    }).then((result) => {
      if (result.isConfirmed && result.dismiss !== Swal.DismissReason.cancel) {
        removeProduct(id);
      }
    });
  };
  const handleShowWeb = (_id, isShowWeb) => {
    console.log("__________", _id, isShowWeb);

    Swal.fire({
      title: isShowWeb != 1 ? "Bạn Chắc Chắn Muốn Hiển Thị Khóa Học Này" : "Bạn Chắc Chắn Muốn Ẩn Khóa Học Này",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Đồng Ý!",
      customClass: {
        popup: "swal2-popup swal2-modal swal2-icon-warning swal2-show",
      },
    }).then((result) => {
      if (result.isConfirmed && result.dismiss !== Swal.DismissReason.cancel) {
        console.log("__________", _id, isShowWeb);
        const isShow = isShowWeb != 1 ? 1 : 0
        updateProductShowWeb({ _id, isShowWeb: isShow }).then((res) => {
          console.log("____________res update", res);
          notification.success({
            message: "Thông báo",
            description: res?.message || "Cập nhật thành công",
            placement: 'top',
          });
        }
        )
      }
    });
  }
  const items = [
    {
      key: "1",
      label: "Danh sách đánh giá",
    },
    {
      key: "2",
      label: "Danh sách bình Luận",
    },
  ];
  const dataSource = useMemo(() => {
    const result = free
      ? productData?.data?.filter((data) => data.price !== "0")
      : productData?.data
        ?.filter((data) => data.price == "0")
        .map(({ _id, name, price, img, description, isShowWeb }: IProduct) => ({
          key: _id,
          name,
          price,
          img,
          description,
          id: _id,
          isShowWeb
        })) || [];
    return result
  }, [free, productData])
  console.log("datasoure :", dataSource);
  const columns = [
    {
      title: "Tên khóa học",
      dataIndex: "name",
      key: "name",
      render: (text: any, { key: _id }: any) => (
        <div className="name-style text-[16px]">{text}</div>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (text: any) => (<p>{formatNumber(text)}đ</p>)
    },
    {
      title: "Mô Tả",
      dataIndex: "description",
      key: "description",
      render: (text: any) => <div className="columnss-cell">{text}</div>,
    },
    {
      title: "Ảnh",
      dataIndex: "img",
      key: "img",
      render: (img: string) => (
        <Image src={img} alt="Ảnh" width={95} height={70} />
      ),
    },
    {
      title: "Trạng thái hiển thị",
      dataIndex: "isShowWeb",
      key: "isShowWeb",
      render: (isShowWeb: any, record: any) =>
        <Switch className="swidth-container" checked={isShowWeb != 1} onChange={() => handleShowWeb(record._id, isShowWeb)} checkedChildren="Show" unCheckedChildren="Hidden" />
    },
    {
      title: "",
      render: ({ _id }: any) => {
        return (
          <>
            <div className="flex items-center justify-center mr-auto">
              <Button
                style={{ paddingLeft: "4px" }}
                className=" w-7 h-7  mr-2"
                type="default"
              >
                <Link to={`/admin/product/detail/${_id}`}>
                  <AiOutlineEye className="text-xl text-primary text-black" />
                </Link>
              </Button>
              <Button
                className=" w-7 h-7 pl-1 mr-2"
                type="default"
                onClick={() => confirm(_id)}
              >
                <IoTrashOutline className="text-xl text-primary text-black" />
              </Button>
              <Button className=" w-7 h-7 pl-1 mr-2" type="default">
                <Link to={`/admin/product/edit/${_id}`}>
                  <AiOutlineEdit className="text-xl text-primary text-black" />
                </Link>
              </Button>

              <Dropdown
                overlay={
                  <Menu onClick={handleMenuItemClick}>
                    {items.map((item) => (
                      <Menu.Item key={item.key}>
                        {item.key === "1" ? (
                          <Link to={`/admin/product/ratings/${_id}`}>
                            {item.label}
                          </Link>
                        ) : (
                          <Link to={`/admin/product/comments/${_id}`}>
                            {item.label}
                          </Link> // Đổi URL tới danh sách bình luận
                        )}
                      </Menu.Item>
                    ))}
                  </Menu>
                }
                className=""
              >
                <Button>...</Button>
              </Dropdown>
              <label className="">
                <input
                  type="checkbox"
                  onChange={() => handleCheckboxChange(_id)}
                  className="w-6 h-6 pl-1 mt-2 ml-2 checkbox-style"
                />
              </label>
            </div>
          </>
        );
      },
    },
  ];
  const handleFilter = () => {
    refetchProductData()
  }
  return (
    <div>
      {/* <div className="space-x-5 mb-5">
        <Button onClick={() => setFree(false)}>Miễn phí</Button>
        <Button onClick={() => setFree(true)}>Có phí</Button>
      </div> */}

      <header className="mb-4 flex justify-between items-center">
        <h2 className="font-bold text-2xl">Quản lý khóa học</h2>
        <Button
          className=" w-32 h-10"
          type="primary"
          danger
          onClick={handleBulkDelete}
          disabled={checkedIds.length === 0}
        >
          Xóa Chọn
        </Button>

      </header>
      <div className="flex justify-between mb-5 mt-10">
        <div className="flex">
            <div className="mr-5">
            <Input allowClear onChange={onChangeSearchName} style={{ width: 300 }}
                placeholder="Tìm kiếm khóa học" />
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
        <div className="">
          <button className="bg-green-700 hover:bg-green-600 hover:text-white  text-white font-bold py-2 px-2 border border-green-600 rounded  flex items-center">
            <Link
              to="/admin/product/add"
              className="flex items-center space-x-1  hover:text-white justify-center text-sm"
            >
              <FaPlus></FaPlus>
              <span>Thêm khóa học mới</span>
            </Link>
          </button>
        </div>
      </div>
      {isRemoveSuccess && <Alert message="Xóa Thành Công!" type="success" />}
      {isLoading ? (
        <Skeleton />
      ) : (
        <Table dataSource={productData?.data || []} columns={columns} />
      )}
    </div>
  );
};

export default Listproduct;
