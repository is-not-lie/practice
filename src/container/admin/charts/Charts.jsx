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
  }
  componentDidMount() {
    this.getCategoryList()
  }
  getCategoryList = async () => {
    const { categoryList } = this.props
    const data = categoryList.length ? categoryList : await reqCategoryList()
    if (data) {
      const category = []
      data.forEach((item) => category.push(item.name))
      this.setState({ category, isDisabled: false, isLoading: false })
    }
  }
  getOption = () => ({
    title: {
      text: '',
    },
    tooltip: {},
    xAxis: {
      data: this.state.category,
    },
    yAxis: {},
    series: [
      {
        name: '销量',
        type: this.props.match.params.type,
        data: [5, 20, 36, 10, 10, 20],
      },
    ],
  })
  update = () => {
    this.setState({ isDisabled: true })
    this.getCategoryList()
  }
  render() {
    const { isDisabled, isLoading } = this.state
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
        <ReactEcharts option={this.getOption()} />
      </Card>
    )
  }
}
export default Charts
