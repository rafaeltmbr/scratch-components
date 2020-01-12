/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/components/conditional_loop/dev/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/components/conditional_loop/dev/index.js":
/*!******************************************************!*\
  !*** ./src/components/conditional_loop/dev/index.js ***!
  \******************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _util_ScratchSVGPath__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../util/ScratchSVGPath */ \"./src/util/ScratchSVGPath.js\");\n/* harmony import */ var _util_ManipulateDOM__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../util/ManipulateDOM */ \"./src/util/ManipulateDOM.js\");\n/* eslint-disable no-console */\n\n\nvar width = 350;\nvar strokeWidth = 2;\n\nvar _SctrachSVGPath$event = _util_ScratchSVGPath__WEBPACK_IMPORTED_MODULE_0__[\"default\"].event({\n  width: width,\n  strokeWidth: strokeWidth,\n  textFieldHeight: 30\n}),\n    eventPath = _SctrachSVGPath$event.path,\n    eventDimensions = _SctrachSVGPath$event.dimensions;\n\nvar eventTag = \"<svg class=\\\"event\\\" width=\\\"\".concat(eventDimensions.width, \"\\\" height=\\\"\").concat(eventDimensions.height, \"\\\"\") + \"stroke-width=\\\"\".concat(strokeWidth, \"\\\" style=\\\"width: \").concat(eventDimensions.width, \"px;\") + \"height: \".concat(eventDimensions.height, \"px\\\"><path d=\\\"\").concat(eventPath, \"\\\" /></svg>\");\nwindow.event = _util_ManipulateDOM__WEBPACK_IMPORTED_MODULE_1__[\"default\"].createNodeElement(eventTag);\ndocument.body.appendChild(window.event);\n\nvar _SctrachSVGPath$state = _util_ScratchSVGPath__WEBPACK_IMPORTED_MODULE_0__[\"default\"].statement({\n  width: width,\n  strokeWidth: strokeWidth,\n  textFieldHeight: 30\n}),\n    statementPath = _SctrachSVGPath$state.path,\n    statementDimensions = _SctrachSVGPath$state.dimensions;\n\nvar statementTag = \"<svg class=\\\"statement-block\\\" width=\\\"\".concat(statementDimensions.width, \"\\\" height=\\\"\").concat(statementDimensions.height, \"\\\"\") + \"stroke-width=\\\"\".concat(strokeWidth, \"\\\" style=\\\"width: \").concat(statementDimensions.width, \"px;\") + \"height: \".concat(statementDimensions.height, \"px\\\"><path d=\\\"\").concat(statementPath, \"\\\" /></svg>\");\nwindow.statement = _util_ManipulateDOM__WEBPACK_IMPORTED_MODULE_1__[\"default\"].createNodeElement(statementTag);\ndocument.body.appendChild(window.statement);\n\nvar _SctrachSVGPath$state2 = _util_ScratchSVGPath__WEBPACK_IMPORTED_MODULE_0__[\"default\"].statement({\n  width: width,\n  strokeWidth: strokeWidth,\n  textFieldHeight: 30,\n  maleFitting: false\n}),\n    statementPath2 = _SctrachSVGPath$state2.path,\n    statementDimensions2 = _SctrachSVGPath$state2.dimensions;\n\nvar statementTag2 = \"<svg class=\\\"statement-block\\\" width=\\\"\".concat(statementDimensions2.width, \"\\\" height=\\\"\").concat(statementDimensions2.height, \"\\\"\") + \"stroke-width=\\\"\".concat(strokeWidth, \"\\\" style=\\\"width: \").concat(statementDimensions2.width, \"px;\") + \"height: \".concat(statementDimensions2.height, \"px\\\"><path d=\\\"\").concat(statementPath2, \"\\\" /></svg>\");\nwindow.statement2 = _util_ManipulateDOM__WEBPACK_IMPORTED_MODULE_1__[\"default\"].createNodeElement(statementTag2);\ndocument.body.appendChild(window.statement2);\n\nvar _SctrachSVGPath$condi = _util_ScratchSVGPath__WEBPACK_IMPORTED_MODULE_0__[\"default\"].conditionalLoop({\n  width: width,\n  strokeWidth: strokeWidth,\n  innerHeight: statementDimensions.fittingHeight,\n  textFieldHeight: 30,\n  femaleFitting: false,\n  maleFitting: false\n}),\n    conditionalLoopPath = _SctrachSVGPath$condi.path,\n    conditionalLoopDimensions = _SctrachSVGPath$condi.dimensions;\n\nvar conditionalLoopTag = \"<svg class=\\\"conditional-loop\\\" width=\\\"\".concat(conditionalLoopDimensions.width, \"\\\" height=\\\"\").concat(conditionalLoopDimensions.height, \"\\\"\") + \"stroke-width=\\\"\".concat(strokeWidth, \"\\\" style=\\\"width: \").concat(conditionalLoopDimensions.width, \"px;\") + \"height: \".concat(conditionalLoopDimensions.height, \"px\\\"><path d=\\\"\").concat(conditionalLoopPath, \"\\\" /></svg>\");\nwindow.conditionalLoop = _util_ManipulateDOM__WEBPACK_IMPORTED_MODULE_1__[\"default\"].createNodeElement(conditionalLoopTag);\ndocument.body.appendChild(window.conditionalLoop);\n\nvar _SctrachSVGPath$condi2 = _util_ScratchSVGPath__WEBPACK_IMPORTED_MODULE_0__[\"default\"].conditionalBlock({\n  width: width,\n  strokeWidth: strokeWidth,\n  innerHeightTrue: statementDimensions.fittingHeight,\n  innerHeightFalse: conditionalLoopDimensions.fittingHeight,\n  textFieldHeight: 30,\n  falsyFemaleFitting: false\n}),\n    conditionalBlockPath = _SctrachSVGPath$condi2.path,\n    conditionalBlockDimensions = _SctrachSVGPath$condi2.dimensions;\n\nvar conditionalBlockTag = \"<svg class=\\\"conditional-block\\\" width=\\\"\".concat(conditionalBlockDimensions.width, \"\\\" height=\\\"\").concat(conditionalBlockDimensions.height, \"\\\"\") + \"stroke-width=\\\"\".concat(strokeWidth, \"\\\" style=\\\"width: \").concat(conditionalBlockDimensions.width, \"px;\") + \"height: \".concat(conditionalBlockDimensions.height, \"px\\\"><path d=\\\"\").concat(conditionalBlockPath, \"\\\" /></svg>\");\nwindow.conditionalBlock = _util_ManipulateDOM__WEBPACK_IMPORTED_MODULE_1__[\"default\"].createNodeElement(conditionalBlockTag);\ndocument.body.appendChild(window.conditionalBlock);\nvar svgList = document.querySelectorAll('svg');\nvar svgs = Object.keys(svgList).map(function (k) {\n  return svgList[k];\n});\nsvgs.forEach(function (svg) {\n  svg.children[0].addEventListener('mousedown', function (_ref) {\n    var startX = _ref.clientX,\n        startY = _ref.clientY;\n    var initialStyle = window.getComputedStyle(svg);\n    var initialX = parseInt(initialStyle.left, 10);\n    var initialY = parseInt(initialStyle.top, 10);\n    svg.setAttribute('data-grabbing', true);\n\n    function handleMovement(_ref2) {\n      var clientX = _ref2.clientX,\n          clientY = _ref2.clientY;\n      var offsetX = clientX - startX;\n      var offsetY = clientY - startY;\n      svg.style.setProperty('left', \"\".concat(offsetX + initialX, \"px\"));\n      svg.style.setProperty('top', \"\".concat(offsetY + initialY, \"px\"));\n    }\n\n    window.addEventListener('mousemove', handleMovement);\n    window.addEventListener('mouseup', function removeEventHandlers() {\n      window.removeEventListener('mousemove', handleMovement);\n      window.removeEventListener('mouseup', removeEventHandlers);\n      svg.setAttribute('data-grabbing', false);\n    });\n  });\n});\n\n//# sourceURL=webpack:///./src/components/conditional_loop/dev/index.js?");

