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
                        fn.apply(self, ags);
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
                // 传入的图片
                uploadImg:  options.uploadImg || '',
                onRender: options.onRender || function () {  },
                onInit: options.onInit || function () {  },
            };
            // 内部数据
            this.store = {
                // 编辑框尺寸--高=宽
                width:0,
                minwidth: 100,
                maxwidth: 100,
                height:0,
                minheight: 100,
                maxheight: 100,
                defaultWidth: 200,
                defaultHeight: 200,
                // 编辑器主体的比例
                editorProportion: 0.9,
                editorProportion2: 0.7,
                // 编辑器主体宽高比例
                editorWH: 2/3,
                // 编辑器工具主体的比例
                editorToolProportion: 0.9,
                // 图片行为参数
                imgmouseStartP: [],
                imgmouseMoveP: [],
                imgTransForXY: [],
                // 鼠标是否在编辑框内
                fingerEenter: false,
                // 是否图片移动开始结束
                imgMoveFinish: false,
                imgMoveStart: false,
                limitMove: false,
                // 图片缩放
                imgScale: 1,
                rotateAngle: 0

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
                                    '<img class="editor-img" src="' + this.options.uploadImg + '" alt="" id="' + $id_prefix+ '_editor-img">' +
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

            var editorToolTpl = '<div class="editor-toolBar" id="' + $id_prefix + '_editor-toolBar">' +
                                    '<div class="toolbar-item toolbar-item-before" id="' + $id_prefix+ '_toolbar-item-before">工具' +
                                    '</div>' +
                                    '<div class="toolbar-item" id="' + $id_prefix + '_tool-reiterate">' +
                                        '<p class="toolBar-item-icon-box">' +
                                            '<span class="toolBar-item-icon"></span>' +
                                        '</p>' +
                                        '<span class="toolBar-item-text">重选</span>' +
                                    '</div>' +
                                    '<div class="toolbar-item" id="' + $id_prefix + '_tool-redo">' +
                                        '<p class="toolBar-item-icon-box">' +
                                            '<span class="toolBar-item-icon"></span>'+
                                        '</p>' +
                                        '<span class="toolBar-item-text">撤销</span>' +
                                    '</div>' +
                                    '<div class="toolbar-item" id="' + $id_prefix + '_tool-rotate">' +
                                        '<p class="toolBar-item-icon-box">' +
                                            '<span class="toolBar-item-icon"></span>' +
                                        '</p>' +
                                        '<span class="toolBar-item-text">旋转</span>' +
                                    '</div>' +
                                    '<div class="toolbar-item" id="' + $id_prefix + '_tool-ok">' +
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
                    if (me.options.module !== 'dialog') return;
                    if (!toolStatus) {
                        if (+me.store.equipmentW <= 460) {
                            toolbar.style.width = `${me.store.equipmentW * me.store.editorProportion - 60}px`;
                        }
                        else if (+me.store.equipmentW > 460) {
                            toolbar.style.width = `${me.options.editorW - 60}px`;
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
            // 1.编辑框行为
            var editorBox = document.getElementById('editor-box');
            var editorBoxEnterFn = function () { 
                me.store.fingerEenter = true;
                // console.log('fingerEenter:', me.store.fingerEenter);
            };
            var editorBoxLeaveFn = function () { 
                me.store.fingerEenter = false;
                // 关闭图片操作行为
                me.store.imgMoveFinish = true;
                me.store.imgMoveStart = false;
                // console.log('fingerEenter:', me.store.fingerEenter);
            };
            this.base.addEventHandler(editorBox, 'mouseenter', editorBoxEnterFn);
            this.base.addEventHandler(editorBox, 'mouseleave', editorBoxLeaveFn);
            // 2.图片行为editor-img
            var imgElem = this.base.getEleById('_editor-img');
            //  移动图片
            var ImgElemDownFn = function (e) {
                // 当前鼠标位置
                if (!me.store.fingerEenter ) return;
                me.store.imgMoveFinish = false;
                me.store.imgMoveStart = true;
                var etype = e.changedTouches || e;
                // 双指放大
                if (e.changedTouches && e.changedTouches.length > 1) {// 移动端  两指
                    var finger1 = {
                        x: parseInt(etype[0].clientX, 10),
                        y: parseInt(etype[0].clientY, 10)
                    };
                    var finger2 = {
                        x: parseInt(etype[1].clientX, 10),
                        y: parseInt(etype[1].clientY, 10)
                    }
                    console.log(' 移动端  两指start:', etype);
                    me.store.imgmouseStartP.push(finger1, finger2);
                }
                else if (e.changedTouches && e.changedTouches.length === 1) {// 移动端  单指
                    var finger1 = {
                        x: parseInt(etype[0].clientX, 10),
                        y: parseInt(etype[0].clientY, 10)
                    };
                    console.log('移动端  单指start:', etype);
                    me.store.imgmouseStartP.push(finger1);
                }
                else {// pc
                    var finger1 = {
                        x: parseInt(etype.clientX, 10),
                        y: parseInt(etype.clientY, 10)
                    };
                    console.log('pc 单指start:', finger1);
                    me.store.imgmouseStartP.push(finger1);
                };
                // console.log('当前鼠标位置', e.changedTouches, me.store.imgmouseStartP)
            };
            var ImgElemMoveFn = function (e) {
                // 当前鼠标位置
                if (!me.store.fingerEenter ) return;
                if (me.store.imgMoveFinish ) return;
                if (!me.store.imgMoveStart ) return;
                var etype = e.changedTouches || e;
                if (e.changedTouches && e.changedTouches.length > 1) {// 移动端  两指
                    var finger1 = {
                        x: parseInt(etype[0].clientX, 10),
                        y: parseInt(etype[0].clientY, 10)
                    };
                    var finger2 = {
                        x: parseInt(etype[1].clientX, 10),
                        y: parseInt(etype[1].clientY, 10)
                    }
                    console.log(' 移动端  两指move:', etype);
                    me.store.imgmouseMoveP.push(finger1, finger2);
                }
                else if (e.changedTouches && e.changedTouches.length === 1) { // 移动端  单指
                    var finger1 = {
                        x: parseInt(etype[0].clientX, 10),
                        y: parseInt(etype[0].clientY, 10)
                    };
                    console.log('移动端  单指move:', etype);
                    me.store.imgmouseMoveP.push(finger1);
                }
                else {// pc 单指
                    var finger1 = {
                        x: parseInt(etype.clientX, 10),
                        y: parseInt(etype.clientY, 10)
                    };
                    console.log('pc 单指move:', finger1);
                    me.store.imgmouseMoveP.push(finger1);
                };
                // me.store.imgmouseMoveP = {x: parseInt(etype.clientX, 10), y: parseInt(etype.clientY, 10)};
                // 判断是移动或则缩放
                if (e.changedTouches && e.changedTouches.length > 1) {// 移动端 双指缩放
                    var imgmouseStartP1 = me.store.imgmouseStartP[0];
                    var imgmouseStartP2 = me.store.imgmouseStartP[1];
                    var imgmouseMoveP1 = me.store.imgmouseMoveP[0];
                    var imgmouseMoveP2 = me.store.imgmouseMoveP[1];
                    // 计算斜边
                    var lenX1 = parseInt(imgmouseMoveP1.x - imgmouseStartP1.x, 10);
                    var lenY1 = parseInt(imgmouseMoveP1.y - imgmouseStartP1.y, 10);
                    var lenX2 = parseInt(imgmouseMoveP2.x - imgmouseStartP2.x, 10);
                    var lenY2 = parseInt(imgmouseMoveP2.y - imgmouseStartP2.y, 10);
                    var hypotenuse1 = Math.sqrt(Math.pow(lenX1, 2) + Math.pow(lenY1, 2));
                    var hypotenuse2 = Math.sqrt(Math.pow(lenX2, 2) + Math.pow(lenY2, 2));
                    // 缩放比例
                    var scaleNum = hypotenuse2 / hypotenuse1;
                    me.updateImgPosition('scale', scaleNum);
                    console.log('移动端 两个手指缩放：',  me.store.imgmouseStartP, imgmouseMoveP);
                }
                else {// pc/移动 单指移动
                    // 计算平移的XY
                    var imgmouseStartP = me.store.imgmouseStartP[0];
                    var imgmouseMoveP = me.store.imgmouseMoveP[0];
                    me.store.imgTransForXY = {
                        x: imgmouseMoveP['x'] - imgmouseStartP['x'],
                        y: imgmouseMoveP['y'] - imgmouseStartP['y']
                    };
                    console.log('pc/移动端 单指移动：', me.store.imgTransForXY);
                    // 让图片移动
                    // me.base.throttle(me.updateImgPosition('position'), 50);
                    me.updateImgPosition('position');
                };
                // console.log('当前鼠标位置1', me.store.imgmouseMoveP)
            };
            var ImgElemUpFn = function (e) { 
                // 当前鼠标位置
                if (!me.store.fingerEenter ) return;
                me.store.imgMoveFinish = true;
                me.store.imgMoveStart = false;
                me.store.imgmouseStartP = [];
                me.store.imgmouseMoveP = [];
                // console.log('当前鼠标位置2', me.store.imgTransForXY);
                // 检测图片边缘
                me.detectionImgPos();
            };
            this.base.addEventHandler(editorBox, 'mousedown', ImgElemDownFn);
            this.base.addEventHandler(editorBox, 'mousemove', this.base.throttle(ImgElemMoveFn, 50));
            this.base.addEventHandler(editorBox, 'mouseup', ImgElemUpFn);
            this.base.addEventHandler(editorBox, 'touchstart', ImgElemDownFn);
            this.base.addEventHandler(editorBox, 'touchmove', this.base.throttle(ImgElemMoveFn, 50));
            this.base.addEventHandler(editorBox, 'touchend', ImgElemUpFn);
            // 3.工具栏行为_tool-redo
            // 撤销
            var redoFn = function () {
                console.log('redo')
                // 图片归位
                me.setIngCenter('center');
            };
            // 旋转
            var rotateFn = function () {
                console.log('rotate')
                // 图片归位
                me.setIngCenter('rotate');
            };
            this.base.addEventHandler(this.base.getEleById('_tool-redo'), 'click', redoFn);
            this.base.addEventHandler(this.base.getEleById('_tool-rotate'), 'click', rotateFn);
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
            if (+this.store.equipmentW <= 460) {
                this.store.width = this.store.equipmentW * this.store.editorProportion * 0.7 || this.store.defaultWidth;
                this.store.minwidth = this.store.equipmentW * this.store.editorProportion * 0.4 || this.store.defaultWidth * 0.9;
                this.store.maxwidth = this.store.equipmentW * this.store.editorProportion * 0.9 || this.store.defaultWidth * 1.1;
                this.store.height = this.store.equipmentW * this.store.editorProportion * 0.7 || this.store.defaultHeight;
                this.store.minheight = this.store.equipmentW * this.store.editorProportion * 0.4 || this.store.defaultHeight * 0.9;
                this.store.maxheight = this.store.equipmentW * this.store.editorProportion * 0.9 || this.store.defaultHeight * 1.1;
            }
            else {
                this.store.width = this.options.editorW * 0.7 || this.store.defaultWidth;
                this.store.minwidth = this.options.editorW * 0.4 || this.store.defaultWidth * 0.9;
                this.store.maxwidth = this.options.editorW * 0.9 || this.store.defaultWidth * 1.1;
                this.store.height = this.options.editorW * 0.7 || this.store.defaultHeight;
                this.store.minheight = this.options.editorW * 0.4 || this.store.defaultHeight * 0.9;
                this.store.maxheight = this.options.editorW * 0.9 || this.store.defaultHeight * 1.1;
            };
            console.log('initData:', this.store);
            this.initSize();
        };
        // 初始化尺寸
        initSize() {
            // 设置编辑器尺寸
            if (this.options.module === 'dialog') {
                if (+this.store.equipmentW <= 460) {
                    this.base.getEleById('_editor-body').style = `width:${this.store.equipmentW * this.store.editorProportion}px;
                                                                height:${(this.store.equipmentW * this.store.editorProportion) / this.store.editorWH}px`;
                    this.base.getEleById('_editor-toolBar').style = `width:${this.store.equipmentW * this.store.editorProportion - 60}px`;
                }
                else {
                    this.base.getEleById('_editor-body').style = `width:${this.options.editorW}px;height:${this.options.editorH}px;`;
                    this.base.getEleById('_editor-toolBar').style = `width:${this.options.editorW - 60}px`;
                };
            }
            else {
                if (+this.store.equipmentW <= 460) {
                    this.base.getEleById('_editor-body').style = `width:${this.store.equipmentW * this.store.editorProportion}px;
                                                                height:${(this.store.equipmentW * this.store.editorProportion) / this.store.editorWH}px`;
                    this.base.getEleById('_editor-toolBar').style = `width:${this.store.equipmentW * this.store.editorProportion}px`;
                }
                else {
                    this.base.getEleById('_editor-body').style = `width:${this.options.editorW}px;height:${this.options.editorH}px;`;
                    this.base.getEleById('_editor-toolBar').style = `width:${this.options.editorW}px;`;
                };
            };
            // 设置裁剪框的宽高和居中
            document.getElementById('editor-box').style= `width:${this.store.width}px;height:${this.store.height}px;`;
            if (+this.store.equipmentW <= 460) {
                this.base.getEleById('_editor-middle-box').style = `width:${this.store.equipmentW * this.store.editorProportion}px;height:${this.store.height + 4}px`;
                this.base.getEleById('_editor-right').style = `width:${(this.store.equipmentW * this.store.editorProportion - this.store.width - 4) / 2}px;`;
                this.base.getEleById('_editor-left').style = `width:${(this.store.equipmentW * this.store.editorProportion - this.store.width - 4) / 2}px;`;
                this.base.getEleById('_editor-bottom').style = `width:${this.store.equipmentW * this.store.editorProportion}px;
                                                                height:${((this.store.equipmentW * this.store.editorProportion) / this.store.editorWH - this.store.height - 4) / 2}px`;
                this.base.getEleById('_editor-top').style = `width:${this.store.equipmentW * this.store.editorProportion}px;
                                                            height:${((this.store.equipmentW * this.store.editorProportion) / this.store.editorWH - this.store.height - 4) / 2}px`;
            }
            else {
                this.base.getEleById('_editor-middle-box').style = `width:${this.options.editorW}px;height:${this.store.height + 4}px`;
                this.base.getEleById('_editor-right').style = `width:${(this.options.editorW - this.store.width - 4) / 2}px;`;
                this.base.getEleById('_editor-left').style = `width:${(this.options.editorW - this.store.width - 4) / 2}px;`;
                this.base.getEleById('_editor-bottom').style = `width:${this.options.editorW}px;
                                                                height:${(this.options.editorH - this.store.height - 4) / 2}px`;
                this.base.getEleById('_editor-top').style = `width:${this.options.editorW}px;
                                                            height:${(this.options.editorH - this.store.height - 4) / 2}px`;
            };
            // 图片居中
            this.setIngCenter();
        };
        // 图片位置变化
        updateImgPosition(type, scaleNum) {
            var imgElem = this.base.getEleById('_editor-img');
            var me = this;
            switch(type) {
                case 'position':
                    // translate3d(${imgLeft}px, ${imgTop}px, 0)
                    var currentTransform = me.base.getEleById('_editor-img').style.transform;
                    // 先保存当前scale和rotate
                    var scaleReg=  /(\s|^)scale\((\d*)(\.?)(\d*)\)(\s|$)/g;
                    var currentScaleEle = scaleReg.exec(currentTransform);
                    var currentScale = currentScaleEle ? currentScaleEle[0] : '';
                    var rotateReg = /(\s|^)rotate\((\d*)deg\)(\s|$)/g;
                    var currentRotateEle = rotateReg.exec(currentTransform);
                    var currentRotate = currentRotateEle ? currentRotateEle[0] : '';
                    console.log('hello00:', currentScale, currentRotate);
                    // 从新组合
                    currentTransform = `translate3d(${me.store.imgTransForXY.x}px, ${me.store.imgTransForXY.y}px, 0)
                                         ${currentScale} ${currentRotate}`
                    imgElem.style.transform = currentTransform;;
                    break;
                case 'scale':
                    var resSacle = me.store.imgScale * scaleNum;
                    me.store.imgScale = resSacle;
                    imgElem.style = `transform: scale(${resSacle});`;
                    break;
            }
        };
        // 图片居中
        setIngCenter(type) {
            var me = this;
            var imgTop;
            var imgLeft;
            if (!type) {
                this.base.getEleById('_editor-img').onload = function () {
                    var imgWidth = me.base.getEleById('_editor-img').width;
                    var imgHeight = me.base.getEleById('_editor-img').height;
                    me.store.imgWidth = imgWidth;
                    me.store.imgHeight = imgHeight;
                    // 图片平移距离
                    if (+me.store.equipmentW <= 460) {
                        imgTop = ((me.store.equipmentW * me.store.editorProportion) / me.store.editorWH - me.store.imgHeight) / 2;
                        imgLeft = 0;
                    }
                    else {
                        imgTop = (me.options.editorH - me.store.imgHeight) / 2;
                        imgLeft = 0;
                    };
                    me.base.getEleById('_editor-img').style = `transform:translate3d(${imgLeft}px, ${imgTop}px, 0) scale(${me.store.imgScale})`;
                };
                // console.log('图片的宽高：', imgWidth, imgHeight);
            }
            else if (type && type === 'center') {
                var imgWidth = me.base.getEleById('_editor-img').width;
                var imgHeight = me.base.getEleById('_editor-img').height;
                me.store.imgWidth = imgWidth;
                me.store.imgHeight = imgHeight;
                // 图片平移距离
                if (+me.store.equipmentW <= 460) {
                    imgTop = ((me.store.equipmentW * me.store.editorProportion) / me.store.editorWH - me.store.imgHeight) / 2;
                    imgLeft = 0;
                }
                else {
                    imgTop = (me.options.editorH - me.store.imgHeight) / 2;
                    imgLeft = 0;
                };
                me.base.getEleById('_editor-img').style = `transform:translate3d(${imgLeft}px, ${imgTop}px, 0) scale(${me.store.imgScale})`;
                me.store.rotateAngle = 0;
            }
            else if (type && type === 'rotate') {
                me.store.rotateAngle = me.store.rotateAngle + 90;
                // 存旋转角度记录的栈
                me.store.rotateAngleArr = [];
                var currentTransform = me.base.getEleById('_editor-img').style.transform;
                var reg = /(\s|^)rotate\((\d*)deg\)(\s|$)/g;
                if (reg.test(currentTransform)) {
                    currentTransform = currentTransform.replace(reg, '');
                };
                currentTransform += ` rotate(${me.store.rotateAngle}deg)`;
                me.store.rotateAngleArr.push(me.store.rotateAngle);
                me.base.getEleById('_editor-img').style.transform = currentTransform;
            };
        };
        // 检图片边缘
        detectionImgPos() {
            if (this.store.limitMove) {
                return;
            }
            let left = this.imgLeft;
            let top = this.imgTop;
            var scale = scale || this.scale;
            let imgWidth = this.imgWidth;
            let imgHeight = this.imgHeight;
            if (this.angle / 90 % 2) {
                imgWidth = this.imgHeight;
                imgHeight = this.imgWidth;
            }
            left = this.cutLeft + imgWidth * scale / 2 >= left
                ? left : this.cutLeft + imgWidth * scale / 2;
            left = this.cutLeft + this.width - imgWidth * scale / 2 <= left
                ? left : this.cutLeft + this.width - imgWidth * scale / 2;
            top = this.cutTop + imgHeight * scale / 2 >= top
                ? top : this.cutTop + imgHeight * scale / 2;
            top = this.cutTop + this.height - imgHeight * scale / 2 <= top
                ? top : this.cutTop + this.height - imgHeight * scale / 2;
            this.imgLeft = left;
            this.imgTop = top;
            this.scale = scale;
        }
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
        // 传入的图片
        uploadImg: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fblog%2F202012%2F04%2F20201204182229_e1a0a.thumb.1000_0.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1638869603&t=0ac37cac7c77e0e7253f4f0c8d6d8851',
        // uploadImg: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201608%2F12%2F20160812204518_SyX8M.thumb.700_0.jpeg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1638869925&t=47cfa3559bb538068255d6bee03a379a',
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