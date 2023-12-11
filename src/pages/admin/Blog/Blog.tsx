// import { useGetProductsQuery,useRemoveProductMutation } from "@/Api/productApi";
import {
  Table,
  Skeleton,
  Alert,
  Button,
  Form,
  Select,
  Input,
  Image,
} from "antd";
import { Link } from "react-router-dom";
import { IoTrashOutline } from "react-icons/io5";
import { AiOutlineEdit } from "react-icons/ai";
import Swal from "sweetalert2";
import './index.css'
import {  IUsers } from "@/interface/user";
import { IBlog } from "@/interface/Blog";
import { useState } from "react";
import { useDeleteBlogMutation, useGetAllBlogQuery } from "@/Api/Blog";
import { FaPlus } from "react-icons/fa";
type Props = {};
const Blog = (props: Props) => {
  const [filteredDataSource, setFilteredDataSource] = useState<IUsers[]>([]);

  const [form] = Form.useForm();
  const [filter, setFilter] = useState<any>({
    page: 1,
    size: 10,
    orderBy: null,
    ascending: null,
    name: null,
    phone: null,
  });
  const onFinish = (formValues: any) => {
    setFilter({
      ...filter,
      ...formValues,
    });
  };
  const handleBulkDelete = () => {
    // Kiểm tra xem có ô trống nào được chọn không
    if (checkedIds.length === 0) {
      return;
    }

    // Hiển thị xác nhận xóa hàng loạt
    Swal.fire({
      title: "Bạn chắc chắn muốn xóa những mục đã chọn?",
      text: " Lưu ý: Bạn sẽ không thể hủy nếu đồng ý!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Đồng Ý!",
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

  const { data: productBlog, isLoading, error } = useGetAllBlogQuery<any>();
  console.log("productUser:", productBlog);
  const [
    removeProduct,
    { isLoading: isRemoveLoading, isSuccess: isRemoveSuccess },
  ] = useDeleteBlogMutation();

  const confirm = (id: number) => {
    Swal.fire({
      title: "Bạn chắc chắn muốn xóa chứ?",
      text: "Lưu ý: Bạn sẽ không thể hủy nếu đồng ý '!",
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

  const dataSource = productBlog?.map(
    ({ _id, name, img, description, language }: IBlog) => ({
      key: _id,
      name,
      img,
      description,
      language,
    })
  );

  const columns = [
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      render:(text : any)=>(
        <div className="name-style">
            {text}
        </div>
    )
    },
    {
      title: "Ảnh",
      dataIndex: "img",
      key: "img",
      render: (img: string) => <Image src={img} alt="Ảnh" width={125} height={90} />,
    },
    {
      title: "Mô Tả",
      dataIndex: "description",
      key: "description",
      render: (text: any) => (
        <div className="columnss-cell" dangerouslySetInnerHTML={{ __html: text }} />
      )
    },
    {
      title: "Ngôn Ngữ",
      dataIndex: "language",
      key: "language",
      render: (text :any) => (
        <div
          className="size"
        >
          {text}
        </div>)
    },
    {
      title: "",
      render: ({ key:_id }: any) => {
        return (
          <>
            <div className="flex items-center justify-end mr-auto">
              <Button
                className="w-7 h-7 pl-1 mr-2"
                type="default"
                style={{ paddingLeft: '4px' }}
                onClick={() => confirm(_id)}
              >
                <IoTrashOutline className="text-xl text-primary text-black" />
              </Button>
              <Button style={{ paddingLeft: '4px' }} className="w-7 h-7 pl-1 mr-2" type="default" >
                <Link to={`/admin/blog/edit/${_id}`}>
                  <AiOutlineEdit className="text-xl text-primary text-black" />
                </Link>
              </Button>
              <label className="">
                <input
                  type="checkbox"
                  style={{}}
                  onChange={() => handleCheckboxChange(_id)}
                  className="w-6 h-6  mt-1 ml-1 checkbox-style"
                />
              </label>
            </div>
          </>
        );
      },
    },
  ];

  return (
    <div>
      <header className="mb-4 flex justify-between items-center">
        <h2 className="font-bold text-2xl">Quản Lý Tin Tức</h2>
        <button className="bg-green-700 hover:bg-green-600 hover:text-white pl-7 text-white font-bold py-1 px-4 border border-green-600 rounded w-48 h-10 flex items-center">
          <Link
            to="/admin/blog/add"
            className="flex items-center space-x-1  hover:text-white justify-center text-sm"
          >
            <FaPlus></FaPlus>
            <span>Thêm tin tức mới</span>
          </Link>
        </button>
        <Form
          form={form}
          name="horizontal_login"
          layout="inline"
          onFinish={onFinish}
        ></Form>
        <Button
          className=" w-32 h-10"
          type="primary"
          danger
          onClick={handleBulkDelete}
          disabled={checkedIds.length === 0}
        >
          Xóa tất cả
        </Button>
      </header>

      {isRemoveSuccess && (
        <Alert message="Xóa tin tức thành công" type="success" />
      )}
      {isLoading ? (
        <Skeleton />
      ) : (
        <Table
          dataSource={
            filteredDataSource.length > 0 ? filteredDataSource : dataSource
          }
          columns={columns}
        />
      )}
    </div>
  );
};

export default Blog;