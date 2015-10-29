"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Request = (function () {
    function Request(baseUrl, method, params) {
        _classCallCheck(this, Request);

        this.xhr = new XMLHttpRequest();
        this.baseUrl = baseUrl;
        this.path = undefined;
        this.params = params;
        this.method = method;
    }

    _createClass(Request, [{
        key: "at",
        value: function at(path) {
            this.path = path;
            return this;
        }
    }, {
        key: "now",
        value: function now() {
            var _this = this;

            console.log("BASE: ", this.baseUrl);
            console.log("PATH: ", this.path);
            var paramString = "?";
            if (this.params != undefined) {
                if (typeof this.params == "object") {
                    for (var key in this.params) {
                        if (paramString != "?") {
                            paramString += "&";
                        }
                        paramString += key + "=" + encodeURIComponent(this.params[key]);
                    }
                } else {
                    paramString += this.params;
                }
            }
            var url = this.baseUrl + this.path + paramString;
            console.log(url);
            return new Promise(function (resolve, reject) {
                _this.xhr.open(_this.method.toUpperCase(), url);
                _this.xhr.onreadystatechange = function (event) {
                    if (event.target.readyState === 4) {
                        try {
                            var result = JSON.parse(event.target.responseText);
                        } catch (e) {
                            throw new Error("Unable to process response as JSON");
                        }
                        if (event.target.status === 200) {
                            resolve(result);
                        } else {
                            reject(result);
                        }
                    }
                };
                _this.xhr.send();
            });
        }
    }]);

    return Request;
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

        //static post(params) {
        //    return new Get(params);
        //}
        //static put(params) {
        //    return new Get(params);
        //}
        //static delete(params) {
        //    return new Get(params);
        //}
    }]);

    return GoAnd;
})();