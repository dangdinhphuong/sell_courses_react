// import { useGetProductsQuery,useRemoveProductMutation } from "@/Api/productApi";
import { useGetCategorysQuery, useRemoveCategoryMutation } from "@/Api/categoryApi";
import { Category } from "@/interface/categorys";
import { Table, Skeleton, Popconfirm, Alert, Button, notification } from "antd";
import { Link, Navigate } from "react-router-dom";
import { IoTrashOutline } from 'react-icons/io5';
import { AiOutlineEdit } from 'react-icons/ai';
import Swal from 'sweetalert2';
import { FaPlus } from "react-icons/fa";
type Props = {};
const Listcategory = (props: Props) => {
    const { data: categoryData, isLoading, error } = useGetCategorysQuery();

    const [removeProduct, { isLoading: isRemoveLoading, }] =
        useRemoveCategoryMutation();
    const confirm = (id: number) => {
        Swal.fire({
            title: 'Bạn chắn chắc muốn xóa chứ?',
            text: "Lưu ý : Bạn sẽ không thể hủy nếu đồng ý '!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: ' Đồng ý',
            cancelButtonText: "Thoát", // Thay đổi chữ "Hủy" thành "Thoát"
            customClass: {
                popup: 'swal2-popup swal2-modal swal2-icon-warning swal2-show', // Áp dụng quy tắc CSS trực tiếp
            },
        }).then((result) => {
            if (result.isConfirmed && result.dismiss !== Swal.DismissReason.cancel) {
                removeProduct(id);
                notification.success({
                    message: 'Success',
                    description: 'Product remove successfully!',
                });
            }
        })

    }
    console.log(categoryData?.data);


    const dataSource = categoryData?.data.map(({ _id, name }: Category) => ({
        key: _id,
        _id,
        name,
    }))

    const columns = [
        {
            title: "Id",
            dataIndex: "_id",
            key: "_id",
        },
        {
            title: "Tên ",
            dataIndex: "name",
            key: "name",
        },

        {
            title: "",
            render: ({ key: _id }: any) => {
                return (
                    <>
                        <div className="flex items-center justify-center mr-auto">
                            <Button className='w-9 h-8 pl-2 ml-2' type='default' onClick={() => confirm(_id)}>
                                <IoTrashOutline className="text-xl" />
                            </Button>
                            <Button className='w-9 h-8 pl-2 ml-2' type='default' >
                                <Link to={`/admin/category/edit/${_id}`} >
                                    <AiOutlineEdit className="text-xl" />
                                </Link>
                            </Button>
                        </div>

                    </>
                );
            },
        },
    ];

    return (
        <div>
            <header className="mb-4 flex justify-between items-center">
                <h2 className="font-bold text-2xl">Quản Lý Danh Mục</h2>
                <button className="bg-green-700 hover:bg-green-600 hover:text-white text-white font-bold py-1 px-4 border border-green-600 rounded flex items-center gap-2 " >
                    <FaPlus ></FaPlus>
                    <Link to="/admin/category/add" className="flex items-center space-x-2  hover:text-white">
                        Thêm danh mục
                    </Link>
                </button>
            </header>

            {isLoading ? <Skeleton /> : <Table dataSource={dataSource} columns={columns} />}
        </div>
    );
};

export default Listcategory;



