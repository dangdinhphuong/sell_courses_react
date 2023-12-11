import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"
import userApi, { useChangePasswordMutation, useLoginMutation } from '@/Api/userApi';
import { IUsers } from "@/interface/user";
import { useNavigate } from "react-router-dom";
import { Button, Checkbox, Form, Input, notification } from 'antd';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useDispatch } from 'react-redux';
import { BiLogoGmail } from "react-icons/bi";
import { RiLockPasswordFill } from "react-icons/ri";
import { RaceBy } from '@uiball/loaders'
import "./signin_signup.css"
type FieldType = {
  email?: string;
  confirmPassword?: string;
  newPassword?: string;
};
const ChangePassword = () => {
  const userInfoString = localStorage.getItem('userInfo');
  const storedUserInfo = userInfoString ? JSON.parse(userInfoString) : null;
  const initialEmail = storedUserInfo?.userData.email || "";

  const [changePassword] = useChangePasswordMutation();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const SET_USER = 'SET_USER';
  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);
  function setUser(user: IUsers) {
    return {
      type: SET_USER,
      payload: user
    };
  }
  const onFinish = (values: IUsers) => {
    changePassword(values)
      .unwrap()
      .then((user) => {
        // Lưu dữ liệu người dùng vào localStorage
        localStorage.setItem('userInfo', JSON.stringify(user));
        // localStorage.clear(); // This line should be removed unless you really intend to clear all local storage data.
        navigate("/signin"); // Redirect the user to the signin page after password change
        notification.success({
          message: 'Thành công',
          description: 'Thay đổi mật khẩu thành công. Vui lòng đăng nhập lại.',
        });
      })
      .catch((error) => {
        notification.error({
          message: 'Lỗi',
          description: error.data?.message || 'Thay đổi mật khẩu thất bại. Vui lòng thử lại.',
        });
      });
  };
  if (isLoading) {
    return <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
      <RaceBy size={100} lineWeight={6} speed={1.4} color="#47d1d1" />
      <div className="mt-2 text-black font-medium" style={{ color: '#70dbdb' }}>Loading</div>
    </div>
  }
  return (
    <div className=" lg:flex lg:justify-center">
    <div className="lg:w-[900px] h-[550px] mt-[50px] lg:flex justify-center text-center rounded-[20px] lg:shadow-custom   ">
      <div className="py-[75px] ">
        <div className="lg:flex">
            <Form
              name="basic"
              className='w-[100%] lg:w-[70%] px-6 lg:px-0'
              initialValues={{ remember: true, email: initialEmail }}
              onFinish={onFinish}
              autoComplete="off"
            >
              <h2 className="text-[40px] lg:mb-[33px]">Đổi mật khẩu</h2>
              <Form.Item<FieldType>
                className="relative mb-[25px]"
                name="email"
                rules={[{ required: true, message: 'Bắt buộc phải nhập Email!' }]}
              >
                <Input className="py-4 lg:py-0 input no-border-radius input-prefix-spacing w-full lg:w-[300px] lg:mr-[25px]" prefix={<BiLogoGmail />} placeholder="Nhập email của bạn" />
              </Form.Item>

              <Form.Item<FieldType>
                className="relative mb-[25px]"
                name="newPassword"
                rules={[{ required: true, message: 'Hãy nhập mật khẩu' }]}
              >
                <Input.Password className="py-4 lg:py-0 input no-border-radius input-prefix-spacing w-full lg:w-[300px] lg:mr-[25px]" prefix={<RiLockPasswordFill />} placeholder="Nhập mật khẩu của bạn" />
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
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Mật khẩu mới mà bạn đã nhập không khớp!'));
                    },
                  }),
                ]}
              >
                <Input.Password className="py-4 lg:py-0 input no-border-radius input-prefix-spacing w-full lg:w-[300px] lg:mr-[25px]" prefix={<RiLockPasswordFill />} placeholder="Nhập mật khẩu mới của bạn" />
              </Form.Item>

              <Form.Item >
                <Button className="lg:mr-[45px] mt-6 text-[20px] w-[140px] h-[50px] " type="primary" danger htmlType="submit">
                  {isLoading ? (
                    <AiOutlineLoading3Quarters className="animate-spin" />
                  ) : (
                    "Đổi mật khẩu"
                  )}
                </Button>
              </Form.Item>
            </Form>

            <div className="login-image ">
              <img className="w-[400px] h-[300px] hidden lg:block " src="../../../public/img/doimk.jpg" alt="" />

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChangePassword