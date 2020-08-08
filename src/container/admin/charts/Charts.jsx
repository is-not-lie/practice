import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, Button } from 'antd'
import { LoadingOutlined, UndoOutlined } from '@ant-design/icons'
import ReactEcharts from 'echarts-for-react'
import { reqCategoryList } from '../../../api'
@connect((state) => ({ categoryList: state.categoryList }))
class Charts extends Component {
  state = {
    category: [],
    isDisabled: false,
    isLoading: true,
    sales: [],
    inventorys: [],
  }
  componentDidMount() {
    this.getCategoryList()
  }
  getCategoryList = async () => {
    const { categoryList } = this.props
    const data = categoryList.length ? categoryList : await reqCategoryList()
    if (data) {
      const category = []
      const sales = []
      const inventorys = []
      data.forEach((item) => {
        category.push(item.name)
        sales.push(Math.floor(Math.random() * 1000))
        inventorys.push(Math.floor(Math.random() * 1000))
      })
      this.setState({
        category,
        sales,
        inventorys,
        isLoading: false,
        isDisabled: false,
      })
    }
  }
  getOption = (type) => {
    const { category, sales, inventorys } = this.state
    const salesData = []
    const inventorysData = []
    let option
    category.forEach((item, i) => {
      salesData.push({ value: sales[i], name: item })
      inventorysData.push({ value: inventorys[i], name: item })
    })
    if (type === 'pie') {
      option = {
        title: {
          text: '',
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a}<br/>{b}:{c}({d}%)',
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: category,
        },
        series: [
          {
            name: '销量',
            type,
            radius: '50%',
            center: ['30%', '50%'],
            data: salesData,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0,0,0,.2)',
              },
            },
          },
          {
            name: '库存',
            type,
            radius: '50%',
            center: ['60%', '50%'],
            data: inventorysData,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0,0,0,.2)',
              },
            },
          },
        ],
      }
    } else {
      option = {
        title: {
          text: '',
        },
        tooltip: {},
        legend: {
          data: ['销量', '库存'],
        },
        xAxis: {
          data: category,
        },
        yAxis: {},
        series: [
          {
            name: '销量',
            type,
            data: sales,
          },
          {
            name: '库存',
            type,
            data: inventorys,
          },
        ],
      }
    }
    return option
  }
  update = () => {
    this.setState({ isDisabled: true })
    this.getCategoryList()
  }
  render() {
    const { isDisabled, isLoading } = this.state
    const { type } = this.props.match.params
    return (
      <Card
        loading={isLoading}
        title={
          <Button
            disabled={isDisabled}
            icon={isDisabled ? <LoadingOutlined /> : <UndoOutlined />}
            onClick={this.update}
          >
            更新
          </Button>
        }
      >
        <ReactEcharts option={this.getOption(type)} />
      </Card>
    )
  }
}
export default Charts
