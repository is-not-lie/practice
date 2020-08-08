import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Modal } from 'antd'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import fullscreen from 'screenfull'
import dayjs from 'dayjs'
import { setCollapsed } from '../../../../redux/actions/admin_action'
import { outLogin } from '../../../../redux/actions/login_action'
import { reqWeatherInfo } from '../../../../api'
import navConfig from '../../../../config/navConfig'
import '../../../../less/header.less'

const { confirm } = Modal

@connect((state) => ({ title: state.uptitle }), {
  setCollapsed,
  outLogin,
})
@withRouter
class Header extends Component {
  state = {
    collapsed: false,
    isScreen: false,
    time: dayjs().format('YYYY/MM/DD hh:mm:ss'),
    title: '',
  }
  componentDidMount() {
    // 请求百度天气接口获取信息
    ;(async () => {
      const result = await reqWeatherInfo()
      this.setState({ ...result })
    })()
    // 开启定时器更新时间
    this.timeKey = setInterval(
      () => this.setState({ time: dayjs().format('YYYY/MM/DD hh:mm:ss') }),
      1000
    )
    // 监听全屏变化
    fullscreen.on('change', () =>
      this.setState({ isScreen: !this.state.isScreen })
    )
    // 获取菜单标题
    this.getTitle()
  }
  // 卸载组件时关闭定时器
  componentWillUnmount() {
    clearInterval(this.timeKey)
  }
  // 切换全屏回调
  handleScreen = () => fullscreen.toggle()
  // 控制收缩侧边栏回调
  toggle = () => {
    const collapsed = !this.state.collapsed
    this.setState({ collapsed })
    this.props.setCollapsed(collapsed)
  }
  // 获取菜单标题回调
  getTitle = () => {
    const { pathname } = this.props.location
    const pathKey =
      pathname.indexOf('product') !== -1
        ? 'product'
        : pathname.split('/').reverse()[0]
    let title
    navConfig.forEach((item) => {
      if (item.children instanceof Array) {
        const tmp = item.children.find((citem) => citem.key === pathKey)
        if (tmp) title = tmp.title
      } else {
        if (item.key === pathKey) title = item.title
      }
    })
    this.setState({ title })
  }
  // 退出登录回调
  outLogin = () => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: '确认退出吗?',
      cancelText: '取消',
      okText: '确定',
      onOk: () => {
        this.props.outLogin()
      },
      onCancel() {},
    })
  }
  render() {
    const { time, dayPictureUrl, weather, temperature, title } = this.state
    return (
      <header className="admin-header">
        {React.createElement(
          this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
          {
            className: 'trigger',
            onClick: this.toggle,
          }
        )}
        <div>
          <div className="header-top">
            <span className="text">欢迎来到后台管理系统</span>
            {React.createElement(
              this.state.isScreen ? FullscreenExitOutlined : FullscreenOutlined,
              {
                className: 'screen',
                onClick: this.handleScreen,
              }
            )}
            <span className="outlogin" onClick={this.outLogin}>
              退出登录
            </span>
          </div>
          <div className="header-bottom">
            <div className="title">
              <span>{this.props.title || title}</span>
            </div>
            <div className="time">
              <span>{time}</span>
              <img src={dayPictureUrl} alt="" />
              <span>{weather}</span>
              <span>{temperature}</span>
            </div>
          </div>
        </div>
      </header>
    )
  }
}
export default Header
