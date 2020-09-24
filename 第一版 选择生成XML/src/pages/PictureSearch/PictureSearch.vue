<template>
    <div style="padding: 15px; height: 100%;">
        <E-button
                :isStyle="false"
                :btnList="btnList"
                :menuList="[]"
                :hasPowerList="hasPowerList"
        ></E-button>
        <div style="display: flex; height: 100%;">
            <div style="width: 250px;">
                <!--筛选-->
                <div class="picture-width picture-screen">
                    <Checkbox
                            :indeterminate="indeterminate"
                            :value="checkAll"
                            @click.prevent.native="handleCheckAll"
                    >全选
                    </Checkbox>
                    <CheckboxGroup
                            v-model="checkAllGroup"
                            @on-change="checkAllGroupChange"
                    >
                        <Checkbox
                                v-for="(item, index) in checkGroup"
                                :key="index"
                                :label="item.key"
                        >{{ item.label }}
                        </Checkbox>
                    </CheckboxGroup>
                </div>
                <div class="picture-width picture-line"></div>
                <!--货号-->
                <Input
                        :rows="6"
                        clearable
                        type="textarea"
                        v-model="skuNums"
                        class="picture-width picture-area"
                        placeholder="请输入完整的sku,多个以回车隔开.."
                />
                <Button
                        type="success"
                        class="picture-width"
                        @click="searchSku"
                        title="至少选中一个分类"
                        :disabled="checkAllGroup.length < 1"
                >货号查询
                </Button>
                <div class="picture-width picture-line"></div>
                <!--图片-->
                <div class="picture-width picture-content">
                    <img id="previewImg" src="" border="0" style="max-width: 100%;"/>
                </div>
                <Input
                        search
                        enter-button
                        class="picture-width"
                        placeholder="请输入URL或点击上传图片..."
                        v-model="imageUrl"
                        @on-search="getUrlImg"
                />
                <Button type="primary" class="picture-width" @click="openUpFile"
                >上传图片
                </Button>
                <Button
                        type="primary"
                        class="picture-width"
                        @click="searchIMG"
                        title="至少选中一个分类"
                        :disabled="checkAllGroup.length < 1"
                >图片识别
                </Button>
            </div>
            <div class="picture-similarity" style="flex: 1;">
                <div class="picture-similarity-title">
                    <h1>结果区</h1>
                    <span>{{ desc }}</span>
                </div>
                <CheckboxGroup v-model="checkDown" class="picture-similarity-list">
                    <div
                            class="picture-similarity-item"
                            v-for="(item, ind) in imageList"
                            :class="{ active: checkDown[ind] }"
                            :key="ind"
                            @click="checkItem(item, ind)"
                    >
                        <div class="box">
                            <div class="bg" :class="{ active: checkDown[ind] }">
                                <Icon type="md-checkmark-circle"/>
                            </div>
                            <div class="image">
                                <img :src="item['imagePath']"/>
                            </div>
                            <div class="info">
                                <div></div>
                                <!---->
                                <div>{{ item["custName"] }}</div>
                                <!---->
                                <div>{{ item["proNo"] }}</div>
                                <!---->
                                <div>{{ computedBizType(item["bizType"]) }}</div>
                            </div>
                        </div>
                    </div>
                </CheckboxGroup>
            </div>
        </div>
        <!--腐竹-->
        <canvas
                id="canvas"
                width="700"
                height="700"
                style="opacity: 0; z-index: -1;"
        ></canvas>
        <input
                type="file"
                ref="upFile"
                @change="fileChange"
                style="display: none;"
                class="filepath"
                accept="image/jpg,image/jpeg,image/png,image/PNG"
        />
    </div>
</template>

