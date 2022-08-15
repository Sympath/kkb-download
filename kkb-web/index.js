const request = require("request");
const URI = require('urijs');
// let cookie = 'sajssdk_2015_cross_new_user=1; Hm_lvt_156e88c022bf41570bf96e74d090ced7=1660472444; gr_user_id=263c0cb4-79e2-46cf-9ae9-1a52ddcc58c7; 99f53b614ce96c83_gr_session_id=09699c41-4b92-4a09-b44e-d10ad0cb2d26; 99f53b614ce96c83_gr_session_id_09699c41-4b92-4a09-b44e-d10ad0cb2d26=true; deviceId=5386f84a5dfb0925bc4befccd60f68c3; ssoToken=c62557b11ee53920e477f179e16bb1d1; passportUid=60271236; access-edu_online=63b13a197af488500997e6e130fe5b0b; Hm_lpvt_156e88c022bf41570bf96e74d090ced7=1660472592; sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%2260271236%22%2C%22first_id%22%3A%221829bdebb22e8a-092da6cdc8840a-1b525635-2007040-1829bdebb2397f%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E7%9B%B4%E6%8E%A5%E6%B5%81%E9%87%8F%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC_%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%22%2C%22%24latest_referrer%22%3A%22%22%7D%2C%22%24device_id%22%3A%221829bdebb22e8a-092da6cdc8840a-1b525635-2007040-1829bdebb2397f%22%2C%22identities%22%3A%22eyIkaWRlbnRpdHlfY29va2llX2lkIjoiMTgyOWJlMTI3OWZiZGEtMGMxZmIxNTZiY2VkNjM4LTFiNTI1NjM1LTIwMDcwNDAtMTgyOWJlMTI3YTBkOWUiLCIkaWRlbnRpdHlfbG9naW5faWQiOiI2MDI3MTIzNiJ9%22%2C%22history_login_id%22%3A%7B%22name%22%3A%22%24identity_login_id%22%2C%22value%22%3A%2260271236%22%7D%7D; kkb_edu_session=eyJpdiI6Imx3bzZrQ1hBamFwbTBXTDZpYThmRGc9PSIsInZhbHVlIjoiakR3TzhlaG5vdzVCakxoMkhOVXJiSkNaR1doYjRIZDk0blQ4VlY1cGZmTW9hZzNOemExM2piYjRyUWxjU0d4ZSIsIm1hYyI6ImRkNzA5NWYyM2FiZjk0NzkzZTJmYzhmNTczZTYwNTc0OGI3ZTFkODUyMTFkNDlmZGUwZjI0Y2I4ZmExOTc3MjMifQ%3D%3D'
// let name = 'yuyuli315';
let cookie = '99f53b614ce96c83_gr_last_sent_cs1=42708337; figui=7pIX3E3CTsV8A724; gr_user_id=1c3f6ba3-d5d6-46c3-b69b-5aace6133a44; kd_user_id=82472e37-4cef-438c-aed0-3d6d185d1697; topic_visitor=bf28ea1e-4bb5-216e-669f-7465ad24df95; Hm_lvt_156e88c022bf41570bf96e74d090ced7=1660443959,1660471390,1660488764,1660523438; deviceId=0c908e266a1c3cf920fc5bb87ff7e088; 99f53b614ce96c83_gr_session_id=d879bc33-4802-4b42-9387-ca185c48b70c; 99f53b614ce96c83_gr_last_sent_sid_with_cs1=d879bc33-4802-4b42-9387-ca185c48b70c; 99f53b614ce96c83_gr_session_id_d879bc33-4802-4b42-9387-ca185c48b70c=true; ssoToken=c9e85d77ced750e84200bde6c4757e46; passportUid=91427846; access-edu_online=d38141de99d121ac1d15686b616703e7; Hm_lpvt_156e88c022bf41570bf96e74d090ced7=1660525591; sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%2291427846%22%2C%22first_id%22%3A%2217a7bb29ffc2e5-0aa7a58a2610ff-34647600-2073600-17a7bb29ffda98%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E7%9B%B4%E6%8E%A5%E6%B5%81%E9%87%8F%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC_%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%22%2C%22%24latest_referrer%22%3A%22%22%7D%2C%22%24device_id%22%3A%2217a7bb29ffc2e5-0aa7a58a2610ff-34647600-2073600-17a7bb29ffda98%22%2C%22identities%22%3A%22eyIkaWRlbnRpdHlfY29va2llX2lkIjoiMTdlNmRhZTM3NDI3NDItMDYyNDBjMTQ4MjEyNjZjLTFkMzI2MjUzLTIwMDcwNDAtMTdlNmRhZTM3NDMxMDhiIiwiJGlkZW50aXR5X2xvZ2luX2lkIjoiOTE0Mjc4NDYifQ%3D%3D%22%2C%22history_login_id%22%3A%7B%22name%22%3A%22%24identity_login_id%22%2C%22value%22%3A%2291427846%22%7D%7D; kkb_edu_session=eyJpdiI6IkVUWjJDMHJEQWRUYk1MYkdiaHV5UWc9PSIsInZhbHVlIjoibFFvaGVcL2c3SU91Y2Yya0lcL0lNNCtUV1RCa0o3S1JmdVpqQWcxT3ZjdVp4UllBRzRRYW1mVzVFZVp4MThnSjBpIiwibWFjIjoiYmIyYmVjNDQ0ZTc1Njk4NGFmMDhmNTZiMzFkMTMxYmFlN2ZiNTY5NGRjM2IyNTVlMGY5NWVkYmI5NmVkOGQwZiJ9; 99f53b614ce96c83_gr_cs1=42708337'
let name = 'baozihi426';
let isDev = false; // 开启本地模式
let host = isDev ? 'http://localhost:3000' : 'http://82.157.62.28:3000'
let query = {
    name,
    cookie: encodeURIComponent(cookie)
}
if (!isDev) {
    query.headless = false
}
let uri = new URI(`${host}/start`);
let url = uri.addQuery(query).toString()
let options = {
    url,
    method: "GET",
    json: true,
    headers: {
        "Content-Type": "application/json",
    }
};
console.log(options);
request(options, function (err, response, body) {
    console.log(err);
    console.log(body);
});
