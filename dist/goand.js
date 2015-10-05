"use strict";

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Request = (function () {
    function Request(method, params) {
        _classCallCheck(this, Request);

        this.xhr = new XMLHttpRequest();
        this.url = undefined;
        this.params = params;
        this.method = method;
    }

    _createClass(Request, [{
        key: "setUrl",
        value: function setUrl(url) {
            "use strict";
            this.url = url;
        }
    }, {
        key: "now",
        value: function now() {
            "use strict";

            var _this = this;

            console.log(Request.config);
            var url = this.url;
            if (this.params != undefined) {
                if (typeof this.params == "object") {
                    for (var key in this.params) {
                        if (url != "") {
                            url += "&";
                        }
                        url += key + "=" + encodeURIComponent(this.params[key]);
                    }
                } else {
                    url += this.params;
                }
            }
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

var Get = (function (_Request) {
    _inherits(Get, _Request);

    function Get(params) {
        _classCallCheck(this, Get);

        _get(Object.getPrototypeOf(Get.prototype), "constructor", this).call(this, "get", params);
        return this;
    }

    //class Post extends Request {
    //    constructor(data) {
    //        super("post");
    //        return this;
    //    }
    //    at(url) {
    //        "use strict";
    //        super.url = url;
    //        return this;
    //    }
    //}

    _createClass(Get, [{
        key: "at",
        value: function at(url) {
            "use strict";
            console.log(url);
            _get(Object.getPrototypeOf(Get.prototype), "setUrl", this).call(this, url);
            return this;
        }
    }]);

    return Get;
})(Request);

var GoAnd = function GoAnd(config) {
    Request.config = config;
    return {
        'get': function get(params) {
            "use strict";
            return new Get(params);
        }
    };
};