<script>
	import $ from "jquery";
	import "cropperjs/dist/cropper.css";
	import Cropper from "cropperjs/dist/cropper.js";

	let cropper = null,
		cropperType = null;
	export default {
		name: "PictureSearch",
		data() {
			return {
				previewSrc: null,
				imageList: [],
				imageUrl: "",
				skuNums: "",
				desc: "以下图片为智能搜索同款结果。",
				//选中下载项
				checkDown: [],
				checkDownAll: false,
				//筛选
				indeterminate: false,
				checkAll: false,
				checkAllGroup: [],
				// checkGroup: ['三松组', '纳谷组', '中文档', '英文档', '展示样', '验货样', '效果图'],
				checkGroup: [
					{key: 1, label: "三松组"},
					{key: 4, label: "英文档"},
					{key: 7, label: "效果图"},

					{key: 2, label: "纳谷组"},
					{key: 3, label: "中文档"},
					{key: 6, label: "验货样"},

					{key: 5, label: "展示样"}
				],
				//操作
				btnList: [
					{
						key: "down",
						name: "下载图片",
						method: () => {
							this.getCheckDown();
						}
					},
					{
						key: "checkAll",
						name: "全选",
						method: () => {
							this.checkAllorNone(true);
						}
					},
					{
						key: "checkNone",
						name: "取消选中",
						method: () => {
							this.checkAllorNone(false);
						}
					}
				],
				hasPowerList: ["up", "down", "checkNone", "checkNone"]
			};
		},
		mounted() {
			this.init();
		},
		methods: {
			init() {
				this.checkAllMethod(false);
				const Image = document.getElementById("previewImg");
				cropper = new Cropper(Image, {
					viewMode: 1,
					autoCrop: true,
					autoCropArea: 1,
					checkCrossOrigin: false,
					ready: () => {
						// this.cropper.rotate(180);
						$("#searchImg").click();
					}
				});
			},
			getCheckDown() {
				let checkDown = this.imageList.filter((item, index) => {
					return this.checkDown[index];
				});
				if (checkDown.length < 1) {
					this.$Message.warning("请至少选中一张照片！！！");
				} else {
					this.getSearchDown(checkDown);
				}
			},
			checkAllorNone(bool) {
				this.checkDown = new Array(this.imageList.length).fill(bool);
			},
			computedBizType(bizType) {
				let group = this.checkGroup.find(item => item.key == bizType);
				return group.label || "未知类型";
			},
			// Post
			getSearchDown(checkDown) {
				// 下载图片
				// let url = 'erp/img/service/downloadImg';
				// let params = {
				//   params: {
				//     objList: JSON.stringify(checkDown),
				//   },
				// };
				// this.$http.fileFlowDown(url, params, name).then(res => {
				//   console.log(res);
				// });
				let url = "ss_sample/img/search/download";
				let formData = new FormData();
				formData.append("objList", JSON.stringify(checkDown));
				let name = new Date().format("yyyy年MM月dd日hh时mm分ss秒") + ".zip";
				this.$http.OdooDown.post(url, formData)
					.then(res => {
						console.log(res);
						if (!res.data) return;
						let url = window.URL.createObjectURL(new Blob([res.data]));
						let link = document.createElement("a");
						link.style.display = "none";
						link.href = url;
						link.setAttribute("download", name);
						document.body.appendChild(link);
						link.click();
					})
					.catch(err => {
						console.log(err);
						this.$Message.error("请求出错");
					});
			},
			getSkuSimilarityIMG(sku) {
				//获取相似图片
				// let url = 'erp/img/service/search/proNo';
				let url = "ss_sample/img/search/proNo";
				let params = {
					proNo: sku,
					groupType: this.checkAllGroup.join(",")
				};

				// this.$http.odoo(url, params).then(res => {
				//   console.log(res);
				//   this.checkDown = [];
				//   this.imageList = res;
				//   this.checkAllorNone(false);
				//   this.desc = '以下图片为货号对应的业务图片。';
				// });

				this.$http.odoo(url, params).then(res => {
					this.checkDown = [];
					let err = res["errorList"];
					this.imageList = res.data;
					this.checkAllorNone(false);
					this.desc = "以下图片为货号对应的业务图片。";

					// 2020.04.13 TODO
					// let dataObj = {};
					// let dataErr = {};
					// let dataSku = sku.split(',');
					// let dataType = {
					// 	1: '三松组',
					// 	4: '英文档',
					// 	7: '效果图',
					// 	2: '纳谷组',
					// 	3: '中文档',
					// 	6: '验货样',
					// 	5: '展示样',
                    // };
					// res.data.map(item => {
					// 	if (dataObj[item['bizType']]) {
					// 		dataObj[item['bizType']].push(item['proNo']);
					// 	} else {
					// 		dataObj[item['bizType']] = [item['proNo']];
					// 	}
					// });
					// this.checkAllGroup.map(type => {
					// 	let label = dataType[type];
					// 	if (!dataObj[type]) {
					// 		// 全部未找到
					// 		dataErr[label] = dataSku;
					// 	} else {
					// 		dataSku.map(item => {
					// 			if (dataObj[type].indexOf(item) === -1) {
					// 				// 货号未找到
					// 				if (dataErr[label]) {
					// 					dataErr[label].push(item);
					// 				} else {
					// 					dataErr[label] = [item];
					// 				}
					// 			}
					// 		});
					// 	}
					// });
					// console.log(dataErr);


					if (err.length) {
						this.$Notice.warning({
							title: "查询失败货号",
							desc:
								"一共查询" +
								sku.split(",").length +
								"个货号，" +
								"其中有" +
								err.length +
								"个货号未查到:" +
								"\n" +
								err.join("\n\r\t"),
							duration: 0
						});
					}
				});
			},
			getIMGSimilarityIMG(imgInfo = {}) {
				//获取相似图片
				let url = "erp/img/service/search/img";
				let params = {
					imgBase64Str: imgInfo.url,
					groupType: this.checkAllGroup.join(",")
				};
				this.$http.post(url, params).then(res => {
					console.log(res);
					this.checkDown = [];
					this.imageList = res;
					this.checkAllorNone(false);
					this.desc = "以下图片为智能搜索同款结果。";
				});
			},
			// Event
			searchSku() {
				//check
				let sku = this.skuNums;
				// sku = sku.replace(/\s/g, "");
				// if (sku.indexOf(',') > -1) {
				//   sku = sku.splice(',');
				// }
				sku = sku.replace(/\n/g, ",");
				if (sku.split(",").length > 100) {
					this.$Message.warning("最大不超过100");
					return;
				}
				this.getSkuSimilarityIMG(sku);
			},
			openUpFile() {
				this.$refs["upFile"].value = "";
				this.$refs["upFile"].click();
			},
			fileChange() {
				//上传图片并展示
				var that = this;
				var reader = new FileReader();
				var file = this.$refs["upFile"].files[0];
				reader.onload = function (evt) {
					that.previewSrc = evt.target.result;
					cropper.replace(that.previewSrc);
				};
				reader.readAsDataURL(file);
			},
			getUrlImg() {
				this.previewSrc = this.imageUrl;
				cropper.replace(this.previewSrc);
				this.imageUrl = "";
				this.imageList = [];
			},
			searchIMG() {
				//搜相似图片
				if (!this.previewSrc) return;
				this.exportUrl(imgInfo => {
					this.getIMGSimilarityIMG(imgInfo);
				});
			},
			checkItem(item, ind) {
				// this.checkDown[ind] = !this.checkDown[ind];
				this.$set(this.checkDown, ind, !this.checkDown[ind]);
			},
			//screen
			checkAllMethod(bool) {
				this.checkAll = bool;
				this.indeterminate = false;
				this.checkAllGroup = bool ? [1, 2, 3, 4, 5, 6, 7] : [];
			},
			handleCheckAll() {
				if (this.indeterminate) {
					this.checkAll = false;
				} else {
					this.checkAll = !this.checkAll;
				}
				this.indeterminate = false;
				this.checkAllMethod(this.checkAll);
			},
			checkAllGroupChange(data) {
				if (data.length === this.checkGroup.length) {
					this.indeterminate = false;
					this.checkAll = true;
				} else if (data.length > 0) {
					this.indeterminate = true;
					this.checkAll = false;
				} else {
					this.indeterminate = false;
					this.checkAll = false;
				}
			},
			handleCheckDownAll(bool) {
			},
			checkDownGroupChange() {
			},
			//tool
			exportUrl(callback, imgInfo = {}) {
				/** 改： 输出图片非1：1 输出最大尺寸为700 */
				let dom = document.getElementById("canvas");
				// let dom = document.createElement('canvas');
				let ctx = dom.getContext("2d");
				var imgObj = cropper.getData();
				let myImg = new Image();
				myImg.crossOrigin = "anonymous";
				myImg.onload = () => {
					// 取截取部分 并 缩放至最大宽度为700
					var outW = imgObj.width,
						outH = imgObj.height,
						maxW = 700;
					if (imgObj.width > imgObj.height) {
						if (imgObj.width > maxW) {
							outW = maxW;
							outH = (outW / imgObj.width) * imgObj.height;
						}
					} else {
						if (imgObj.height > maxW) {
							outH = maxW;
							outW = (outH * imgObj.width) / imgObj.height;
						}
					}
					dom.width = outW;
					dom.height = outH;
					// console.log(imgObj, outW, outH);
					//x 起始位置 width 裁剪宽度 myImg.width 图片真实宽度 默认正方形
					ctx.drawImage(
						myImg,
						imgObj.x,
						imgObj.y,
						imgObj.width,
						imgObj.height,
						0,
						0,
						outW,
						outH
					);
					imgInfo.url = dom.toDataURL("image/jpeg");
					let file = this.convertBase64UrlToBlob(imgInfo.url);
					imgInfo.file = file;
					if (file.size > 2 * 1024 * 1024) {
						// funAlert('图片太大！请压缩后再试！');
					} else if (file.size > 1024 * 1024) {
						this.canvasDataURL(
							imgInfo.url,
							{
								quality: 0.6
							},
							url => {
								imgInfo.url = url;
								let file = this.convertBase64UrlToBlob(imgInfo.url);
								imgInfo.file = file;
								callback && callback(imgInfo);
							}
						);
					} else {
						callback && callback(imgInfo);
					}
				};
				myImg.src = this.previewSrc;
			},
			convertBase64UrlToBlob(urlData, file = {}) {
				var arr = urlData.split(","),
					mime = arr[0].match(/:(.*?);/)[1],
					bstr = atob(arr[1]),
					n = bstr.length,
					u8arr = new Uint8Array(n);
				while (n--) {
					u8arr[n] = bstr.charCodeAt(n);
				}
				let bl = new Blob([u8arr], {
					type: mime,
					name: file.name
				});
				return bl;
			},
			canvasDataURL(path, obj, callback) {
				var img = new Image();
				img.onload = function () {
					// 默认按比例压缩
					var w = img.width,
						h = img.height,
						scale = w / h;
					w = obj.width || w;
					h = obj.height || w / scale;
					var quality = 0.7; // 默认图片质量为0.7
					//生成canvas
					var canvas = document.createElement("canvas");
					var ctx = canvas.getContext("2d");
					var anw = document.createAttribute("width");
					anw.nodeValue = w;
					var anh = document.createAttribute("height");
					anh.nodeValue = h;
					canvas.setAttributeNode(anw);
					canvas.setAttributeNode(anh);
					ctx.drawImage(img, 0, 0, w, h);
					// 图像质量
					if (obj.quality && obj.quality <= 1 && obj.quality > 0) {
						quality = obj.quality;
					}
					// quality值越小，所绘制出的图像越模糊
					var base64 = canvas.toDataURL("image/jpeg", quality);
					// 回调函数返回base64的值
					callback(base64);
				};
				img.src = path;
			}
		}
	};
