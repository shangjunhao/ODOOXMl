<template>
  <div class="picture-markItem-wrapper">
    <div class="mark-head">
      <!-- heads -->
      <div class="mark-head-menus">
        <!-- menus -->
        <div class="mark-head-menu" style="display: flex;">
          <div class="mark-head-btn right">
            <!-- 2020.07.23 因原本三级审核取消 修改为一级审核 中文档提交按钮始终存在 -->
            <Button type="primary" v-if="btnStates.cn_save_btn && EnOrCn === 'cn'" @click="saveJsonData">保存</Button>
            <Button type="primary" v-if="btnStates.cn_submit_btn && EnOrCn === 'cn'" @click="newBusinessData('submit')">提交</Button>
            <Button type="primary" v-if="btnStates.cn_revoke_btn && EnOrCn === 'cn'" @click="newBusinessData('revoke')">撤销</Button>

            <Button type="primary" v-if="btnStates.en_save_btn && EnOrCn === 'en'" @click="saveJsonData">保存</Button>
            <Button type="primary" v-if="btnStates.en_submit_btn && EnOrCn === 'en'" @click="newBusinessData('submit')">提交</Button>
            <!--更改：领导通知不需要撤销 <Button type="primary" v-if="btnStates.en_revoke_btn && EnOrCn === 'en'" @click="newBusinessData('revoke')">撤销</Button>-->

            <!--
            6.16号、增加三级审核、审批单独界面、本页面只负责提交数据

            <Button type="text" :disabled="true" style="color: #0D0D0D;"
              >状态: {{ approves[itemData.approve_status] }}</Button
            >

            <Button
              type="primary"
              @click="businessData('submit')"
              v-show="
                EnOrCn === 'cn' &&
                  itemData.approve_status === 0 &&
                  itemData['image_cn_path']
              "
              >提交</Button
            >
            <Button
              type="primary"
              @click="businessData('approve')"
              v-show="EnOrCn === 'cn' && itemData.approve_status === 1"
              >审核</Button
            >
            <Button
              type="primary"
              @click="businessData('revoke_submit')"
              v-show="EnOrCn === 'cn' && itemData.approve_status === 1"
              >撤销提交</Button
            >
            <Button
              type="primary"
              @click="businessData('revoke_approve')"
              v-show="EnOrCn === 'cn' && itemData.approve_status === 2"
              >撤销审核</Button
            >



            <Divider type="vertical" />
            <Button
              type="default"
              @click="saveJsonData"
              v-show="EnOrCn === 'en' || itemData.approve_status === 0"
              >保存</Button
            >

            -->

            <Divider type="vertical" />
            <Button type="default" @click="downIMG(false)">下载</Button>

            <Divider type="vertical" />
            <!-- 2020.07.10 领导通知不关闭视角 -->
            <Select v-model="angle" placeholder="视角" style="width:80px; display: none;">
              <Option v-for="(val, key) in angleData" :value="key" :key="key">{{
                val[EnOrCn]
              }}</Option>
            </Select>
            <Divider type="vertical" />
            <Select v-model="EnOrCn" placeholder="中英文" style="width:80px">
              <Option :value="'en'" :key="'en'">英文</Option>
              <Option :value="'cn'" :key="'cn'">中文</Option>
            </Select>
            <Divider type="vertical" />
          </div>

          <div class="mark-head-btn center"></div>
        </div>
      </div>
    </div>

    <div class="mark-content">
      <!-- tools -->
      <div class="mark-left-tool">
        <ul class="mark-tool-icon">
          <li
            v-for="(item, ind) in tools"
            :class="{ disable: item.active }"
            :key="ind"
            :title="item.title"
            @click="toolClick(item, ind)"
          >
            <Icon :type="item.icon" />
            <div class="mark-tool-title">
              {{ item.title }}{{ " " + item.keys || "" }}
            </div>
          </li>
        </ul>
        <ul class="mark-panel-icon">
          <li :class="{ active: copyPanelShow }">
            <Icon type="md-images" @click="copyPanelShow = !copyPanelShow" />
          </li>
          <li :class="{ active: dataPanelShow }">
            <Icon type="md-options" @click="dataPanelShow = !dataPanelShow" />
          </li>
        </ul>
      </div>

      <!-- data tab -->
      <div class="mark-left-data" :class="{ hidden: !dataPanelShow }">
        <mark-data ref="data" :EnOrCn="EnOrCn" :initData="initData"></mark-data>
      </div>

      <!-- draw mark -->
      <div class="mark-cont-mark">
        <mark-draw
          ref="mark"
          :url="url"
          :EnOrCn="EnOrCn"
          :itemData="itemData"
          :configJson="configJson"
          :angle="angleData[angle] || null"
          @jsonChange="editJsonData"
        ></mark-draw>
      </div>

      <!-- copy mark -->
      <div class="mark-left-copy" :class="{ hidden: !copyPanelShow }">
        <mark-copy
          ref="clone"
          :EnOrCn="EnOrCn"
          @getCloneData="getCloneData"
        ></mark-copy>
      </div>
    </div>
  </div>
