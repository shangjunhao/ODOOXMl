<template>
  <div class="E-picture-upload">
    <input
      ref="file"
      type="file"
      accept=".jpg,.jpeg,.png"
      @change="fileChange"
      multiple
      style="display: none;"
    />
    <Button @click="openChange" type="primary">选择图片</Button>
    <!--
        <Modal
            v-model="uploadListStatus"
            title="上传进度">
            <p v-for="item in uploadListMsg">
                <Progress :percent="item.num">
                    <Icon type="checkmark-circled"></Icon>
                    <span>{{item.msg}}</span>
                    <div>{{item.name}}</div>
                </Progress>
            </p>
        </Modal>
        <div class="test-image">
            <img :src="url" alt=""
                 style="display: none;
                 position: fixed;top: 0;left: 0;right: 0;bottom: 0;
                 width: 1169px;height: 827px; margin: auto; border: 3px solid #000000">
        </div>
        -->
  </div>
</template>

<script>
export default {
  name: "uploadBaseImg",
  methods: {
    // 上传
    fileUpload(file, index, batch) {
      this.num++;
      this.uploadList.push(file);
      let formData = new FormData();
      formData.append("file", file);
      formData.append("index", index);
      formData.append("batch_no", batch);
      this.$http
        .fileUpLoad("ss_sample/tag_image/batch_upload", formData)
        .then(res => {
          // debugger
          this.uploadList.pop();
          if (!this.uploadList.length) {
            this.$parent.getInit();
          }
          if (!res.data.status) {
            this.$Message.error(res.data["failure_msg"]);
          }
        });
    },
    //
    fileChange($event) {
      let target = $event.target || $event.srcElement;
      let files = Array.from(target.files);
      if (!files) return;
      this.fileList(files);
    },
    openChange() {
      let input = this.$refs["file"];
      this.uploadList = [];
      input.value = "";
      input.click();
    },
    // file check => 大小、尺寸、格式、
    // file handle => 排序、方向、尺寸、压缩、背景、上传、进度
    fileList(files = []) {
      /*
       * let batch = new Date().getTime();
       * */
      const batch = new Date().format("yyyyMMddhhmmss");
      files.map((item, index) => {
        let check = this.fileCheck(item);
        check && this.fileHandle(item, index, batch);
      });
    },
    fileCheck(file) {
      return true;
    },
    fileHandle(file, index, batchNo) {
      let that = this;
      let Img = new _IMG({ file });
      let size = (1024 * 1024 * 2) / file.size;
      let canvas = document.createElement("canvas");
      let imageDownAfter = function(myImg, oldImg, orient) {
        let x,
          y,
          Max_W = 1169,
          Max_H = 827,
          ctx = this.ctx,
          w = myImg.width, // 输出
          h = myImg.height, // 输出
          width = myImg.width,
          height = myImg.height;

        if ([5, 6, 7, 8].indexOf(orient) > -1) {
          Max_W = 827;
          Max_H = 1169;
        }
        if (w / h > Max_W / Max_H) {
          height = h = Max_W / (w / h);
          width = w = Max_W;
        } else {
          width = w = Max_H * (w / h);
          height = h = Max_H;
        }

        x = (Max_W - w) / 2;
        y = (Max_H - h) / 2;

        console.log("x:", x);
        console.log("y:", y);
        console.log("w:", w);
        console.log("h:", h);
        console.log("Max_W:", Max_W);
        console.log("Max_H:", Max_H);
        console.log("width:", width);
        console.log("height:", height);
        console.log("orient:", orient);

        switch (orient) {
          case 2:
            ctx.transform(-1, 0, 0, 1, width, 0);
            break;
          case 3:
            ctx.transform(-1, 0, 0, -1, Max_W, Max_H);
            break; // ok
          case 4:
            ctx.transform(1, 0, 0, -1, 0, height);
            break;
          case 5:
            ctx.transform(0, 1, 1, 0, 0, 0);
            break;
          case 6:
            ctx.transform(0, 1, -1, 0, Max_H, 0);
            break; // ok
          case 7:
            ctx.transform(0, -1, -1, 0, height, width);
            break;
          case 8:
            ctx.transform(0, -1, 1, 0, 0, Max_W);
            break; // Max_W ? width
          default:
            ctx.transform(1, 0, 0, 1, 0, 0);
        }
        // ctx.transform(Math.cos(deg*align),Math.sin(deg*align),-Math.sin(deg*align),Math.cos(deg*align),height,0);

        // Draw a white base
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, Max_W, Max_H);
        ctx.drawImage(myImg, x, y, w, h);

        // Draw pictures and convert to files
        this.type = "image/jpeg";
        this.quality = size > 1 ? 1 : size.toFixed(2);
        let url = this.canvas.toDataURL(this.type, this.quality);
        this.imageToFile(url, this.file).then(upFile => {
          /** Image out */
          that.url = url;
          that.fileUpload(upFile, index, batchNo);
          // that.$parent.$set(that.$parent.goods[0], 'url', url);
          // console.log(url, upFile, this);
          // that.url = url;
        });

        return { x, y, w, h };
      };
      // 配置
      Img.getOrientation(file)
        .then(orient => {
          Img.imageToDom(file).then(fileImg => {
            Img.isCanvas(canvas);
            Img.canvas.width = 1169;
            Img.canvas.height = 827;
            Img.imageDrawAfter = function(myImg) {
              let p = imageDownAfter.bind(this);
              return p(myImg, fileImg, orient);
            };
            Img.imageBase64(fileImg);
          });
        })
        .catch(orient => {
          // 暂时处理逻辑相同
          Img.imageToDom(file).then(fileImg => {
            Img.isCanvas(canvas);
            Img.canvas.width = 1169;
            Img.canvas.height = 827;
            Img.imageDrawAfter = function(myImg) {
              let p = imageDownAfter.bind(this);
              return p(myImg, fileImg, orient);
            };
            Img.imageBase64(fileImg);
          });
        });
    }
  },
  data() {
    return {
      // 废弃
      // maxSizeList: [], //超过大小
      // formatList: [], //格式错误
      // uploadList: [], //待上传
      // filesNum: 0, //压缩队列总数
      // fileMsg: '', //没啥用
      // uploadMsg: '', //信息
      // uploadListStatus: false,
      // uploadListMsg: [], //

      // 使用
      num: 0,
      url: "",
      uploadList: []
    };
  }
};
</script>

<style scoped>
.E-picture-upload {
  position: absolute;
  top: 0;
  left: 20px;
  padding: 10px 0;
  transition: all 0.3s;
}
</style>
