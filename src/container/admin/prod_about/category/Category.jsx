import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, Button, Form, Input, Table, Modal, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import {
  reqCategoryList,
  reqAddCategory,
  reqUpdateCategory,
} from '../../../../api'
import { addCategoryList } from '../../../../redux/actions/category_action'
import { PAGESIZE } from '../../../../config'
import { categoryRules } from '../../../../config/rules/product_rules'
const { Item } = Form
@connect((state) => ({}), { addCategoryList })
class Category extends Component {
  state = {
    categoryList: [],
    columns: [
      {
        title: '分类名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '操作',
        key: 'operation',
        render: (item) => (
          <Button
            type="link"
            className="operBtn"
            onClick={() => this.showSetModal(item)}
          >
            修改分类
          </Button>
        ),
        width: '30%',
        align: 'center',
      },
    ],
    isLogin: true,
    visible: false,
    operationType: '',
    confirmLoading: false,
  }
  componentDidMount() {
    // 组件挂载完毕立刻请求商品分类列表
    ;(async () => {
      const data = await reqCategoryList()
      if (data) this.setState({ categoryList: data.reverse() })
      this.setState({ isLogin: false })
      this.props.addCategoryList(data)
    })()
  }
  // 显示添加商品的模态框回调
  showAddModal = () => this.setState({ visible: true, operationType: 'add' })
  // 显示修改商品的模态框回调
  showSetModal = (item) => {
    this.form.setFieldsValue({ categoryName: item.name })
    this.setState({
      visible: true,
      operation: 'update',
      item,
    })
  }
  // 模态框确认按钮回调
  handleOk = () => {
    this.setState({ confirmLoading: true })
    const { operationType } = this.state
    this.form
      .validateFields(['categoryName'])
      .then((v) =>
        operationType === 'add' ? this.addCategory(v) : this.operCategory(v)
      )
      .catch(() => {
        message.error('表单校验失败，请检查')
        this.setState({ confirmLoading: false })
      })
  }
  // 模态框取消按钮回调
  handleCancel = () => {
    this.form.resetFields()
    this.setState({ visible: false })
  }
  // 添加商品分类回调
  addCategory = async (v) => {
    const data = await reqAddCategory(v)
    if (data) {
      const categoryList = [...this.state.categoryList]
      categoryList.unshift(data)
      this.setState({ categoryList, visible: false, confirmLoading: false })
      message.success('商品分类添加成功')
      this.form.resetFields()
    }
  }
  // 修改商品分类回调
  operCategory = async (v) => {
    const { _id } = this.state.item
    await reqUpdateCategory({ categoryId: _id, ...v })
    const categoryList = [...this.state.categoryList]
    categoryList.map((item) => {
      item.name = item._id === _id ? v.categoryName : item.name
      return item
    })
    this.setState({
      item: null,
      visible: false,
      confirmLoading: false,
      categoryList,
    })
    message.success('商品分类更新成功', 1)
  }
  render() {
    const {
      categoryList,
      columns,
      isLogin,
      operationType,
      visible,
      confirmLoading,
    } = this.state
    return (
      <div>
        <Card
          extra={
            <Button
              className="addBtn"
              icon={<PlusOutlined />}
              onClick={this.showAddModal}
            >
              添加
            </Button>
          }
        >
          <Modal
            confirmLoading={confirmLoading}
            forceRender
            title={operationType === 'add' ? '添加分类' : '修改分类'}
            visible={visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            okText="确定"
            cancelText="取消"
          >
            <Form
              ref={(ref) => (this.form = ref)}
              name="global_state"
              layout="horizontal"
            >
              <Item name="categoryName" rules={categoryRules}>
                <Input placeholder="请输入分类名" />
              </Item>
            </Form>
          </Modal>
          <Table
            bordered
            dataSource={categoryList}
            columns={columns}
            rowKey="_id"
            isLogin={isLogin}
            pagination={{ pageSize: PAGESIZE, showQuickJumper: true }}
          />
        </Card>
      </div>
    )
  }
}
export default Category
