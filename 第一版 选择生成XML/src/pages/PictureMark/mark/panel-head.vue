<template>
  <div class="mark-head-menus">
    <div class="mark-head-menu">
      <div class="mark-back">
        <router-link class="mark-back-icon" :to="'123'">
          <Icon type="ios-arrow-back" />
        </router-link>
        <span class="mark-back-font">ERP</span>
      </div>

      <div class="mark-toolbar">
        <div class="toolbars">
          <div class="toolbar-item">
            <div class="toolbar">
              <Icon type="md-refresh" />
              <div class="toolbar-text">撤销</div>
            </div>
          </div>
          <div class="toolbar-item">
            <div class="toolbar">
              <Icon type="md-trash" />
              <div class="toolbar-text">清空</div>
            </div>
          </div>
          <div class="toolbar-item">
            <div class="toolbar red">
              <Icon type="md-close" />
              <div class="toolbar-text">删除</div>
            </div>
          </div>
          <div class="toolbar-item">
            <div class="toolbar">
              <Icon type="md-add" />
              <div class="toolbar-text">辅助线</div>
            </div>
          </div>
        </div>

        <div class="toolbars">
          <div class="toolbar-item">
            <div class="toolbar green">
              <Icon type="md-cloud-done" />
              <div class="toolbar-text">保存</div>
            </div>
          </div>
          <div class="toolbar-item">
            <div class="toolbar red">
              <Icon type="md-cloud-upload" />
              <div class="toolbar-text">提交</div>
            </div>
          </div>
          <div class="toolbar-item">
            <div class="toolbar red">
              <Icon type="md-cloud-download" />
              <div class="toolbar-text">下载</div>
            </div>
          </div>
        </div>

        <div class="toolbars">
          <div class="toolbar-item">
            <div class="toolbar green">
              <Icon type="md-images" />
              <div class="toolbar-text">主信息</div>
              <!-- 底图信息 url rotate width height 其他信息 大类 视角 货号 材质 -->
            </div>
          </div>
          <div class="toolbar-item">
            <div class="toolbar green">
              <Icon type="md-images" />
              <div class="toolbar-text">转中文</div>
            </div>
          </div>
        </div>

        <div class="toolbars">
          <div class="toolbar-item">
            <div class="toolbar red">
              <Icon type="md-images" />
              <div class="toolbar-text">审批</div>
            </div>
          </div>
          <div class="toolbar-item">
            <div class="toolbar red">
              <Icon type="md-images" />
              <div class="toolbar-text">撤销审批</div>
            </div>
          </div>
        </div>
      </div>

      <div class="mark-control"></div>
    </div>
  </div>
</template>

<script>
/**
 * 触发事件（事件类型）
 * */
export default {
  name: "mark-head"
};
</script>

<style scoped lang="scss">
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
    text-align: left;
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
</style>
