function Cnode(o = {}) {
  this.type = "";
  this.isLock = true;
  this.isEdit = true;
  this.config = o.config || {
    size: 10,
    color: "#000",
    nodeColor: "#000"
  };
}

Cnode.prototype = {
  set(Guide, date, font) {
    Guide = Object.assign({}, Guide, date);
    Guide.font = Object.assign({}, Guide.font, font);

    return Guide;
  },
  edit(Guide, font, point) {
    // 修改文字
    console.log(Guide);
    let type = Guide.type;
    let config = this.config;
    Guide = this.set(
      Guide,
      {
        color: config.nodeColor
      },
      {
        top: Guide.font.top,
        left: Guide.font.left,
        color: config.color,
        fontSize: config.size,
        content: font.content,
        contentI: font.contentI || "自定义",
        contentT: font.contentT || "自定义"
      }
    );
    Guide = this[type](point, {}, Guide);
    return Guide;
  },
  create(type, point, other = {}) {
    let types = ["arrow", "iframe", "picture", "maxLength", "thickness"];
    if (!types.includes(type)) {
      console.error("type 类型不存在！");
      return;
    }
    if (type === "maxLength" && !this.isLock) {
      type = "thickness";
    }
    if (this[type]) {
      let Guide = this[type](point, other);
      return Guide;
    }
  },
  repaint(Guide, point) {
    // 重绘位置
    Guide.point = point;
    let type = Guide.type;
    if (type !== "thickness") {
      let site = this.computeSite(point);
      Guide = this.set(Guide, site, {});
    }
    Guide = this[type](point, {}, Guide);
    return Guide;
  },
  template(type, point) {
    let lock = this.isLock;
    let config = this.config;

    let id = new Date().getTime();
    let Guide = {
      id: id,
      lock: lock,
      type: type,
      point: point,
      color: config.nodeColor,
      // top left width height rotate| top left width height -rotate align
      font: {
        color: config.color,
        fontSize: config.size,
        content: "自定义",
        contentI: "自定义",
        contentT: "自定义"
      }
    };
    return Guide;
  },
  compatible(item = {}) {
    // 兼容
    let Guide,
      other = {};
    let type = item.type;
    let point = item.location;
    // arrow maxLength thickness
    if (item.type === "picture") {
      item.content = "";
      let img = item.image;
      other = {
        url: img.url,
        width: img.width * img.zoom,
        height: img.height * img.zoom
      };
    }
    Guide = this.create(type, point, other);
    Guide = this.set(
      Guide,
      {},
      {
        content: item.content,
        contentI: item.contentI,
        contentT: item.contentT
      }
    );
    return Guide;
  },
  //  绘制方法
  arrow(point, other, Guide) {
    let computedFont = function(guide) {
      console.log("guide", guide);
      return {
        top: guide.font ? guide.font.top : -guide.height,
        left: guide.font ? guide.font.left : 0,
        width: guide.width * 0.8,
        height: guide.height,
        align: guide.rotate === 180 ? "right" : "left",
        rotate: Math.abs(guide.rotate) === 90 ? 0 : -guide.rotate
      };
    };

    if (Guide) {
      let font = computedFont(Guide); // 这里要不要变更文字宽度？
      if (Math.abs(Guide.rotate) === 90) {
        // font.origin = '';
        font.rotate = 0;
      }
      Guide = this.set(Guide, {}, font);
      return Guide;
    }
    let site = this.computeSite(point);
    let font = computedFont(site);
    Guide = this.template("arrow", point);
    Guide = this.set(Guide, site, font);
    console.log("arrow", Guide);
    return Guide;
  },
  iframe(point, other, Guide) {
    let computedFont = function(guide) {
      return {
        align: "center",
        top: -20,
        left: 0,
        rotate: 0,
        width: guide.width * 0.8,
        height: 20
      };
    };
    // 方向矫正
    if (point.sx > point.ex) {
      let sx = point.sx;
      point.sx = point.ex;
      point.ex = sx;
    }
    if (point.sy > point.ey) {
      let sy = point.sy;
      point.sy = point.ey;
      point.ey = sy;
    }

    if (Guide) {
      Guide.point = point;
      let font = computedFont(Guide); // 这里要不要变更文字宽度？
      Guide = this.set(
        Guide,
        {
          rotate: 0,
          width: point.ex - point.sx,
          height: point.ey - point.sy
        },
        font
      );
      return Guide;
    }
    let site = this.computeSite(point);
    site = Object.assign(
      {},
      site,
      {
        rotate: 0,
        top: point.sy,
        left: point.sx,
        width: point.ex - point.sx,
        height: point.ey - point.sy
      },
      other
    );
    let font = computedFont(site);
    Guide = this.template("iframe", point);
    Guide = this.set(Guide, site, font);

    console.log("iframe", Guide);
    return Guide;
  },
  picture(point, other, Guide) {
    let computedFont = function(guide) {
      return {
        align: "center",
        top: -20,
        left: 0,
        rotate: 0,
        width: guide.width * 0.8,
        height: 20
      };
    };

    if (Guide) {
      let font = computedFont(Guide); // 这里要不要变更文字宽度？
      Guide = this.set(Guide, {}, font);
      return Guide;
    }
    if (!other.url || !other.width || !other.height) {
      console.error("检测创建图片函数中 other字段是否完整（url与宽高）");
      return;
    }
    let site = this.computeSite(point);
    site = Object.assign(
      {},
      site,
      {
        rotate: 0,
        top: point.sy,
        left: point.sx
        // url: other.url,
        // width: other.width,
        // height: other.height,
        // top: point.ey - (other.height/2),
        // left: point.ex - (other.width/2),
      },
      other
    );
    let font = computedFont(site);
    Guide = this.template("picture", point);
    Guide = this.set(Guide, site, font);
    return Guide;
  },
  maxLength(point, other, Guide) {
    let computedFont = function(text, size, guide) {
      let len = text.length || 0;
      let long = len * size + 10;
      let left = (guide.width - long) / 2;
      return {
        top: 0,
        left: left,
        width: long,
        align: "center",
        height: guide.height,
        rotate: -guide.rotate
      };
    };

    if (Guide) {
      let text = Guide.font.content;
      let size = Guide.font.fontSize;
      let font = computedFont(text, size, Guide);
      Guide = this.set(Guide, {}, font);
      return Guide;
    }
    Guide = this.template("maxLength", point);
    let text = Guide.font.content;
    let size = Guide.font.fontSize;
    let site = this.computeSite(point);
    let font = computedFont(text, size, site);
    Guide = this.set(Guide, site, font);
    return Guide;
  },
  thickness(point, other, Guide) {
    let computedFont = function(text, size, guide) {
      let len = text.length || 0;
      let long = len * size + 10;
      let left = (guide.width - long) / 2;
      return {
        top: 0,
        left: left,
        width: long,
        align: "center",
        height: guide.height,
        rotate: -guide.rotate
      };
    };

    if (Guide) {
      let text = Guide.font.content;
      let size = Guide.font.fontSize;
      let site = this.computeSite(point, true);
      let font = computedFont(text, size, Guide);
      Guide = this.set(Guide, site, font);
      return Guide;
    }
    Guide = this.template("thickness", point);
    let text = Guide.font.content;
    let size = Guide.font.fontSize;
    let site = this.computeSite(point, true);
    let font = computedFont(text, size, site);
    Guide = this.set(Guide, site, font);
    return Guide;
  },
  //	计算方法
  computeBox(Guide) {},
  computeSite(loc, lock) {
    // todo
    // lock = this.isLock;

    let X = loc.ex - loc.sx;
    let Y = loc.ey - loc.sy;
    let locW = Math.abs(X);
    let locH = Math.abs(Y);
    let xrad = Math.atan2(Y, X);
    let angle = (xrad / Math.PI) * 180;
    let distance = Math.sqrt(Math.pow(X, 2) + Math.pow(Y, 2));

    let top,
      left,
      width,
      height = 20;

    if (!lock) {
      //开启锁定模式
      width = distance;
      if (angle <= 45 && angle >= -45) {
        angle = 0;
      } else if (angle <= 135 && angle >= 45) {
        angle = 90;
      } else if (angle <= -45 && angle >= -135) {
        angle = -90;
      } else {
        angle = 180;
      }
      // console.log(loc, distance, angle, locW, locH);
    } else {
      // distance = (locW > locH) ? locW : locH;
      console.log(loc, distance, angle, locW, locH);
    }
    width = distance > 21 ? distance : 21;

    return {
      rotate: angle,
      width: width - 1,
      height: height,
      top: loc.sy - 9,
      left: loc.sx
    };
  },
  computeStyle(val) {
    let style = {};
    Object.keys(val).map(key => {
      let item = val[key];
      if (
        key === "top" ||
        key === "left" ||
        key === "width" ||
        key === "height" ||
        key === "fontSize"
      ) {
        style[key] = item + "px";
      } else if (key === "color") {
        style[key] = item;
      } else if (key === "zoom") {
        style["transform"] = "scale(" + item + ")";
      } else if (key === "align") {
        style["textAlign"] = item;
      } else if (key === "rotate") {
        style["transform"] = "rotate(" + item + "deg)";
      } else if (key === "origin") {
        style["transformOrigin"] = item;
      }
    });
    return style;
  }
};

export default {
  Cnode
};
