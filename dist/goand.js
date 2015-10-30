"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Request = (function () {
    function Request(baseUrl, method, params, payload) {
        _classCallCheck(this, Request);

        this.xhr = new XMLHttpRequest();
        this.baseUrl = baseUrl;
        this.path = undefined;
        this.params = params;
        this.payload = payload;
        this.method = method;
    }

    _createClass(Request, [{
        key: "at",
        value: function at(path) {
            this.path = path || "";
            return this.execute();
        }
    }, {
        key: "execute",
        value: function execute() {
            var _this = this;

            var url = Request.interpolate(this.baseUrl + this.path, this.params) + Request.buildParamString(this.params);
            return new Promise(function (resolve, reject) {
                _this.xhr.open(_this.method.toUpperCase(), url);
                _this.xhr.onreadystatechange = function (event) {
                    if (event.target.readyState === 4) {
                        var result = Request.fromJson(event.target.responseText);
                        if (event.target.status === 200) {
                            resolve(result);
                        } else {
                            reject(result);
                        }
                    }
                };
                if (["post", "put"].indexOf(_this.method) > -1) {
                    _this.xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
                }
                var data = _this.payload !== undefined ? Request.toJson(_this.payload) : "";
                _this.xhr.send(data);
            });
        }
    }], [{
        key: "buildParamString",
        value: function buildParamString(params) {
            var paramString = "";
            if (params != undefined && Object.keys(params).length > 0) {
                paramString = "?";
                if (typeof params == "object") {
                    for (var key in params) {
                        if (paramString != "?") {
                            paramString += "&";
                        }
                        paramString += key + "=" + encodeURIComponent(params[key]);
                    }
                } else {
                    paramString += params;
                }
            }
            return paramString;
        }
    }, {
        key: "interpolate",
        value: function interpolate(url, params) {
            if (typeof params == "object") {
                for (var key in params) {
                    var _find = "{" + key + "}";
                    if (url.indexOf(_find) > -1) {
                        url = url.replace(_find, params[key]);
                    }
                    delete params[key];
                }
            }
            return url;
        }
    }, {
        key: "toJson",
        value: function toJson(obj) {
            var str = "";
            if (typeof obj == "object") {
                try {
                    str = JSON.stringify(obj);
                } catch (e) {
                    console.error("Invalid JSON object provided. ");
                }
            }
            return str;
        }
    }, {
        key: "fromJson",
        value: function fromJson(str) {
            var obj = null;
            if (typeof str == "string") {
                try {
                    obj = JSON.parse(str);
                } catch (e) {
                    console.error("Invalid JSON string provided. ");
                }
            }
            return obj;
        }
    }]);

    return Request;
})();

var JpRequest = (function () {
    function JpRequest(baseUrl, params) {
        _classCallCheck(this, JpRequest);

        if (isNaN(JpRequest.count++)) {
            JpRequest.count = 0;
        }
        this.baseUrl = baseUrl;
        this.path = undefined;
        this.params = params;
    }

    _createClass(JpRequest, [{
        key: "at",
        value: function at(path) {
            this.path = path;
            return this.execute();
        }
    }, {
        key: "execute",
        value: function execute() {
            var timeout = 5000;
            var url = this.baseUrl + this.path + Request.buildParamString(this.params);
            return new Promise(function (resolve, reject) {
                var callback = '__callback' + JpRequest.count++;
                var timeoutId = window.setTimeout(function () {
                    reject(new Error('Request timeout.'));
                }, timeout);
                window[callback] = function (response) {
                    window.clearTimeout(timeoutId);
                    resolve(Request.fromJson(response));
                };
                var script = document.createElement('script');
                script.src = url + (url.indexOf('?') === -1 ? '?' : '&') + 'callback=' + callback;
                script.onload = function () {
                    script.remove();
                };
                document.getElementsByTagName('head')[0].appendChild(script);
            });
        }
    }]);

    return JpRequest;
})();

var GoAnd = (function () {
    function GoAnd(baseUrl, config) {
        _classCallCheck(this, GoAnd);

        this.baseUrl = baseUrl || "";
        this.format = "";
        if (config != undefined) {
            this.format = config.format || "";
        }
        return this;
    }

    _createClass(GoAnd, [{
        key: "get",
        value: function get(params) {
            return new Request(this.baseUrl, "get", params);
        }
    }, {
        key: "getJson",
        value: function getJson(params) {
            return new JpRequest(this.baseUrl, params);
        }
    }, {
        key: "post",
        value: function post(payload, params) {
            return new Request(this.baseUrl, "post", params, payload);
        }
    }, {
        key: "put",
        value: function put(payload, params) {
            return new Request(this.baseUrl, "put", params, payload);
        }
    }, {
        key: "delete",
        value: function _delete(params) {
            return new Request(this.baseUrl, "delete", params);
        }
    }]);

    return GoAnd;
})();

exports.GoAnd = GoAnd;