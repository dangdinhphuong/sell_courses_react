import { Link } from "react-router-dom"
import userApi, { useLoginMutation } from '@/Api/userApi';
import { IUsers } from "@/interface/user";
import { useNavigate } from "react-router-dom";
import { Button, Checkbox, Form, Input, notification } from 'antd';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useDispatch } from 'react-redux';
import { UserOutlined, LockOutlined } from '@ant-design/icons'; // Import icons
import { BiLogoGmail } from "react-icons/bi";
import { RiLockPasswordFill } from "react-icons/ri";
import "./signin_signup.css"
import { useState } from "react";
type FieldType = {
  email?: string;
  password?: string;
};
const Signin = () => {
  const [signin, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const SET_USER = 'SET_USER';
  const [isAuthenticated, setIsAuthenticated] = useState(false);




  function setUser(user: IUsers) {
    return {
      type: SET_USER,
      payload: user
    };
  }
  const googleAuth = () => {
    window.localStorage.setItem('authInProgress', 'true');
    window.open(`http://localhost:8088/auth/google/callback`, "_self");
  };


  const onFinish = async (values: IUsers) => {
    try {
      const user = await signin(values).unwrap();
      // Serialize and save user data to local storage
      localStorage.setItem('userInfo', JSON.stringify(user));
      dispatch(setUser(user));
      navigate('/'); // Replace with your success route
      notification.success({
        message: 'Thành công',
        description: 'Đăng nhập thành công.',
      });
    } catch (error) {
      // It's a good practice to clear any potentially stale user data upon login failure
      localStorage.removeItem('user');
      notification.error({
        message: 'Lỗi',
        description: error.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra tài khoản hoặc mật khẩu.',
      });
    }
  };
  return (
    <div className=" lg:flex lg:justify-center ">
      <div className="lg:w-[900px] h-[550px] mt-[50px] lg:flex justify-center text-center rounded-[20px] lg:shadow-custom  ">
        <div className="py-[75px] ">
          <div className="lg:flex">
            <Form
              name="basic"
              className="w-[100%] lg:w-[70%] px-6 lg:px-0" id="register-form"

              initialValues={{ remember: true }}
              onFinish={onFinish}
              autoComplete="off"
            >
              <h2 className="lg:mr-10 text-[40px] mb-[33px]">Đăng nhập</h2>
              <Form.Item<FieldType>
                className="relative mb-[25px]"
                name="email"
                rules={[{ required: true, message: 'Bắt buộc phải nhập Email!' }]}
              >
                <Input className="py-4 lg:py-0 input no-border-radius input-prefix-spacing w-full lg:w-[300px] lg:mr-[25px]" placeholder="Nhập email của bạn" prefix={<BiLogoGmail />} />

              </Form.Item>

              <Form.Item<FieldType>
                className="relative mb-[25px]"
                name="password"
                rules={[{ required: true, message: 'Hãy nhập mật khẩu' }]}
              >
                <Input.Password className="py-4 lg:py-0 input no-border-radius input-prefix-spacing w-full lg:w-[300px] lg:mr-[25px]" placeholder="Nhập mật khẩu của bạn" prefix={<RiLockPasswordFill />} />
              </Form.Item>

              <Form.Item >
                <div className="flex items-center">
                  <Button className="lg:mr-[45px] mb-4 mx-auto mt-6 text-[15px] w-[120px] h-[38px] hover:scale-105 duration-300 bg-[#537FE7] hover:bg-[#C0EEF2] text-white" htmlType="submit">
                    {isLoading ? (
                      <AiOutlineLoading3Quarters className="animate-spin" />
                    ) : (
                      "Đăng nhập"
                    )}
                  </Button>
                  <button onClick={googleAuth} className="flex h-10 items-center border-2 border-gray-200 p-3 rounded-lg mt-2 hover:scale-105 hover:border-blue-300 duration-200">
                    <img className="w-6 mr-2" src="././././public/img/icongg.png" alt="google icon" />
                    <span>Đăng nhập Google</span>
                  </button>
                </div>

              </Form.Item>
              <a href="/forgotPassword" className=" lg:mr-[45px] mt-6 text-[18px]">Quên Mật Khẩu</a>
            </Form>

            <div className="login-image">
              <img className="w-[400px] h-[300px] hidden lg:block " src="../../../public/img/signin.jpg" alt="" />
              <a href="/signup" className="login-image-link text-[18px]">Tạo tài khoản</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signin