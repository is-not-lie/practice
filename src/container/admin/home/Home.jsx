import React, { Component } from 'react'
import { connect } from 'react-redux'
import '../../../less/Home.less'
import { BASE_URL } from '../../../config'
@connect((state) => ({ userInfo: state.userInfo }))
class Home extends Component {
  state = {
    stars: [],
  }
  componentDidMount() {
    this.canvasMove()
    window.onresize = this.canvasMove
  }
  componentWillUnmount() {
    clearInterval(this.timeKey)
    window.onresize = null
  }
  canvasMove = () => {
    clearInterval(this.timeKey)
    const oc = this.oc
    const home = this.home
    oc.width = home.offsetWidth
    oc.height = home.offsetHeight
    const ctx = oc.getContext('2d')
    const stars = []
    const starCont = (oc.width + oc.height) / 8
    for (let i = 0; i < starCont; i++) {
      stars.push({
        x: Math.random() * oc.width,
        y: Math.random() * oc.height,
        r: Math.random(),
      })
    }
    this.timeKey = setInterval(() => {
      ctx.clearRect(0, 0, oc.width, oc.height)
      stars.forEach((item) => {
        if (item.x > oc.width) item.x = Math.random() * oc.width
        if (item.y > oc.height) item.y = Math.random() * oc.height
        item.x += Math.random()
        item.y += Math.random()
      })
      stars.forEach((item) => {
        ctx.save()
        ctx.fillStyle = `rgba(250,250,250,.8)`
        ctx.beginPath()
        ctx.arc(item.x, item.y, item.r, 0, 360)
        ctx.fill()
        ctx.restore()
      })
    }, 1000 / 60)
  }
  render() {
    const { username, avatar } = this.props.userInfo.user
    return (
      <div className="home" ref={(ref) => (this.home = ref)}>
        <img src={`${BASE_URL}/${avatar}`} alt="用户头像" />
        <h2>欢迎，{username}</h2>
        <canvas className="canvas" ref={(ref) => (this.oc = ref)}></canvas>
      </div>
    )
  }
}
export default Home
