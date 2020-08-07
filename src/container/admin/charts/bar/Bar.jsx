import React, { Component } from 'react'
import ReactEcharts from 'echarts-for-react'
import { message } from 'antd'
import { getGoodsCategory } from '../../api'
export default class Bar extends Component {
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
      text: '柱状图',
    },
    tooltip: {},
    xAxis: {
      data: this.state.porduct,
    },
    yAxis: {},
    series: [
      {
        name: '销量',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20],
      },
    ],
  })
  render () {
    /* 
      数据可视化：
        echarts（百度的）
        D3
        highCharts
    */
    return <ReactEcharts option={this.getOption()} />
  }
}
