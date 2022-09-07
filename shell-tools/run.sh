# 解决相对路径问题 先进入脚本所在的目录，往上一层就是根目录了
cd $(dirname $0)
cd '..'
echo "开始 ***********✅"
npm run build
npm run build1
# npm run build-sh
echo "完成 *********** ✅"
