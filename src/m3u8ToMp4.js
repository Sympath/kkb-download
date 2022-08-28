/**
 * 功能： 下载 M3U8 地址的视频并保存成 MP4 格式
 * 说明： 本模块修改自NPM模块 m3u8-to-mp4 ， 原模块地址： https://www.npmjs.com/package/m3u8-to-mp4
 *  
 */

let ffmpeg = require("fluent-ffmpeg");
let log = require('single-line-log').stdout;

/**
 * A class to convert M3U8 to MP4
 * @class
 */
class m3u8ToMp4Converter {
    /**
     * Sets the input file
     * @param {String} filename M3U8 file path. You can use remote URL
     * @returns {Function}
     */
    setInputFile(filename) {
        if (!filename) throw new Error("您必须指定M3U8文件地址");
        this.M3U8_FILE = filename;

        return this;
    }

    /**
     * Sets the output file
     * @param {String} filename Output file path. Has to be local :)
     * @returns {Function}
     */
    setOutputFile(filename) {
        if (!filename) throw new Error("您必须指定文件路径和名称");
        this.OUTPUT_FILE = filename;

        return this;
    }

    /**
     * Starts the process
     */
    start() {
        return new Promise((resolve, reject) => {
            if (!this.M3U8_FILE || !this.OUTPUT_FILE) {
                reject(new Error("您必须指定输入和输出文件"));
                return;
            }

            console.log('=========================');

            ffmpeg(this.M3U8_FILE)
                .on("error", error => {
                    reject(new Error(error));
                })
                .on('progress', function (progress) {
                    log('下载进度: 已完成 ' + (progress.percent).toFixed(2) + '%。');
                })
                .on("end", () => {
                    log('下载进度: 已完成 100%。\n');
                    console.log('=========================');
                    resolve();
                })
                .outputOptions("-c copy")
                .outputOptions("-bsf:a aac_adtstoasc")
                .output(this.OUTPUT_FILE)
                .run();
        });
    }
}

module.exports = m3u8ToMp4Converter;
