import {
    loadFileNameByPath4Ext,
    writeFileRecursive,
    deleteFileInDir
} from '../../utils/node-api';
import path from 'path';
import * as config from '../../config/index.js';

// 清空下载内容
deleteFileInDir(`${__dirname.replace('/src', '').replace('/dist', '')}`, ['mp4'])