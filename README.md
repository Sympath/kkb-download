## 前言

这是一个面向 kkb 课程的视频抓取工具，只需要登陆一次，就可以把自己的 vip 课程都下载到本地

## 具体步骤

完成配置：登陆官网，获取 cookies，全局搜索【配置 1】填写 cookies；（如果有多个账号，可以全局搜索【配置 2】填写名称）；

1. 信息生成：执行`npm run formatConfig`；会生成 currentConfig 目录及其下对应配置文件
2. 执行`npm install`：进行安装依赖
3. 执行`npm run build1`：触发接口，生成所有 vip 课程的目录结构、静态资源和对应所有课程视频转码 ffepmg 命令
4. 执行`npm run build2`：收集所有 vip 课程的 ffepmg 命令 txt 文件，生成一个对象，【key 是文件地址；val 是对应的子目录数组】
5. 执行`npm run build3`：根据命令生成对应的`download.sh`脚本文件，包含所有 ffepmg 命令

### 云服务器情况

6. 执行`npm run build4-linux`：触发此 download.sh，挂载在后台进行下载启动
   如果出现无权限问题，可以执行如下命令进行处理：sudo chmod 777 ./

### 无云服务器情况

7. 执行`npm run build4`：触发此 download.sh
   如果出现无权限问题，可以执行如下命令进行处理：sudo chmod 777 ./

## ffmpeg

### linux 下安装 ffmpeg 的详细教程

- ffmpeg 开启 https 协议：https://blog.csdn.net/w839687571/article/details/99707201

一、centos linux 下安装 ffmpeg

1、下载解压

```
wget http://www.ffmpeg.org/releases/ffmpeg-3.1.tar.gz
tar -zxvf ffmpeg-3.1.tar.gz
```

2、 进入解压后目录,输入如下命令/usr/local/ffmpeg 为自己指定的安装目录

```
cd ffmpeg-3.1
```

```
./configure --prefix=/usr/local/ffmpeg
```

```
make && make install
```

3、配置变量

```
vi /etc/profile
```

在最后 PATH 添加环境变量：

```
export PATH=$PATH:/usr/local/ffmpeg/bin
```

保存退出
查看是否生效

```
source /etc/profile 设置生效
```

复制
4、查看版本

```
ffmpeg -version 查看版本
```

复制
注意：

若安装过程中出现以下错误：

yasm/nasm not found or too old. Use –disable-yasm for a crippled build.
If you think configure made a mistake, make sure you are using the latest
version from Git. If the latest version fails, report the problem to the
ffmpeg-user@ffmpeg.org mailing list or IRC #ffmpeg on irc.freenode.net.
Include the log file “config.log” produced by configure as this will help
solve the problem.

需要安装 yasm

```
wget http://www.tortall.net/projects/yasm/releases/yasm-1.3.0.tar.gz
tar -zxvf yasm-1.3.0.tar.gz
```

```
cd yasm-1.3.0
```

```
./configure && make && make install
```

复制
二、debian 安装 ffmpeg

1、编辑/etc/apt/sources.list 加入

deb http://www.deb-multimedia.org jessie main
复制
2、安装 ffmpeg

sudo apt-get update
sudo apt-get install deb-multimedia-keyring
sudo apt-get install ffmpeg
复制
到此这篇关于 linux 下安装 ffmpeg 的详细教程的文章就介绍到这了,更多相关 linux 安装 ffmpeg 内容请搜索 ZaLou.Cn 以前的文章或继续浏览下面的相关文章希望大家以后多多支持 ZaLou.Cn！

## 会议留存问题

1. webpack 源码如何调试
2. 失败的课程会遗失
3. 数据存储形式可以考虑优化
4. 已下载课程进行记录、缓存
5. github 记得删仓库
6. 自动上传百度云盘（此外，需考虑云服务器空间问题，https://tsukkomi.org/post/download-baidu-pan-with-bypy）

### 你是怎么理解 JWT

JSON Web Token（JWT）是一个用于多方以 json 格式进行信息传输的传输形式标准，是目前最流行的跨域认证解决方案，在此之前是 session 认证；而 jwt 出现的意义在于解决了传统 session 认证会导致身份信息在服务端存储过多，不宜扩展的问题；具体解决核心点在于 JWT 模式下，会以【Header + Payload + Signature】的形式生成一个字符串，一般存放在请求头的 Authorization 字段上，以 Bear 协议作为前缀，身份信息存在 Payload 中；这样将身份信息放在客户端进行存储，每次请求携带给服务端，就解决 session 存储的问题了。
而客户端存储的安全问题则是通过 Signature 签名保证，Signature 是经由 Header、Payload 和一个 secret（只保存在服务端的密钥）一起 Base64 组成的，这就能保证不被串改了。

## 个人常用命令

将本地的仓库上传至服务器

```
 rsync -av /Users/wzyan/Documents/selfspace/ffmpeg-download  root@82.157.62.28:/root/kkb-download --exclude='node_modules'  --exclude '.git'
```

将远端生成好的 sh 脚本文件放在本地来看看

```
 scp root@82.157.62.28:/root/kkb-download/ffmpeg-download/download.sh  /Users/wzyan/Documents/selfspace/ffmpeg-download/
```

如何结束掉 nuhup 的执行

1. ps 命令查询：其中 download.sh 是执行的文件名； grep -v grep 的作用是过滤 grep 本身
2. kill 杀死进程 id

```
ps -aux | grep download.sh | grep -v grep
kill -9 进程id
```

查看命令对应精准启动时间

```
ps -eo pid,lstart,etime,cmd |grep download.sh
```

![20220810220632](https://raw.githubusercontent.com/Sympath/imgs/main/20220810220632.png)

## 脚本执行

脚本仓库：https://github.com/Sympath/download-sh

## 网页端入口实现流程

参考 vue-ui，实现一个 web 应用，用于生成 download 仓库并一键启动抓取动作；以下环境均是 linux

1. 提示用户输入 cookie 和用户名（用于包裹最外层），点击克隆 git 仓库`kkb-download`，并替换对应配置；
2. 安装依赖按钮：点击安装依赖，执行依赖安装命令`npm run download`；并且默认运行`npm run watch`
3. 启动生成配置按钮：点击执行`npm run formatConfig`
4. 生成脚本按钮：点击执行`npm run build1 && npm run build2 && npm run build3`
5. 开始爬取按钮：点击执行`npm run build4-linux`

## 应用架构

1. kkb-Web：用户端(谷歌插件)，输入 cookie 和包名，发起请求从而触发下载；其中 isDev 开启时就会触发本地的 3000 端口(https://github.com/Sympath/kkb-down-web)
2. kkb-serve：服务端，接收请求，接收后进行下载【download-sh】仓库并输入依赖，执行课程下载流程（https://github.com/Sympath/download-serve）
3. download-sh：下载流程脚本（https://github.com/Sympath/download-sh）
4. kkb-download：核心下载模块（https://github.com/Sympath/kkb-download）

## 缓存

在课程下载中存在失败的情况，这时就需要进行缓存，避免

1. token 不同、课程名称相同时重复
2. 下载失败得重头再来的情况，缓存处理如下

shDownload_1 文件在生成 sh 脚本时
解决问题一

1. 视频维度的去重：cacheManage 以视频名称为标识，如果同一名称就不再记录

解决问题二

2. 小节维度的去缓存：当小节下载成功后，将对应记录命令的 txt 文件改名为 txt.cache
3. 课程级别的去缓存：当课程下载完成后会删除 output 中的课程资源，而读取命令的 getFileArr_1.js 中如果文件不存在则不进行读取记录；目前改为直接读取 output 中的目录，从而做到只要【上传完就删，一定不会重复读取】

## 常用命令

查看日志

```
cd kkb-down/download-serve/all-kkb/baozihi426/ && cat all.log
```

## 问题处理

PUPPETEER_SKIP_DOWNLOAD：处理 puppeteer 安装出错问题 https://github.com/puppeteer/puppeteer/issues/6492
npm install --ignore-scripts puppeteer
