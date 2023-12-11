import { useGetCategorysQuery } from "@/Api/categoryApi";
import { Category } from "@/interface/categorys";
import { IProduct } from "@/interface/products";
import { Form, Button, Input } from "antd";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useAddBlogMutation } from "@/Api/Blog";
import { useEffect, useState } from "react";
import { useForm } from "antd/es/form/Form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import các kiểu CSS mặc định của React-Quill
import "./index.css";

type FieldType = {
  nameUser: string;
  imgUser: string;
  name: string;
  img: string | null;
  description: string;
  language: string | null;
};
type UserType = {
  id: number;
  name: string;
  img: string | number;
  email: string;
  // ... other properties if any
} | null;
const CreateBlog = () => {
  const [userInfo, setUserInfo] = useState<UserType>(null);
  const [form] = useForm();
  const [quillContent, setQuillContent] = useState<string>("");

  console.log("1:", userInfo);
  useEffect(() => {
    const savedUser = localStorage.getItem("userInfo");
    if (savedUser) {
      setUserInfo(JSON.parse(savedUser));
    }
  }, []);
  console.log("userInfor:", userInfo);
  const nameUser = userInfo?.userData.name;
  const imgUser = userInfo?.userData.img;
  form.setFieldsValue({ nameUser });
  form.setFieldsValue({ imgUser });
  console.log("userd:", nameUser);
  console.log("img:", imgUser);
  const [addProduct, { isLoading }] = useAddBlogMutation();
  const navigate = useNavigate();
  const onFinish = (values: IProduct) => {
    addProduct(values)
      .unwrap()
      .then(() => navigate("/home"));
  };
  const quillModules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["code-block", "blockquote"],
    ],
  };

  const quillFormats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
    "align",
    "script",
    "color",
    "background",
  ];
  const toolbarOptions = [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["code-block", "blockquote"],
  ];
  return (
    <div className="flex justify-center h-[1000px] items-center   w-[1500px]">
      <div className="pt-3 -mt-36 bg-white rounded-lg shadow-md form-container w-full flex flex-col items-center ">
        <header className="mb-4">
          <h2 className="font-bold text-2xl">Thêm Blog</h2>
        </header>
        <div className="w-full max-w-md ">
          <Form
            form={form}
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            onFinish={onFinish}
            autoComplete="off"
            className="w-[1182px] ml-[-504px]"
          >
            <Form.Item
              name="name"
              className="ml-[382px]"
              rules={[
                { required: true, message: "Vui lòng nhập tên Blog!" },
                { min: 5, message: "Tiêu đề ít nhất 5 ký tự" },
              ]}
            >
              <div className="input-container">
                <Input
                  placeholder="NHẬP TIÊU ĐỀ"
                  className="borderless-input text-2xl font-bold"
                />
              </div>
            </Form.Item>

            <Form.Item<FieldType>
              label="NỘI DUNG"
              name="description"
              rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
            >
              <ReactQuill
              theme="snow"
                modules={
                  {
                    toolbar: toolbarOptions
                  }
                }
                
                value={quillContent}
                onChange={setQuillContent}
              />
            </Form.Item>
            <Form.Item<FieldType>
              label="ẢNH"
              name="img"
              rules={[
                { required: true, message: "Vui lòng nhập img khóa học!" },
              ]}
            >
              <Input className="" />
            </Form.Item>
            <Form.Item<FieldType>
              label="NGÔN NGỮ"
              name="language"
              rules={[
                { required: true, message: "Vui lòng nhập ngôn ngữ!" },
                { min: 3, message: "khóa học ít nhất 3 ký tự" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" danger htmlType="submit">
                {isLoading ? (
                  <AiOutlineLoading3Quarters className="animate-spin" />
                ) : (
                  "Thêm"
                )}
              </Button>
              <Button
                className="ml-2  bg-yellow-500 text-white"
                onClick={() => navigate("/admin/products")}
              >
                Quay lại
              </Button>
            </Form.Item>
            <Form.Item<FieldType>
              name="nameUser"
              rules={[{ required: true, message: "Vui lòng nhập tên id!" }]}
            >
              <Input style={{ display: "none" }} />
            </Form.Item>
            <Form.Item<FieldType>
              name="imgUser"
              rules={[{ required: true, message: "Vui lòng nhập tên id!" }]}
            >
              <Input style={{ display: "none" }} />
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default CreateBlog;
