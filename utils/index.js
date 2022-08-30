import URI from "urijs";
// const URI = require("urijs");
let utils = {};

/**
 * 为 url 做字符串拼接，覆盖重复的query
 * @param {String} url
 * @param {Object} query
 */
let assignQuery = (url = "", query = {}) => {
  let uri = new URI(url);
  Object.keys(query).forEach((key) => {
    if (uri.hasQuery(key)) uri.removeQuery(key);
  });
  return uri.addQuery(query).toString();
};

/**
 * 类型判断函数 传递一个要判断的类型 会返回一个函数 传要判断的值 返回是否属于之前的类型
 * @param {*} type 是否是此类型
 * @returns
 */
function typeCheck(type) {
  let types = [
    "Array",
    "Object",
    "Number",
    "String",
    "Undefined",
    "Boolean",
    "Function",
    "Map",
    "Null",
  ];
  let map = {};
  types.forEach((type) => {
    map[type] = function (target) {
      return Object.prototype.toString.call(target) === `[object ${type}]`;
    };
  });
  return map[type];
}
/**
 * 遍历对象 直接获取key value  （不会遍历原型链  forin会）
 * @param {*} obj 被遍历对象
 * @param {*} cb 回调
 */
export function eachObj(obj, cb) {
  if (typeCheck("Map")(obj)) {
    for (let [key, value] of obj) {
      cb(key, value);
    }
  } else if (typeCheck("Object")(obj)) {
    for (const [key, value] of Object.entries(obj)) {
      cb(key, value);
    }
  } else {
    console.log("请传递对象类型");
  }
}
// 处理命令的敏感词
export function filterName(name) {
  const reg = /[`【】()（）\r\n[\]]/gim
  name = name.replace(/、/g, '.')
  // 处理空格
  name = name.replace(/ /g, '-')
  return name.replace(reg, '')
}

export default {
  typeCheck,
  eachObj,
  filterName,
  assignQuery
};
