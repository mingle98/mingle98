window.onload  = function (){
    // 定义公共方法类
    class Base {
        constructor () {};
        // 1.将ajax进行函数封装
	    ajax(options) {
            // 存储的是默认值
            var defaults = {
                type: "get",
                url: "",
                data: {},
                header: {
                    "Content-Type": "aplication/json",
                },
                success: function () {},
                error: function () {},
            };
            // 使用options对象中的属性覆盖defaults对象中的属性
            Object.assign(defaults, options);
            // 第一：创建ajax对象（使用js中XMLHttpRequest的构造函数）
            var xhr = new XMLHttpRequest();
            // 处理并且拼接请求参数
            var params = "";
            // 循环用户传入的对象类型格式的参数（for in）
            for (var attr in defaults.data) {
                // 将参数转换成字符串形式
                if (defaults.data.hasOwnProperty(attr)) {
                    params += attr + "=" + defaults.data[attr] + "&";
                };
            }
            // 将拼接好的参数是、中最后一个多余的&号截掉，结构从新赋值回去
            params = params.substr(0, params.length - 1);
            // 第二：配置ajax对象，告诉他要以什么方式向那个地址发生请求
            // 判断请求方式
            if (defaults.type == "get") {
                xhr.open(defaults.type, defaults.url + "?" + params);
            }else {
                xhr.open(defaults.type, defaults.url);
            };
            // 第三：发送请求（这里相当于请求报文）
            // 如果请求方式是post
            if (defaults.type == "post") {
                // 用户希望的向服务器端传递的请求参数的类型
                var contentType = defaults.header["Content-Type"];
                // 设置请求参数格式类型
                xhr.setRequestHeader("Content-Type", contentType);
                // 判断用户希望的请求参数的格式类型
                // 如果类型是json格式
                if (contentType == "aplication/json") {
                    xhr.send(JSON.stringify(defaults.data));
                }else {
                    // 向服务器端传递普通类型的请求参数
                    xhr.send(params);
                };
            }else {
                xhr.send();
            };
            // 第四：监听xgr下面的onload事件，当xhr对象接受完响应数据后触发（因为这里发出请求到接受完成数据是需要时间的所以是异步的）
            xhr.onload = function () {
                // 获取响应头中的数据
                var ContentType = xhr.getResponseHeader("Content-Type");
                // 服务器端响应回来的数据
                responseText = xhr.responseText;
                // 如果响应类型中包含aplication/json
                if (ContentType.includes("aplication/json")) {
                    // 将json字符串转化成json对象
                    responseText = JSON.parse(responseText);
                };
                // 当http状态码等于200时候
                if (xhr.status==200) {
                    // 请求成功 调用处理成功情况的函数
                    defaults.success(responseText,xhr);
                }else {
                    // 请求失败 调用处理失败情况的函数
                    defaults.error(responseText,xhr);
                };
            };
	    };
        // 2.将JSONP封装成函数
	    jsonp(options){
            // 创建script标签
            var script = document.createElement("script");
            // 拼接字符串的变量
            var params = "";
            for(var attr in options.data){
                params += "&" + attr + "=" + options.data[attr];
            }
            // 解决多次请求函数名重复导致的数据重叠问题(函数名myjsonp-123456格式)
            var fnName = "myjsonp" + Math.random().toString().replace(".", "")
            // 将定义的函数也封装进去了，但是它已经不是全局函数了（因此我们要想办法将他变成全局函数就要挂载到window对象下）
            window[fnName] = options.success;
            // 设置src属性
            script.src = options.url + "?callback=" + fnName + params;
            // 将script标签追加到页面中
            document.body.appendChild(script);
            // 为script标签添加onload事件
            script.onload=function(){
                // 将body中的script标签删除
                document.body.removeChild(script);
            };
	    };
        // 3.节流函数
        throttle(fn, delay = 500) {
            var firstFlag = true;
            var timer;
            return function () { 
                var self = this;
                var ags = arguments;
                if (firstFlag) {
                    fn.apply(self, ags);
                    firstFlag = false;
                };
                if (!timer) {
                    timer = setTimeout(function () { 
                        self.apply(fn, ags);
                        timer = null;
                    }, delay);
                };
            };
        };
        // 4.防抖函数
        debounce(fn, delay) {
            var timer;
            return function (params) { 
                var self  = this;
                if (timer) clearTimeout(timer);
                timer = setTimeout(function () { 
                    fn.apply(self, params);
                    timer = null;
                }, delay || 500);
            }
        };
        // 5.事件监听
        addEventHandler(elem, type, handler) {
            if (elem.addEventListener) {
                elem.addEventListener(type, handler, false);
            }
            else if (elem.attachEvent) {
                elem.attachEvent('on' + type, handler);
            }
            else {
                elem['on' + type] = handler;
            }
        };
        removeEventHandler(elem, type, handler) {
            if (elem.addEventListener) {
                elem.removeEventListener(type, handler, false);
            }
            else if (elem.detachEvent) {
                elem.detachEvent('on' + type, handler);
            }
            else {
                elem['on' + type] = null;
            }
        };
        // 6.创建script标签
        createScriptTag(srcElem, src, charset) {
            srcElem.setAttribute('type', 'text/javascript');
            charset && srcElem.setAttribute('charset', charset);
            srcElem.setAttribute('src', src);
            document.getElementsByTagName('head')[0].appendChild(srcElem);
        };
        removeScriptTag(srcElem) {
            // 删属性
            if (srcElem.clearAttributes) {
                srcElem.clearAttributes();
            }
            else {
                for (attr in srcElem) {
                    if (srcElem.hasOwnProperty(attr)) {
                        delete srcElem[attr];
                    };
                };
            };
            // 删节点
            if (srcElem && srcElem.parentNode) {
                srcElem.parentNode.removeChild(srcElem);
            };
            // 销毁
            srcElem = null;
        };
        // 7.处理节点的类
        // 判断是否有className
        hasClassName(ele, cName) {
            return !!ele.className.match(new RegExp('(\\s|^)' + cName + '(\\s|$)'));
        };
        addClass(ele, cName) {
            if (!this.hasClassName(ele, cName)) {
                // 获取class内容
                var classObj = ele.className;
                // 是否需要加空格 如果className是空就不需要
                var bank = (classObj === '') ? '' : ' ';
                ele.className = bank + cName;
            };
            return this;
        };
        removeClass(ele, cName) {
            var reg = new RegExp('(\\s|^)' + cName + '(\\s|$)');
            if (this.hasClassName(ele, cName)) {
                // 第一种情况 classname前后有空格
                if (ele.className.indexOf(' ' + cName + ' ') >= 0) {
                    ele.className.replace(reg, ' ');
                }
                else {
                    // 其他情况
                    ele.className.replace(reg, '');
                }
            };
            return this;
        };
        // 8.阻止默认事件（冒泡或则a标签等)
        stopPropagation(e) {
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            else {
                e.cancelBubble = true;
            }
        };
        preventDefault(e) {
            if (e.preventDefault) {
                e.preventDefault();
            }
            else {
                e.returnValue = false;
            }
        };
        // 9.给url上加query
        // 处理query
        buildQuery(query) {
            if (typeof query === 'string') {
                return query;
            };
            if (typeof query === 'object') {
                var builder = [];
                for(key in query) {
                    if(query.hasOwnProperty(key)) {
                        var value = query[key];
                        if (value) {
                           builder.length && builder.push('&');
                           var res = (typeof value === 'boolean') ? (value ? '1' : '0') : value.toString();
                           builder.push(key, '=', res);
                        }
                    }
                }
                return builder.join('');
            };
            return null;
        };
        appendQuery(url, query) {
            query = this.buildQuery(query);
            if (typeof (query) === 'string') {
                var hasQuery = (/\?/g).test(url);
                url += (hasQuery ? "&" : "?") + query;
            };
            return query;
        };
        // 10.通过id获取元素
        getEleById(id_tail) {
            if (!$id_prefix) return null;
            var allid = String($id_prefix) + String(id_tail);
            var targetDom = document.getElementById(allid);
            if (targetDom) {
                return targetDom;
            };
            return null;
        };
        // 11.获取ie浏览器版本
        IEVersion () {
            var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串  
            var isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1; //判断是否IE<11浏览器  
            var isEdge = userAgent.indexOf('Edge') > -1 && !isIE; //判断是否IE的Edge浏览器  
            var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1;
            if (isIE) {
                var reIE = new RegExp('MSIE (\\d+\\.\\d+);');
                reIE.test(userAgent);
                var fIEVersion = parseFloat(RegExp['$1']);
                if (fIEVersion == 7) {
                    return 7;
                } else if (fIEVersion == 8) {
                    return 8;
                } else if (fIEVersion == 9) {
                    return 9;
                } else if (fIEVersion == 10) {
                    return 10;
                } else {
                    return 6;//IE版本<=7
                }   
            } else if(isEdge) {
                return 'edge';//edge
            } else if(isIE11) {
                return 11; //IE11  
            } else {
                return -1;//不是ie浏览器
            }
        };
        // 12.
    };


    // 全局变量
    var $id_prefix = '$baidu_' + Math.floor(Math.random() * 1000000).toString().split(',');
    console.log('$id_prefix', $id_prefix);

    // 图片编辑器类
    class ImgEditor {
        constructor(options) {
            // 配置项
            this.options = {
                // 弹窗模式或则嵌入模式
                module: options.module || 'dialog',
            };
            // 基础工具
            this.base = new Base();
        };
        render() {

        };
        
    }
}