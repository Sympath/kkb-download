echo '1'
ffmpeg -i https://v.baoshiyun.com/resource/media-862177870184448/lud/f09353774383465cbdebf8f606e74922.m3u8?MtsHlsUriToken=fcd0059e14bb44ddabf4d6ad3c965963a213267349ee46b385388b499a46c220 -c copy -bsf:a  aac_adtstoasc ./output/【2023考研公共课】数学二/1.【数学二】基础精讲/1.【高数】基础精讲/【数学】高数基础精讲1--01.mp4
