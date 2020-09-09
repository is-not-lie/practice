import React, { Component } from 'react'
import { Card, Button, Table, message, Modal, Form, Input, Select } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { PAGESIZE } from '../../../config'
import { addUserRules } from '../../../config/rules/user_rules'
import {
  reqUserList,
  reqAddUser,
  reqUpdateUser,
  reqDelUser,
} from '../../../api'
import ImgUpload from '../ImgUpload/ImgUpload'
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
                this.form.setFieldsValue({ ...item })
                this.setState({ update: true, visible: true, item })
              }}
            >
              修改
            </Button>
            <Button
              type="link"
              onClick={() => this.setState({ isShowDelModal: true, item })}
            >
              删除
            </Button>
          </div>
        ),
      },
    ],
    add: false,
    update: false,
    roles: [],
    isLoading: true,
    modalLoading: false,
    item: {},
    isShowDelModal: false,
  }
  componentDidMount() {
    this.getUserList()
  }
  // 获取用户列表回调
  getUserList = async () => {
    const data = await reqUserList()
    if (data) {
      this.setState({
        roles: data.roles,
        userList: data.users.reverse(),
        isLoading: false,
      })
    }
  }

  handleOk = () => {
    const { add } = this.state
    this.setState({ modalLoading: true })
    this.form
      .validateFields(['username', 'password', 'phone', 'email', 'role_id'])
      .then((v) => {
        v.imgs = this.imgs.getImgArr()
        add ? this.addUser(v) : this.updateUser(v)
      })
      .catch(() => message.error('校验失败，请检查', 1))
  }
  handleCancel = () => {
    this.state.add
      ? this.setState({ add: false, visible: false })
      : this.setState({ update: false, visible: false })
    this.form.resetFields()
  }
  addUser = async (v) => {
    const { imgs } = v
    if (imgs.length > 0) {
      v.avatar = imgs[0]
    }
    const data = await reqAddUser(v)
    if (data) {
      const userList = [...this.state.userList]
      userList.unshift(data)
      this.setState({
        userList,
        add: false,
        modalLoading: false,
        visible: false,
      })
      this.form.resetFields()
      message.success('新增用户成功', 1)
    }
  }
  updateUser = async (v) => {
    const { _id } = this.state.item
    const { imgs } = v
    if (imgs.length > 0) {
      v.avatar = imgs[0]
    }
    const data = await reqUpdateUser({ _id, ...v })
    if (data) {
      let userList = [...this.state.userList]
      userList = userList.map((item) => (item._id === _id ? data : item))
      this.setState({
        userList,
        update: false,
        modalLoading: false,
        visible: false,
      })
      this.form.resetFields()
      message.success('修改用户信息成功', 1)
    }
  }
  delUserOk = async () => {
    const { _id } = this.state.item
    const data = await reqDelUser(_id)
    if (data) {
      const userList = [...this.state.userList]
      const result = userList.find((item) => item._id === _id)
      userList.splice(userList.indexOf(result), 1)
      this.setState({ userList, isShowDelModal: false })
      message.success('删除用户成功')
    }
  }
  delUserCancel = () => this.setState({ isShowDelModal: false })
  render() {
    const {
      userList,
      columns,
      add,
      visible,
      roles,
      isLoading,
      modalLoading,
      isShowDelModal,
    } = this.state
    return (
      <div className="user">
        <Card
          title={
            <Button
              icon={<PlusOutlined />}
              onClick={() => this.setState({ visible: true, add: true })}
            >
              创建用户
            </Button>
          }
        >
          <Modal
            forceRender
            loading={modalLoading}
            title={add ? '添加用户' : '修改信息'}
            visible={visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            okText="确定"
            cancelText="取消"
          >
            <Form ref={(ref) => (this.form = ref)}>
              <Item
                name="username"
                label="用户名"
                rules={[addUserRules.username]}
              >
                <Input placeholder="请输入用户名" />
              </Item>
              <Item
                name="password"
                label="密码"
                rules={[addUserRules.password]}
              >
                <Input placeholder="请输入密码" type="password" />
              </Item>
              <Item name="phone" label="手机号" rules={[addUserRules.phone]}>
                <Input placeholder="请输入手机号" />
              </Item>
              <Item name="email" label="邮箱" rules={[addUserRules.email]}>
                <Input placeholder="请输入邮箱" type="email" />
              </Item>
              <Item label="用户头像">
                <ImgUpload ref={(ref) => (this.imgs = ref)} />
              </Item>
              <Item
                name="role_id"
                label="角色"
                rules={[addUserRules.role_id]}
                initialValue=""
              >
                <Select disabled={!roles.length}>
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
            title="确认删除此用户吗?"
            visible={isShowDelModal}
            onOk={this.delUserOk}
            onCancel={this.delUserCancel}
            okText="确定"
            cancelText="取消"
          />
          <Table
            dataSource={userList}
            columns={columns}
            bordered
            rowKey="_id"
            pagination={{ defaultPageSize: PAGESIZE }}
            loading={isLoading}
          />
        </Card>
      </div>
    )
  }
}
