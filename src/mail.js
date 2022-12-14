const nodemailer = require("nodemailer");
const args = require('minimist')(process.argv.slice(2))
let userName = args['name'];
let courseName = args['courseName'];
let userLink = `https://pan.baidu.com/disk/main?from=homeFlow#/index?category=all&path=%2Fapps%2Fbypy%2F${userName}%2F${courseName}`
let transporter = nodemailer.createTransport({
  service: "qq",
  port: 465, // SMTP端口 发邮件的端口
  secureConnection: true, // 使用SSL 加密传输服务
  auth: {
    user: "3101885298@qq.com", // 发件人地址
    pass: "xjqeqhtsojyadeid", // 这不是邮箱密码，而是授权码；需要在 qq邮箱 - 设置 - 账户 - 生成授权码  获取
  },
});

let mailOptions = {
  from: "3101885298@qq.com 王志远", // 邮件中的【发件人】栏信息
  to: "3101885298@qq.com", // 收件人
  subject: `开课吧下载工具-${userName}的课程下载成功啦`, // 邮件标题
  html: `<h1>课程名：${courseName}</h1>分享课程访问地址：${userLink}`, // 内容
};

transporter.sendMail(mailOptions, (err, info) => {
  console.log(err, info);
  console.log("消息已发送");
});
