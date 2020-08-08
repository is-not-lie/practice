import React, { Component } from 'react'
import { connect } from 'react-redux'
import ReactEcharts from 'echarts-for-react'
import { reqCategoryList } from '../../../api'
@connect((state) => ({ categoryList: state.categoryList }))
class Charts extends Component {
  state = {
    category: [],
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
      this.setState({ category })
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

  render() {
    return <ReactEcharts option={this.getOption()} />
  }
}
export default Charts
