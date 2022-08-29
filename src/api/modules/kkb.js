import axios from 'axios'
import * as fs from 'fs'
axios.defaults.timeout = 30000;
const requestConfig = {
    headers:
    {
        Authorization: '',
        cookie: ''
    }
}
// 课程接口，可以获取所有章id
export const initConfig = async function (Authorization, cookie) {
    requestConfig.headers.Authorization = Authorization
    requestConfig.headers.cookie = cookie
}
// 课程接口，可以获取所有章id
export const getCourseInfo = async function (course_id) {
    let courseUrl = `https://weblearn.kaikeba.com/student/courseinfo?course_id=${course_id}&__timestamp=1653898285046`;
    let { data } = await axios.get(courseUrl, requestConfig)
    return data
}
// 章详情接口，可以获取章下对应所有节id
export const getChapterInfo = async function (course_id, chapter_id) {
    let chapterUrl = `https://weblearn.kaikeba.com/student/chapterinfo?course_id=${course_id}&chapter_id=${chapter_id}`;
    let { data } = await axios.get(chapterUrl, requestConfig)
    return data

}
// 节详情，可以获取节下所有对应课程视频地址
export const getMediaInfo = async function (params) {
    let mediaUrl = 'https://api-vod.baoshiyun.com/vod/v1/platform/media/detail'
    let { data } = await axios.get(mediaUrl, { ...requestConfig, params })
    let { code, msg } = data
    if (code === -1003) {
        throw new Error(params.mediaId + msg)
    }
    return data
}

export const getStaticFile = async function (url, fileAbsPath) {
    const writer = fs.createWriteStream(fileAbsPath)
    const response = await axios({ url, responseType: 'stream' })
    response.data.pipe(writer)
}


