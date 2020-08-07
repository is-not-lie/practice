import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Menu } from 'antd'
import './LeftNav.less'
import logo from '../../../../static/img/logo.png'
import navConfig from '../../../../config/navConfig'
import { upTitle } from '../../../../redux/actions/admin_action'
const { Item, SubMenu } = Menu

@connect((state) => ({}), { upTitle })
@withRouter
class LeftNav extends Component {
  createMenuItem = (item) =>
    item.children instanceof Array ? (
      <SubMenu key={item.key} title={item.title} icon={item.icon}>
        {item.children.map((item) => this.createMenuItem(item))}
      </SubMenu>
    ) : (
      <Item
        key={item.key}
        icon={item.icon}
        onClick={() => this.props.upTitle(item.title)}
      >
        <Link to={item.path}>{item.title}</Link>
      </Item>
    )

  render() {
    const { pathname } = this.props.location
    return (
      <Menu
        mode="inline"
        selectedKeys={
          pathname.indexOf('product') !== -1
            ? 'product'
            : pathname.split('/').reverse()[0]
        }
        defaultOpenKeys={pathname.split('/').splice(2)}
        className="meun"
      >
        <header className="title">
          <h1>
            <img src={logo} alt="" />
          </h1>
        </header>
        {navConfig.map((item) => this.createMenuItem(item))}
      </Menu>
    )
  }
}
export default LeftNav
