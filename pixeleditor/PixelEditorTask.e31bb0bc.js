// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"modules/rgb-slider/index.js":[function(require,module,exports) {
var rgbSlider = function rgbSlider(document) {
  var slider = document.querySelector('#rgb-slider');
  slider.insertAdjacentHTML('beforeend', '<input type="range" min="0" max="360" value="180" class="rgb-range-slider" />');
  slider.insertAdjacentHTML('beforeend', '<div class="rgb-slider-scale"></div>');
  slider.insertAdjacentHTML('beforeend', "<div class=\"rgb-slider-arrow-container flex flex-justify-space-between\">\n      <div class=\"rgb-slider-arrow-left\"></div>\n      <div class=\"rgb-slider-arrow-right\"></div>\n    </div>");
  var sliderArrowContainer = document.querySelector('.rgb-slider-arrow-container');
  var sliderArrowRight = document.querySelector('.rgb-slider-arrow-right');
  var sliderArrowLeft = document.querySelector('.rgb-slider-arrow-left');
  var sliderRange = document.querySelector('.rgb-range-slider');

  function fixSlider() {
    var sliderValue = sliderRange.value;
    sliderArrowContainer.style.top = "".concat((1 - sliderValue / 360) * 400 - 8, "px");
    var sliderColor = HSLToHex(sliderValue, 100, 50);
    sliderArrowRight.style.borderRightColor = sliderColor;
    sliderArrowLeft.style.borderLeftColor = sliderColor;
    return sliderColor;
  }

  return {
    sliderRange: sliderRange,
    fixSlider: fixSlider
  };
};

function HSLToHex(h, s, l) {
  s /= 100;
  l /= 100;
  var c = (1 - Math.abs(2 * l - 1)) * s,
      x = c * (1 - Math.abs(h / 60 % 2 - 1)),
      m = l - c / 2,
      r = 0,
      g = 0,
      b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h <= 360) {
    r = c;
    g = 0;
    b = x;
  } // Having obtained RGB, convert channels to hex


  r = Math.round((r + m) * 255).toString(16);
  g = Math.round((g + m) * 255).toString(16);
  b = Math.round((b + m) * 255).toString(16); // Prepend 0s, if necessary

  if (r.length == 1) r = "0" + r;
  if (g.length == 1) g = "0" + g;
  if (b.length == 1) b = "0" + b;
  return "#" + r + g + b;
}

module.exports = rgbSlider;
},{}],"modules/painting-grid/index.js":[function(require,module,exports) {
var paintingGrid = function paintingGrid(document) {
  var paintingCanvas = document.querySelector('#painting-canvas');
  var paintingCanvasCtx = paintingCanvas.getContext('2d');
  var gridSize = 16;
  var paintingColor = '#000';
  paintingCanvas.addEventListener('mousedown', function (e) {
    paintingCanvasMouseDown(e);
  });

  function getMousePosition(canvas, e) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  function paintingCanvasMouseDown(e) {
    var paintCellNumbers = parseInt(gridSize);
    var paintCellSize = 400 / paintCellNumbers;
    var mousePosition = getMousePosition(paintingCanvas, e);
    var rowIndex = Math.ceil(mousePosition.x / paintCellSize);
    var columnIndex = Math.ceil(mousePosition.y / paintCellSize);
    paintingCanvasCtx.fillStyle = paintingColor;
    paintingCanvasCtx.fillRect((rowIndex - 1) * paintCellSize, (columnIndex - 1) * paintCellSize, paintCellSize, paintCellSize);
  }

  function updatePaintingBoard() {
    paintingCanvasCtx.clearRect(0, 0, paintingCanvas.width, paintingCanvas.height);
    paintingCanvasCtx.beginPath();
    paintingCanvasCtx.strokeStyle = '#d7d7d7';
    var paintCellNumbers = parseInt(gridSize);
    var paintCellSize = 400 / paintCellNumbers;

    for (var i = 0; i < paintCellNumbers; i++) {
      for (var j = 0; j < paintCellNumbers; j++) {
        paintingCanvasCtx.rect(i * paintCellSize, j * paintCellSize, paintCellSize, paintCellSize);
      }
    }

    paintingCanvasCtx.stroke();
  }

  function updatePaintingGridSize(size) {
    gridSize = size;
    updatePaintingBoard();
  }

  function updatePaintingGridColor(color) {
    paintingColor = color;
  }

  function downloadPainting() {
    var downloadLink = document.createElement('a');
    downloadLink.href = paintingCanvas.toDataURL();
    downloadLink.download = 'painting.png';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  return {
    updatePaintingGridSize: updatePaintingGridSize,
    updatePaintingGridColor: updatePaintingGridColor,
    downloadPainting: downloadPainting
  };
};

module.exports = paintingGrid;
},{}],"index.js":[function(require,module,exports) {
var selectedColorBox = document.querySelector('.selected-color-box');
var sizeInputs = document.querySelectorAll('.input-box .input input');
var sliderColor = '#000';

var rgbSlider = require('./modules/rgb-slider');

var paintingGrid = require('./modules/painting-grid');

var _paintingGrid = paintingGrid(document),
    updatePaintingGridSize = _paintingGrid.updatePaintingGridSize,
    updatePaintingGridColor = _paintingGrid.updatePaintingGridColor,
    downloadPainting = _paintingGrid.downloadPainting;

var _rgbSlider = rgbSlider(document),
    sliderRange = _rgbSlider.sliderRange,
    fixSlider = _rgbSlider.fixSlider;

handleSliderChange();

sliderRange.oninput = function () {
  handleSliderChange();
};

function handleSliderChange() {
  sliderColor = fixSlider();
  selectedColorBox.style.backgroundColor = sliderColor;
  selectedColorBox.innerHTML = sliderColor;
  updatePaintingGridColor(sliderColor);
}

updatePaintingGridSize(sizeInputs[0].value);

sizeInputs[0].oninput = function (e) {
  sizeInputs[1].value = e.target.value;
  updatePaintingGridSize(sizeInputs[0].value);
};

sizeInputs[1].oninput = function (e) {
  sizeInputs[0].value = e.target.value;
  updatePaintingGridSize(sizeInputs[0].value);
};

document.querySelector('.button-download').addEventListener('click', function () {
  downloadPainting();
}, false);
},{"./modules/rgb-slider":"modules/rgb-slider/index.js","./modules/painting-grid":"modules/painting-grid/index.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "46100" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/PixelEditorTask.e31bb0bc.js.map