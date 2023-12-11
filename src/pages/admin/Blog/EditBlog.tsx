import {
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from "@/Api/productApi";
import { useGetCategorysQuery } from "@/Api/categoryApi";
import { Category } from "@/interface/categorys";
import { IProduct } from "@/interface/products";
import { Button, Form, Input, Skeleton, Select, notification,Image } from "antd";
import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import { useGetOneUserQuery, useUpdateUserMutation } from "@/Api/userApi";
import { IUsers } from "@/interface/user";
import { useGetOneBlogQuery, useUpdateBlogMutation } from "@/Api/Blog";
type FieldType = {
  name: string;
  img:  string ;
  description: string | number;
  language: string
};
const EditBlog = () => {
  const { idBlog } = useParams<{ idBlog: string }>();
  const { data: productData, isLoading } = useGetOneBlogQuery(idBlog || "");
  const [updateBlog] = useUpdateBlogMutation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  console.log(productData);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  useEffect(() => {
    form.setFieldsValue({
      name: productData?.name,
      img: productData?.img,
      description: productData?.description,
      language: productData?.language
    });
  }, [productData]);

  // const dataSource = categoryData?.map(({ _id, name,email }: IUsers) => ({
  //     key: _id,
  //     name,
  //     email,
  // }))

  const onFinish = (values) => {
    const formData: FormData = new FormData();
    formData.append('name', values.name);
    formData.append('description', values.description);
    formData.append('language', values.language);
    if (selectedImageFile) {
      formData.append('img', selectedImageFile);
    }
    console.log(formData);

    const productData = {
      _id: idBlog,
      ...values,
    };
    updateBlog({ blog: productData, formData })
      .unwrap()
      .then(() => navigate("/admin/blog"));
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
        <h2 className="font-bold text-2xl">
          Sửa Lại Blog : {productData?.name}
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
            label="Tên"
            name="name"
            rules={[
              { required: true, message: "Vui lòng nhập tên bài viết!" },
              {
                validator: (_, value) => {
                  const wordLength = value.trim().split(/\s+/).join('').length;
                  if (wordLength < 3) {
                    return Promise.reject("Tên phải chứa ít nhất 4 ký tự!");
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
          >
            <Image
              width={150}
              src={selectedImageFile ? URL.createObjectURL(selectedImageFile) : productData?.img}
            />
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </Form.Item>

          <Form.Item<FieldType>
            label="Mô Tả"
            name="description"
            rules={[
              { required: true, message: "Vui lòng nhập mô tả!" },
              {
                validator: (_, value) => {
                  const wordLength = value.trim().split(/\s+/).join('').length;
                  if (wordLength < 10) {
                    return Promise.reject("Mô tả cần ít nhất 10 ký tự!");
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input />
           
          </Form.Item>
          <Form.Item<FieldType>
  label="Ngôn Ngữ Lập Trình"
  name="language"
  rules={[
    { required: true, message: "Vui lòng nhập ngôn ngữ!" },
    {
      validator: (_, value) => {
        const wordLength = value.trim().split(/\s+/).join('').length;
        if (wordLength < 4) {
          return Promise.reject("Ngôn ngữ phải chứa ít nhất 4 ký tự!");
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
              onClick={() => navigate("/admin/blog")}
            >
              Quay lại
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default EditBlog;
