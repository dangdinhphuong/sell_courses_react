import userApi, { useSignUpMutation } from '@/Api/userApi';
import { useNavigate } from "react-router-dom";
import { IUsers } from '@/interface/user';
import React from 'react';
import { Button, Checkbox, Form, Input, Select, notification } from 'antd';
import { Option } from 'antd/es/mentions';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import "./signin_signup.css"
import { BiLogoGmail, BiSolidUser } from "react-icons/bi";
import { RiLockPasswordFill } from "react-icons/ri";
import { BsPhoneFill } from "react-icons/bs";
type FieldType = {
  name?: string;
  email?: string;
  phoneNumber: number;
  password?: string;
  confirmPassword?: string;
};

const Signup = () => {
  const [addsignup, { isLoading }] = useSignUpMutation();
  const navigate = useNavigate();
  const onFinish = (values: IUsers) => {
    addsignup(values)
      .unwrap()
      .then((response) => {
        // Kiểm tra nội dung thông điệp trong phản hồi để xác định loại thông báo
        if (response.message.includes("đã tồn tại")) {
          // Nếu thông điệp có chứa "đã tồn tại", hiển thị thông báo lỗi
          console.log(response.message); // Log ra console
          notification.error({
            message: 'Đăng ký thất bại',
            description: response.message,
          });
        } else {
          // Ngược lại, hiển thị thông báo thành công
          console.log(response.message); // Log ra console
          notification.success({
            message: 'Đăng ký thành công',
            description: response.message,
          });
          navigate("/signin");
        }
      })
      .catch((error) => {
        // Ghi ra console thông điệp lỗi
        console.error('Lỗi đăng ký:', error);
        // Hiển thị thông báo lỗi dựa trên phản hồi từ server
        const errorMessage = error.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.';
        notification.error({
          message: 'Lỗi',
          description: errorMessage,
        });
      });
  };
  return (
    // andt
    <div className="  lg:flex lg:justify-center">
      <div className="lg:w-[900px] h-[550px] mt-[50px] lg:flex justify-center text-center rounded-[20px] lg:shadow-custom   ">
        <div className="py-[50px]  ">
          <div className="lg:flex">

            <Form
              className="w-[100%] lg:w-[70%] px-6 lg:px-0" id="register-form"
              name="basic"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              autoComplete="off"
            >
              <h2 className="lg:mr-10 text-[40px] mb-[20px]">Đăng ký</h2>
              <Form.Item<FieldType>
                className="relative mb-[25px]"
                name="name"
                rules={[
                  {
                    required: true,
                    message: 'Bắt buộc phải nhập tên'
                  },
                  {
                    pattern: /^[^\s0-9]*$/,
                    message: 'Tên không được chứa khoảng trắng và số'
                  }
                ]}
              >
                <Input className="py-4 lg:py-0 input no-border-radius input-prefix-spacing w-full lg:w-[300px] lg:mr-[25px]" placeholder="Nhập tên của bạn" prefix={<BiSolidUser />} />

              </Form.Item>

              <Form.Item<FieldType>
                className="relative mb-[25px]"
                name="email"
                rules={[
                  { required: true, message: 'Bắt buộc phải nhập Email!' },
                  () => ({
                    validator(_, value) {
                      if (!value || /^[A-Za-z0-9]+@[A-Za-z0-9]+\.[A-Za-z]{2,}$/.test(value)) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Email không hợp lệ!'));
                    },
                  }),
                ]}

              >
                <Input className="py-4 lg:py-0 input no-border-radius input-prefix-spacing w-full lg:w-[300px] lg:mr-[25px]" placeholder="Nhập email của bạn" prefix={<BiLogoGmail />} />

              </Form.Item>

              <Form.Item<FieldType>
                className="relative mb-[25px]"
                name="phoneNumber"
                rules={[
                  { required: true, message: 'Bắt buộc phải nhập số điện thoại!' },
                  () => ({
                    validator(_, value) {
                      if (!value || /^(0|\+84)\d{8,}$/.test(value)) { // Kiểm tra có ít nhất 9 số
                        if (/^(0+|\+840+)$/.test(value)) {
                          return Promise.reject(new Error('Số điện thoại không được chỉ gồm số 0!'));
                        }
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Số điện thoại phải bắt đầu bằng số 0 hoặc +84, có ít nhất 9 số và không chứa khoảng trắng hay chữ cái!'));
                    },
                  }),
                ]}


              >
                <Input className="py-4 lg:py-0 input no-border-radius input-prefix-spacing w-full lg:w-[300px] lg:mr-[25px]" placeholder="Nhập số điện thoại của bạn" prefix={<BsPhoneFill />} />

              </Form.Item>

              <Form.Item<FieldType>
                className="relative mb-[25px]"
                name="password"
                rules={[
                  { required: true, message: 'Hãy nhập mật khẩu' },
                  { min: 6, message: 'Mật khẩu phải dài hơn 6 ký tự' },
                  () => ({
                    validator(_, value) {
                      if (!value || /^\S{6,}$/.test(value)) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Mật khẩu không được chứa khoảng trắng và phải dài hơn 6 ký tự!'));
                    },
                  }),
                ]}

              >
                <Input.Password className="py-4 lg:py-0 input no-border-radius input-prefix-spacing w-full lg:w-[300px] lg:mr-[25px]" placeholder="Nhập mật khẩu của bạn" prefix={<RiLockPasswordFill />} />
              </Form.Item>
              <Form.Item<FieldType>
                className="relative mb-[25px]"
                name="confirmPassword"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập lại mật khẩu!',
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Mật khẩu mới mà bạn đã nhập không khớp!'));
                    },
                  }),
                ]}
              >
                <Input.Password className="py-4 lg:py-0 input no-border-radius input-prefix-spacing w-full lg:w-[300px] lg:mr-[25px]" placeholder="Nhập mật khẩu của bạn" prefix={<RiLockPasswordFill />} />
              </Form.Item>


              <Form.Item className=''>
                <Button className=' lg:mr-[45px] my-auto hover:scale-105 duration-300 text-[20px] w-[200px] bg-[#537FE7] hover:bg-[#C0EEF2] hover:text-white text-white h-[50px] ' htmlType="submit">
                  {isLoading ? (
                    <AiOutlineLoading3Quarters className="animate-spin" />
                  ) : (
                    "Đăng ký"
                  )}
                </Button>

              </Form.Item>
            </Form>

            <div className="login-image ml-4 hidden lg:block">
              <img className="w-[400px] h-[300px] " src="../../../public/img/signup.jpg" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup