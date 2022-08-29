# 解决相对路径问题 先进入脚本所在的目录，往上一层就是根目录了
cd $(dirname $0)
cd '..'
npm run formatConfig
# 1. 进行webpack编译
npm run build
npm run build1
