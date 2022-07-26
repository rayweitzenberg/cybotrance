function lerp(a, b, c) {
  return b + a * (c - b);
}
function norm(a, b, c) {
  return (a - b) / (c - b);
}
function map(a, b, c, d, e) {
  return lerp(norm(a, b, c), d, e);
}
function getPixel(a, b, c, d) {
  var e = 4 * (c + b * d),
    f = a[e],
    g = a[e + 1],
    h = a[e + 2],
    i = a[e + 3];
  return [f, g, h, i];
}
function setPixel(a, b, c, d, e, f, g, h) {
  var i = 4 * (c + b * d);
  (a[i] = e), (a[i + 1] = f), (a[i + 2] = g), (a[i + 3] = h);
}
function distance(a, b) {
  var c = a.x - b.x,
    d = a.y - b.y,
    e = a.z - b.z;
  return Math.sqrt(c * c + d * d + e * e);
}
function getClosestFromList(a, b) {
  var c = 1e11,
    d = 0,
    e = null;
  return (
    b.forEach(function (b) {
      (d = distance(b, a)), c > d && ((c = d), (e = b));
    }),
    e
  );
}
function init() {
  cancelAnimationFrame(interval), (centers = []), (radius = h / 3);
  for (var a = 5, b = 0; a > b; b++) {
    var c = Math.random() * PI2,
      d = 0.5 * radius + Math.random() * radius * 0.5,
      e = new Point(w / 2 + Math.cos(c) * d, h / 2 + Math.sin(c) * d);
    (e.ox = w / 2),
      (e.oy = h / 2),
      (e.angle = c),
      (e.radius = d),
      (e.rspeed = 1 + 0.1 * Math.random()),
      (e.speed =
        (0.1 * RAD + Math.random() * RAD) * (Math.random() > 0.5 ? -1 : 1)),
      centers.push(e);
  }
  (particles = []), add();
}
function update() {
  (interval = requestAnimationFrame(update)),
    particles.length < 128 && add(),
    particles.length >= 128 && Math.random() < 0.1 && particles.shift(),
    (ctx.fillStyle = "#000"),
    ctx.clearRect(0, 0, w, h),
    (ctx.lineWidth = 2),
    (ctx.strokeStyle = "#EEE"),
    (ctx.fillStyle = "#CCC");
  var a = 1 - (0.5 + 0.5 * Math.sin(25e-5 * Date.now()));
  centers.forEach(function (b) {
    (b.x = b.ox + Math.cos(3 * b.angle) * Math.max(4, b.radius * a * b.rspeed)),
      (b.y =
        b.oy + Math.sin(2 * b.angle) * Math.max(4, b.radius * a * b.rspeed)),
      (b.angle += b.speed),
      ctx.beginPath(),
      ctx.arc(b.x, b.y, 2, 0, PI2),
      ctx.stroke(),
      ctx.fill();
  }),
    (ctx.lineWidth = 0.5),
    (ctx.strokeStyle = "#CCC"),
    (ctx.globalAlpha = 0.5),
    ctx.beginPath(),
    particles.forEach(function (a) {
      var b = getClosestFromList(a, centers);
      ctx.lineTo(b.x, b.y),
        ctx.moveTo(a.x, a.y),
        ctx.lineTo(b.x, b.y),
        (a.x += 0.1 * (b.x - a.x)),
        (a.y += 0.1 * (b.y - a.y));
    }),
    ctx.stroke(),
    (ctx.globalAlpha = 1);
  var b = new Point(),
    c = 10 + (0.5 + 0.5 * Math.sin(0.001 * Date.now())) * radius,
    d = c * c;
  ctx.beginPath();
  for (var e = 0; e < particles.length; e++) {
    var f = particles[e];
    ctx.moveTo(f.x, f.y), (b.x = f.x), (b.y = f.y);
    for (var g = e + 1; g < particles.length; g++) {
      var i = particles[g];
      if (d > c) {
        var j = Math.atan2(f.y - i.y, f.x - i.x);
        (f.x += 0.0025 * (i.x + Math.cos(j) * c - f.x)),
          (f.y += 0.0025 * (i.y + Math.sin(j) * c - f.y));
      }
    }
    Math.abs(b.x - f.x) < 1 || Math.abs(b.y - f.y) < 1
      ? ctx.lineTo(f.x + 1, f.y)
      : ctx.lineTo(f.x, f.y);
  }
  for (
    ctx.lineCap = "round",
      ctx.lineWidth = 3,
      ctx.strokeStyle = "#FFF",
      ctx.stroke(),
      e = 0;
    e < particles.length;
    e++
  )
    (f = particles[e]),
      (f.x < 0 || f.y < 0 || f.x > canvas.width || f.y > canvas.height) &&
        (particles.splice(e, 1), e--);
}
function add() {
  if (0 == particles.length)
    return particles.push(new Point(Math.random() * w, Math.random() * h));
  var a = particles[parseInt(Math.random() * particles.length)];
  particles.push(new Point(a.x, a.y));
}
var PI = Math.PI,
  PI2 = 2 * PI,
  RAD = PI / 180,
  DEG = 180 / PI;
!(function (a) {
  !(function () {
    if (!a.requestAnimationFrame) {
      a.webkitRequestAnimationFrame &&
        ((a.requestAnimationFrame = a.webkitRequestAnimationFrame),
        (a.cancelAnimationFrame =
          a.webkitCancelAnimationFrame || a.webkitCancelRequestAnimationFrame));
      var b = 0;
      (a.requestAnimationFrame = function (c) {
        var d = new Date().getTime(),
          e = Math.max(0, 16 - (d - b)),
          f = a.setTimeout(function () {
            c(d + e);
          }, e);
        return (b = d + e), f;
      }),
        (a.cancelAnimationFrame = function (a) {
          clearTimeout(a);
        });
    }
  })(),
    "function" == typeof define &&
      define(function () {
        return a.requestAnimationFrame;
      });
})(window);
var canvas = document.createElement("canvas");
document.body.appendChild(canvas);
var w = (canvas.width = window.innerWidth),
  h = (canvas.height = window.innerHeight),
  ctx = canvas.getContext("2d"),
  Point = (function () {
    function a(a, b, c) {
      (this.x = a || 0), (this.y = b || 0), (this.z = c || 0);
    }
    var b = a.prototype;
    return (b.constructor = a), a;
  })();
Point.prototype = {
  draw: function (a, b) {
    a.beginPath(), a.arc(this.x, this.y, b || 1, 0, 2 * Math.PI), a.stroke();
  },
  copy: function (a) {
    return (this.x = a.x), (this.y = a.y), this;
  },
  clone: function () {
    return new Point(this.x, this.y);
  },
  add: function (a) {
    return (this.x += a.x), (this.y += a.y), this;
  },
  sub: function (a) {
    return (this.x -= a.x), (this.y -= a.y), this;
  },
  multiply: function (a) {
    return (this.x *= a.x), (this.y *= a.y), this;
  },
  negate: function () {
    return (this.x *= 1), (this.y *= 1), this;
  },
  length: function () {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  },
  normalize: function (a) {
    a = a || 1;
    var b = (1 / this.length()) * a;
    return (this.x *= b), (this.y *= b), this;
  },
  dot: function (a) {
    return this.x * a.x + this.y * a.y;
  },
};
var particles,
  imgData,
  data,
  radius = 300,
  centers,
  interval;
window.onmousedown =
  window.ontouchstart =
  window.onresize =
  window.onload =
    function (a) {
      (w = width = canvas.width = window.innerWidth),
        (h = height = canvas.height = window.innerHeight),
        init(),
        update();
    };
