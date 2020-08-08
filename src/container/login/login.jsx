import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { Form, Input, Button, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { createLoginAction } from '../../redux/actions/login_action'
import { usernameRules, passwordRules } from '../../config/rules/login_rules'
import { reqLogin } from '../../api'
import '../../less/login.less'
import logo from '../../static/img/logo.png'
const { Item } = Form
@connect((state) => ({ isLogin: state.userInfo.isLogin }), {
  createLoginAction,
})
class Login extends Component {
  state = {
    starts: [],
  }
  componentDidMount() {
    const starts = [...this.state.starts]
    for (let i = 0; i < 800; i++) {
      starts.push({
        key: Date.now() + i,
        style: {
          transformOrigin: `0 0 ${800 + Math.random() * 300}px`,
          transform: `translate3d(0,0,-${800 + Math.random() * 300}px)
        rotateY(${Math.random() * 360}deg) rotateX(${
            Math.random() * -50
          }deg) scale(${0.2 + Math.random() * 1},${0.2 + Math.random() * 1})`,
        },
      })
    }
    this.setState({ starts })
  }
  onFinish = async (e) => {
    const data = await reqLogin(e)
    if (data) {
      createLoginAction(data)
      this.props.history.replace('/admin/home')
    }
  }
  onFinishFailed = () => message.error('校验失败，请重新输入！', 1)
  render() {
    if (this.props.isLogin) return <Redirect to="/admin/home" />
    const { starts } = this.state
    return (
      <div className="login">
        <header>
          <h1>后台管理系统</h1>
        </header>
        <section>
          <img src={logo} alt="logo"></img>
          <Form
            className="form"
            initialValues={{
              remember: true,
            }}
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
          >
            <Item name="username" className="username" rules={usernameRules}>
              <Input
                placeholder="用户名"
                prefix={<UserOutlined className="site-form-item-icon" />}
              />
            </Item>
            <Item name="password" className="password" rules={passwordRules}>
              <Input
                type="password"
                placeholder="密码"
                prefix={<LockOutlined className="site-form-item-icon" />}
              />
            </Item>
            <Item className="submit">
              <Button htmlType="submit">登录</Button>
            </Item>
          </Form>
        </section>
        <div className="starts">
          {starts.map((item) => (
            <span className="start" key={item.key} style={item.style}></span>
          ))}
        </div>
      </div>
    )
  }
}
export default Login
