<template>
  <div class="mark-draw-panel">
    <div class="mark-draw-wrapper">
      <main ref="mark-view" class="mark-viewport">
        <section class="ctx">
          <canvas width="1169" height="827">您的浏览器不支持canvas</canvas>
        </section>
        <section class="base">
          <!-- 大类 货号 视角 底图 2019.12.18 新增上传人标识-->
          <img
            class="guide-baseImg"
            :src="url"
            alt="底图"
            width="1169"
            height="827"
          />
          <span class="guide-baseSku">{{ itemData["name"] || "" }}</span>
          <span class="guide-baseCate">{{
            tagText(itemData["category_dict"])
          }}</span>
          <!--
          2020.07.10 领导要求关闭视角 更换为logo图片
          <span class="guide-baseAngle">{{
            tagText(itemData["visual_angle_dict"], angle)
          }}</span>
          -->
          <img class="guide-baseAngle" v-if="EnOrCn === 'en'" src="./logo.png" alt="SINGSONG" width="107" height="164">
          <span class="guide-basePerson" v-if="EnOrCn === 'cn'"
            >标注人：{{
              itemData["create_uid"] ? itemData["create_uid"][1] : ""
            }}</span
          >
        </section>
        <section class="icon" style="display: none;">
          <!-- 纵 -->
          <div v-show="thisX - starX == thisY - starY">
            <div
              class="editLine"
              style="top:0; height: 100%; width: 1px;"
              :style="{ left: thisX - 5 + 'px' }"
            ></div>
            <div
              class="editLine"
              style="top:0; height: 100%; width: 1px;"
              :style="{ left: starX - 5 + 'px' }"
            ></div>
          </div>
          <!-- 横 -->
          <div v-show="thisX - starX == thisY - starY">
            <div
              class="editLine"
              style="left:0; height: 1px; width: 100%;"
              :style="{ top: thisY - 5 + 'px' }"
            ></div>
            <div
              class="editLine"
              style="left:0; height: 1px; width: 100%;"
              :style="{ top: starY - 5 + 'px' }"
            ></div>
          </div>
          <!-- 实时 todo 不在最上层导致可能会抓不到坐标 -->
          <div>
            <div
              class="editLine"
              style="top:0; height: 100%; width: 1px;"
              :style="{ left: thisX + 'px' }"
            ></div>
            <div
              class="editLine"
              style="left:0; height: 1px; width: 100%;"
              :style="{ top: thisY + 'px' }"
            ></div>
          </div>
        </section>
        <section class="node">
          <!-- 图片 箭头 尺寸 :class="val.type" -->
          <div
            class="guide-item"
            :class="val.type"
            v-for="(val, key) in newData"
            @click.stop="activeTextClick(val)"
            @dblclick.stop="activeNodeClick(val)"
            :key="key"
            :style="getNodeStyle(val)"
          >
            <!-- @dblclick.stop="activeNodeClick(val)" -->

            <!--style="display: none;"-->
            <div
              class="guide-text"
              :data-id="val.id"
              :class="{ draw: editId === val.id }"
              :style="getNodeStyle(val, 'font')"
              @click.stop.self.prevent="editTextDblclick($event, val)"
              @dblclick.stop.self.prevent="editTextDblclick($event, val)"
            >
              {{ val.font.content || "" }}
            </div>
            <!--  -->

            <!-- type -->
            <div class="guide-icon" v-if="val.type === 'picture'">
              <img :src="val.url" alt="配图" width="100%" height="100%" />
            </div>

            <div class="guide-node arrow" v-else-if="val.type === 'arrow'">
              <!--<svg xmlns="http://www.w3.org/2000/svg" :width="val.width" :height="val.height"
                                 preserveAspectRatio="xMidYMid slice" viewBox="0,0,1169,400">
                                <line :style="{stroke:val.color,strokeWidth:1169/val.width*2}" x1="0" y1="200" x2="1168" y2="200"></line>
                                <line :style="{stroke:val.color,strokeWidth:1169/val.width*2}" x1="1100" y1="150" x2="1168" y2="200"></line>
                                <line :style="{stroke:val.color,strokeWidth:1169/val.width*2}" x1="1100" y1="250" x2="1168" y2="200"></line>
                            </svg>-->
              <svg :width="val.width" :height="val.height">
                <line
                  :style="{ stroke: val.color, strokeWidth: 1.5 }"
                  x1="0"
                  :y1="val.height / 2"
                  :x2="val.width"
                  :y2="val.height / 2"
                ></line>
                <line
                  :style="{ stroke: val.color, strokeWidth: 1.5 }"
                  :x1="val.width - 20"
                  :y1="0"
                  :x2="val.width"
                  :y2="val.height / 2"
                ></line>
                <line
                  :style="{ stroke: val.color, strokeWidth: 1.5 }"
                  :x1="val.width - 20"
                  :y1="val.height"
                  :x2="val.width"
                  :y2="val.height / 2"
                ></line>
              </svg>
            </div>

            <div
              class="guide-node maxLength"
              v-else-if="val.type === 'maxLength'"
            >
              <svg :width="val.width" :height="val.height">
                <line
                  :style="{ stroke: val.color, strokeWidth: 2.5 }"
                  x1="0"
                  y1="0"
                  x2="0"
                  :y2="val.height"
                ></line>
                <line
                  :style="{ stroke: val.color, strokeWidth: 2.5 }"
                  :x1="val.width"
                  y1="0"
                  :x2="val.width"
                  :y2="val.height"
                ></line>

                <!--<line x1="0" :y1="val.height/2" :x2="val.width" :y2="val.height/2" :style="{stroke:val.color,strokeWidth:1}"></line>-->
                <line
                  :style="{ stroke: val.color, strokeWidth: 1.5 }"
                  x1="0"
                  :y1="val.height / 2"
                  :x2="val.font.left"
                  :y2="val.height / 2"
                ></line>
                <line
                  :style="{ stroke: val.color, strokeWidth: 1.5 }"
                  :x1="val.font.left + val.font.width"
                  :y1="val.height / 2"
                  :x2="val.width"
                  :y2="val.height / 2"
                ></line>
              </svg>
            </div>

            <div
              class="guide-node thickness"
              v-else-if="val.type === 'thickness'"
            >
              <svg :width="val.width" :height="val.height">
                <line
                  :style="{ stroke: val.color, strokeWidth: 1.5 }"
                  x1="20"
                  :y1="0"
                  x2="0"
                  :y2="val.height / 2"
                ></line>
                <line
                  :style="{ stroke: val.color, strokeWidth: 1.5 }"
                  x1="20"
                  :y1="val.height"
                  x2="0"
                  :y2="val.height / 2"
                ></line>

                <line
                  :style="{ stroke: val.color, strokeWidth: 1.5 }"
                  :x1="val.width - 20"
                  :y1="0"
                  :x2="val.width"
                  :y2="val.height / 2"
                ></line>
                <line
                  :style="{ stroke: val.color, strokeWidth: 1.5 }"
                  :x1="val.width - 20"
                  :y1="val.height"
                  :x2="val.width"
                  :y2="val.height / 2"
                ></line>

                <line
                  x1="0"
                  :y1="val.height / 2"
                  :x2="val.font.left"
                  :y2="val.height / 2"
                  :style="{ stroke: val.color, strokeWidth: 1.5 }"
                ></line>
                <line
                  :x1="val.font.left + val.font.width"
                  :y1="val.height / 2"
                  :x2="val.width"
                  :y2="val.height / 2"
                  :style="{ stroke: val.color, strokeWidth: 1.5 }"
                ></line>
              </svg>
            </div>

            <div class="guide-node iframe" v-else-if="val.type === 'iframe'">
              <svg :width="val.width" :height="val.height">
                <rect
                  :width="val.width"
                  :height="val.height"
                  fill="transparent"
                  stroke-width="3"
                  stroke="red"
                ></rect>
              </svg>
            </div>

            <div class="guide-node content" v-else-if="val.type === 'content'">
              <!-- TODO 折线 -->
              <svg :width="val.width" :height="val.height">
                <line
                  :style="{ stroke: val.color, strokeWidth: 2 }"
                  :x1="val.left"
                  :y1="val.top"
                  :x2="val.left + val.width"
                  :y2="val.height"
                ></line>
              </svg>
            </div>
          </div>
        </section>
        <!--<section class="draw" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></section>-->
        <section class="high" v-show="highShow" @click.stop="() => {}">
          <guide-high
            :style="{ transform: 'rotate(' + activeVal.rotate + 'deg)' }"
            class="draw-item-box"
            :isActive="true"
            :preventActiveBehavior="true"
            :parentLimitation="false"
            :isDraggable="true"
            :isResizable="true"
            :aspectRatio="false"
            :sticks="activeSticks"
            :x="activePoint.left || 10"
            :y="activePoint.top || 10"
            :w="activePoint.width || 10"
            :h="activePoint.height || 10"
            :minw="10"
            :minh="10"
            :parentW="1169"
            :parentH="827"
            @resizing="getPoint"
            @dragging="getPoint"
            @resizestop="getPointStop"
            @dragstop="getPointStop"
          >
            <!--
                        @clicked.stop="() => { console.log(this.activeId) }"
                        @mousedown.stop="() => { console.log(this.activeId) }"
                        -->
          </guide-high>
        </section>
      </main>
    </div>
  </div>
