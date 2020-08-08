import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, Button, Table, Modal, Form, Input, message, Tree } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { reqRoleList, reqAddRole, reqUpdateRole } from '../../../api'
import navConfig from '../../../config/navConfig'
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
        children: [...navConfig],
      },
    ],
    checkedKeys: [],
    _id: '',
    isLoading: true,
    addLoading: false,
    setLoading: false,
  }
  componentDidMount() {
    // 请求角色列表信息
    ;(async () => {
      const data = await reqRoleList()
      if (data) this.setState({ roleList: data.reverse(), isLoading: false })
    })()
  }
  handleAddOk = () => {
    this.setState({ addLoading: true })
    this.form
      .validateFields(['roleName'])
      .then(async (v) => {
        const data = await reqAddRole(v)
        if (data) {
          const roleList = [...this.state.roleList]
          roleList.unshift(data)
          this.setState({ roleList, isShowAdd: false, addLoading: false })
          this.form.resetFields()
          message.success('新增角色成功', 1)
        }
      })
      .catch(() => message.error('表单验证失败，请检查输入'))
  }
  handleAddCancel = () => {
    this.setState({ isShowAdd: false })
    this.form.resetFields()
  }
  handleAuthOk = async () => {
    this.setState({ setLoading: true })
    const menus = [...this.state.checkedKeys]
    const auth_name = this.props.userInfo.user.username
    const auth_time = Date.now()
    const { _id } = this.state
    const data = await reqUpdateRole({
      _id,
      menus,
      auth_time,
      auth_name,
    })
    if (data) {
      const roleList = [...this.state.roleList]
      roleList.forEach((item) => {
        if (item._id === _id) {
          item.menus = menus
          item.auth_time = auth_time
          item.auth_name = auth_name
        }
      })
      this.setState({ roleList, isShowAuth: false, setLoading: false })
      message.success('角色授权成功')
    }
  }
  handleAuthCancel = () => this.setState({ isShowAuth: false })

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
      isLoading,
      addLoading,
      setLoading,
    } = this.state
    return (
      <div className="role">
        <Card
          title={
            <Button
              icon={<PlusOutlined />}
              onClick={() => this.setState({ isShowAdd: true })}
            >
              新增角色
            </Button>
          }
        >
          <Modal
            loading={addLoading}
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
            loading={setLoading}
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
            loading={isLoading}
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
