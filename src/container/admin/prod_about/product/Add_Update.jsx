import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, Button, Form, Select, Input, message } from 'antd'
import { ArrowLeftOutlined, MoneyCollectOutlined } from '@ant-design/icons'
import { productRules } from '../../../../config/rules/product_rules'
import {
  reqCategoryList,
  reqAddProduct,
  reqProductInfo,
  reqUpdateProduct,
} from '../../../../api'
import ImgUpload from './ImgUpload'
import RichTextEditor from './RichTextEditor'
const { Item } = Form
const { Option } = Select
@connect((state) => ({
  categoryList: state.categoryList,
  productList: state.productList,
}))
class AddUpdate extends Component {
  state = {
    categoryList: [],
    id: '',
    categoryId: '',
    name: '',
    desc: '',
    price: '',
    detail: '',
    imgs: [],
    _id: '',
  }
  componentDidMount() {
    const { categoryList, productList } = this.props
    const { id } = this.props.match.params
    if (categoryList.length) this.setState({ categoryList })
    else this.getCategoryList()
    if (id) {
      this.setState({ id })
      if (productList.length) {
        let result = productList.find((item) => item._id === id)
        if (result) {
          this.setState({ ...result })
          this.pic.setImgArr(result.imgs)
          this.rich.setRichText(result.detail)
        }
      } else this.getProductInfo(id)
    }
  }
  // 根据id获取商品信息
  getProductInfo = async (id) => {
    const data = await reqProductInfo(id)
    if (data) {
      this.setState({ ...data })
      this.pic.setImgArr(data.imgs)
      this.rich.setRichText(data.detail)
    }
  }
  // 获取分类列表信息
  getCategoryList = async () => {
    const data = await reqCategoryList()
    this.setState({ categoryList: data })
  }
  // 表单提交成功回调
  onFinish = async (e) => {
    const imgs = this.pic.getImgArr()
    const detail = this.rich.getRichText()
    const { id, _id } = this.state
    id
      ? await reqUpdateProduct({ ...e, imgs, detail, _id })
      : await reqAddProduct({ imgs, detail, ...e })
    this.props.history.replace('/admin/prod_about/product')
    message.success('操作成功')
  }
  // 表单提交失败回调
  onFinishFailed = () => message.error('校验失败，请检查商品信息')
  render() {
    const { name, desc, price, categoryId, id, categoryList } = this.state
    return (
      <Card
        title={
          <div>
            <Button
              type="link"
              icon={<ArrowLeftOutlined />}
              onClick={this.props.history.goBack}
            ></Button>
            <span>{id ? '商品修改' : '商品添加'}</span>
          </div>
        }
      >
        <Form
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
          labelCol={{ md: 2 }}
          wrapperCol={{ md: 16 }}
        >
          <Item
            name="name"
            label="商品名称"
            rules={[productRules.name]}
            initialValue={name || ''}
          >
            <Input placeholder="请输入商品名称" />
          </Item>
          <Item
            name="desc"
            label="商品描述"
            rules={[productRules.desc]}
            initialValue={desc || ''}
          >
            <Input placeholder="请输入商品描述" />
          </Item>
          <Item
            name="price"
            label="商品价格"
            rules={[productRules.price]}
            initialValue={price || ''}
          >
            <Input
              placeholder="请输入商品价格"
              type="number"
              prefix={<MoneyCollectOutlined />}
            />
          </Item>
          <Item
            name="categoryId"
            label="商品分类"
            rules={[productRules.categoryId]}
            initialValue={categoryId || ''}
          >
            <Select>
              <Option value="">请选择商品分类</Option>
              {categoryList.map((item) => (
                <Option value={item._id} key={item._id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Item>
          <Item label="商品图片">
            <ImgUpload ref={(ref) => (this.pic = ref)} />
          </Item>
          <Item label="商品详情">
            <RichTextEditor ref={(ref) => (this.rich = ref)} />
          </Item>
          <Item>
            <Button htmlType="submit">提交</Button>
          </Item>
        </Form>
      </Card>
    )
  }
}
export default AddUpdate
