<template>
  <div class="Epicture-upload">
    <input
      ref="file"
      type="file"
      accept=".jpg,.jpeg,.png"
      style="display: none;"
      @change="fileChange"
      multiple
    />
    <Button @click="openChange" type="primary">选择图片</Button>
    <Modal v-model="uploadListStatus" title="上传进度">
      <p v-for="item in uploadListMsg">
        <Progress :percent="item.num">
          <Icon type="checkmark-circled"></Icon>
          <span>{{ item.msg }}</span>
          <div>{{ item.name }}</div>
        </Progress>
      </p>
    </Modal>
  </div>
</template>

<script>
/**
 * 图片上传
 * 0、数据初始化：
 *        格式限制、（.jpg,.jpeg,.png）
 *        大小限制、
 *        数量限制、
 *        错误提醒
 * 1、上传
 * 2、排序（可）
 * 3、压缩（可）
 * 4、方向处理（可）
 * 5、尺寸处理（可）
 * 6、图片预览（可）
 * 7、上传进度（可）
 * @param compress Obj
 * @event upDateList Fun
 * @param uploadPost Fun :taggingBatchUpload
 * @event sessure Fun
 *
 * */
// import EXIF from 'exif-js';
import Cookies from "js-cookie";
export default {
  name: "pictureUpload",
  data() {
    return {
      headers: {
        Authorization: Cookies.get("token")
      },
      maxSizeList: [], //超过大小
      formatList: [], //格式错误
      uploadList: [], //待上传
      uploadListMsg: [], //
      uploadListStatus: false,
      filesNum: 0, //压缩队列总数
      fileMsg: "", //没啥用
      uploadMsg: "" //信息
    };
  }, //compress
  props: {
    compressDef: {
      type: Object,
      default: function() {
        return {
          formats: ["jpg", "jpeg", "png"],
          ratio: {
            //期望尺寸
            width: 1169,
            height: 827,
            color: "#fff", //背景色留白
            quality: 0.7 //图片质量 0-1
          },
          min: 1,
          max: 30,
          num: 100
        };
      }
    },
    uploadPost: Function,
    successCb: Function
  },
  watch: {
    fileMsg() {
      console.log(this.fileMsg);
    },
    uploadMsg() {
      console.log(this.uploadMsg);
    }
  },
  mounted() {},
  methods: {
    //post
    fillUpload(fileO) {
      this.$set(this.uploadListMsg[fileO.index], "msg", "上传中...");
      this.uploadPost({
        files: [fileO.file],
        batchNo: fileO.batchNo,
        index: fileO.index
      }).then(res => {
        this.$set(this.uploadListMsg, fileO.index, {
          num: 100,
          msg: "上传成功",
          name: fileO.name,
          status: "success"
        });
        this.filesNum--;
        this.uploadMsg =
          "第" +
          fileO.index +
          "张图片上传成功！还剩余" +
          this.filesNum +
          "张未成功！";
        if (!this.filesNum) {
          this.uploadListMsg = [];
          this.$emit("upDateList");
          this.uploadListStatus = false;
          // this.uploadMsg = '全部上传成功！';
          // this.$store.commit('setLoading', false);
        }
      });
    },
    //up even
    openChange() {
      //清空所有数组
      let input = this.$refs["file"];
      this.uploadList = [];
      this.formatList = [];
      this.maxSizeList = [];
      input.value = "";
      input.click();
    },
    fileChange($event) {
      let tager = $event.target || $event.srcElement;
      let batch = new Date().format("yyyyMMddhhmmss");
      let files = Array.from(tager.files);
      if (!files) return;
      this.$store.commit("setLoading", true);
      files.forEach((item, index, array) => {
        let fileInfo = {
          num: 0,
          msg: "压缩中",
          name: item.name,
          status: "active"
        };
        this.uploadListStatus = true;
        this.uploadListMsg.push(fileInfo);
        if (this.handleMaxNum(index)) {
          fileInfo.msg = "超过数量";
          fileInfo.status = "wrong";
        } else if (this.handleMaxSize(item)) {
          fileInfo.msg = "超过大小";
          fileInfo.status = "wrong";
        } else if (this.handleFormatError(item)) {
          fileInfo.msg = "格式错误";
          fileInfo.status = "wrong";
        } else {
          let fileO = {
            file: item,
            index: index,
            batchNo: batch
          };
          this.filesNum++;
          this.fileMsg =
            "总文件数" +
            files.length +
            "校验成功" +
            this.filesNum +
            "个、开始进行压缩转向处理";
          //压缩转换
          let min = this.compressDef.min || 1;
          var URL = window.URL || window.webkitURL;
          var url = URL.createObjectURL(fileO.file);
          this.imageLoad(url).then(myImg => {
            const Quality = 0.7;
            //生成canvas
            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext("2d");
            this.fileDirection(canvas, ctx, myImg);
            var quality =
              fileO.file.size > min * 1024 * 1024
                ? this.compressDef.ratio.quality || Quality
                : 1;
            var base64 = canvas.toDataURL("image/jpeg", quality);
            fileO.file = this.base64ToBlob(base64, fileO.file);
            fileInfo.num = 33;
            fileInfo.msg = "压缩成功";
            this.fillUpload(fileO);
          });
        }
      });
    },
    fileHandle() {},
    //up check
    handleError(error) {
      this.$Message.error(error);
    },
    handleFormatError(file) {
      let formats = this.compressDef.formats.map(item => {
        return "image/" + item;
      });
      if (formats.indexOf(file.type) == -1) {
        this.handleError(file.name + "文件格式错误!");
        this.formatList.push(file.name);
        return true;
      }
    },
    handleMaxSize(file) {
      let max = this.compressDef.max;
      if (max && file.size > max * 1024 * 1024) {
        this.handleError(file.name + "文件超过" + max + "兆!");
        this.maxSizeList.push(file.name);
        return true;
      }
    },
    handleMaxNum(index) {
      let num = this.compressDef.num;
      if (num && index > num - 1) {
        this.handleError("超过最大上传数量！");
        return true;
      }
    },
    //up deal
    fileDirection(canvas, ctx, myImg) {
      let width = this.compressDef.ratio.width;
      let height = this.compressDef.ratio.height;
      var om = 0,
        defW = width,
        defH = height,
        w = myImg.width,
        h = myImg.height;
      canvas.width = width;
      canvas.height = height;
      // 小图、中图、大图留白、高图旋转
      if (w <= h) {
        //s >= 1
        //旋转
        om = width;
        defH = width;
        defW = height;
        ctx.rotate(Math.PI / 2);
      }
      var defS = defH / defW,
        ow = defW,
        oh = defH,
        ox = 0,
        oy = 0,
        s = h / w;
      if (w < defW && h < defH) {
        ow = w;
        oh = h;
        ox = (defW - ow) / 2;
        oy = (defH - oh) / 2;
      } else if (s > defS) {
        //高了
        ow = defH / s;
        ox = (defW - ow) / 2;
      } else if (s < defS) {
        //宽了
        oh = defW * s;
        oy = (defH - oh) / 2;
      }
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, -om, defW, defH);
      ctx.drawImage(myImg, ox, oy - om, ow, oh);
    },
    //JPEG 可抽取
    imageLoad(url) {
      var promise = new Promise(function(resolve, reject) {
        let myImg = new Image();
        myImg.crossOrigin = "anonymous";
        myImg.onload = () => {
          resolve(myImg);
        };
        myImg.src = url;
      });
      return promise;
    },
    base64ToBlob(urlData, file) {
      var arr = urlData.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      let bl = new File([u8arr], {
        type: mime,
        name: file.name
      });
      return bl;
    }
  }
};
</script>

<style scoped>
.Epicture-upload {
  float: left;
}
</style>
