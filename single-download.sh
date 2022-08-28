m3u8Url=$0
bypyDir=$1
bypyFullDir=$2
filename=$3

echo "获取到的地址为：${m3u8Url}"
ffmpeg -i $m3u8Url -c copy -bsf:a aac_adtstoasc ./${filename}.mp4
echo "下载完成"
bypy upload ./${filename}.mp4 bypyFullDir
echo "上传云盘完成，邮件通知下"
node src/mail.js --name=${bdypDir} --courseName=${filename}
echo "邮件通知成功，可访问地址确定：https://pan.baidu.com/disk/main?from=homeFlow#/index?category=all&path=%2Fapps%2Fbypy%2F${bypyFullDir}✅"
