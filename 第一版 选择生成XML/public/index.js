'use strict';

/**
 * 公用函数
 * */
const isArray = (arr) => {
  return (Object.prototype.toString.call(arr) === '[object Array]');
};
const isString = (str) => {
  return (Object.prototype.toString.call(str) === '[object String]');
};
const isNull = (str) => {
  return (str === '' || str === null || str === undefined || str === []);
};
let Zero = {
	toJSON(str) {
		if (typeof str == 'string') {
			try {
				str = JSON.parse(str);
				return str;
			} catch (e) {
				console.log(e);
				return {};
			}
		}
	},
	GetQueryString(name) {
		let search = window.location.search;
		let hash = window.location.href.split('?')[1];
		search = search ? search : ('?' + hash);
		let url = decodeURIComponent(search);
		let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
		let r = url.substr(1).match(reg);  //匹配目标参数
		if (r != null) return unescape(r[2]); return null; //返回参数值
		// let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		// let r = window.location.search.substr(1).match(reg);
		// if(r!=null)return  unescape(r[2]); return null;
	},
	getPasteDate(imageCb, textCb, errorCb) {
		let paste = function (event) {
			if (event.clipboardData || event.originalEvent) {
				//某些chrome版本使用的是event.originalEvent
				let clipboardData = (event.clipboardData || event.originalEvent.clipboardData);
				if(clipboardData.items){
					let item = clipboardData.items[0];
					if (item && item.type.indexOf("image") !== -1) {
						let fill = item.getAsFile();
						imageCb && imageCb(fill);
					} else if (item && item.type.indexOf("text") !== -1) {
						item.getAsString( text => {
							textCb && textCb(text);
							console.log(text);
						});
					} else {
						errorCb && errorCb();
					}
				}
	        }
		};
		return paste;
	},
};
Date.prototype.format = function(format) { // new Date().format('yyyy-MM-dd hh:mm:ss')
  var o = {
    "M+" : this.getMonth()+1, //month
    "d+" : this.getDate(),    //day
    "h+" : this.getHours(),   //hour
    "m+" : this.getMinutes(), //minute
    "s+" : this.getSeconds(), //second
    "q+" : Math.floor((this.getMonth()+3)/3),  //quarter
    "S" : this.getMilliseconds() //millisecond
  }
  if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
    (this.getFullYear()+"").substr(4 - RegExp.$1.length));
  for(var k in o)if(new RegExp("("+ k +")").test(format))
    format = format.replace(RegExp.$1,
      RegExp.$1.length==1 ? o[k] :
        ("00"+ o[k]).substr((""+ o[k]).length));
  return format;
};
/**
 * 图片处理
 *
 * 加载、绘制、导出、黏贴、file转url、file转base64、转file、url下载、base64下载
 * TODO
 * 图片旋转
 * 图片裁剪
 *
 * 图片功能：
 *  1、导出： 大小、背景、
 * */

