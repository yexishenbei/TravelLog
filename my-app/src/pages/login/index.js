import React from 'react'
import { Form, Input, Button, message } from 'antd'
import './index.css'
import { LoginApi } from './services'
import { useNavigate, Navigate } from 'react-router-dom'

const Login = () => {
  const navigator = useNavigate()
  
  // 在已经登录的状态下，跳转到首页
  if (localStorage.getItem('token')) {
    return <Navigate to='/home' />
  }

  const handleSubmit = async (val) => {
    if (!val.password || !val.username) {
      message.warning('请输入用户名和密码')
      return
    }

    try {
      // 调用 LoginApi 进行登录
      const res = await LoginApi(val)

      // 获取登录成功的响应数据
      const { data } = res

      // 将 token 存储到 localStorage 中
      localStorage.setItem('token', data.token)
      localStorage.setItem("role", data.user.role);

      // 登录成功后跳转到首页
      navigator('/home')
    } catch (error) {
      // 如果登录失败，显示错误信息
      message.error('登录失败，请检查用户名和密码')
    }
  }

  return (
    <Form className='login-box' onFinish={handleSubmit}>
      <div className='title'>游记后台管理系统</div>
      <Form.Item
        label='账号'
        name='username'
        rules={[{ required: true, message: '请输入账号!' }]}
      >
        <Input placeholder='请输入账号' />
      </Form.Item>

      <Form.Item
        label='密码'
        name='password'
        rules={[{ required: true, message: '请输入密码!' }]}
      >
        <Input.Password placeholder='请输入密码' />
      </Form.Item>

      <Form.Item className='login-button'>
        <Button type='primary' htmlType='submit'>
          登录
        </Button>
      </Form.Item>
    </Form>
  )
}

export default Login
