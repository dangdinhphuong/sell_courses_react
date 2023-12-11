import { Button, Form, Input, Skeleton, Select } from "antd";
import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import { useGetLessonByIdQuery, useUpdateLessonMutation } from "@/Api/lesson";
import { Lesson } from "@/interface/lessons";
type FieldType = {
  name: string;
  video: File | null; // Sử dụng kiểu File cho trường video
  productId: string;
};
const EditLesson = () => {
  const { idLesson } = useParams<{ idLesson: string }>();
  const { data: lessonData, isLoading } = useGetLessonByIdQuery(idLesson || "");
  const [updateLesson, isLoadingdata] = useUpdateLessonMutation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
  const [isValidFileSize, setIsValidFileSize] = useState(true);
  const [videotime, setvideotime] = useState(0);
  useEffect(() => {
    form.setFieldsValue({
      name: lessonData?.data.name,
    });
  }, [lessonData]);

  const onFinish = (values: Lesson) => {
    const trimmedValues = Object.fromEntries(
      Object.entries(values).map(([key, value]) => [
        key,
        typeof value === "string" ? value.trim() : value,
      ])
    );
    const formData: any = new FormData();
    formData.append("name", trimmedValues.name);
    formData.append('videotime', videotime)
    // Thêm tệp video vào formData nếu nó tồn tại
    if (selectedVideoFile) {
      formData.append("video", selectedVideoFile);
    }

    formData.append("productId",lessonData?.data.productId._id);

    const LessonData = { ...values, _id: idLesson };
    updateLesson({ lesson: LessonData, formData: formData })
      .unwrap()
      .then(() =>
        navigate(`/admin/product/detail/${lessonData?.data.productId._id}`)      
      );
  };

  const handleVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file: any = event.target.files[0];
    console.log(file);

    if (file) {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        // Thời lượng video có sẵn trong video.duration (tính bằng giây)
        console.log('Thời lượng video:', video.duration);
        setvideotime(video.duration)
      };
      video.src = URL.createObjectURL(file);
      const fileSize: any = file.size / 1024 / 1024;
      if (fileSize > 25) {
        setIsValidFileSize(false);
      } else {
        setIsValidFileSize(true);
        setSelectedVideoFile(file);
      }
    }
  };
  return (
    <div>
      <header className="mb-4">
        <h2 className="font-bold text-2xl">
          Sửa khóa học : {lessonData?.data.name}
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
            label="Tên bài học"
            name="name"
            rules={[
              { required: true, message: "Vui lòng nhập tên bài học!" },
              {
                whitespace: true,
                message: "Tên bài học không được chỉ chứa khoảng trắng!",
              },
              { min: 3, message: "Tên bài học ít nhất 3 ký tự" },
              { max: 100, message: "Tên bài học nhiều nhất 100 ký tự" },
              {
                pattern: /^[a-zA-Z0-9À-ỹ ]*$/,
                message: "Tên bài học chỉ được chứa chữ cái, số ",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
        label="Video"
        name="video"
        rules={[
          {
            validator: (_) => {
              if (!isValidFileSize) {
                return Promise.reject('Video vượt quá dung lượng');
              }
              return Promise.resolve();
            },
          },
        ]}
      >
        <input type="file" accept="video/*" onChange={handleVideoChange} />
        {/* {selectedVideoFile ? (
          <div style={{ marginTop: '8px' }}>
            <video width="320" height="240" controls>
              <source
                src={URL.createObjectURL(selectedVideoFile)}
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          </div>
        ) : (
          lessonData?.data.video && (
            <div style={{ marginTop: '8px' }}>
              <video width="320" height="240" controls>
                <source src={lessonData?.data.video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )
        )} */}
      </Form.Item>
          

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" danger htmlType="submit">
            {!isLoadingdata ? 'Đang tải lên...' : 'Thêm'}
            </Button>
            <Button
              className="ml-2 bg-yellow-500 text-white"
              onClick={() =>
                navigate(
                  `/admin/product/detail/${lessonData?.data.productId._id}`
                )
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

export default EditLesson;