const _IMG = function (opt) {
	let canvas = document.createElement('canvas');
    this.url = opt.url || '';
    this.file = opt.file || null;
    this.base64 = opt.base64 || '';
    this.canvas = opt.canvas || canvas;
    this.quality = opt.quality || 0.7;
    this.type = opt.type || "image/jpeg";

    // event
    this.imageDrawAfter = opt.imageDrawAfter || function (myImg) {
    	return {x: 0, y: 0, w: myImg.width, h: myImg.height};
    }; // 返回绘制位置
    this.imageDownAfter = opt.imageDownAfter || function () {

    }; //

    this.init();
};
_IMG.prototype = {
	/** 有返回值/有异步 Promise */
    init() {
        this.img = null;
        this.ctx = null;
    },
    isData() {

    },
    isCanvas(canvas) {
        this.canvas = canvas || this.canvas;
        if (!this.canvas.getContext) {
            console.error('你的浏览器不支持HTML5 Canvas! ');
            return false;
        }
        this.ctx = this.canvas.getContext("2d");
        return true;
    },

	imageUrl(file) {
    	console.log('imageFileToUrl', this);

    	this.file = file;
        let URL = window.URL || window.webkitURL;
        let promise = new Promise((resolve, reject) => {
            if (URL.createObjectURL) {
                let url = URL.createObjectURL(file);
                this.url = url;
                resolve(url);
            } else {
                let oFileReader = new FileReader();
                oFileReader.onloadend = function(e) {
                    let base64 = e.target['result'];
                    this.url = base64;
                    resolve(base64);
                };
                oFileReader.readAsDataURL(file);
            };
        });
        return promise;
    },
	imageDom(url) {
    	console.log('imageUrlToDom', this);

        let promise = new Promise((resolve, reject) => {
            let myImg = new Image();
            myImg.crossOrigin = 'anonymous';
            myImg.onload = () => {
                this.img = myImg;
                this.canvas.width = myImg.width;
                this.canvas.height = myImg.height;
                resolve(myImg);
            };
            myImg.onerror = (err) => {
                reject(err);
            };
            myImg.src = url;
        });
        return promise;
    },
	imageFile(url) {
    	console.log('imageUrlToFile', this);

	},
	imageBase64(myImg, canvas) {
    	console.log('imageDomToBase64', this);

    	let promise = new Promise((resolve, reject) => {
            try {
                if (!this.isCanvas(canvas)) return Promise.reject();
		        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		        let p = this.imageDrawAfter(myImg);
		        this.ctx.drawImage(myImg, p.x, p.y, p.w, p.h);
		        let base64 = this.canvas.toDataURL(this.type, this.quality);
		        this.base64 = base64;
                resolve(base64);
            } catch (e) {
                reject(e);
            }
        });
        return promise;
	},
	imageToDom(file) {
    	console.log('imageFileToDom', this);

    	let promise = new Promise((resolve, reject) => {
    		this.imageUrl(file).then(url => {
    			this.imageDom(url).then(myImg => {
    				resolve(myImg)
			    })
		    })
    	});
        return promise;

	},
	imageToFile(url, file={}) {
    	console.log('imageBase64ToFile', this);

    	let name = file.name || new Date().getTime();
    	let promise = new Promise((resolve, reject) => {
    		let arr = url.split(','), mime = arr[0].match(/:(.*?);/)[1],
			    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
	        while(n--){
	            u8arr[n] = bstr.charCodeAt(n);
	        }
	        let bl = new File([u8arr], name, {
	            type: mime,
	        });
	        this.file = bl;
	        resolve(bl);
	    });
        return promise;
    },
	imageDown(base64, filename) {
    	// base64下载
        let arr = base64.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            type = mime.split('/')[1];
        const save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
        save_link['href'] = base64;
        save_link['download'] = filename + '.' + type;
        const event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        save_link.dispatchEvent(event);
    },
	imageUrlDown(url, name, callback) {
    	// URL地址下载 有问题
		let link = document.createElement('a');
        link.style.display = 'none';
        link.href = url;
        link.setAttribute('download', name);
        document.body.appendChild(link);
        link.click();
	},
	getOrientation(file) {
    	// 返回-2代码代表图片不是jpg格式，返回-1代表未定义。
    	let promise = new Promise((resolve, reject) => {
    		let reader = new FileReader();
		    reader.onload = function(e) {
		        let view = new DataView(e.target.result);
		        if (view.getUint16(0, false) != 0xFFD8) reject( - 2);
		        let length = view.byteLength,
		        offset = 2;
		        while (offset < length) {
		            let marker = view.getUint16(offset, false);
		            offset += 2;
		            if (marker == 0xFFE1) {
		                if (view.getUint32(offset += 2, false) != 0x45786966) reject( - 1);
		                let little = view.getUint16(offset += 6, false) == 0x4949;
		                offset += view.getUint32(offset + 4, little);
		                let tags = view.getUint16(offset, little);
		                offset += 2;
		                for (let i = 0; i < tags; i++) if (view.getUint16(offset + (i * 12), little) == 0x0112)
		                	resolve(view.getUint16(offset + (i * 12) + 8, little));
		            } else if ((marker & 0xFF00) != 0xFF00) break;
		            else offset += view.getUint16(offset, false);
		        }
		        return reject( - 1);
		    };
		    reader.readAsArrayBuffer(file);
	    });
        return promise;
	},
	imageRotate(angle) {
    	this.imageDrawAfter = (myImg) => {
    		this.ctx.translate(myImg.width, myImg.height);
    		this.ctx.rotate(Math.PI / 180 * angle);
    		return {
				x: 0,
				y: 0,
				w: myImg.width,
				h: myImg.height,
            };
	    };
	},
	// 功能集合 暂弃用
	getIOSImage(myImg, srcOrientation) {
    	let promise = new Promise( (res, rej) => {
            let newUrl = null;
            let newImg = new Image();
            let canvas = document.createElement('canvas');
            let ctxImg = canvas.getContext('2d');
            canvas.width = myImg.width;
            canvas.height = myImg.height;

            switch (srcOrientation) {
                case 3:
                    // 180
                    ctxImg.rotate(180 * Math.PI / 180);
                    ctxImg.drawImage(myImg, -myImg.width, -myImg.height, myImg.width, myImg.height);
                    newUrl = canvas.toDataURL("image/jpeg");
                    break;
                case 6:
                    // 90
                    ctxImg.rotate(90 * Math.PI / 180);
                    ctxImg.drawImage(myImg, 0, -myImg.width, myImg.height, myImg.width);
                    newUrl = canvas.toDataURL("image/jpeg");
                    break;
                case 8:
                    // 270
                    ctxImg.rotate(270 * Math.PI / 180);
                    ctxImg.drawImage(myImg, -myImg.height, 0, myImg.height, myImg.width);
                    newUrl = canvas.toDataURL("image/jpeg");
                    break;
                case 2:
                    ctxImg.translate(myImg.width, 0);
                    ctxImg.scale(-1, 1);
                    ctxImg.drawImage(myImg, 0, 0, myImg.width, myImg.height);
                    newUrl = canvas.toDataURL("image/jpeg");
                    break;
                case 4:
                    ctxImg.translate(myImg.width, 0);
                    ctxImg.scale(-1, 1);
                    ctxImg.rotate(180 * Math.PI / 180);
                    ctxImg.drawImage(myImg, -myImg.width, -myImg.height, myImg.width, myImg.height);
                    newUrl = canvas.toDataURL("image/jpeg");
                    break;
                case 5:
                    ctxImg.translate(myImg.width, 0);
                    ctxImg.scale(-1, 1);
                    ctxImg.rotate(90 * Math.PI / 180);
                    ctxImg.drawImage(myImg, 0, -myImg.width, myImg.height, myImg.width);
                    newUrl = canvas.toDataURL("image/jpeg");
                    break;
                case 7:
                    ctxImg.translate(myImg.width, 0);
                    ctxImg.scale(-1, 1);
                    ctxImg.rotate(270 * Math.PI / 180);
                    ctxImg.drawImage(myImg, -myImg.height, 0, myImg.height, myImg.width);
                    newUrl = canvas.toDataURL("image/jpeg");
                    break;
                default:
                	console.log('旋转出错！')
                    break;
            }
			res(newUrl);
            // newImg.crossOrigin = 'anonymous';
            // newImg.onload = () => {
            //     res(newImg);
            // };
            // newImg.src = newUrl;
        });
        return promise;
	},
	imageIOSRotate(file) {
    	// iOS方向旋转
    	// this.ctx.translate(myImg.width, myImg.height);
		// this.ctx.rotate(Math.PI / 180 * deg);
    	return this.getOrientation(file).then(srcOrientation => {
    		this.imageDrawAfter = (myImg) => {
    			console.log(srcOrientation);
    		    switch (srcOrientation) {
					case 2: this.ctx.transform(-1, 0, 0, 1, myImg.width, 0); break;
					case 3: this.ctx.transform(-1, 0, 0, -1, myImg.width, myImg.height ); break;
					case 4: this.ctx.transform(1, 0, 0, -1, 0, myImg.height ); break;
					case 5: this.ctx.transform(0, 1, 1, 0, 0, 0); break;
					case 6: this.ctx.transform(0, 1, -1, 0, myImg.height , 0); break;
					case 7: this.ctx.transform(0, -1, -1, 0, myImg.height , myImg.width); break;
					case 8: this.ctx.transform(0, -1, 1, 0, 0, myImg.width); break;
					default: this.ctx.transform(1, 0, 0, 1, 0, 0);
		        };
    		    return {
					x: 0,
					y: 0,
					w: myImg.width,
					h: myImg.height,
	            };
		    };
    		return this.imageUrl(file)
	    }, Orientation => {
    		console.log('Orientation', Orientation);
    		this.imageDrawAfter = false;
    		return this.imageUrl(file)
	    }).then(url => {
    		return this.imageDom(url)
	    }).then(myImg => {
	    	return this.imageBase64(myImg)
	    })
	},
};
