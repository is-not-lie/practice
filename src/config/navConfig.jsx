import React from 'react'
import {
  HomeOutlined,
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  AreaChartOutlined,
  AppstoreOutlined,
  BarsOutlined,
  ToolOutlined,
  UserOutlined,
  SafetyOutlined,
} from '@ant-design/icons'
export default [
  {
    title: '首页',
    key: 'home',
    icon: React.createElement(HomeOutlined),
    path: '/admin/home',
  },
  {
    title: '商品',
    key: 'prod_about',
    icon: React.createElement(BarChartOutlined),
    children: [
      {
        title: '分类管理',
        key: 'category',
        icon: React.createElement(LineChartOutlined),
        path: '/admin/prod_about/category',
      },
      {
        title: '商品管理',
        key: 'product',
        icon: React.createElement(PieChartOutlined),
        path: '/admin/prod_about/product',
      },
    ],
  },
  {
    title: '用户管理',
    key: 'user',
    icon: React.createElement(AreaChartOutlined),
    path: '/admin/user',
  },
  {
    title: '角色管理',
    key: 'role',
    icon: React.createElement(AppstoreOutlined),
    path: '/admin/role',
  },
  {
    title: '图形图表',
    key: 'charts',
    icon: React.createElement(BarsOutlined),
    children: [
      {
        title: '柱状图',
        key: 'bar',
        icon: React.createElement(ToolOutlined),
        path: '/admin/charts/bar',
      },
      {
        title: '折线图',
        key: 'line',
        icon: React.createElement(UserOutlined),
        path: '/admin/charts/line',
      },
      {
        title: '饼状图',
        key: 'pie',
        icon: React.createElement(SafetyOutlined),
        path: '/admin/charts/pie',
      },
    ],
  },
]
