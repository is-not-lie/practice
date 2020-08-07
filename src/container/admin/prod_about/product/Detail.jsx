import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, Button, List, message } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { reqProductInfo, reqCategoryInfo } from '../../../../api'
import { BASE_URL } from '../../../../config'

const { Item } = List
@connect((state) => ({
  productList: state.productList,
  categoryList: state.categoryList,
}))
class Detail extends Component {
  state = {
    name: '',
    desc: '',
    price: '',
    imgs: [],
    detail: '',
    categoryId: '',
    categoryName: '',
    isLoading: true,
  }
  componentDidMount() {
    let { id } = this.props.match.params
    const { categoryList, productList } = this.props
    if (productList.length) {
      const result = productList.find((item) => item._id === id)
      this.categoryId = result.categoryId
      this.setState({ ...result })
    } else this.getProductInfo(id)

    if (categoryList.length) {
      const result = categoryList.find((item) => item._id === this.categoryId)
      this.setState({ categoryName: result.name, isLoading: false })
    } else this.getCategoryInfo()
  }
  getCategoryInfo = async () => {
    let data = await reqCategoryInfo(this.categoryId)
    if (data) this.setState({ categoryName: data.name, isLoading: false })
  }
  getProductInfo = async (id) => {
    const data = await reqProductInfo(id)
    if (data) {
      this.categoryId = data.categoryId
      this.setState({ ...data })
    }
  }
  render() {
    let {
      name,
      desc,
      price,
      imgs,
      detail,
      categoryId,
      categoryName,
      isLoading,
    } = this.state
    return (
      <Card
        title={
          <div>
            <Button
              onClick={this.props.history.goBack}
              icon={<ArrowLeftOutlined />}
              type="link"
            ></Button>
            <span>商品详情</span>
          </div>
        }
      >
        <List loading={isLoading}>
          <Item>
            <div>
              <span
                style={{
                  fontSize: '20px',
                  fontWeight: 600,
                  color: '#000',
                  marginRight: '10px',
                }}
              >
                商品名称:
              </span>
              <span style={{ fontSize: '16px', color: '#6c6c6c' }}>{name}</span>
            </div>
          </Item>
          <Item>
            <div>
              <span
                style={{
                  fontSize: '20px',
                  fontWeight: 600,
                  color: '#000',
                  marginRight: '10px',
                }}
              >
                商品描述:
              </span>
              <span style={{ fontSize: '16px', color: '#6c6c6c' }}>{desc}</span>
            </div>
          </Item>
          <Item>
            <div>
              <span
                style={{
                  fontSize: '20px',
                  fontWeight: 600,
                  color: '#000',
                  marginRight: '10px',
                }}
              >
                商品价格:
              </span>
              <span style={{ fontSize: '16px', color: '#6c6c6c' }}>
                {price}
              </span>
            </div>
          </Item>
          <Item>
            <div>
              <span
                style={{
                  fontSize: '20px',
                  fontWeight: 600,
                  color: '#000',
                  marginRight: '10px',
                }}
              >
                所属分类:
              </span>
              <span style={{ fontSize: '16px', color: '#6c6c6c' }}>
                {categoryName}
              </span>
            </div>
          </Item>
          <Item>
            <div>
              <span
                style={{
                  fontSize: '20px',
                  fontWeight: 600,
                  color: '#000',
                  marginRight: '10px',
                }}
              >
                商品图片:
              </span>
              {imgs.map((item, i) => (
                <img
                  src={`${BASE_URL}/upload/${item}`}
                  alt="商品图片"
                  key={categoryId + i}
                  style={{ width: '100px', height: '100px' }}
                />
              ))}
            </div>
          </Item>
          <Item>
            <div>
              <span
                style={{
                  fontSize: '20px',
                  fontWeight: 600,
                  color: '#000',
                  marginRight: '10px',
                }}
              >
                商品详情:
              </span>
              <span
                style={{ fontSize: '16px', color: '#6c6c6c' }}
                dangerouslySetInnerHTML={{ __html: detail }}
              ></span>
            </div>
          </Item>
        </List>
      </Card>
    )
  }
}
export default Detail
