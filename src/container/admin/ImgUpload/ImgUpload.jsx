import React, { Component } from 'react'
import { Upload, Modal, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { BASE_URL } from '../../../config'
import { reqRemoveImg } from '../../../api'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

class ImgUpload extends Component {
  state = {
    previewVisible: false, // 控制图片预览窗的展示
    previewImage: '', // 预览图片的 URL 或 Base64
    previewTitle: '', // 预览图片的名称
    fileList: [],
  }
  // 关闭图片预览窗
  handleCancel = () => this.setState({ previewVisible: false })
  // 展示图片预览窗
  handlePreview = async (file) => {
    // 如果图片没有url也没有转换称Base64，则调用getBase64方法将图片转换为Base64
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle:
        file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    })
  }
  // 图片状态发生改变的回调
  handleChange = async ({ file, fileList }) => {
    if (file.status === 'done') {
      let url = `${BASE_URL}/${file.response.data.url
        .split('/')
        .splice(3)
        .join('/')}`
      fileList[fileList.length - 1].url = url
      fileList[fileList.length - 1].name = file.response.data.name
    }
    if (file.status === 'removed') {
      const data = await reqRemoveImg(file.name)
      if (data) message.success('图片删除成功')
    }
    this.setState({ fileList })
  }
  // 获取图片数组的回调
  getImgArr = () => {
    let result = []
    this.state.fileList.forEach((item) => result.push(item.name))
    return result
  }
  setImgArr = (imgArr) => {
    let fileList = imgArr.map((item, i) => ({
      uid: -i,
      name: item,
      url: `${BASE_URL}/upload/${item}`,
    }))
    this.setState({ fileList })
  }
  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div className="ant-upload-text">上传图片</div>
      </div>
    )
    return (
      <div className="clearfix">
        <Upload
          // 接收图片服务器的地址
          action={`${BASE_URL}/upload`}
          // 请求方式
          method="post"
          // 发给服务器的参数名称
          name="image"
          // 照片墙的样式
          listType="picture-card"
          // 展示图片列表：[{uid,name,status,url}]
          fileList={fileList}
          // 点击预览小眼睛的回调
          onPreview={this.handlePreview}
          // 图片状态改变的回调
          onChange={this.handleChange}
        >
          {/* 控制图片上传数量，大于限制数量时隐藏图片上传按钮 */}
          {fileList.length >= 4 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    )
  }
}
export default ImgUpload