</template>

<script>
// 纯交互逻辑 数据中心
// markHead 暂时废用
import Guide from "./mark/guide.js";
import markHead from "./mark/panel-head";
import markDraw from "./mark/panel-mark";
import markData from "./mark/panel-data";
import markCopy from "./mark/panel-clone";

let flag = true,
  $Mark = null,
  $Data = null,
  $Clone = null;
let Cnode = new Guide.Cnode();
export default {
  name: "PictureMarkDetails",
  components: {
    "mark-head": markHead,
    "mark-data": markData,
    "mark-copy": markCopy,
    "mark-draw": markDraw
  },
  watch: {
    angle(val) {
      let angle = this.angleData[val] || {};
      this.$set(this.itemData, "visual_angle_dict", angle);
    },
    EnOrCn(val, old) {
      if (old === "") return;
      this.pageInit();
    }
  },
  methods: {
    init() {
      this.getVisualAngle();
      $Mark = this.$refs["mark"];
      $Data = this.$refs["data"];
      $Clone = this.$refs["clone"];
      this.id = Number(Zero.GetQueryString("id"));
      this.EnOrCn = Zero.GetQueryString("type");
      // 初始化
      Promise.all([this.getInitData(), this.getDtlData(this.id)]).then(
        ([res1, [res2]]) => {
          if (res1 && res2) {
            $Data.init(res1);
            this.initData = res1;
            this.itemData = res2;
            // 绘制 初始化 基础数据
            this.pageInit();
            this.url = res2["img_src"];
          }
        }
      );
    },
    pageInit(id, callback) {
      // 功能：更新近期、计算标注、清空备份、绘制初始化
      // 场景：第一次请求时、中英转换、数据改变时（标注保存、业务审批、克隆）
      // data = data ? data : this.itemData;
      this.getTagImageStates(); // 获取标注状态控制按钮
      $Mark.init();
      this.saveData = [];
      $Clone.getRecentData(this.EnOrCn);
      if (!id && !callback) {
        this.dataInIt(this.itemData);
      } else {
        this.getDtlData(id).then(([res]) => {
          callback && callback(res);
        });
      }
    },
    dataInIt(res) {
      // 转换->版本检测->兼容->(mark)备份->绘制->保存
      // 绘制=>新增or删除or清空or撤退or
      // 保存=>下载or提交or审核
      this.translateData(res);
      this.compatibleData();
      this.notesD();
    },
    /** post */
    saveTagData() {
      // 保存数据
      let url = "ss_sample/tag_image/tag_action";
      let configJson = JSON.stringify(this.configJson);
      let params = {
        id: this.id,
        type: this.EnOrCn,
        configJson: configJson,
        imgBase64Str: this.imgBase64Str,
        visual_angle_code: Number(this.angle)
      };
      this.$http.odoo(url, params).then(save => {
        this.pageInit(this.id, res => {
          // 更新 文档 path
          this.itemData = res;
          // this.dataInIt(res);
          this.$Message.info('保存成功!');
        });
      });
    },
    getInitData() {
      // 获取基础数据
      let url = "ss_sample/tag_image/init_data_dimension";
      return this.$http.odoo(url);
    },
    getDtlData(id) {
      // 获取详情数据
      let url = "dataset/call_kw/ss.sample.tag.image/read";
      let params = {
        args: [
          [Number(id)],
          [
            "id",
            "name",
            "category_id",
            "img_src",
            "category_dict",
            "visual_angle_dict",
            "create_uid",
            "approve_status",
            "config_json_en",
            "config_json_cn",
            "image_en_path",
            "image_cn_path"
          ]
        ],
        kwargs: {},
        method: "read",
        model: "ss.sample.tag.image"
      };
      return this.$http.odoo(url, params);
    },
    getVisualAngle() {
      // 获取视角
      let url = "ss_sample/tag_image/init_data_visual_angle";
      return this.$http.odoo(url).then(res => {
        this.angleData = res.visual_angle || {};
      });
    },
    upAuxilImg(images) {
      // 上传？
      let url = "ss_sample/tag_image/assist_upload";
      let params = {
        array_data: images
      };
      this.$http.odoo(url, params).then(res => {
        for (let i = 0, len = res.length; i < len; i++) {
          let item = res[i];
          this.$set(this.configJson[item.key], "url", item["remote_url"]);
        }
        this.saveTagData();
      });
    },
    businessData(type) {
      /**
       * 业务操作 作废
       * @param submit,revoke_submit,approve,revoke_approve,invalid
       */
      let url = "ss_sample/tag_image/approve_action";
      let params = { id: this.id, approve_type: type };
      this.$http.odoo(url, params).then(bus => {
        this.pageInit(this.id, res => {
          // 改变状态
          this.itemData = res;
          if (type === 'submit') this.downLoadData();
        });
      });
    },
    newBusinessData(type) {
      /**
       * 业务操作
       * @param submit、revoke
       * */
      let url = {
        en: {
          submit: 'ss_sample/tag_image/en_tag_submit',
          revoke: 'ss_sample/tag_image/en_tag_revoke'
        },
        cn: {
          submit: 'ss_sample/tag_image/cn_tag_submit',
          revoke: 'ss_sample/tag_image/cn_tag_revoke'
        }
      }[this.EnOrCn][type];
      let params = { tag_image_id: this.id };
      this.$http.odoo(url, params).then(bus => {
        this.pageInit(this.id, res => {
          // 改变状态
          this.itemData = res;
          if (type === 'submit') this.downLoadData();
        });
      });
    },
    getTagImageStates() {
      /**
       * 标注状态
       * */
      const url = 'ss_sample/tag_image/tag_image_btn_operator';
      let params = { tag_image_id: this.id };
      this.$http.odoo(url, params).then(result => {
        console.log('result', result);
        this.btnStates = result;
      });
    },
    /** data */
    saveJsonData() {
      // 检测上传其中的配图
      let images = [];
      for (let key in this.configJson) {
        let item = this.configJson[key];
        if (
          item.type === "picture" &&
          item.url &&
          item.url.includes("data:image/")
        ) {
          images.push({
            key: item.id,
            imgBase64Str: item.url
          });
        }
      }
      let that = this;
      $Mark.cancelActiveClick();
      setTimeout(function() {
        $Mark.exportIMG(url => {
          that.imgBase64Str = url;
          if (images.length) {
            that.upAuxilImg(images);
          } else {
            that.saveTagData();
          }
        });
      }, 0);
    },
    downLoadData() {
      // 下载
      this.$Modal.confirm({
        title: "提交成功！",
        content: "数据提交成功，点击关闭按钮关闭当前页面并下载文档！",
        closable: true,
        okText: "关闭并下载",
        cancelText: "取消",
        onOk: () => {
          // 关闭并下载
          this.downAndClose();
        },
        onCancel: () => {
          // 初始化
          this.init();
        }
      });
    },
    downAndClose() {
      this.downIMG(function() {
        window.opener = null;
        window.open("", "_self");
        window.close();
      });
    },
    getCloneData(id) {
      // 克隆
      if (!id) return;
      // this.copyPanelShow = false;
      this.pageInit(id, res => {
        this.dataInIt(res);
      });
    },
    compatibleData() {
      // 兼容旧数据
      let json = {};
      let data = this.configJson;
      if (!data.sku) return false; //新版本
      let keys = Object.keys(data);
      let types = ["arrow", "thickness", "maxLength", "picture"];
      keys.map((key, ind) => {
        let item = data[key];
        if (item.type && types.indexOf(item.type) > -1) {
          let Guide = Cnode.compatible(item, this.config);
          Guide.id = Guide.id + "_" + key;
          json[Guide.id] = Guide;
        }
        if (ind === keys.length - 1) {
          this.configJson = json;
        }
      });
    },
    translateData(res) {
      // 序列化、翻译、中英文切换
      let json = null;
      let type = this.EnOrCn;
      let data = res || this.itemData;
      let cn = data["config_json_cn"];
      let en = data["config_json_en"];
      switch (type) {
        case "cn":
          json = cn || this.EnToCn(en) || {};
          break;
        case "en":
          json = en || {};
          break;
        default:
          json = {};
          break;
      }
      this.configJson = Zero.toJSON(json) || {};
    },
    editJsonData(id, data) {
      // 获取、兼容、中英互转、
      // 备份、删除、清空、新增
      // 所有编辑函数从这里修改
      this.notesD();
      this.$set(this.configJson, id, data);
    },
    /** mark */
    copyD(json) {
      // 复制整体
      let data = JSON.stringify(json);
      data = JSON.parse(data);
      return data;
    },
    notesD() {
      // 记录、操作前备份
      let json = this.configJson;
      let data = this.copyD(json);
      let save = this.saveData.splice(0, this.saveIndex + 1);

      save.push(data);
      this.saveData = save;
      this.saveIndex = save.length - 1;
      // this.saveData.push(data);
    },
    emptyD() {
      // 清空
      this.notesD();
      this.configJson = {};
      $Mark.cancelActiveClick();
    },
    revokeD(bool) {
      // 撤销
      let x = bool ? 1 : -1;
      let index = this.saveIndex + x;
      let data = this.saveData[index];
      if (index > -1 && data) {
        $Mark.cancelActiveClick();
        this.configJson = data;
        this.saveIndex = index;
      } else {
        this.$Message.warning("已到最后一步");
      }
      // if (this.saveData.length) {
      // 	$Mark.cancelActiveClick();
      // 	let data = this.saveData.pop();
      // 	this.configJson = data;
      // } else {
      // 	this.$Message.warning('已撤退到最后一步');
      // }
    },
    deleteD() {
      // 删除
      this.notesD();
      let id = $Mark.activeId;
      let json = this.configJson;
      if (id) {
        $Mark.cancelActiveClick();
        delete json[id];
      }
    },
    downIMG(callback) {
      // 导出 优先导出图片路径
      let that = this;
      $Mark.cancelActiveClick();
      setTimeout(function() {
        // 方案一 截图下载
        $Mark.exportIMG(url => {
          let Img = new _IMG({});
          let sku = that.itemData["name"];
          Img.imageDown(url, sku + "_" + that.EnOrCn);
          callback && callback();
        });

        // 方案二 A标签下载

        // let key = (that.EnOrCn === 'cn')
        //     ? 'image_en_path' : 'image_en_path';
        // let Img = new _IMG({});
        // let url = that.itemData[key];
        // let sku = that.itemData['name'];
        // let filename = sku+'_'+that.EnOrCn;
        // if (!url) {
        // 	that.$Message.warning('图片未保存！');
        // } else {
        // 	Img.imageUrlDown(url, filename+'.jpeg');
        // 	Img.imageDom(url).then(myImg => {
        //         return Img.imageBase64(myImg)
        //     }).then(base64 => {
        //         Img.imageDown(base64, filename);
        //     })
        // };
      }, 0);
    },
    EnToCn(string) {
      let i = 0,
        j = {};
      if (!string) return false;
      let obj = JSON.parse(string);
      for (let key in obj) {
        let item = obj[key];
        let font = item["font"];
        let id = font["contentI"];
        let type = font["contentT"];
        let list = this.initData[type];
        let node = Object.assign({}, item);
        if (list && list[id]) {
          node.font.content = list[id]["cn"];
          i++;
          j[key] = node;
        }
      }
      return i > 0 ? JSON.stringify(j) : false;
    },
    /** event */
    toolClick(item, ind) {
      $Mark = this.$refs["mark"];
      let active = this.tools[ind]["active"];
      if (active !== undefined) {
        this.$set(this.tools[ind], "active", !active);
      }
      item.click && item.click.bind($Mark)(active);
    },
    handleKeyDown(e) {
      let key = e.keyCode || e.which || e.charCode;
      let ctrlKey = e.ctrlKey || e.metaKey;
      if (e.altKey && !ctrlKey) {
        this.tools.map((item, ind) => {
          if (item.code === key) {
            this.toolClick(item, ind);
            e.preventDefault();
            return;
          }
        });
        if (key === 9) {
          // 切换 标注栏
          let index = ($Data.index + 1) % 3;
          $Data.setMenus(index);
        } else if (key === 83) {
          // 保存
          this.saveJsonData();
        } else if (key === 13) {
          // 关闭并下载
          this.$Loading.start();
          this.downAndClose();
        }
        e.preventDefault();
      }
    },
    handleKeyUp(e) {
      e.preventDefault();
    }
  },
  data() {
    return {
      // post data
      id: "",
      url: "", // 主图
      angle: null, // 视角
      EnOrCn: "", // 类型
      newData: {}, // fei
      saveData: [], // 备份
      initData: {}, // 基础
      itemData: {}, // 详情
      angleData: [], // 视角数据
      configJson: {}, // 处理后的 json
      drawJsonData: {}, //
      imgBase64Str: "", // 文档
      saveIndex: 0, // 备份位置

      dataPanelShow: true,
      copyPanelShow: true,

      // mark ？
      edit: true,
      lock: true,

      // btn States
      btnStates: {
        cn_revoke_btn: false,
        cn_save_btn: false,
        cn_submit_btn: false,
        en_revoke_btn: false,
        en_save_btn: false,
        en_submit_btn: false,
      },

      tools: [
        {
          code: 69,
          keys: "Alt + E",
          // icon: 'md-create',
          icon: "md-navigate",
          title: "开启编辑",
          active: false,
          click: function() {
            this.setDrawData(true, "isEdit");
            // $Mark.openEdit = !$Mark.openEdit;
          }
        },
        {
          code: 87,
          keys: "Alt + W",
          icon: "md-lock",
          // icon: 'md-add'
          title: "锁定角度", // 辅助线
          active: false,
          click: function() {
            this.setDrawData(true, "isLock");
            // $Mark.lockDirection = !$Mark.lockDirection;
          }
        },
        {
          code: 81,
          keys: "Alt + Q",
          icon: "md-expand",
          title: "框选",
          active: true,
          click: function(active) {
            if (!active) {
              $Data.init();
            } else {
              this.setDrawData("iframe", "type");
            }
          }
        },
        {
          code: 65,
          keys: "Alt + A",
          icon: "ios-skip-forward",
          title: "前进",
          click: () => {
            this.revokeD(true);
          }
        },
        {
          code: 90,
          keys: "Alt + Z",
          icon: "md-skip-backward",
          title: "撤销",
          click: this.revokeD
        },
        {
          code: 68,
          keys: "Alt + D",
          icon: "md-close",
          title: "删除",
          click: this.deleteD
        },
        {
          code: 84,
          keys: "Alt + T",
          icon: "md-trash",
          title: "清空",
          click: this.emptyD
        }
      ],
      events: [],
      approves: ["草拟", "提交", "审批"]
    };
  },
  created() {
    document.addEventListener("keydown", this.handleKeyDown);
    document.addEventListener("keyup", this.handleKeyUp);
  },
  mounted() {
    this.init();
  },
  destroyed() {
    document.removeEventListener("keydown", this.handleKeyDown);
    document.removeEventListener("keyup", this.handleKeyUp);
  }
};
</script>

