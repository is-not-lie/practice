// 商品相关表单验证规则
export const categoryRules = [{ required: true, message: '分类名不能为空' }]
// 添加/修改商品相关验证规则
export const productRules = {
  name: { required: true, message: '商品名称不能为空' },
  desc: { required: true, message: '商品描述不能为空' },
  price: { required: true, message: '商品价格不能为空' },
  categoryId: { required: true, message: '商品分类不能为空' },
}
