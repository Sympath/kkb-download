const URI = require("urijs");

/**
 * 判断是否是微医域名
 * @param {Mixin} url 地址或 uri
 */
const getHostName = function (uri) {
  uri = new URI(uri);
  return uri.hostname();
};
module.exports = {
  getHostName,
};