<style scoped lang="scss">
$topHeight: 50px;

@mixin leftPanel {
  height: 100%;
  background: #ffffff;
  transition: all linear 0.3s;
}

.picture-markItem-wrapper {
  position: relative;
  box-sizing: border-box;
  background: #c0c0c0;
  .mark-head {
    top: 0;
    left: 0;
    width: 100%;
    position: absolute;
    /* head menus */
    .mark-head-menus {
      position: relative;
      width: 100%;
      height: 50px;
      z-index: 1;
      background: #ffffff;
      box-shadow: 0 2px 3px 2px rgba(0, 0, 0, 0.1);
      .mark-head-menu {
        display: flex;
        height: 100%;
        text-align: center;
        /*line-height: 50px;*/

        .mark-back {
          display: flex;
          height: 100%;
          padding-right: 10px;
          align-items: center;
          flex: 0 0 183px;
          .mark-back-icon {
            display: flex;
            width: 30px;
            height: 100%;
            cursor: pointer;
            font-size: 16px;
            padding: 0 7px;
            text-align: center;
            align-items: center;
            font-weight: bolder;
            color: rgb(141, 158, 167);
            transition: all 0.1s linear 0s;
            i {
              position: relative;
              top: -1px;
            }
            &:hover {
              color: rgb(193, 193, 193);
            }
          }
          .mark-back-font {
            display: inline;
            font-size: 14px;
            color: rgb(91, 107, 115);
            max-width: initial !important;
            vertical-align: bottom;
            line-height: unset;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
        }

        .mark-toolbar {
          flex: 1 1 0%;
          display: flex;
          justify-content: center;
          justify-content: space-evenly;
          .toolbars {
            display: flex;
            .toolbar-item {
              height: 100%;
              margin: 0 3px;
              .toolbar {
                min-width: 50px;
                font-size: 13px;
                padding: 6px 0;
                text-align: center;
                color: rgb(91, 107, 115);
                .i {
                  width: 100%;
                  height: 30px;
                }
                &:hover {
                  color: #000;
                  cursor: pointer;
                }
                &.green:hover {
                  color: green;
                }
                &.red:hover {
                  color: red;
                }
              }
            }
          }
        }

        .mark-control {
          width: 245px;
        }
      }
    }
    /* head btn */
    .mark-head-btn {
      position: fixed;
      top: 10px;
      right: 15px;
      z-index: 99;
      &.right button {
        margin-left: 4px;
        &:first-child {
          margin-left: 0;
        }
      }
      &.center {
        left: 0;
        right: 0;
        margin: auto;
      }
    }
  }
  .mark-content {
    position: relative;
    display: flex;
    width: 100%;
    height: 100%;
    padding-top: $topHeight;
    /* tool */
    .mark-left-tool {
      /*
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            */
      position: relative;
      z-index: 9;
      width: 40px;
      height: 100%;
      padding: 15px 0;
      align-items: center;
      background: #ffffff;
      border-top: 1px solid rgb(222, 222, 228);
      border-right: 1px solid rgb(222, 222, 228);
      .mark-panel-icon {
        left: 0;
        bottom: 15px;
        width: 40px;
        color: #c2c4c5;
        cursor: pointer;
        font-size: 22px;
        position: absolute;
        & li:hover {
          color: #0d0d0d;
        }
        & li.active {
          color: #0d0d0d;
        }
      }
      /*.mark-node-icon {
                height: 22px;
                line-height: 22px;
                margin: 0 8px 8px;
                padding-bottom: 15px;
                box-sizing: content-box;
                border-bottom: 1px solid #000000;
                li {
                    border: 1px dashed #4c4c4c;
                }
                !**!
            }*/
      .mark-tool-icon {
        li {
          margin-bottom: 24px;
          position: relative;
          color: #0d0d0d;
          &:hover {
            cursor: pointer;
          }
          &.active {
            cursor: pointer;
            color: #0d0d0d;
          }
          &.disable {
            color: #c2c4c5;
            /*cursor: not-allowed;*/
          }
          i {
            width: 26px;
            height: 26px;
            padding: 2px;
            font-size: 22px;
          }
          .mark-tool-title {
            left: 90%;
            width: 0;
            opacity: 0;
            z-index: -1;
            position: absolute;
            top: 50%;
            color: #fff;
            height: 26px;
            padding: 0 6px;
            line-height: 26px;
            transition: all 0.3s;
            border-radius: 0 6px 6px 0;
            transform: translateY(-50%);
            background: rgba(0, 0, 0, 0.6);
          }
          &:hover .mark-tool-title {
            opacity: 1;
            left: 130%;
            z-index: 0;
            width: max-content;
          }
          .mark-tool-title:hover {
            left: 90%;
            width: 0;
            opacity: 0;
            z-index: -1;
          }
        }
      }
    }
    /* data */
    .mark-left-data {
      width: 260px;
      @include leftPanel;
      &.hidden {
        margin-left: -260px;
      }
    }
    /* copy */
    .mark-left-copy {
      /*
            left: 40px;
            z-index: 5;
            width: 300px;
            top: $topHeight;
            overflow: hidden;
            position: absolute;
            @include leftPanel;
            height: calc( 100% - 50px );
            */
      width: 300px;
      @include leftPanel;
      &.hidden {
        margin-right: -300px;
      }
    }
    /* mark */
    .mark-cont-mark {
      flex: 1;
      min-width: 600px;
      background: rgb(245, 245, 245);
    }
  }
}
</style>
