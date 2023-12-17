import React, { useState } from 'react';
import { Form, Input, Button, Select, notification, Image } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAddProductMutation } from '@/Api/productApi';
import { useGetCategorysQuery } from '@/Api/categoryApi';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
const Addproduct = () => {
  const [addProduct, { isLoading }] = useAddProductMutation();
  const navigate = useNavigate();
  const { data: categoryData } = useGetCategorysQuery();
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [paymentContent, setPaymentContent] = useState('')
  const onFinish = (values: any) => {
    // Cắt bỏ khoảng trắng ở hai đầu dữ liệu
    const trimmedValues = Object.fromEntries(
      Object.entries(values).map(([key, value]) => [
        key,
        typeof value === "string" ? value.trim() : value,

      ])
    );

    const formData: any = new FormData();
    formData.append("name", trimmedValues.name);
    formData.append("price", trimmedValues.price);
    formData.append("img", selectedImageFile);
    formData.append("description", trimmedValues.description);
    formData.append("categoryId", trimmedValues.categoryId);
    formData.append("paymentContent", trimmedValues.paymentContent);
    formData.append("isShowWeb", trimmedValues.isShowWeb);

    console.log(formData);

    addProduct(formData)
      .unwrap()
      .then(() => {
        navigate("/admin/products");
        notification.success({
          message: "Success",
          description: "Product added successfully!",
        });
      })
      .catch((error) => {
        console.error("Error adding product:", error);
        notification.error({
          message: "Error",
          description: "Failed to add product. Please try again.",
        });
      });
  };

  const handleImageChange = (event: any) => {
    const file = event.target.files[0];
    setSelectedImageFile(file);

    // Hiển thị ảnh trước khi tải lên
    const reader = new FileReader();
    reader.readAsDataURL(file);
  };


  const numberPattern = /^[0-9]*$/;
  return (
    <div>
      <header className="mb-4">
        <h2 className="font-bold text-2xl">Thêm khóa học</h2>
      </header>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Tên khóa học"
          name="name"
          rules={[
            { required: true, message: "Vui lòng nhập tên khóa học!" },
            {
              whitespace: true,
              message: "Tên khóa học không được chỉ chứa khoảng trắng!",
            },
            { min: 3, message: "Tên khóa học ít nhất 3 ký tự" },
            { max: 100, message: "Tên khóa học nhiều nhất 100 ký tự" },
            {
              pattern: /^[a-zA-Z0-9À-ỹ ]*$/,
              message: "Tên khóa học học chỉ được chứa chữ cái, số ",
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
          {selectedImageFile && (
            <Image
              width={150}
              src={URL.createObjectURL(selectedImageFile)}
              alt="Preview"
            />
          )}
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </Form.Item>
        <Form.Item
          label="Giá khóa học"
          name="price"
          rules={[
            { required: true, message: "Vui lòng nhập giá khóa học!" },
            { pattern: numberPattern, message: "Sai định dạng giá chỉ được nhập số dương" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Mô tả"
          name="description"
          rules={[
            { required: true, message: "Vui lòng nhập mô tả!" },
            { min: 10, message: "Mô tả khóa học ít nhất 10 ký tự" },
            {
              whitespace: true,
              message: "Mô tả khóa học không được chỉ chứa khoảng trắng!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Danh Mục" name="categoryId" rules={[{ required: true, message: 'Vui lòng nhập category!' }]}>
          <Select>
            {categoryData?.data.map(({ _id, name }) => (
              <Select.Option key={_id} value={_id}>
                {name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Trạng thái hiển thị" name="isShowWeb" >
          <Select defaultValue="Hiển thị"

            options={[
              { value: '0', label: 'Hiển thị' },
              { value: '1', label: 'Không hiển thị' },
            ]}>

          </Select>
        </Form.Item>

        <Form.Item label="Nội Dung Khóa Học" name="paymentContent" className='h-36'>
          <ReactQuill
            theme='snow'
            value={paymentContent}
            onChange={setPaymentContent}
            placeholder="Nhập nội dung khóa học..."
          />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" danger htmlType="submit">
            {isLoading ? 'Đang tải lên...' : 'Thêm'}
          </Button>
          <Button
            className="ml-2 bg-yellow-500 text-white"
            onClick={() => navigate('/admin/products')}
          >
            Quay lại
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Addproduct;
