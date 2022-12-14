# 解决相对路径问题 先进入脚本所在的目录，往上一层就是根目录了
cd $(dirname $0)
cd '..'
while read line; do
    eval "$line"
done <./config/single-download-config

echo "获取到的地址为：${m3u8Url}"
ffmpeg -i $m3u8Url -c copy -bsf:a aac_adtstoasc ./${courseName}.mp4
echo "下载完成"
bypy upload ./${courseName}.mp4 ${bypyDir}/${bypyFullDir}
echo "上传云盘完成，邮件通知下"
rm -rf ./${courseName}.mp4
echo "删除资源完成"
node src/mail.js --name=${bdypDir} --courseName=${courseName}
echo "邮件通知成功，可访问地址确定：https://pan.baidu.com/disk/main?from=homeFlow#/index?category=all&path=%2Fapps%2Fbypy%2F${bypyDir}/${bypyFullDir}✅"
