import JSZip from 'jszip';
/**
 * 前端图片处理一些工具方法，获取图片类型、获取图片文件数据，前端回显、按比例压缩图片、压缩图片到指定大小
 * @example
 * import {compressImageToSize, getImageFileInfo} from 'path/to/image-utils';
 *
 * handleChange = (e) => {
 *     const images = [...this.state.images];
 *     if (!e.target.files) return;
 *     Array.from(e.target.files).forEach(f => getImageFileInfo(f, (info, err) => {
 *         if (err) return;
 *         compressImageToSize({
 *             data: info.data,
 *             type: info.type,
 *         }).then(imageData => {
 *             images.push(<span><img src={imageData} alt={info.name}/> data size: {imageData.length / 1024} K</span>);
 *             this.setState({images});
 *         });
 *     }));
 *     // 清空value 允许上传相同文件
 *     e.target.value = '';
 * }
 *
 * render() {
 *     const {images} = this.state;
 *     return (
 *         <div>
 *             <input type="file" multiple onChange={this.handleChange}/>
 *             {images.map((item, index) => <div key={index}>{item}</div>)}
 *         </div>
 *     );
 * }
 * @module 前端图片操作
 */

/**
 * 根据文件名，获取图片类型，如果有返回值，说明此文件是图片，只支持jpg、jpeg、gif、png四中图片格式
 * @param fileName
 * @returns {*}
 */
export function getImageType(fileName) {
    const imageTypes = [
        'jpg',
        'jpeg',
        'gif',
        'png',
    ];
    if (fileName) {
        const nameArr = fileName.split('.');
        if (nameArr && nameArr.length) {
            let type = nameArr[nameArr.length - 1];
            type = type.toLowerCase();
            if (imageTypes.includes(type)) {
                return `image/${type}`;
            }
        }
    }
    return false;
}

/**
 * 获取图片数据，可直接赋值到img的src属性，进行显示
 * @param {Blob} file 用户选择的图片文件
 * @returns {Promise}
 */
export function getImageData(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

/**
 * 图片压缩，接受一个options参数，具体参数如下：
 * @param {string} data 图片数据 FileReader readAsDataURL方法得到的数据
 * @param {string} [type='image/jpeg'] 处理完之后的图片类型
 * @param {Number} [quality=0.8] 图片压缩比例
 * @returns {Promise}
 */
export function compressImage({
    data,
    type = 'image/jpeg',
    quality = 0.8,
}) {
    if (!data) return;
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const img = new Image();
        img.onload = function () {
            img.width *= quality;
            img.height *= quality;
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;

            // canvas清屏
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // 将图像绘制到canvas上
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // 必须等压缩完才读取canvas值，否则canvas内容是黑帆布
            resolve(canvas.toDataURL(type));
        };
        img.onerror = reject;
        // 记住必须先绑定事件，才能设置src属性，否则img没有内容可以画到canvas
        img.src = data;
    });
}

/**
 * 将图片压缩到指定大小，目前算法不够准确
 * @param {string} data 图片数据 FileReader readAsDataURL方法得到的数据
 * @param {string} [type='image/jpeg'] 处理完之后的图片类型
 * @param {Number} [size=300 * 1024] 压缩后大小
 * @returns {Promise}
 */
export function compressImageToSize({
    data,
    type = 'image/jpeg',
    size = 300 * 1024, // 默认 300K左右
}) {
    if (data.length < size) {
        return Promise.resolve(data);
    }
    // TODO 这个算法不准确，但是可以压缩到size以内
    // 通过data.length获取的大小，跟图片实际大小不同，data.length要大一些

    const quality = Math.sqrt(size / data.length);
    return compressImage({
        data,
        type,
        quality,
    });
}

/**
 * 根据用户上传的文件，获取图片信息，支持zip解压，获取zip包中的图片
 * @param {Blob} file 任意文件，如果是zip，函数内部会解压，获取其中的图片信息
 * @param {Function} cb 获取图片信息的回调函数
 */
export function getImageFileInfo(file, cb) {
    const fileName = file.name;
    const fileSize = file.size;
    const fileType = file.type;
    const imageType = getImageType(fileName);
    if (imageType) { // 是图片
        getImageData(file).then(data => {
            cb({
                name: fileName,
                size: fileSize,
                type: fileType,
                data,
            });
        }, err => cb(null, err));
        return;
    }
    JSZip.loadAsync(file)
        .then(zip => {
            zip.forEach((relativePath, zipEntry) => {
                const name = zipEntry.name;
                const imgType = getImageType(name);
                if (!zipEntry.dir && imgType) { // 是图片
                    zipEntry.async('base64')
                        .then(content => cb({
                            name,
                            size: content.length,
                            type: imgType,
                            data: `data:${imgType};base64,${content}`,
                        }), err => cb(null, err));
                }
            });
        }, err => cb(null, err));
}