</template>

<script>
/**
 *
 * 需要解决的问题： 增加其他图形 箭头翻转的问题 元件提取的问题 最终导出的问题 // 提纯元件的问题
 *  新增 编辑 复制 记录 撤销 清空 删除 导出 兼容
 *
 * 面向过程：
 *  构建底图 (图片、货号、尺寸、大类)
 *  新建图形 (起始位置、结束位置、基础数据)
 *  计算坐标
 *  绘制图形
 *  单击选中
 *  编辑图形（文字、样式、大小、颜色）
 *  修改位置 (文字、外框)
 *  修改内容 (文字、颜色)
 *
 *  撤销操作
 *
 *  删除操作
 *
 *  清除所有
 * */
import Guide from "./guide.js";
import html2canvas from "html2canvas";
import VueDragResize from "vue-drag-resize";
let Cnode = new Guide.Cnode();
export default {
  name: "panel-mark",
  props: ["url", "angle", "EnOrCn", "itemData", "configJson"],
  components: { "guide-high": VueDragResize },
  watch: {
    // itemData() {
    //
    // },
    configJson(val) {
      this.newData = val;
    }
  },
  data() {
    return {
      newData: {}, // 显示数据
      // 绘制信息
      thisX: 0,
      thisY: 0,
      starX: 0,
      starY: 0,
      type: "arrow",
      editId: "",
      activeId: "",
      activeFont: null,
      activePoint: {}, // 选中位置`
      highStyle: {}, // 高亮样式
      highShow: false, // 高亮状态
      drawStar: false, // 绘制状态

      imgData: {}, // 准备废弃
      activeVal: {}, // 准备废弃

      sticks: {
        iframe: ["tl", "tr", "bl", "br"],
        picture: ["tl", "tr", "bl", "br"],
        default: ["ml", "mr", "tm", "bm"]
      },
      activeSticks: []
    };
  },
  methods: {
    set(id, data, record) {
      // 修改JSON 当记录为一个操作时
      if (record) {
        this.$emit("jsonChange", id, data);
      } else {
        this.$set(this.newData, id, data);
      }
    },
    init() {
      this.editId = "";
      this.activeId = "";
      this.activeFont = null;
      this.drawStar = false;
      this.cancelActiveClick();
    },
    addD(type, other) {
      // 新增
      if (Cnode.isEdit) {
        let point = this.getCreate();
        let Guide = Cnode.create(type, point, other);

        this.editId = Guide.id;
        this.set(Guide.id, Guide);
      } else {
        this.$Message.warning("未开启编辑！");
      }
    },
    exportIMG(cb) {
      this.editTextClose();
      //
      let that = this,
        width = 1169,
        height = 827;
      let _canvas = that.$refs["mark-view"];
      let canvas2 = document.createElement("canvas");
      let scale = 1;
      canvas2.width = width * scale;
      canvas2.height = height * scale;
      let context1 = canvas2.getContext("2d");
      if (context1) {
        context1.scale(scale, scale);
      }
      let opts = {
        scale,
        width,
        height,
        useCORS: true,
        logging: true,
        canvas: canvas2,
        allowTaint: true
      };
      html2canvas(_canvas, opts).then(canvas => {
        const context = canvas2.getContext("2d");
        if (context) {
          context.scale(1, 1);
          context.mozImageSmoothingEnabled = false;
          context.webkitImageSmoothingEnabled = false;
          context.imageSmoothingEnabled = false;
        }
        // canvas转换成url，然后利用a标签的download属性，直接下载，绕过上传服务器再下载
        let url = canvas.toDataURL("image/jpeg");
        cb && cb(url);
      });
    },
    /** 位置事件 */
    getStar() {
      this.starX = this.thisX;
      this.starY = this.thisY;
    },
    getMove(event) {
      let canvas = document.querySelector("canvas");
      let box = canvas.getBoundingClientRect();
      this.thisX = event.clientX - box.left;
      this.thisY = event.clientY - box.top;
      // console.log('x: ', event.clientX - box.left);
      // console.log('y: ', event.clientY - box.top);
      // console.log('box: ', box);
      // console.log('____________________________')
      // this.thisX = event.layerX || event.offsetX;
      // this.thisY = event.layerY || event.offsetY;
    },
    getCreate() {
      return {
        sx: this.starX,
        sy: this.starY,
        ex: this.thisX,
        ey: this.thisY
      };
    },
    getNodeStyle(val = {}, type) {
      if (type && type === "font") val = val.font;
      let style = Cnode.computeStyle(val);
      return style;
    },
    // 拖拽事件
    getPoint(point) {
      let text = null,
        font = null;
      let val = this.configJson[this.activeId];
      if (!val) {
        this.$Message.warning("未选中拖拽目标！");
      } else {
        if (this.activeFont) {
          text = {
            top: point.top - val.top,
            left: point.left - val.left,
            width: point.width,
            height: point.height
          };
          font = Object.assign({}, val.font, text);
        } else {
          let top =
            val.font.top < 0
              ? val.font.top
              : (point.width / val.width) * val.font.top;
          let left =
            val.font.left < 0
              ? val.font.left
              : (point.height / val.height) * val.font.left;
          text = {
            top: top,
            left: left,
            width: val.font.width,
            height: val.font.height
          };
          val = Object.assign({}, val, point);
          font = Object.assign({}, val.font, text);
        }
        val.font = font;
        this.set(val.id, val);
      }
    },
    getPointStop() {
      let val = this.configJson[this.activeId];

      this.highShow = true;
      // Cnode.isEdit = false;
      this.set(val.id, val, true);
    },
    /** 绘制事件 */
    isActiveNode(callback, bool, i) {
      let id = i || this.activeId;
      let Guide = this.configJson[id];
      if (!id || !Guide) {
        bool && this.$Message.warning("未选中目标，不可编辑文字");
      } else {
        callback && callback(id, Guide);
      }
    },
    setDrawData(data, type) {
      //  TODO
      switch (type) {
        case "type":
          this.type = data;
          break;
        case "config":
          Cnode.config = data;
          this.isActiveNode((id, Guide) => {
            this.editColorSize(id, Guide, data);
          });
          break;
        case "isEdit":
          Cnode.isEdit = !Cnode.isEdit;
          break;
        case "isLock":
          Cnode.isLock = !Cnode.isLock;
          break;
        default:
          break;
      }
    },
    // 开始绘制
    starDraw() {
      this.cancelActiveClick();
      this.getStar();
      this.addD(this.type);
    },
    // 连续绘制
    moveDraw() {
      let point = this.getCreate();
      let Guide = this.configJson[this.editId];
      Guide = Cnode.repaint(Guide, point);
      this.set(this.editId, Guide);
    },
    // 结束绘制
    stopDraw() {
      let val = this.configJson[this.editId];
      this.set(val.id, val, true);
      this.activeNodeClick(val);
      this.editId = null;
    },
    // 图片事件
    addPasteEvent(event) {
      let getImage = file => {
        let Img = new _IMG({});
        Img.imageUrl(file).then(url => {
          Img.imageDom(url).then(myImg => {
            Img.imageBase64(myImg).then(base64 => {
              let other = {
                url: base64,
                myImg,
                width: myImg.width,
                height: myImg.height,
                top: this.thisY - myImg.height / 2,
                left: this.thisX - myImg.width / 2
              };
              // this.getStar();
              this.addD("picture", other);
            });
          });
        });
        // 添加数据、绘制图片、修改图片数据、上传图片、上传数据
      };
      let getText = text => {
        this.$Message.warning("读取到文字内容:" + text + "，请重新复制！");
      };
      let getError = () => {
        this.$Message.warning("读取错误，请重新复制！");
      };
      Zero.getPasteDate(getImage, getText, getError)(event);
    },
    // 修改颜色
    editColorSize(id, Guide, data) {
      let font = Guide.font;
      let point = Guide.point;
      font.color = data.color;
      font.fontSize = data.size;
      Guide.color = data.nodeColor;
      let { content, contentI, contentT } = font;
      Guide = Cnode.edit(
        Guide,
        {
          content,
          contentI,
          contentT
        },
        point
      );
      this.set(id, Guide, true);
    },
    // 修改文字
    editTextEvent(ctx, i) {
      let id = i || this.activeId;
      let Guide = this.configJson[id];
      if (!id || !Guide) {
        this.$Message.warning("未选中目标，不可编辑文字");
      } else {
        // let point = this.getCreate();
        let point = Guide.point;
        Guide = Cnode.edit(Guide, ctx, point);
        this.set(id, Guide, true);
      }
    },
    editTextClose() {
      let doms = document.querySelectorAll(".editInput");
      for (let i = 0, len = doms.length; i < len; i++) {
        let dom = doms[i];
        let val = dom.value;
        let per = dom.parentNode || dom.parentElement;
        let did = per.getAttribute("data-id");
        console.log(dom, val, did);
        dom.remove();
        this.editTextEvent(
          {
            content: val,
            contentI: "自定义",
            contentT: "自定义"
          },
          did
        );
      }
    },
    editTextDblclick(e) {
      let target = e.target || e.srcElement;
      let id = target.getAttribute("data-id");
      let text = target.innerText;
      let that = this;
      // 方案1 生成input
      this.editTextClose();
      let input = document.createElement("input");
      let keyDown = function(e) {
        if (e.keyCode == "13") {
          let tar = e.target || e.srcElement;
          let val = tar.value;
          input.remove();
          // target.innerText = val;
          that.editTextEvent(
            {
              content: val,
              contentI: "自定义",
              contentT: "自定义"
            },
            id
          );
        }
      };
      input.addEventListener("keydown", keyDown);
      input.className = "editInput";
      target.append(input);
      input.value = text;
      input.focus();
      // 方案二 弹出文字编辑
    },
    // 选中事件
    activeTextClick(val) {
      if (this.drawStar) return;
      if (val.type !== "arrow") {
        this.activeNodeClick(val);
      } else {
        let font = val.font;
        this.activeId = val.id;
        this.activeFont = val.font;
        this.activeVal = val;
        this.activePoint = {
          top: val.top + font.top,
          left: val.left + font.left,
          width: font.width,
          height: font.height
        };
        this.highShow = true;
        this.activeSticks = this.sticks["default"];
      }
    },
    activeNodeClick(val) {
      console.log("activeNodeClick", this.drawStar);
      if (this.drawStar) {
        // 关闭绘制
        this.drawStar = false;
        this.stopDraw();
        return;
      }

      let def = this.sticks["default"];
      let self = this.sticks[val.type];

      this.activeId = val.id;
      this.activeFont = null;
      this.activeVal = val;
      this.activePoint = {
        top: val.top,
        left: val.left,
        width: val.width,
        height: val.height
      };

      this.highShow = true;
      this.activeSticks = self || def;
      this.highStyle = Cnode.computeStyle(val);
    },
    cancelActiveClick() {
      this.highShow = false;
      this.activeId = "";
      this.activeFont = null;

      this.activePoint = {};
    },
    /** DOM事件 */
    initEvent() {
      let that = this;
      let mark = this.$refs["mark-view"];
      mark.addEventListener("click", function() {
        that.editTextClose();
        that.cancelActiveClick();
      });
      mark.addEventListener("dblclick", function() {
        if (!Cnode.isEdit) return;
        that.drawStar = !that.drawStar;
        if (that.drawStar) {
          that.starDraw();
        } else {
          that.stopDraw();
        }
      });
      mark.addEventListener("mousemove", function(e) {
        that.getMove(e);
        if (that.drawStar) {
          that.moveDraw();
        }
      });
      mark.addEventListener("mouseenter", function() {
        document.addEventListener("paste", that.addPasteEvent);
      });
      mark.addEventListener("mouseleave", function() {
        document.removeEventListener("paste", that.addPasteEvent);
      });
    },
    // 辅助
    tagText(val, obj) {
      val = obj || val || {};
      let type = this.EnOrCn;
      if (typeof val === "string") {
        val = JSON.parse(val);
      }
      return val[type] || "";
    }
    /** 新增 编辑 复制 记录 撤销 清空 删除 导出 兼容 **/
    /*
            copyD(json) {
            	// 复制整体
            	let data = JSON.stringify(json);
            	data = JSON.parse(data);
            	console.log(data);
            	// data['font'] = JSON.parse(data.font);
            	return data;
            },
            notesD() {
            	// 记录、操作前备份
            	let json = this.configJson;
            	let data = this.copyD(json);
            	this.saveData.push(data);
            },
            emptyD() {
            	// 清空
            	this.notesD();
            	this.configJson = {};
            	this.cancelActiveClick();
            },
            revokeD() {
            	// 撤销
            	if (this.saveData.length) {
            		this.cancelActiveClick();
            		let data = this.saveData.pop();
            		this.configJson = data;
                }
            },
            deleteD() {
            	// 删除
            	this.notesD();
            	let id = this.activeId;
            	let json = this.configJson;
            	let data = this.copyD(json);
            	if (id) {
            		this.cancelActiveClick();
            		delete data[id];
            		this.$set(this, 'configJson', data);
                }
            },
            downIMG() {
            	// 导出
            	this.cancelActiveClick();
                this.exportIMG(url => {
                	let Img = new IMG({});
                	Img.imageDown(url, this.sku+this.EnOrCn);
                });
            },
            compatibleD() {
            	let data = this.drawJsonData;
            	let keys = Object.keys(data);
				let types = ['arrow', 'thickness', 'maxLength', 'picture'];
				keys.map((key) => {
					let item = data[key];
					if (item.type && types.indexOf(item.type) > -1) {
						let Guide = Cnode.compatible(item, this.config);
						Guide.id = Guide.id+'_'+key;
						this.set(Guide.id, Guide);
						// $Mark.$set($Mark.configJson, Guide.id, Guide);
                    }
                });
            },
            */
    /** 新增 编辑 复制 记录 撤销 清空 删除 导出 兼容 **/
  },
  mounted() {
    // this.init();
    this.initEvent();
  }
};
</script>
<!-- scoped -->
<style lang="scss">
@font-face {
  font-family: "MatrixCode";
  src: url("SCode.woff.ttf") format("opentype");
}
.mark-draw-panel {
  flex: 1;
  width: 100%;
  height: 100%;
  display: flex;
  overflow: scroll;
  background-color: #333;
  .mark-draw-wrapper {
    position: relative;
    margin: auto;
    display: flex;
    min-width: (1169px + 20px);
    min-height: (827px + 20px);
    background: #c2c4c5;

    .mark-viewport {
      position: relative;
      margin: auto;
      width: 1169px;
      height: 827px;
      display: flex;
      background: #fff;
      transition: all 0.3s;
      transform: scale(1);
      .ctx,
      .base,
      .icon,
      .node {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
      .high {
        z-index: 3;
      }
      .ctx canvas {
        width: 100%;
        height: 100%;
      }
      .draw-item-box {
        transform-origin: left center;
      }
    }
  }
}

@mixin abs100 {
  position: absolute;
  top: 10px;
  color: #000000;
  font-size: 32px;
  font-family: "微软雅黑";
  /*font-family: "Bitstream Vera Sans Mono", Monaco, MatrixCode, "Courier New", Courier, monospace;*/
}
.editInput {
  @include abs100;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  font-size: 12px;
  line-height: 20px;
}
.editLine {
  position: absolute;
  background-color: red;
}
.mark-viewport {
  overflow: hidden;
  .guide-baseImg {
    @include abs100;
    top: 0;
    left: 0;
  }
  .guide-baseSku {
    @include abs100;
    left: 0;
    right: 0;
    font-size: 36px;
    /** sku */
  }
  .guide-baseCate {
    @include abs100;
    left: 20px;
    /** cate */
  }
  .guide-baseAngle {
    @include abs100;
    top: 16px;
    right: 20px;
    /** angle */
  }
  .guide-basePerson {
    @include abs100;
    top: auto;
    right: 20px;
    bottom: 10px;
  }

  .guide-item {
    z-index: 2;
    cursor: pointer;
    position: absolute;
    transform-origin: left center;
    .guide-icon,
    .guide-node {
      width: 100%;
      height: 100%;
    }
    .guide-text {
      position: absolute;
      top: -30px;
      left: 0;
      z-index: 2;
      width: 100%;
      height: auto;
      text-align: left;
      line-height: 20px;

      color: #0d0d0d;
      word-wrap: break-word;
      font: normal 13px "微软雅黑";
    }
    &.picture {
      z-index: 1;
      .guide-text {
        display: none;
      }
    }
  }
}
</style>

<!--


/* arrow */
            /*&.arrow .guide-text{
                left: 0!important;
                top: -20px!important;
                width: 100%!important;
                text-indent: 6px;
                text-align: left;
            }
            .guide-node.arrow {
                display: flex;
                .line {
                    position: relative;
                    width: 100%;
                    height: 2px;
                    margin: auto;
                    background: #0D0D0D;
                    border-radius: 5px;
                    &::after, &::before{
                        position: absolute;
                        top: 0;
                        right: 0;
                        content: '';
                        width: 20px;
                        height: 1px;
                        background: #0D0D0D;
                        transform-origin: top right;
                    }
                    &::after {
                        transform: rotate(20deg);
                    }
                    &::before {
                        transform: rotate(-20deg);
                    }
                }
                .text {
                    position: absolute;
                    top: 20px;
                }
            }*/

            /* maxLength */
            /*&.maxLength .guide-text, &.thickness .guide-text{
                box-sizing: border-box;
                padding: 0 5px;
                text-align: center;
            }
            .guide-node.maxLength, .guide-node.thickness {
                display: flex;
                .line {
                    flex: 1;
                    &::after {
                        content: "";
                        width: calc( 100% - 10px);
                        height: 1px;
                        display: inline-block;
                        vertical-align: middle;
                        border-top: 2px solid #000;
                    }
                    &:first-child {
                        text-align: left;
                        border-left: 2px solid #000;
                    }
                    &:last-child {
                        text-align: right;
                        border-right: 2px solid #000;
                    }
                }
                .text {
                    width: auto;
                }
            }*/

            /*  */

<div class="text" :style="{transform: 'rotate('+ -val.rotate +'deg)'}">
    {{val.font.content || ''}}
</div>
<div class="line"></div>



<div class="line"></div>
<div class="text" :style="{transform: 'rotate('+ -val.rotate +'deg)'}">
    {{val.font.content || ''}}
</div>
<div class="line"></div>



<div class="line"></div>
<div class="text" :style="{transform: 'rotate('+ -val.rotate +'deg)'}">
    {{val.font.content || ''}}
</div>
<div class="line"></div>

-->
