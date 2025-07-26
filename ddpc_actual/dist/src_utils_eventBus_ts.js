"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkhost"] = self["webpackChunkhost"] || []).push([["src_utils_eventBus_ts"],{

/***/ "./src/utils/eventBus.ts":
/*!*******************************!*\
  !*** ./src/utils/eventBus.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   dispatchEvent: () => (/* binding */ dispatchEvent),\n/* harmony export */   listenForEvent: () => (/* binding */ listenForEvent)\n/* harmony export */ });\nvar dispatchEvent = function dispatchEvent(name, data) {\n  var event = new CustomEvent(name, {\n    detail: data\n  });\n  window.dispatchEvent(event);\n};\nvar listenForEvent = function listenForEvent(name, handler) {\n  window.addEventListener(name, handler);\n  return function () {\n    return window.removeEventListener(name, handler);\n  };\n};\n\n//# sourceURL=webpack://host/./src/utils/eventBus.ts?\n}");

/***/ })

}]);