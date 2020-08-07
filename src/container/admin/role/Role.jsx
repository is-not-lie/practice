import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, Button, Table, Modal, Form, Input, message, Tree } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { reqRoleList, reqAddRole, reqUpdateRole } from '../../../api'
import menuList from '../Admin/list/listConfig'
const { Item } = Form
@connect((state) => ({ userInfo: state.userInfo }))
class Role extends Component {
  state = {
    columns: [
      {
        title: '角色名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        key: 'create_time',
        render: (time) => dayjs(time).format('YYYY年 MM月 DD日 HH:mm:ss'),
      },
      {
        title: '授权时间',
        dataIndex: 'auth_time',
        key: 'auth_time',
        render: (time) =>
          time ? dayjs(time).format('YYYY年 MM月 DD日 HH:mm:ss') : '',
      },
      {
        title: '授权人',
        dataIndex: 'auth_name',
        key: 'auth_name',
      },
      {
        title: '操作',
        key: 'option',
        render: (item) => (
          <Button
            type="link"
            onClick={() => {
              this.setState({
                isShowAuth: true,
                _id: item._id,
                checkedKeys: item.menus,
              })
            }}
          >
            设置权限
          </Button>
        ),
      },
    ],
    roleList: [],
    isShowAdd: false,
    isShowAuth: false,
    treeData: [
      {
        title: '平台权限',
        key: 'all',
        children: [...menuList],
      },
    ],
    checkedKeys: [],
    _id: '',
  }
  componentDidMount() {
    ;(async () => {
      const { status, data } = await reqRoleList()
      if (status === 0) {
        this.setState({ roleList: data })
      } else message.error('暂无角色信息')
    })()
  }
  handleAddOk = () => {
    this.form
      .validateFields(['roleName'])
      .then(async (v) => {
        const { status, data } = await reqAddRole(v)
        if (status === 0) {
          message.success('新增角色成功', 1)
          const roleList = [...this.state.roleList]
          roleList.unshift(data)
          this.setState({ roleList })
        } else message.error('添加角色失败，请稍后重新尝试', 1)
        this.setState({ isShowAdd: false })
        this.form.resetFields()
      })
      .catch(() => message.error('表单验证失败，请检查输入'))
  }
  handleAddCancel = () => {
    this.setState({ isShowAdd: false })
    this.form.resetFields()
  }
  handleAuthOk = async () => {
    const menus = [...this.state.checkedKeys]
    const auth_name = this.props.userInfo.user.username
    const auth_time = Date.now()
    const { _id } = this.state
    const { status } = await reqUpdateRole({
      _id,
      menus,
      auth_time,
      auth_name,
    })
    if (status === 0) {
      // const roleList = [...this.state.roleList]
      // roleList.find()
      // console.log(data)
      message.success('角色授权成功')
      ;(async () => {
        const { status, data } = await reqRoleList()
        if (status === 0) {
          this.setState({ roleList: data })
        } else message.error('暂无角色信息')
      })()
    } else message.error('授权失败，请联系管理人员')
    this.setState({ isShowAuth: false })
  }
  handleAuthCancel = () => {
    this.setState({ isShowAuth: false })
  }

  // 选项状态改变时触发回调
  onCheck = (checkedKeys) => this.setState({ checkedKeys })

  render() {
    const {
      columns,
      roleList,
      isShowAdd,
      isShowAuth,
      treeData,
      checkedKeys,
    } = this.state
    return (
      <div className="role">
        <Card
          title={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => this.setState({ isShowAdd: true })}
            >
              新增角色
            </Button>
          }
        >
          <Modal
            title="新增角色"
            visible={isShowAdd}
            onOk={this.handleAddOk}
            onCancel={this.handleAddCancel}
            okText="确定"
            cancelText="取消"
          >
            <Form
              ref={(ref) => (this.form = ref)}
              name="global_state"
              layout="horizontal"
            >
              <Item
                name="roleName"
                rules={[{ required: true, message: '角色名不能为空' }]}
              >
                <Input placeholder="请输入角色名" />
              </Item>
            </Form>
          </Modal>
          <Modal
            title="设置权限"
            visible={isShowAuth}
            onOk={this.handleAuthOk}
            onCancel={this.handleAuthCancel}
            okText="确定"
            cancelText="取消"
          >
            <Tree
              checkable
              onCheck={this.onCheck}
              checkedKeys={checkedKeys}
              treeData={treeData}
              defaultExpandAll
            />
          </Modal>
          <Table
            dataSource={roleList}
            columns={columns}
            bordered
            rowKey="_id"
          />
        </Card>
      </div>
    )
  }
}
export default Role
