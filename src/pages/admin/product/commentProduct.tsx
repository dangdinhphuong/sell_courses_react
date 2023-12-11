import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGetProductByIdQuery } from "@/Api/productApi";
import { Table, Skeleton, Button, Alert } from "antd";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { IoTrashOutline } from "react-icons/io5";
import Swal from "sweetalert2";
import { useRemoveCommentMutation } from "@/Api/CommentApi";
import { IComment } from "@/interface/comment";
import axios from "axios";
const CommentProduct = () => {
  const { idProduct }: any = useParams<{ idProduct: string }>();
  const {
    data: productData,
    isLoading,
    refetch,
  }: any = useGetProductByIdQuery(idProduct);
  console.log("vãi shit:", productData);
  const [
    removeComment,
    { isLoading: isRemoveLoading, isSuccess: isRemoveSuccess },
  ] = useRemoveCommentMutation();
const processComments = (comments : any) => {
  return comments?.map((comment : any) => {
    const newComment = {
      key: comment._id,
      comment: comment?.name,
      user: comment?.user?.name,
      status: comment.status,
      children: comment?.children ? processComments(comment?.children) : []
    };
    return newComment;
  });
};
  const dataSource = processComments(productData?.data?.comment2)
  const [hiddenComments, setHiddenComments]: any = useState({});
  const toggleHidden = (commetId: any) => {
    setHiddenComments((prevHiddenComments: any) => {
      const updatedHiddenComments = {
        ...prevHiddenComments,
        [commetId]: !prevHiddenComments[commetId], // Đảo trạng thái ẩn/hiện
      };

      // Lưu trạng thái ẩn/hiện vào localStorage
      localStorage.setItem(
        "hiddenComments",
        JSON.stringify(updatedHiddenComments)
      );
      return updatedHiddenComments;
    });
  };
  useEffect(() => {
    // Kiểm tra xem đã có trạng thái ẩn/hiện trong localStorage hay chưa
    const storedHiddenRatings = localStorage.getItem("hiddenComments");
    if (storedHiddenRatings) {
      setHiddenComments(JSON.parse(storedHiddenRatings));
    }
  }, []);
  const handelHidecomment = async (id: any) => {
    console.log(id);
    await axios.patch(`http://localhost:8088/api/edit/comment/${id}`,
     { status: "false" },
    );
    refetch();
  };
  const handelShowcomment = async (id: any) => {
    console.log(id);
    await axios.patch(`http://localhost:8088/api/edit/comment/${id}`,
     { status: "true" },
    );
    refetch();
  };
  // Xử lý khi người dùng nhấp vào nút xóa
  const handleRemoveComment = (commentId: number) => {
    console.log("_id of rating to be removed:", commentId);
    Swal.fire({
      title: "Bạn Chắc Chắn Muốn Xóa chứ?",
      text: "Bạn sẽ không thể hủy nếu đồng ý '!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: " Oke Luôn!",
      customClass: {
        popup: "swal2-popup swal2-modal swal2-icon-warning swal2-show",
      },
    }).then((result) => {
      if (result.isConfirmed && result.dismiss !== Swal.DismissReason.cancel) {
        // Gọi mutation để xóa đánh giá và cập nhật trạng thái
        removeComment({ commentId: commentId, hidden: false }).then(() => {
          // Sau khi xóa thành công, cập nhật lại danh sách sản phẩm bằng cách fetch lại dữ liệu
          refetch();
        });
      }
    });
  };

  // Define columns for the ratings table
  const columns = [
  {
    title: "User",
    dataIndex: "user",
    key: "user",
    render: (text: any, record: any) => (
      <span className={`${hiddenComments[record.key] ? "opacity-50" : ""}`}>
        {text}
      </span>
    ),
  },
  {
    title: "Comment",
    dataIndex: "comment",
    key: "comment",
    render: (text: any, record: any) => (
      <span className={`${hiddenComments[record.key] ? "opacity-50" : ""}`}>
        {text}
      </span>
    ),
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    render: (status: string) => (
      <div>{status === "true" ? "Show" : "Hide"}</div>
    ),
  },
  {
    title: "Action",
    dataIndex: "key",
    key: "action",
    render: (id: string, record: any) => (
      <Button
        className=""
        onClick={() => {
          if (record.status === "true") {
            handelHidecomment(id);
          } else {
            handelShowcomment(id);
          }
        }}
      >
        {record.status === "true" ? <EyeOutlined /> : <EyeInvisibleOutlined />}
      </Button>
    ),
  },
];


  return (
    <div>
      <header className="mb-4 flex justify-between items-center">
        <h2 className="font-bold text-2xl">Quản lý Bình Luận</h2>
      </header>
      {isRemoveSuccess && <Alert message="Xóa Thành Công!" type="success" />}
      {isLoading ? (
        <Skeleton />
      ) : (
        <Table dataSource={dataSource} columns={columns} />
      )}
    </div>
  );
};

export default CommentProduct;