import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect, Route, Switch } from 'react-router-dom'
import { Layout } from 'antd'
import Header from './header/Header'
import LeftNav from './navList/LeftNav'
import './Admin.less'
// 路由组件
import Home from '../home/Home'
import Category from '../prod_about/category/Category'
import Product from '../prod_about/product/Product'
import AddUpdate from '../prod_about/product/Add_Update'
import Detail from '../prod_about/product/Detail'
import User from '../user/User'
import Role from '../role/Role'
import Bar from '../charts/bar/Bar'
import Line from '../charts/line/Line'
import Pie from '../charts/pie/Pie'
const { Sider, Content } = Layout

@connect((state) => ({ collapsed: state.collapsed, userInfo: state.userInfo }))
class Admin extends Component {
  render() {
    const { collapsed, userInfo } = this.props
    if (!userInfo.isLogin) return <Redirect to="/login" />
    return (
      <Layout className="layout">
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          className="left-nav"
        >
          <LeftNav />
        </Sider>
        <Layout className="site-layout">
          <Header />
          <Content className="site-layout-background">
            <Switch>
              <Route path="/admin/home" component={Home} />
              <Route path="/admin/prod_about/category" component={Category} />
              <Route
                path="/admin/prod_about/product"
                component={Product}
                exact
              />
              <Route
                path="/admin/prod_about/product/add_update/:id"
                component={AddUpdate}
              />
              <Route
                path="/admin/prod_about/product/add_update"
                component={AddUpdate}
                exact
              />
              <Route
                path="/admin/prod_about/product/detail/:id"
                component={Detail}
              />
              <Route path="/admin/user" component={User} />
              <Route path="/admin/role" component={Role} />
              <Route path="/admin/charts/bar" component={Bar} />
              <Route path="/admin/charts/line" component={Line} />
              <Route path="/admin/charts/pie" component={Pie} />
              <Redirect to="/admin/home" />
            </Switch>
          </Content>
        </Layout>
      </Layout>
    )
  }
}
export default Admin