/***/ }),

/***/ "./src/util/ManipulateDOM.js":
/*!***********************************!*\
  !*** ./src/util/ManipulateDOM.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nvar ManipulateDOM =\n/*#__PURE__*/\nfunction () {\n  function ManipulateDOM() {\n    _classCallCheck(this, ManipulateDOM);\n  }\n\n  _createClass(ManipulateDOM, null, [{\n    key: \"createNodeElement\",\n    value: function createNodeElement(html) {\n      var node = document.createElement('div');\n      node.innerHTML = html;\n      return node.children.length === 1 ? node.children[0] : node.children;\n    }\n  }]);\n\n  return ManipulateDOM;\n}();\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (ManipulateDOM);\n\n//# sourceURL=webpack:///./src/util/ManipulateDOM.js?");

/***/ }),

/***/ "./src/util/ScratchSVGPath.js":
/*!************************************!*\
  !*** ./src/util/ScratchSVGPath.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nvar ScratchSVGPath =\n/*#__PURE__*/\nfunction () {\n  function ScratchSVGPath() {\n    _classCallCheck(this, ScratchSVGPath);\n  }\n\n  _createClass(ScratchSVGPath, null, [{\n    key: \"conditionalLoop\",\n    value: function conditionalLoop() {\n      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};\n      var componentWidth = options.width || 200;\n      var componentInnerHeight = options.innerHeight || 28;\n      var componentTextFieldHeight = options.textFieldHeight || 36;\n      var componentStrokeWidth = options.strokeWidth || 1;\n      var componentMaleFitting = typeof options.maleFitting === 'undefined' ? true : options.maleFitting;\n      var componentFemaleFitting = typeof options.femaleFitting === 'undefined' ? true : options.femaleFitting;\n      var startPoint = \"M \".concat(componentStrokeWidth / 2, \",\").concat(4 + componentStrokeWidth / 2);\n      var topLeftCorner = 'a 4 4 0 0 1 4,-4';\n      var innerTopLeftCorner = 'a 4 4 0 0 0 -4,4';\n      var innerBottomLeftCorner = 'a 4 4 0 0 0 4,4';\n      var topRightCorner = 'a 4 4 0 0 1 4,4';\n      var bottomRightCorner = 'a 4 4 0 0 1 -4,4';\n      var bottomLeftCorner = 'a 4 4 0 0 1 -4,-4';\n      var innerShortLineToBottom = \"v\".concat(componentInnerHeight - 8);\n      var shortLineToRight = 'h 8';\n      var shortLineToLeft = 'h -8';\n      var shortLineToBottom = 'v 24';\n      var midLineToBottom = \"v\".concat(componentTextFieldHeight);\n      var midLineToLeft = \"h\".concat(64 - componentWidth);\n      var midLineToRight = \"h\".concat(componentWidth - 64);\n      var longLineToRight = \"h\".concat(componentWidth - 52);\n      var longLineToLeft = \"h\".concat(52 - componentWidth);\n      var femaleFitting = 'c 2,0 3,1 4,2 l 4,4 c 1,1 2,2 4,2 h12 c 2,0 3,-1 4,-2 l 4,-4 c 1,-1 2,-2 4,-2';\n      var femaleFittingBypass = 'h 36';\n      var maleFitting = 'c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h-12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2';\n      var maleFittingBypass = 'h -36';\n      var closePath = 'z';\n      var path = startPoint + topLeftCorner + shortLineToRight + femaleFitting + longLineToRight + topRightCorner + midLineToBottom + bottomRightCorner + midLineToLeft + maleFitting + shortLineToLeft + innerTopLeftCorner + innerShortLineToBottom + innerBottomLeftCorner + shortLineToRight + (componentFemaleFitting ? femaleFitting : femaleFittingBypass) + midLineToRight + topRightCorner + shortLineToBottom + bottomRightCorner + longLineToLeft + (componentMaleFitting ? maleFitting : maleFittingBypass) + shortLineToLeft + bottomLeftCorner + closePath;\n      var width = componentWidth + componentStrokeWidth;\n      var height = componentInnerHeight + componentTextFieldHeight + 48 + componentStrokeWidth;\n      return {\n        path: path,\n        dimensions: {\n          width: width,\n          height: height,\n          fittingHeight: height - 8 - componentStrokeWidth,\n          strokeWidth: componentStrokeWidth\n        }\n      };\n    }\n  }, {\n    key: \"conditionalBlock\",\n    value: function conditionalBlock() {\n      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};\n      var componentWidth = options.width || 200;\n      var componentInnerHeightTrue = options.innerHeightTrue || 28;\n      var componentInnerHeightFalse = options.innerHeightFalse || 28;\n      var componentTextFieldHeight = options.textFieldHeight || 36;\n      var componentStrokeWidth = options.strokeWidth || 1;\n      var componentMaleFitting = typeof options.maleFitting === 'undefined' ? true : options.maleFitting;\n      var componentTruthyFemaleFitting = typeof options.truthyFemaleFitting === 'undefined' ? true : options.truthyFemaleFitting;\n      var componentFalsyFemaleFitting = typeof options.falsyFemaleFitting === 'undefined' ? true : options.falsyFemaleFitting;\n      var startPoint = \"M \".concat(componentStrokeWidth / 2, \",\").concat(4 + componentStrokeWidth / 2);\n      var topLeftCorner = 'a 4 4 0 0 1 4,-4';\n      var innerTopLeftCorner = 'a 4 4 0 0 0 -4,4';\n      var innerBottomLeftCorner = 'a 4 4 0 0 0 4,4';\n      var topRightCorner = 'a 4 4 0 0 1 4,4';\n      var bottomRightCorner = 'a 4 4 0 0 1 -4,4';\n      var bottomLeftCorner = 'a 4 4 0 0 1 -4,-4';\n      var innerShortLineToBottomTrue = \"v\".concat(componentInnerHeightTrue - 8);\n      var innerShortLineToBottomFalse = \"v\".concat(componentInnerHeightFalse - 8);\n      var shortLineToRight = 'h 8';\n      var shortLineToLeft = 'h -8';\n      var shortLineToBottom = 'v 24';\n      var midLineToBottom = \"v\".concat(componentTextFieldHeight);\n      var midLineToLeft = \"h\".concat(64 - componentWidth);\n      var midLineToRight = \"h\".concat(componentWidth - 64);\n      var longLineToRight = \"h\".concat(componentWidth - 52);\n      var longLineToLeft = \"h\".concat(52 - componentWidth);\n      var femaleFitting = 'c 2,0 3,1 4,2 l 4,4 c 1,1 2,2 4,2 h12 c 2,0 3,-1 4,-2 l 4,-4 c 1,-1 2,-2 4,-2';\n      var femaleFittingBypass = 'h 36';\n      var maleFitting = 'c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h-12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2';\n      var maleFittingBypass = 'h -36';\n      var closePath = 'z';\n      var path = startPoint + topLeftCorner + shortLineToRight + femaleFitting + longLineToRight + topRightCorner + midLineToBottom + bottomRightCorner + midLineToLeft + maleFitting + shortLineToLeft + innerTopLeftCorner + innerShortLineToBottomTrue + innerBottomLeftCorner + shortLineToRight + (componentTruthyFemaleFitting ? femaleFitting : femaleFittingBypass) + midLineToRight + topRightCorner + shortLineToBottom + bottomRightCorner + midLineToLeft + maleFitting + shortLineToLeft + innerTopLeftCorner + innerShortLineToBottomFalse + innerBottomLeftCorner + shortLineToRight + (componentFalsyFemaleFitting ? femaleFitting : femaleFittingBypass) + midLineToRight + topRightCorner + shortLineToBottom + bottomRightCorner + longLineToLeft + (componentMaleFitting ? maleFitting : maleFittingBypass) + shortLineToLeft + bottomLeftCorner + closePath;\n      var width = componentWidth + componentStrokeWidth;\n      var height = componentInnerHeightTrue + componentInnerHeightFalse + componentTextFieldHeight + 80 + componentStrokeWidth;\n      return {\n        path: path,\n        dimensions: {\n          width: width,\n          height: height,\n          fittingHeight: height - 8 - componentStrokeWidth,\n          strokeWidth: componentStrokeWidth\n        }\n      };\n    }\n  }, {\n    key: \"statement\",\n    value: function statement() {\n      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};\n      var componentWidth = options.width || 200;\n      var componentTextFieldHeight = options.textFieldHeight || 36;\n      var componentStrokeWidth = options.strokeWidth || 1;\n      var componentMaleFitting = typeof options.maleFitting === 'undefined' ? true : options.maleFitting;\n      var startPoint = \"M \".concat(componentStrokeWidth / 2, \",\").concat(4 + componentStrokeWidth / 2);\n      var topLeftCorner = 'a 4 4 0 0 1 4,-4';\n      var topRightCorner = 'a 4 4 0 0 1 4,4';\n      var bottomRightCorner = 'a 4 4 0 0 1 -4,4';\n      var bottomLeftCorner = 'a 4 4 0 0 1 -4,-4';\n      var shortLineToRight = 'h 8';\n      var shortLineToLeft = 'h -8';\n      var midLineToBottom = \"v\".concat(componentTextFieldHeight);\n      var longLineToRight = \"h\".concat(componentWidth - 52);\n      var longLineToLeft = \"h\".concat(52 - componentWidth);\n      var femaleFitting = 'c 2,0 3,1 4,2 l 4,4 c 1,1 2,2 4,2 h12 c 2,0 3,-1 4,-2 l 4,-4 c 1,-1 2,-2 4,-2';\n      var maleFitting = 'c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h-12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2';\n      var maleFittingBypass = 'h -36';\n      var closePath = 'z';\n      var path = startPoint + topLeftCorner + shortLineToRight + femaleFitting + longLineToRight + topRightCorner + midLineToBottom + bottomRightCorner + longLineToLeft + (componentMaleFitting ? maleFitting : maleFittingBypass) + shortLineToLeft + bottomLeftCorner + closePath;\n      var width = componentWidth + componentStrokeWidth;\n      var height = componentTextFieldHeight + 16 + componentStrokeWidth;\n      return {\n        path: path,\n        dimensions: {\n          width: width,\n          height: height,\n          fittingHeight: height - 8 - componentStrokeWidth,\n          strokeWidth: componentStrokeWidth\n        }\n      };\n    }\n  }, {\n    key: \"event\",\n    value: function event() {\n      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};\n      var componentWidth = options.width || 200;\n      var componentTextFieldHeight = options.textFieldHeight || 36;\n      var componentStrokeWidth = options.strokeWidth || 1;\n      var componentMaleFitting = typeof options.maleFitting === 'undefined' ? true : options.maleFitting;\n      var startPoint = \"M \".concat(componentStrokeWidth / 2, \",\").concat(17 + componentStrokeWidth / 2);\n      var bigArc = 'c 25,-22 71,-22 96,0';\n      var topRightCorner = 'a 4 4 0 0 1 4,4';\n      var bottomRightCorner = 'a 4 4 0 0 1 -4,4';\n      var bottomLeftCorner = 'a 4 4 0 0 1 -4,-4';\n      var shortLineToLeft = 'h -8';\n      var midLineToBottom = \"v\".concat(componentTextFieldHeight);\n      var longLineToRight = \"h\".concat(componentWidth - 100);\n      var longLineToLeft = \"h\".concat(52 - componentWidth);\n      var maleFitting = 'c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h-12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2';\n      var maleFittingBypass = 'h -36';\n      var closePath = 'z';\n      var path = startPoint + bigArc + longLineToRight + topRightCorner + midLineToBottom + bottomRightCorner + longLineToLeft + (componentMaleFitting ? maleFitting : maleFittingBypass) + shortLineToLeft + bottomLeftCorner + closePath;\n      var width = componentWidth + componentStrokeWidth;\n      var height = componentTextFieldHeight + 33 + componentStrokeWidth;\n      return {\n        path: path,\n        dimensions: {\n          width: width,\n          height: height,\n          fittingHeight: height - 8 - componentStrokeWidth,\n          strokeWidth: componentStrokeWidth\n        }\n      };\n    }\n  }]);\n\n  return ScratchSVGPath;\n}();\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (ScratchSVGPath);\n\n//# sourceURL=webpack:///./src/util/ScratchSVGPath.js?");

/***/ })

/******/ });