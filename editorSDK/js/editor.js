window.onload = function (){
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
        hasClassName(ele, cName) {console
            return !!ele.className.match(new RegExp('(\\s|^)' + cName + '(\\s|$)'));
        };
        addClass(ele, cName) {
            if (!this.hasClassName(ele, cName)) {
                // 获取class内容
                var classObj = ele.className;
                // 是否需要加空格 如果className是空就不需要
                var bank = (classObj === '') ? '' : ' ';
                ele.className += bank + cName;
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
        // 12.获取cookie
        getRaw(key) {
            var reg = new RegExp('(^| )' + key + '=([^;]*)(;|\x24)');
            var result = reg.exec(document.cookie);
            if (result) {
                return result[2] || null;
            }

            return null;
        };
        getCookie(key) {
            var value = getRaw(key);
            if (typeof value === 'string') {
                value = decodeURIComponent(value);
                return value;
            }
            return null;
        };
        // 13.获取安卓版本号
        get_android_version() {
            var ua = navigator.userAgent.toLowerCase();
            var version = null;
            if (ua.indexOf('android') > 0) {
                var reg = /android [\d._]+/gi;
                var vInfo = ua.match(reg);
                version = (vInfo + '').replace(/[^0-9|_.]/ig, '').replace(/_/ig, '.'); // 得到版本号4.2.2
                version = parseInt(version.split('.')[0], 10);// 得到版本号第一位
            };
            return version;
        };
        // 14.插入模板字符串的方法
        insertHTML(position, tempStr, parentEle) {
            // beforeBegin: 插入到标签开始前
            // afterBegin:插入到标签开始标记之后
            // beforeEnd:插入到标签结束标记前
            // afterEnd:插入到标签结束标记后
            // console.log('insertHTML:', position, tempStr, parentEle);
            if (parentEle) {
                parentEle.insertAdjacentHTML(position, tempStr);
            }
            else {
                var box = document.createElement('div');
                this.insertHTML('afterBegin', tempStr, box);
                document.body.appendChild(box);
            };
        };
        // 15.隐藏或者显示元素
        toggleShow(elem) {
            if (!elem) return;
            if (elem.style.display === 'none') {
                elem.style.display = 'block';
            }
            else {
                elem.style.display = 'none';
            }
        };
        // 16.获取设备视口宽高
        getSViewportOffset() {
            const obj = {
                w: null,
                n: null
            }
            if (window.innerWidth) {
                return {
                    w: window.innerWidth,
                    h: window.innerHeight
                }
            } else {
                if (document.compatMode === "BackCompat") {
                    return {
                        w: document.body.clientWidth,
                        h: document.body.clientHeight
                    }
                } else {
                    return {
                        w: document.documentElement.clientWidth,
                        h: document.documentElement.clientHeight
                    }
                }
            }
        }
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
                // 主体编辑器容器id
                containerId: options.id,
                // 主体编辑器的宽高
                editorW: options.editorW || 400,
                editorH: options.editorH || 600,
                // 编辑器工具容器id
                toolContainerId: options.toolid,
                onRender: options.onRender || function () {  },
                onInit: options.onInit || function () {  },
            };
            // 内部数据
            this.store = {
                // 编辑框尺寸--高=宽
                width:0,
                minwidth: 100,
                maxwidth: 100,
                defaultWidth: 200

            };
            console.log('options:', this.options);
            // 基础工具
            this.base = new Base();
            // 渲染页面
            this.render();
        };
        render() {
            // 触发hook
            this.options.onRender();
            this.renderTpl();
        };
        // 存模版的方法
        get_tpl(file) {
            var editorBodyTpl = '<div class="editor-body" id="' + $id_prefix+ '_editor-body">' +
                                    '<img class="editor-img" src="./img/u=1960663123,2805398451&fm=26&fmt=auto&gp=0.webp" alt="">' +
                                    '<div class="editor-content">' +
                                        '<div class="editor-top" id="' + $id_prefix+ '_editor-top"></div>' +
                                        '<div class="editor-middle-box" id="' + $id_prefix+ '_editor-middle-box">' +
                                            '<div class="editor-right" id="' + $id_prefix+ '_editor-right"></div>' +
                                            '<div class="editor-box" id="editor-box"></div>' +
                                            '<div class="editor-left" id="' + $id_prefix+ '_editor-left"></div>' +
                                        '</div>' +
                                        '<div class="editor-bottom" id="' + $id_prefix+ '_editor-bottom"></div>' +
                                    '</div>' +
                                    '<canvas class="canvas"></canvas>' +
                                '</div>';

            var editorToolTpl = '<div class="editor-toolBar" id="' + $id_prefix+ '_editor-toolBar">' +
                                    '<div class="toolbar-item toolbar-item-before" id="' + $id_prefix+ '_toolbar-item-before">工具' +
                                    '</div>' +
                                    '<div class="toolbar-item">' +
                                        '<p class="toolBar-item-icon-box">' +
                                            '<span class="toolBar-item-icon"></span>' +
                                        '</p>' +
                                        '<span class="toolBar-item-text">重选</span>' +
                                    '</div>' +
                                    '<div class="toolbar-item">' +
                                        '<p class="toolBar-item-icon-box">' +
                                            '<span class="toolBar-item-icon"></span>'+
                                        '</p>' +
                                        '<span class="toolBar-item-text">撤销</span>' +
                                    '</div>' +
                                    '<div class="toolbar-item">' +
                                        '<p class="toolBar-item-icon-box">' +
                                            '<span class="toolBar-item-icon"></span>' +
                                        '</p>' +
                                        '<span class="toolBar-item-text">旋转</span>' +
                                    '</div>' +
                                    '<div class="toolbar-item">' +
                                        '<p class="toolBar-item-icon-box">' +
                                            '<span class="toolBar-item-icon"></span>' +
                                        '</p>' +
                                        '<span class="toolBar-item-text">选好了</span>' +
                                    '</div>' +
                                '</div>';
            var tempObj = {
                editor: editorBodyTpl,
                editorTool: editorToolTpl
            };
            return tempObj[file];
        }
        // 渲染模版
        renderTpl() {
            var tempEditorTpl = this.get_tpl('editor');
            var tempEditorToolTpl = this.get_tpl('editorTool');
            //  弹窗
            var maskDiv = document.createElement('div');
            maskDiv.id = $id_prefix + "_editor-dialog-mask";
            maskDiv.className = "editor-dialog-mask";

            if (this.options.module === 'dialog') {
                console.log('dialog');
                // 渲染编辑器主体到页面
                document.body.appendChild(maskDiv);
                this.base.insertHTML('afterBegin', tempEditorTpl, this.base.getEleById('_editor-dialog-mask'));
                this.base.addClass(this.base.getEleById('_editor-body'), 'dialog-body');
                // 渲染编辑器工具bar主体到页面
                this.base.insertHTML('afterBegin', tempEditorToolTpl, this.base.getEleById('_editor-body'));
                this.base.addClass(this.base.getEleById('_editor-toolBar'), 'editor-toolBar-fold');
            }
            else {
                console.log('Embedding');
                // 渲染编辑器主体到页面
                if (this.options.containerId) {
                    var containerEle = document.getElementById(this.options.containerId);
                    this.base.insertHTML('afterBegin', tempEditorTpl, containerEle);
                }
                else {
                    this.base.insertHTML('afterBegin', tempTpl, '');
                };
                // 渲染编辑器工具bar主体到页面
                if (this.options.toolContainerId) {
                    var containerToolEle = document.getElementById(this.options.toolContainerId);
                    this.base.insertHTML('afterBegin', tempEditorToolTpl, containerToolEle);
                }
                else {
                    this.base.insertHTML('afterBegin', tempEditorToolTpl, '');
                };
                this.base.toggleShow(this.base.getEleById('_toolbar-item-before'));
            };
            this.setEvent();
            // 初始化
            this.init();
        };
        // 设置事件
        setEvent() {
            var toolbar = this.base.getEleById('_editor-toolBar');
            var beforeItem = this.base.getEleById('_toolbar-item-before');
            var me = this;
            if (this.options.module === 'dialog') {
                var toolStatus = false;
                // 展开折叠工具bar
                var visibleTollBar = function () { 
                    if (!toolStatus) {
                        if (me.options.module === 'dialog' && +me.store.equipmentW <= 460) {
                            toolbar.style.width = '70vw'
                        }
                        else {
                            toolbar.style.width = '338px'
                        };
                        toolStatus = true;
                    }
                    else {
                        toolbar.style.width = '0px';
                        toolStatus = false;
                    };
                 }
                this.base.addEventHandler(beforeItem, 'mouseover', visibleTollBar);
                this.base.addEventHandler(toolbar, 'mouseleave', visibleTollBar);
            };
        };
        // 初始化
        init() {
            // 触发hook
            this.options.onInit();
            // 初始化数据
            this.initData();
            // 初始化尺寸
            this.initSize();
        };
        initData() {
            // 获取设备宽高
            var {w, h} = this.base.getSViewportOffset();
            this.store.equipmentW = w;
            this.store.equipmentH = h;
            // 剪裁框的尺寸
            this.store.width = this.store.equipmentW * 0.7 || this.store.defaultWidth;
            this.store.minwidth = this.store.equipmentW * 0.4 || this.store.defaultWidth * 0.9;
            this.store.maxwidth = this.store.equipmentW * 0.9 || this.store.defaultWidth * 1.1;

            console.log('initData:', this.store);
            this.initSize();
        };
        // 初始化尺寸
        initSize() {
            // 设置编辑器尺寸
            if (this.options.module === 'dialog') {
                if (+this.store.equipmentW <= 460) {
                    this.base.getEleById('_editor-body').style = 'width: 90vw;height:135vw';
                    this.base.getEleById('_editor-toolBar').style = 'width: 70vw;';
                }
                else {
                    this.base.getEleById('_editor-body').style = `width:${this.options.editorW}px;height:${this.options.editorH}px;`;
                };
            }
            else {
                if (+this.store.equipmentW <= 460) {
                    this.base.getEleById('_editor-body').style = 'width: 90vw;height:135vw';
                    this.base.getEleById('_editor-toolBar').style = 'width: 90vw;';
                }
                else {
                    this.base.getEleById('_editor-body').style = `width:${this.options.editorW}px;height:${this.options.editorH}px;`;
                    this.base.getEleById('_editor-toolBar').style = `width:${this.options.editorW}px;`;
                };
            };
            // 设置裁剪框的宽高
            document.getElementById('editor-box').style= `width:${this.store.width}px;height:${this.store.width}px;`;
            this.base.getEleById('_editor-middle-box').style = `width:${this.options.editorW}px;height:${this.store.width + 4}px`;
            this.base.getEleById('_editor-right').style = `width:${(this.options.editorW - this.store.width) / 2}px;`;
            this.base.getEleById('_editor-left').style = `width:${(this.options.editorW - this.store.width) / 2}px;`;
            this.base.getEleById('_editor-bottom').style = `width:${this.options.editorW}px;height:${(this.options.editorH - this.store.width) / 2}px;`;
            this.base.getEleById('_editor-top').style = `width:${this.options.editorW}px;height:${(this.options.editorH - this.store.width) / 2}px;`;
        };
        
    };






    let options = {
        // 弹窗模式或则嵌入模式
        module: 'dialog1',
        // 主体编辑器容器id
        id: 'editorBox',
        // 编辑器工具容器id
        toolid: 'toolBox',
        editorW: 400,
        editorH: 600,
        // 渲染页面时触发hook
        onRender: function () { 
            console.log('render....');
        },
        onInit: function () { 
            console.log('init...')
         }
    };
    let editorInstance = new ImgEditor(options);
};