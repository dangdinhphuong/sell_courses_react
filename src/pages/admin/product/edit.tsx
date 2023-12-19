import React, { useState, useEffect } from 'react';
import { useGetProductByIdQuery, useUpdateProductMutation } from "@/Api/productApi";
import { useGetCategorysQuery } from "@/Api/categoryApi";
import { Category } from "@/interface/categorys";
import { Button, Form, Input, Skeleton, Select, Image, notification } from "antd";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'
import 'react-quill/dist/quill.bubble.css';
const EditProduct = () => {
  const { idProduct } = useParams<{ idProduct: string }>();
  console.log("idProduct", idProduct);

  const { data: productData, isLoading }: any = useGetProductByIdQuery(idProduct || "");
  const [updateProduct] = useUpdateProductMutation();
  const navigate = useNavigate();
  const [paymentContent, setPaymentContent] = useState('')
  const [form] = Form.useForm();
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  useEffect(() => {
    form.setFieldsValue({
      name: productData?.data.name,
      price: productData?.data.price,
      img: productData?.data.img,
      description: productData?.data.description,
      categoryId: productData?.data.categoryId?._id,
      paymentContent: productData?.data.paymentContent,
      isShowWeb: productData?.data.isShowWeb
    });
  }, [productData]);

  const { data: categoryData } = useGetCategorysQuery();

  const onFinish = (values: any) => {
    const trimmedValues = Object.fromEntries(
      Object.entries(values).map(([key, value]) => [
        key,
        typeof value === "string" ? value.trim() : value,

      ])
    );

    const formData: any = new FormData();
    formData.append("name", trimmedValues.name);
    formData.append("price", trimmedValues.price);
    formData.append("description", trimmedValues.description);
    formData.append("categoryId", trimmedValues.categoryId);
    formData.append("paymentContent", trimmedValues.paymentContent);
    formData.append("isShowWeb", trimmedValues.isShowWeb);

    if (selectedImageFile) {
      formData.append('img', selectedImageFile);
    }
    console.log('values', values);
    console.log('trimmedValues', trimmedValues);
    console.log('selectedImageFile', selectedImageFile);
    console.log('formData', formData);

    const productData = {
      _id: idProduct,
      ...values,
    };

    updateProduct({ product: productData, formData: formData })
      .unwrap()
      .then(() => navigate('/admin/products')); // Chuyển hướng sau khi cập nhật
    notification.success({
      message: 'Success',
      description: 'Product edit successfully!',
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
  const numberPattern = /^[0-9]*$/;

  return (
    <div>
      <header className="mb-4">
        <h2 className="font-bold text-2xl">Sửa khóa học : {productData?.data.name}</h2>
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
                message: "Tên khóa học chỉ được chứa chữ cái, số ",
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
              src={selectedImageFile ? URL.createObjectURL(selectedImageFile) : productData?.data.img}
            />
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
          <Form.Item
            label="Category"
            name="categoryId"
            rules={[
              { required: true, message: "Vui lòng nhập category!" },
            ]}
          >
            <Select>
              {categoryData?.data.map(({ _id, name }: Category) => (
                <Select.Option key={_id} value={_id}>
                  {name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>


          <Form.Item label="Trạng thái hiển thị" name="isShowWeb" >
            <Select>
              <Select.Option value={0}>Hiển thị</Select.Option>
              <Select.Option value={1}>Không hiển thị</Select.Option>
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
              {isLoading ? (
                <AiOutlineLoading3Quarters className="animate-spin" />
              ) : (
                "Sửa"
              )}
            </Button>
            <Button
              className="ml-2 bg-yellow-500 text-white"
              onClick={() => navigate("/admin/products")}
            >
              Quay lại
            </Button>
          </Form.Item>
        </Form>
      )
      }
    </div >
  );
};

export default EditProduct;
