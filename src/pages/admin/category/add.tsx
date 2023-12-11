import { useAddCategoryMutation } from "@/Api/categoryApi";
import { IProduct } from "@/interface/products";
import { Form, Button, Input, notification } from "antd";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
type FieldType = {
  name: string;
};
const Addcategory = () => {
  const [addCategory, { isLoading }] = useAddCategoryMutation();
  const navigate = useNavigate();
  const onFinish = (values:any) => {
    const trimmedName = values.name.trim();
    // Gán giá trị đã được cắt khoảng trắng lại cho thuộc tính name
    values.name = trimmedName;
    addCategory(values)
      .unwrap()
      .then(() => navigate("/admin/categorys"));
    navigate("/admin/categorys");
    notification.success({
      message: "Success",
      description: "Product added successfully!",
    });
  };

  return (
    <div>
      <header className="mb-4">
        <h2 className="font-bold text-2xl">Thêm danh mục</h2>
      </header>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
<Form.Item
  label="Tên sản phẩm"
  name="name"
  rules={[
    { required: true, message: "Vui lòng nhập category!" },
    { min: 5, message: "Tên danh mục ít nhất 5 ký tự" },
    {
      whitespace: true,
      message: "Tên danh mục không được chỉ chứa khoảng trắng!",
    },
    {
      pattern: /^[a-zA-Z0-9À-ỹ ]*$/,
      message: "Tên danh mục chỉ được chứa chữ cái,số ",
    },
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
      </Form>
    </div>
  );
};

export default Addcategory;
