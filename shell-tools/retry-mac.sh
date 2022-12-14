# 解决相对路径问题 先进入脚本所在的目录，往上一层就是根目录了
cd $(dirname $0)
cd '..'
npm run formatConfig
# 1. 进行webpack编译
npm run build
npm run build1
npm run build
# 2. 根据当前output内剩余课程的txt
npm run build2
npm run build
# 3. 再次生成数据结构并再次生成download.sh
npm run build3
npm run build
# 4. 执行download.sh进行重传
npm run build4-mac
