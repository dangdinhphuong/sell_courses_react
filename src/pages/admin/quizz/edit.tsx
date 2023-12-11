import { Button, Form, Input, Skeleton, Select } from "antd";
import { useEffect } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import { Lesson } from "@/interface/lessons";
import { useGetQuizzByIdQuery, useUpdateQuizzMutation } from "@/Api/quizz";
import { Quizz } from "@/interface/quizzs";
type FieldType = {
  name: string;
  correctAnswer: string;
  Wronganswer1: string;
  Wronganswer2: string;
  Wronganswer3: string;
  lessonId: string | number;
};
const EditQuizz = () => {
  const { idQuizz } = useParams<{ idQuizz: string }>();
  const { data: quizzData, isLoading } = useGetQuizzByIdQuery(idQuizz || "");
  const [updatequizz] = useUpdateQuizzMutation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  console.log(idQuizz);

  console.log(quizzData);

  useEffect(() => {
    form.setFieldsValue({
      name: quizzData?.data.name,
      correctAnswer: quizzData?.data.correctAnswer,
      Wronganswer1: quizzData?.data.Wronganswer1,
      Wronganswer2: quizzData?.data.Wronganswer2,
      Wronganswer3: quizzData?.data.Wronganswer3,
      lessonId: quizzData?.data.lessonId._id,
    });
  }, [quizzData]);
  console.log(quizzData?.data._id);

  const onFinish = (values: Quizz) => {
    updatequizz({ ...values, _id: idQuizz })
      .unwrap()
      .then(() =>
        navigate(`/admin/lesson/detail/${quizzData?.data.lessonId._id}`)
      );
  };
  const numberPattern = /^[0-9]*$/;
  return (
    <div>
      <header className="mb-4">
        <h2 className="font-bold text-2xl">Sửa câu hỏi</h2>
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
            label="Câu hỏi"
            name="name"
            rules={[
              { required: true, message: "Vui lòng nhập câu hỏi!" },
              { min: 5, message: "Sản phẩm ít nhất 5 ký tự" },
              {
                whitespace: true,
                message: "câu hỏi mục không được chỉ chứa khoảng trắng!",
              },
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
            className="pointer-events-none" // Vô hiệu hóa trường nhập
          >
            <Input />
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
              className="ml-2 bg-yellow-500 text-white "
              onClick={() =>
                navigate(`/admin/lesson/detail/${quizzData?.data.lessonId._id}`)
              }
            >
              Quay lại
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default EditQuizz;