</script>

<style scoped>
    #canvas {
        position: absolute;
        top: 0;
        left: 0;
    }

    .picture-width {
        width: 250px;
        margin-bottom: 15px;
    }

    .picture-line {
        display: none;
        border-bottom: 1px solid #2c3e50;
    }

    .picture-area {
        font-size: 18px;
    }

    .picture-screen {
        text-align: center;
        padding-bottom: 5px;
    }

    .picture-content {
        box-sizing: border-box;
        position: relative;
        width: 250px;
        height: 250px;
        display: flex;
        border: 1px solid #4d4d4d;
        background-color: #ffffff;
    }

    .picture-similarity {
        height: 100%;
        min-height: 300px;
        padding: 8px 10px;
        margin-left: 15px;
        border: 1px solid #666666;
    }

    .picture-similarity-title {
        margin-bottom: 20px;
    }

    .picture-similarity-list {
        min-width: 220px;
        height: calc(100% - 74px);
        overflow-y: scroll;
    }

    .picture-similarity-item {
        display: inline-block;
        cursor: pointer;
        margin: 0 15px 20px 0;
        border: 1px solid #666666;
    }

    .picture-similarity-item .box {
        margin: 5px;
        width: 200px;
        height: 195px;
        overflow: hidden;
        position: relative;
        border: 1px solid #2c3e50;
    }

    .picture-similarity-item.active {
        background-color: cadetblue;
    }

    .box .bg.active {
        display: flex;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.16);
    }

    .box .bg i {
        display: none;
    }

    .box .bg.active i {
        display: block;
        /*margin: auto;*/
        color: darkgreen;
        font-size: 39px;
    }

    .picture-similarity-item .image {
        position: relative;
        width: 100%;
        display: flex;
        background-color: #c3c3c3;
        height: calc(100% - 50px);
    }

    .picture-similarity-item img {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        max-width: 100%;
        max-height: 100%;
    }

    .picture-similarity-item .info {
        /*opacity: 0;
              bottom: -25%;
              color: #2c3e50;*/

        bottom: 0;
        opacity: 1;
        color: #ffffff;

        position: absolute;
        left: 0;
        width: 100%;
        height: 50px;
        display: flex;
        flex-wrap: wrap;
        padding: 6px 8px 4px;
        transition: all 0.3s;
        background-color: rgba(0, 0, 0, 0.72);
    }

    .picture-similarity-item .info div {
        width: 50%;
        height: 20px;
        font-size: 14px;
        line-height: 20px;
    }

    .picture-similarity-item .info div:nth-child(2n) {
        text-align: right;
    }

    /*.picture-similarity-item .box:hover .info {
          bottom: 0;
          opacity: 1;
          color: #ffffff;
        }
        .picture-similarity-item .info:hover {
          opacity: 1;
          bottom: 0;
          color: #ffffff;
        }*/
</style>
