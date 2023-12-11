
import { useParams } from "react-router-dom";
import { Form, Button, Input,  } from "antd";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useAddQuizzMutation } from "@/Api/quizz";
import { Quizz } from "@/interface/quizzs";



const Addquizz = () => {
  const { idLesson } = useParams<{ idLesson: string }>();
  const [addquizz, { isLoading }] = useAddQuizzMutation();
  const navigate = useNavigate();
  const onFinish = (values: Quizz) => {
    const trimmedValues = Object.fromEntries(
      Object.entries(values).map(([key, value]) => [
        key,
        typeof value === "string" ? value.trim() : value,
      ])
    );
  
    addquizz(trimmedValues)
      .unwrap()
      .then(() => {
        navigate(`/admin/lesson/detail/${idLesson}`);
        window.location.reload();
      });
  };

  return (
    <div>
      <header className="mb-4">
        <h2 className="font-bold text-2xl">Thêm câu hỏi </h2>
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
          label="Câu hỏi"
          name="name"
          rules={[
            { required: true, message: "Vui lòng nhập câu hỏi!" },
            { min: 5, message: "Sản phẩm ít nhất 5 ký tự" },
            {
              whitespace: true,
              message: "câu hỏi mục không được chỉ chứa khoảng trắng!",
            }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="câu trả lời đúng"
          name="correctAnswer"
          rules={[
            { required: true, message: "Vui lòng nhập đáp án câu hỏi!" },
            {
              whitespace: true,
              message: "Câu trả lời không được chỉ chứa khoảng trắng!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="câu trả lời 1"
          name="Wronganswer1"
          rules={[
            { required: true, message: "Vui lòng nhập đáp án câu hỏi!" },
            {
              whitespace: true,
              message: "Câu trả lời không được chỉ chứa khoảng trắng!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="câu trả lời 2"
          name="Wronganswer2"
          rules={[
            { required: true, message: "Vui lòng nhập đáp án câu hỏi!" },
            {
              whitespace: true,
              message: "Câu trả lời không được chỉ chứa khoảng trắng!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="câu trả lời 3"
          name="Wronganswer3"
          rules={[
            { required: true, message: "Vui lòng nhập đáp án câu hỏi!" },
            {
              whitespace: true,
              message: "Câu trả lời không được chỉ chứa khoảng trắng!",
            },
          ]}
        >
          <Input />
        </Form.Item>

       
        <Form.Item
          label="lessonId"
          name="lessonId"
          initialValue={idLesson} // Đặt giá trị mặc định bằng lessonId
          className="pointer-events-none"// Vô hiệu hóa trường nhập
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
            className="ml-2 bg-yellow-500 text-white"
            onClick={() => navigate(`/admin/lesson/detail/${idLesson}`)}
          >
            Quay lại
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Addquizz;
