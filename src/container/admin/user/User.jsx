import React, { Component } from 'react'
import { Card, Button, Table, message, Modal, Form, Input, Select } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { PAGESIZE } from '../../config'
import { reqUserList, reqAddUser } from '../../api'
const { Item } = Form
const { Option } = Select

export default class User extends Component {
  state = {
    userList: [],
    columns: [
      {
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: '电话',
        dataIndex: 'phone',
        key: 'phone',
      },
      {
        title: '注册时间',
        dataIndex: 'create_time',
        key: 'create_time',
        render: (time) =>
          time ? dayjs(time).format('YYYY年 MM月 DD日 HH:mm:ss') : '',
      },
      {
        title: '所属角色',
        dataIndex: 'role_id',
        key: 'role_id',
        render: (id) => {
          const { roles } = this.state
          const result = roles.find((item) => item._id === id)
          if (result) return result.name
        },
      },
      {
        title: '操作',
        key: 'option',
        render: (item) => (
          <div>
            <Button
              type="link"
              onClick={() => {
                this.setState({ isShowUpdate: true })
              }}
            >
              修改
            </Button>
            <Button type="link" onClick={() => {}}>
              删除
            </Button>
          </div>
        ),
      },
    ],
    isShowAdd: false,
    isShowUpdate: false,
    roles: [],
  }
  componentDidMount() {
    this.getUserList()
  }
  // 获取用户列表回调
  getUserList = async () => {
    const { status, data } = await reqUserList()
    if (status === 0) {
      this.setState({ roles: data.roles, userList: data.users.reverse() })
    } else message.error('获取用户列表失败，请稍后尝试')
  }
  handleOk = () => {
    this.addForm
      .validateFields(['username', 'password', 'phone', 'email', 'role_id'])
      .then(async (v) => {
        const { status, data, msg } = await reqAddUser(v)
        console.log(status, data)
        if (status === 0) {
          const userList = [...this.state.userList]
          userList.unshift(data)
          this.setState({ userList, isShowAdd: false })
          message.success('新增用户成功', 1)
          this.addForm.resetFields()
        } else message.error(msg, 1)
      })
      .catch(() => message.error('校验失败，请检查'))
  }
  handleCancel = () => {
    this.setState({ isShowAdd: false })
    this.addForm.resetFields()
  }
  handleAuthOk = () => {
    this.setState({ isShowUpdate: false })
  }
  handleAuthCancel = () => {
    this.setState({ isShowUpdate: false })
  }
  render() {
    const { userList, columns, isShowAdd, isShowUpdate, roles } = this.state
    return (
      <div className="user">
        <Card
          title={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => this.setState({ isShowAdd: true })}
            >
              创建用户
            </Button>
          }
        >
          <Modal
            title="添加用户"
            visible={isShowAdd}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            okText="确定"
            cancelText="取消"
          >
            <Form ref={(ref) => (this.addForm = ref)}>
              <Item
                name="username"
                label="用户名"
                rules={[{ required: true, message: '用户名不能为空' }]}
              >
                <Input placeholder="请输入用户名" />
              </Item>
              <Item
                name="password"
                label="密码"
                rules={[{ required: true, message: '密码不能为空' }]}
              >
                <Input placeholder="请输入密码" type="password" />
              </Item>
              <Item
                name="phone"
                label="手机号"
                rules={[{ required: true, message: '手机号不能为空' }]}
              >
                <Input placeholder="请输入手机号" />
              </Item>
              <Item
                name="email"
                label="邮箱"
                rules={[{ required: true, message: '邮箱不能为空' }]}
              >
                <Input placeholder="请输入邮箱" type="email" />
              </Item>
              <Item
                name="role_id"
                label="角色"
                rules={[{ required: true, message: '角色不能为空' }]}
                initialValue=""
              >
                <Select>
                  <Option value="">请选择一个角色</Option>
                  {roles.map((item) => (
                    <Option key={item._id} value={item._id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Item>
            </Form>
          </Modal>
          <Modal
            visible={isShowUpdate}
            onOk={this.handleAuthOk}
            onCancel={this.handleAuthCancel}
            okText="确定"
            cancelText="取消"
          >
            <Form ref={(ref) => (this.updateForm = ref)}>
              <Item>
                <Input />
              </Item>
            </Form>
          </Modal>
          <Table
            dataSource={userList}
            columns={columns}
            bordered
            rowKey="_id"
            pagination={{ defaultPageSize: PAGESIZE }}
          />
        </Card>
      </div>
    )
  }
}
