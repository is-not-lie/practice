import React, { Component } from 'react'
import ReactEcharts from 'echarts-for-react'
import { message } from 'antd'
import { getGoodsCategory } from '../../api'
export default class Line extends Component {
  state = {
    porduct: [],
  }
  componentDidMount () {
    ; (async () => {
      const { status, data } = await getGoodsCategory()
      if (status === 0) {
        const porduct = [...this.state.porduct]
        data.forEach((item) => porduct.push(item.name))
        this.setState({ porduct })
      } else message.error('获取商品信息失败，请联系管理人员')
    })()
  }
  getOption = () => ({
    title: {
      text: '折线图',
    },
    tooltip: {},
    xAxis: {
      data: this.state.porduct,
    },
    yAxis: {},
    series: [
      {
        name: '销量',
        type: 'line',
        data: [5, 20, 36, 10, 10, 20],
      },
    ],
  })
  render () {
    return <ReactEcharts option={this.getOption()} />
  }
}
