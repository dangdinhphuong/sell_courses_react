import {
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from "@/Api/productApi";
import { useGetCategorysQuery } from "@/Api/categoryApi";
import { Category } from "@/interface/categorys";
import { IProduct } from "@/interface/products";
import {Button, Form, Input, Skeleton, Select, Image, notification} from "antd";
import React, {useEffect, useState} from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import { useGetOneUserQuery, useUpdateUserMutation } from "@/Api/userApi";
import { IUsers } from "@/interface/user";
type FieldType = {
  name: string;
  email: number | string;
  img: string | number;
  phoneNumber: number
};
const EditUser = () => {
  const { idUser } = useParams<{ idUser: string }>();
  const { data: userData, isLoading }: any = useGetOneUserQuery(idUser || "");
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [updateUser] = useUpdateUserMutation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  console.log("pro: ",userData);

  useEffect(() => {
    form.setFieldsValue({
      name: userData?.name,
      email: userData?.email,
      img: userData?.img,
      phoneNumber: userData?.phoneNumber,
    });
  }, [userData]);

  // const dataSource = categoryData?.map(({ _id, name,email }: IUsers) => ({
  //     key: _id,



  //     name,
  //     email,
  // }))

  const onFinish = (values: any) => {
    const trimmedValues: any = {
      name: typeof values.name === 'string' ? values.name.trim() : values.name,
      email: typeof values.email === 'string' ? values.email.trim() : values.email,
      phoneNumber: typeof values.phoneNumber === 'string' ? values.phoneNumber.trim() : values.phoneNumber,
    };

    const formData: any = new FormData();
    formData.append('name', trimmedValues.name);
    formData.append('email', trimmedValues.email);
    formData.append('phoneNumber', trimmedValues.phoneNumber);

    if (selectedImageFile) {
      formData.append('img', selectedImageFile);
    }

    const userData = {
      _id: idUser,
      ...values,
    };
    console.log('values', values);
    console.log('trimmedValues', trimmedValues);
    console.log('selectedImageFile', selectedImageFile);
    console.log('formData', formData);
    updateUser({ user: userData, formData: formData })
        .unwrap()
        .then(() => navigate('/admin/user')); // Chuyển hướng sau khi cập nhật
    notification.success({
      message: 'Success',
      description: 'User edit successfully!',
    });
  };
  const handleImageChange = (event: any) => {
    const file = event.target.files[0];
    setSelectedImageFile(file);

    // Cập nhật giá trị "img" trong "values" khi chọn tệp tin mới
    form.setFieldsValue({
      ...form.getFieldsValue(),
      img: file, // Sử dụng "file" thay vì giá trị "img" cũ
    });
  };

  return (
    <div>
      <header className="mb-4">
        <h2 className="font-bold text-2xl">
          Sửa Lại Người Dùng : {userData?.name}
        </h2>
      </header>
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
          <Form.Item<FieldType>
            label="Tên Người Dùng"
            name="name"
            rules={[
              { required: true, message: "Vui lòng nhập tên khóa học!" },
              {
                validator: (_, value) => {
                  const wordLength = value.trim().split(/\s+/).join('').length;
                  if (wordLength < 5) {
                    return Promise.reject("Tên phải chứa ít nhất 5 ký tự!");
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập giá khóa học!" },
              {
                validator: (_, value) => {
                  const wordLength = value.trim().split(/\s+/).join('').length;
                  if (wordLength < 10) {
                    return Promise.reject("Email phải chứa ít nhất 10 ký tự!");
                  }
                  return Promise.resolve();
                },
              },

            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
              label="Ảnh"
              name="img"
              rules={[{ required: true, message: "Vui lòng chọn ảnh!" }]}
          >
            <Image
                width={150}
                src={selectedImageFile ? URL.createObjectURL(selectedImageFile) : userData?.img}
            />
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </Form.Item>

          <Form.Item<FieldType>
            label="Số Điện Thoại"
            name="phoneNumber"
            rules={[
              { required: true, message: "Vui lòng nhập phone Number!" },
              {
                validator: (_, value) => {
                  const wordLength = value.trim().split(/\s+/).join('').length;
                  if (wordLength < 9) {
                    return Promise.reject("Số điện thoại phải chứa ít nhất 9 ký tự!");
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input />
          </Form.Item>
          {/*
                    <Form.Item label="category" name="categoryId"
                    rules={[
                        { required: true, message: "Vui lòng nhập category!" },
                    ]}
                    >
                        <Select>
                            {categoryData?.data.map(({ _id, name }: Category) => (
                                console.log(name),
                                <Select.Option key={_id} value={_id}>
                                    {name}
                                </Select.Option>
                            ))}
                        </Select>

                    </Form.Item> */}

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" danger htmlType="submit">
              {isLoading ? (
                <AiOutlineLoading3Quarters className="animate-spin" />
              ) : (
                "Sửa"
              )}
            </Button>
            <Button
              className="ml-2 bg-yellow-500 text-white "
              onClick={() => navigate("/admin/user")}
            >
              Quay lại
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default EditUser;
