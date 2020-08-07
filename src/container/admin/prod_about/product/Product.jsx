import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, Select, Button, Input, Table, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { PAGESIZE } from '../../../../config'
import {
  reqProductList,
  reqSearchProductList,
  reqUpdateProductStatus,
} from '../../../../api'
import { addProductList } from '../../../../redux/actions/product_action'
const { Option } = Select
@connect((state) => ({}), { addProductList })
class Product extends Component {
  state = {
    columns: [
      {
        title: '商品名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '商品描述',
        dataIndex: 'desc',
        key: 'desc',
        ellipsis: true,
      },
      {
        title: '价格',
        dataIndex: 'price',
        key: 'price',
        align: 'center',
        width: '10%',
        render: (price) => `¥${price}`,
      },
      {
        title: '状态',
        key: 'status',
        align: 'center',
        width: '10%',
        render: (item) => (
          <div>
            <Button
              type={item.status === 1 ? 'danger' : 'primary'}
              onClick={() => this.updateProductStatus(item)}
            >
              {item.status === 1 ? '下架' : '上架'}
            </Button>
            <br />
            <span>{item.status === 1 ? '在售' : '已停售'}</span>
          </div>
        ),
      },
      {
        title: '操作',
        key: 'option',
        align: 'center',
        width: '10%',
        render: (item) => (
          <div>
            <Button
              type="link"
              onClick={() =>
                this.props.history.push(
                  `/admin/prod_about/product/detail/${item._id}`
                )
              }
            >
              详情
            </Button>
            <br />
            <Button
              type="link"
              onClick={() =>
                this.props.history.push(
                  `/admin/prod_about/product/add_update/${item._id}`
                )
              }
            >
              修改
            </Button>
          </div>
        ),
      },
    ],
    productList: [],
    current: 1,
    total: 1,
    searchType: 'productName',
    keyWord: '',
    isSearch: false,
  }
  componentDidMount() {
    this.reqProductList()
  }
  // 请求商品分页列表回调
  reqProductList = async (number = 1, pageSize = PAGESIZE) => {
    const { isSearch, searchType, keyWord } = this.state
    const data = isSearch
      ? await reqSearchProductList(number, pageSize, searchType, keyWord)
      : await reqProductList(number, pageSize)
    if (data) {
      const { pageNum, total, list } = data
      this.setState({ current: pageNum, total, productList: list })
      this.props.addProductList(list)
    }
  }
  // 搜索按钮回调
  search = () => {
    this.setState({ isSearch: true })
    this.reqProductList()
  }
  // 更新商品状态回调
  updateProductStatus = async (item) => {
    let { _id, status } = item
    status = status === 1 ? 2 : 1
    await reqUpdateProductStatus(_id, status)
    const productList = [...this.state.productList]
    productList.map((item) => {
      item.status = item._id === _id ? status : item.status
      return item
    })
    this.setState({ productList })
    message.success('商品状态更新成功', 1)
  }
  render() {
    const { columns, productList, current, total } = this.state
    return (
      <Card
        title={
          <div>
            <Select
              defaultValue="productName"
              onChange={(v) => this.setState({ searchType: v })}
            >
              <Option value="productName">按名称搜索</Option>
              <Option value="productDesc">按描述搜索</Option>
            </Select>
            <Input
              onChange={(e) => this.setState({ keyWord: e.target.value })}
              placeholder="关键字"
              style={{ width: '20%', margin: '0 10px' }}
            />
            <Button onClick={this.search}>搜索</Button>
          </div>
        }
        extra={
          <Button
            onClick={() =>
              this.props.history.push('/admin/prod_about/product/add_update')
            }
            icon={<PlusOutlined />}
          >
            添加商品
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={productList}
          bordered
          rowKey="_id"
          pagination={{
            pageSize: PAGESIZE,
            current,
            total,
            onChange: this.reqProductList,
          }}
        />
      </Card>
    )
  }
}
export default Product
