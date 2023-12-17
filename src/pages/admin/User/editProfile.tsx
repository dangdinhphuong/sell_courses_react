import { useGetOneUserQuery, useUpdateUserMutation } from "@/Api/userApi";
import { IUsers } from "@/interface/user";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import { Skeleton } from "antd";
import React, { useEffect, useState , message} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Form, Input, Select, Upload } from "antd";
import { UploadOutlined } from '@ant-design/icons';

const EditProfile = () => {
  const [userData, setUserData] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();
  type FieldType = {
    name: string;
    email: number | string;
    img: string | number;
    phoneNumber: number
  };

  const handleChange = (info:any) => {    
    // if (info.file.status === 'done') {
    //   // Nếu bạn muốn xem trước hình ảnh ngay khi tệp đã tải lên thành công
    //   setPreviewImage(URL.createObjectURL(info.file.originFileObj));
    //   message.success(`${info.file.name} file uploaded successfully`);
    // } else if (info.file.status === 'error') {
    //   message.error(`${info.file.name} file upload failed.`);
    // }
  };

  const beforeUpload = (file: any) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      // Cập nhật xem trước hình ảnh
      setPreviewImage(reader.result);
    };
    return false; // Không thực hiện tải lên ngay lúc này
  };
  // Định nghĩa giá trị ban đầu cho các trường thông tin người dùng

  const { idUser } = useParams<{ idUser: string }>();
  const { data: productData, isLoading } = useGetOneUserQuery(idUser || "");
  const [updateUser] = useUpdateUserMutation();
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue({
      name: productData?.name,
      email: productData?.email,
      img: productData?.img,
      phoneNumber: productData?.phoneNumber,
    });
  }, [productData]);

  const onFinish = (values: IUsers) => {
    updateUser({ ...values, _id: idUser })
      .unwrap()
      .then((response) => {
        // Cập nhật trạng thái của ứng dụng với thông tin mới
        setUserData(response);

        // Kiểm tra nếu có sự thay đổi trong response
        if (JSON.stringify(response) !== JSON.stringify(productData)) {
          // Lưu thông tin người dùng mới vào localStorage
          localStorage.setItem("userInfo", JSON.stringify(response));
        }

        // window.location.reload();

      });

    // navigate(`/profile/${productData?._id}`, { replace: true });

  };

  return (
    <div className="flex justify-center">
      <header className="pt-[128px] w-[800px] mb-4">
        <div className="bg-gray-100 p-4 rounded-lg shadow-lg text-center">
          <h2 className="font-bold text-3xl my-4">Sửa Lại Người Dùng : {productData?.name}</h2>
          {isLoading ? (
            <Skeleton />
          ) : (
            <Form
              form={form}
              name="basic"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ maxWidth: 600 }}
              onFinish={onFinish}
              autoComplete="off"
            >
              <div className="grid grid-cols-1 gap-4">
                <Form.Item label="Name" name="name" className="mb-0" style={{ paddingTop: '18px' }}>
                  <Input className="w-full h-[3rem]" />
                </Form.Item>

                <Form.Item label="Email" name="email" className="mb-0">
                  <Input className="w-full h-[3rem]" />
                </Form.Item>

                <Form.Item label="Avatar" className="mb-0">
                  <Upload
                      showUploadList={false} // Ẩn danh sách tải lên mặc định của Ant Design
                      beforeUpload={beforeUpload}
                      onChange={handleChange}
                      className="flex"
                    >
                      <Button icon={<UploadOutlined />}>Select Image</Button>
                  </Upload>
                    {previewImage && (
                      <div className="mt-3">
                        <img className="rounded-full object-cover" src={previewImage} style={{ width:50,height:50}} />
                      </div>
                    )}
                </Form.Item>

                <Form.Item label="Phone Number" name="phoneNumber" className="mb-0">
                  <Input className="w-full h-[3rem]" />
                </Form.Item>
              </div>

              <Form.Item className="my-4" wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" danger htmlType="submit" className="mr-2">
                  {isLoading ? (
                    <AiOutlineLoading3Quarters className="animate-spin" />
                  ) : (
                    "Thêm"
                  )}
                </Button>
                <Button
                  className="bg-yellow-500 text-white"
                  onClick={() => navigate("/profile")}
                >
                  Quay lại
                </Button>
              </Form.Item>
            </Form>
          )}
        </div>
      </header>
    </div>

  );
};

export default EditProfile;