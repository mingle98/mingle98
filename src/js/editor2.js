(function (window) {
window.mingleSDK = window.mingleSDK ? window.mingleSDK : {};
window.mingleSDK.initImgEditor = function(options) {
    if (window.mingleSDK.imgEditorInstance) {
        return indow.mingleSDK.imgEditorInstance;
    };
    !window.mingleSDK.imgEditorInstance && (window.mingleSDK.imgEditorInstance = new ImgEditor(options));
};
// 定义公共方法类
class Base {
    constructor () {};
    // 1.将ajax进行函数封装
    ajax(options) {
        // 存储的是默认值
        let defaults = {
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
        let xhr = new XMLHttpRequest();
        // 处理并且拼接请求参数
        let params = "";
        // 循环用户传入的对象类型格式的参数（for in）
        for (let attr in defaults.data) {
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
            let contentType = defaults.header["Content-Type"];
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
            let ContentType = xhr.getResponseHeader("Content-Type");
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
        let script = document.createElement("script");
        // 拼接字符串的变量
        let params = "";
        for(let attr in options.data){
            params += "&" + attr + "=" + options.data[attr];
        }
        // 解决多次请求函数名重复导致的数据重叠问题(函数名myjsonp-123456格式)
        let fnName = "myjsonp" + Math.random().toString().replace(".", "")
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
        let firstFlag = true;
        let timer;
        return function () { 
            let self = this;
            let ags = arguments;
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
        let timer;
        return function (params) { 
            let self  = this;
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
            let classObj = ele.className;
            // 是否需要加空格 如果className是空就不需要
            let bank = (classObj === '') ? '' : ' ';
            ele.className += bank + cName;
        };
        return this;
    };
    removeClass(dom, cName) {
        if (this.hasClassName(dom, cName)) {
            if (dom.className.indexOf(' ' + cName + ' ') >= 0) {
                dom.className = dom.className.replace(new RegExp('(\\s|^)' + cName + '(\\s|$)'), ' ');
            } else {
                dom.className = dom.className.replace(new RegExp('(\\s|^)' + cName + '(\\s|$)'), '');
            };
        }
        return this;
    }
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
            let builder = [];
            for(key in query) {
                if(query.hasOwnProperty(key)) {
                    let value = query[key];
                    if (value) {
                        builder.length && builder.push('&');
                        let res = (typeof value === 'boolean') ? (value ? '1' : '0') : value.toString();
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
            let hasQuery = (/\?/g).test(url);
            url += (hasQuery ? "&" : "?") + query;
        };
        return query;
    };
    // 10.通过id获取元素
    getEleById(id_tail) {
        if (!$id_prefix) return null;
        let allid = String($id_prefix) + String(id_tail);
        let targetDom = document.getElementById(allid);
        if (targetDom) {
            return targetDom;
        };
        return null;
    };
    // 11.获取ie浏览器版本
    IEVersion () {
        let userAgent = navigator.userAgent; //取得浏览器的userAgent字符串  
        let isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1; //判断是否IE<11浏览器  
        let isEdge = userAgent.indexOf('Edge') > -1 && !isIE; //判断是否IE的Edge浏览器  
        let isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1;
        if (isIE) {
            let reIE = new RegExp('MSIE (\\d+\\.\\d+);');
            reIE.test(userAgent);
            let fIEVersion = parseFloat(RegExp['$1']);
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
        let reg = new RegExp('(^| )' + key + '=([^;]*)(;|\x24)');
        let result = reg.exec(document.cookie);
        if (result) {
            return result[2] || null;
        }

        return null;
    };
    getCookie(key) {
        let value = getRaw(key);
        if (typeof value === 'string') {
            value = decodeURIComponent(value);
            return value;
        }
        return null;
    };
    // 13.获取安卓版本号
    get_android_version() {
        let ua = navigator.userAgent.toLowerCase();
        let version = null;
        if (ua.indexOf('android') > 0) {
            let reg = /android [\d._]+/gi;
            let vInfo = ua.match(reg);
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
            let box = document.createElement('div');
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
    };
    // 17.判断是否为pc浏览器
    isPC() {
        let userAgentInfo = navigator.userAgent;
        let Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'];
        let flag = true;
        for (let v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) {
                flag = false;
                break;
            }
        }
        return flag;
    };
    // 18.延时函数
    async sleep(delay = 500) {
        let fn = function () {
            return new Promise((resolve, reject) => {
                setTimeout(_ => {
                    resolve();
                    console.log('sleep...', delay);
                }, delay);
            })
        };
        await fn();
    };
    // 19.封装获取query参数的方法
    getQueryString(name) {
        let locationArray = location.href.substring(location.href.indexOf("?") + 1).split("&");
        let locationObj = {};
        for (let i = 0,
            len = locationArray.length; i < len; i++) {
            let tempArray = locationArray[i].split("=");
            locationObj[tempArray[0]] = tempArray[1]
        }
        if (name && name !== 0 && name !== false) {
            return locationObj[name] ? locationObj[name] : ""
        } else {
            return locationObj
        }
    };
};


// 全局变量
let $id_prefix = '$baidu_' + Math.floor(Math.random() * 1000000).toString().split(',');
// console.log('$id_prefix', $id_prefix);
let downloadFlag = false;

// 图片编辑器类
class ImgEditor {
    constructor(options) {
        // 配置项
        this.options = {
            // 弹窗模式或则嵌入模式
            module: options.module || 'dialog',
            // 主体编辑器容器id
            containerId: options.id,
            // 主体编辑器的宽高(width>460px时候该配置生效)
            editorW: options.editorW || 400,
            editorH: options.editorH || 600,
            // 编辑器工具容器id
            toolContainerId: options.toolid,
            // 传入的图片
            uploadImg: options.uploadImg || '',
            // 裁剪框尺寸模式 默认模式上default（0.7)、小尺寸模式samll（0.4）、大尺寸模式big（0.9）
            editrBoxModel: options.editrBoxModel || 'default',
            // 是否禁用手指拖动功能
            disableTouch: options.disableTouch || false,
            // 禁用手指拖动功能时自定义步长 单位px
            disableTouchStepLen: options.disableTouchStepLen || 30,
            // 图片的放大最大(小)比例，最小默认值0.5，最大3
            imgMaxScale: options.imgMaxScale || 3,
            imgMinScale: options.imgMinScale || 0.5,
            onRender: options.onRender || function () {  },
            onInit: options.onInit || function () {  },
            onScale: options.onScale || function () {  },
            onRedo: options.onRedo || function () {  },
            onClickHook: options.onClickHook || function () {  },
            onMoveHook: options.onMoveHook || function () {  },
            onEndHook: options.onEndHook || function () {  },
        };
        // 内部数据
        this.store = {
            // 编辑框尺寸--高=宽
            width: 0,
            minwidth: 100,
            maxwidth: 100,
            height:0,
            minheight: 100,
            maxheight: 100,
            defaultWidth: 200,
            defaultHeight: 200,
            // 编辑器主体的比例
            editorProportion: options.editorProportion || 0.9,
            // 编辑器主体宽高比例
            editorWH: options.editorWH || 2 / 3,
            // 编辑器工具主体的比例
            editorToolProportion: options.editorToolProportion || options.editorProportion || 0.9,
            // --------------
            // 图片行为参数
            // 图片平移的top
            imgTop: 0,
            // 图片平移的legt:
            imgLeft: 0,
            // 图片缩放
            imgScale: 1,
            // 图片的宽高
            imgHeightimgWidth: 0,
            imgHeight: 0,
            // 图片旋转角度
            rotateAngle: 0,
            imgmouseStartP: [],
            imgmouseMoveP: [],
            imgTransForXY: [],
            // 鼠标是否在编辑框内
            fingerEenter: false,
            // 是否图片移动开始结束
            imgMoveFinish: false,
            imgMoveStart: false,
            limitMove: false,
            // --------------
            // 剪裁框的位置数据
            trimmingBoxTop: 0,
            trimmingBoxBottom: 0,
            trimmingBoxleft: 0,
            trimmingBoxright: 0,
            // 首次初始化好的图片信息
            initImgEle: null,
            initImgEleWidth: 0,
            initImgEleHeight: 0,
            imgOriginScaleNum: 1,
            imgOriginWH: 0,
            // 用于绘制在canvas上的img的对应的起始点坐标X\Y
            imgToCanvasX: 0,
            imgToCanvasY: 0,
            // 用于canvas映射到剪裁时候到真实比例
            mapRealCutProportion: 1,
            // 剪裁缩放后到X、Y差值
            mapRealCutProportionXDif: 0,
            mapRealCutProportionYDif: 0,
            // 是否处于旋转状态为正
            rotateAngleStatus: false,
            // 使用的滤镜
            imgFilter: {
                style: '',
                bwNum: 0,
                ltNum: 0,
                mkType: '',
                mkTypeNum: ''
            },
            // 是否配置query的编辑框尺寸参数
            editorbox: {
                value: 1,
                open: false
            }
        };
        console.log('options:', this.options);
        // 基础工具
        this.base = new Base();
        // 语言文案
        let langquery = this.base.getQueryString('lang') || 'Zh';
        this.lang = {
            En: {
                headTitle: '',
                headTitle: '',
                tools: {
                    reSelect: 'reelect',
                    confirm: 'confirm',
                    reset: 'undo',
                    rotate: 'rotating',
                },
                downloadSuc: 'download successful',
                downloadFail: 'download failed',
                downloadBtn: 'download',
                downloadBtned: 'Downloaded',
                ieV: 'The current browser version is too early. Upgrade the browser to the latest version'
            },
            Zh: {
                headTitle: '',
                tools: {
                    reSelect: '重选',
                    confirm: '选好了',
                    reset: '撤销',
                    rotate: '旋转',
                },
                downloadSuc: '下载成功！',
                downloadFail: '下载失败',
                downloadBtn: '下载',
                downloadBtned: '已下载',
                ieV: '当前浏览器版本过低，请升级至最新版本！'
            }
        } [langquery];
        // 检测浏览器
        let iev = this.base.IEVersion();
        if (!isNaN(iev) && iev <= 7 && iev !== -1) {
            alert(this.lang.ieV);
            return false;
        };
        // 是否采用滤镜
        if (this.base.getQueryString('filter')) {
            this.store.imgFilter.style = this.base.getQueryString('filter') || '';
            let bwNum = this.base.getQueryString('bwNum');
            let ltNum = this.base.getQueryString('ltNum');
            let mkType = this.base.getQueryString('mkType');
            let mkTypeNum = this.base.getQueryString('mkTypeNum');
            bwNum && (this.store.imgFilter.bwNum = bwNum || 0);
            ltNum && (this.store.imgFilter.ltNum = ltNum || 0);
            mkType && (this.store.imgFilter.mkType = mkType || '');
            mkTypeNum && (this.store.imgFilter.mkTypeNum = mkTypeNum || '');
        };
        // console.log('query:', this.base.getQueryString('filter'), this.store.imgFilter);
        // 是否在query上配置裁剪框尺寸配置 比例
        if (this.base.getQueryString('editorbox') && !isNaN(this.base.getQueryString('editorbox'))) {
            this.store.editorbox.value = Math.abs(this.base.getQueryString('editorbox')) || 1;
            this.store.editorbox.open = true;
            console.log('裁剪框尺寸配置:', this.store.editorbox.value);
        };
        // 渲染页面
        this.render();
        let me = this;
        window.onresize = function () {
            // 渲染页面
            while (document.body.firstChild) {
                document.body.removeChild(document.body.firstChild);
            };
            me.render();
        };
    };
    render() {
        // 触发hook
        this.options.onRender();
        this.renderTpl();
    };
    // 初始化
    init() {
        // 触发hook
        this.options.onInit();
        // 检查端
        this.mobilecheck();
        // 初始化数据
        this.initData();
        // 初始化尺寸
        this.initSize();
    };
    // 存模版的方法
    get_tpl(file) {
        let me = this;
        let editorBodyTpl = '<div class="editor-body" id="' + $id_prefix+ '_editor-body">' +
                                '<img class="editor-img" src="' + this.options.uploadImg + '" alt="" id="' + $id_prefix+ '_editor-img">' +
                                '<div class="editor-content">' +
                                    '<div class="editor-top" id="' + $id_prefix+ '_editor-top">' +
                                        '<div class="editor-1-arrowBox" id="' + $id_prefix + '_editor-1-arrowBox">' +
                                            '<div class="editor-big-icon arrow" id="' + $id_prefix + '_editor-big-icon"></div>' +
                                            '<div class="editor-small-icon arrow" id="' + $id_prefix + '_editor-small-icon"></div>' +
                                        '</div>' +
                                    '</div>' +
                                    '<div class="editor-middle-box" id="' + $id_prefix + '_editor-middle-box">' +
                                        '<div class="editor-right" id="' + $id_prefix + '_editor-right"></div>' +
                                        '<div class="editor-box" id="' + $id_prefix + '_editor-box"></div>' +
                                        '<div class="editor-left" id="' + $id_prefix+ '_editor-left"></div>' +
                                    '</div>' +
                                    '<div class="editor-bottom" id="' + $id_prefix+ '_editor-bottom">' + 
                                        '<div class="editor-2-arrowBox" id="' + $id_prefix + '_editor-2-arrowBox">' +
                                            '<div class="editor-top-arrow arrow" id="' + $id_prefix + '_editor-top-arrow"></div>' +
                                            '<div class="editor-bottom-arrow arrow" id="' + $id_prefix + '_editor-bottom-arrow"></div>' +
                                            '<div class="editor-left-arrow arrow" id="' + $id_prefix + '_editor-left-arrow"></div>' +
                                            '<div class="editor-right-arrow arrow" id="' + $id_prefix + '_editor-right-arrow"></div>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="canvas-box" id="' + $id_prefix + '_canvas-box">' +
                                    '<div class="editor-back-arrow" id="' + $id_prefix + '_editor-back-arrow"></div>' +
                                    '<canvas class="canvas" id="' + $id_prefix + '_canvas"></canvas>' +
                                    '<button class="download-button" id="' + $id_prefix + '_download-button">' + me.lang.downloadBtn +'</button>' +
                                    '<div class="download-tip" id="' + $id_prefix + '_download-tip"></div>' +
                                '</div>' +
                                '<div class="loading-box" id="' + $id_prefix + '_loading-box">' +
                                    '<div class="loading-icon" id="' + $id_prefix + '_loading-icon">' +
                                        '<p class="loading-iocn-img" id="' + $id_prefix + '_oading-iocn-img"></p>' +
                                        '<p class="loading-txt" id="' + $id_prefix + '_loading-txt">加载中</p>' +
                                    '</div>' +
                                '</div>' +
                            '</div>';

        let editorToolTpl = '<div class="editor-toolBar" id="' + $id_prefix + '_editor-toolBar">' +
                                '<div class="toolbar-item toolbar-item-before" id="' + $id_prefix+ '_toolbar-item-before">工具' +
                                '</div>' +
                                '<div class="toolbar-item" id="' + $id_prefix + '_tool-select">' +
                                    '<p class="toolBar-item-icon-box">' +
                                        '<span class="toolBar-item-icon reselect-icon"></span>' +
                                    '</p>' +
                                    '<span class="toolBar-item-text">' + me.lang.tools.reSelect + '</span>' +
                                '</div>' +
                                '<div class="toolbar-item" id="' + $id_prefix + '_tool-redo">' +
                                    '<p class="toolBar-item-icon-box ">' +
                                        '<span class="toolBar-item-icon chexiao-icon"></span>'+
                                    '</p>' +
                                    '<span class="toolBar-item-text">' + me.lang.tools.reset + '</span>' +
                                '</div>' +
                                '<div class="toolbar-item" id="' + $id_prefix + '_tool-rotate">' +
                                    '<p class="toolBar-item-icon-box">' +
                                        '<span class="toolBar-item-icon xuanzhuan-icon"></span>' +
                                    '</p>' +
                                    '<span class="toolBar-item-text">' + me.lang.tools.rotate + '</span>' +
                                '</div>' +
                                '<div class="toolbar-item" id="' + $id_prefix + '_tool-ok">' +
                                    '<p class="toolBar-item-icon-box">' +
                                        '<span class="toolBar-item-icon ok-icon"></span>' +
                                    '</p>' +
                                    '<span class="toolBar-item-text">' + me.lang.tools.confirm + '</span>' +
                                '</div>' +
                            '</div>';
        let tempObj = {
            editor: editorBodyTpl,
            editorTool: editorToolTpl
        };
        return tempObj[file];
    }
    // 渲染模版
    renderTpl() {
        let tempEditorTpl = this.get_tpl('editor');
        let tempEditorToolTpl = this.get_tpl('editorTool');
        //  弹窗
        let maskDiv = document.createElement('div');
        maskDiv.id = $id_prefix + "_editor-dialog-mask";
        maskDiv.className = "editor-dialog-mask";

        if (this.options.module === 'dialog') {
            console.log('dialog');
            // 渲染编辑器主体到页面
            document.body.appendChild(maskDiv);
            this.base.insertHTML('afterBegin', tempEditorTpl, this.base.getEleById('_editor-dialog-mask'));
            this.base.addClass(this.base.getEleById('_editor-body'), 'dialog-body');
            // 渲染编辑器工具bar主体到页面
            this.base.insertHTML('afterBegin', tempEditorToolTpl, this.base.getEleById('_editor-dialog-mask'));
            this.base.addClass(this.base.getEleById('_editor-toolBar'), 'editor-toolBar-fold');
        }
        else {
            console.log('Embedding');
            // 渲染编辑器主体到页面
            if (this.options.containerId) {
                let containerEle = document.getElementById(this.options.containerId);
                this.base.insertHTML('afterBegin', tempEditorTpl, containerEle);
            }
            else {
                this.base.insertHTML('afterBegin', tempTpl, '');
            };
            // 渲染编辑器工具bar主体到页面
            if (this.options.toolContainerId) {
                let containerToolEle = document.getElementById(this.options.toolContainerId);
                this.base.insertHTML('afterBegin', tempEditorToolTpl, containerToolEle);
            }
            else {
                this.base.insertHTML('afterBegin', tempEditorToolTpl, '');
            };
            this.base.toggleShow(this.base.getEleById('_toolbar-item-before'));
        };
        // 是否禁用touch
        if (!this.options.disableTouch) {
            this.base.getEleById('_editor-2-arrowBox').style.display = 'none';
            // this.base.getEleById('_editor-1-arrowBox').style.display = 'none';
        }
        this.setEvent();
        // 初始化
        this.init();
    };
    // 设置事件
    setEvent() {
        let toolbar = this.base.getEleById('_editor-toolBar');
        let beforeItem = this.base.getEleById('_toolbar-item-before');
        let me = this;
        if (this.options.module === 'dialog') {
            let toolStatus = false;
            // 展开折叠工具bar
            let visibleTollBar = function () {
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
            // this.bindEventStore(beforeItem, 'click', visibleTollBar);
        };


        // 1.编辑框行为
        let editorBox = me.base.getEleById('_editor-box');
        let editorBoxEnterFn = function () {
            if (me.store.fingerEenter) return;
            me.store.fingerEenter = true;
            // console.log('fingerEenter:', me.store.fingerEenter);
        };
        let editorBoxLeaveFn = function () { 
            me.store.fingerEenter = false;
            // 关闭图片操作行为
            me.store.imgMoveFinish = true;
            me.store.imgMoveStart = false;
            // console.log('fingerEenter:', me.store.fingerEenter);
        };
        this.base.addEventHandler(editorBox, 'mouseenter', editorBoxEnterFn);
        this.base.addEventHandler(editorBox, 'mouseleave', editorBoxLeaveFn);
        this.base.addEventHandler(editorBox, 'touchstart', editorBoxEnterFn);
        this.base.addEventHandler(editorBox, 'touchend', editorBoxLeaveFn);

        // 2.图片行为editor-img
        let imgElem = this.base.getEleById('_editor-img');
        //  移动图片
        let ImgElemDownFn = function (e) {
            if (!me.store.rotateAngleStatus) {
                return false;
            };
            // 当前鼠标位置
            if (!me.store.fingerEenter) return;
            me.store.imgMoveFinish = false;
            me.store.imgMoveStart = true;
            e = e || window.event;
            me.base.preventDefault(e);
            let etype = e.changedTouches || e;
            // 双指放大
            if (e.changedTouches && e.changedTouches.length > 1) {// 移动端  两指
                let finger1 = {
                    x: parseInt(etype[0].clientX, 10),
                    y: parseInt(etype[0].clientY, 10)
                };
                let finger2 = {
                    x: parseInt(etype[1].clientX, 10),
                    y: parseInt(etype[1].clientY, 10)
                }
                // console.log(' 移动端  两指start:', etype);
                me.store.imgmouseStartP.push(finger1, finger2);
            }
            else if (e.changedTouches && e.changedTouches.length === 1) {// 移动端  单指
                let finger1 = {
                    x: parseInt(etype[0].clientX, 10),
                    y: parseInt(etype[0].clientY, 10)
                };
                me.store.imgmouseStartP[0] = finger1;
                // console.log('移动端  单指start:', me.store.imgmouseStartP[0]);
            }
            else {// pc
                let finger1 = {
                    x: parseInt(etype.clientX, 10),
                    y: parseInt(etype.clientY, 10)
                };
                // console.log('pc 单指start:', finger1);
                me.store.imgmouseStartP[0] = finger1;
            };
            // console.log('当前鼠标位置', e.changedTouches, me.store.imgmouseStartP)
        };
        let ImgElemMoveFn = function (e) {
            if (!me.store.rotateAngleStatus) {
                alert('旋转模式下暂不支持移动操作！');
                return false;
            };
            // 当前鼠标位置
            if (!me.store.fingerEenter ) return;
            if (me.store.imgMoveFinish ) return;
            if (!me.store.imgMoveStart ) return;
            e = e || window.event;
            me.base.preventDefault(e);
            let etype = e.changedTouches || e;
            if (e.changedTouches && e.changedTouches.length > 1) {// 移动端  两指
                let finger1 = {
                    x: parseInt(etype[0].clientX, 10),
                    y: parseInt(etype[0].clientY, 10)
                };
                let finger2 = {
                    x: parseInt(etype[1].clientX, 10),
                    y: parseInt(etype[1].clientY, 10)
                }
                // console.log(' 移动端  两指move:', etype);
                me.store.imgmouseMoveP.push(finger1, finger2);
            }
            else if (e.changedTouches && e.changedTouches.length === 1) { // 移动端  单指
                let finger1 = {
                    x: parseInt(etype[0].clientX, 10),
                    y: parseInt(etype[0].clientY, 10)
                };
                // console.log('移动端  单指move:', finger1);
                me.store.imgmouseMoveP[0] = (finger1);
            }
            else {// pc 单指
                let finger1 = {
                    x: parseInt(etype.clientX, 10),
                    y: parseInt(etype.clientY, 10)
                };
                // console.log('pc 单指move:', finger1);
                me.store.imgmouseMoveP[0] = finger1;
            };
            // me.store.imgmouseMoveP = {x: parseInt(etype.clientX, 10), y: parseInt(etype.clientY, 10)};
            // 判断是移动或则缩放
            if (e.changedTouches && e.changedTouches.length > 1) {// 移动端 双指缩放
                let imgmouseStartP1 = me.store.imgmouseStartP[0];
                let imgmouseStartP2 = me.store.imgmouseStartP[1];
                let imgmouseMoveP1 = me.store.imgmouseMoveP[0];
                let imgmouseMoveP2 = me.store.imgmouseMoveP[1];
                // 计算斜边
                let lenX1 = parseInt(imgmouseMoveP1.x - imgmouseStartP1.x, 10);
                let lenY1 = parseInt(imgmouseMoveP1.y - imgmouseStartP1.y, 10);
                let lenX2 = parseInt(imgmouseMoveP2.x - imgmouseStartP2.x, 10);
                let lenY2 = parseInt(imgmouseMoveP2.y - imgmouseStartP2.y, 10);
                let hypotenuse1 = Math.sqrt(Math.pow(lenX1, 2) + Math.pow(lenY1, 2));
                let hypotenuse2 = Math.sqrt(Math.pow(lenX2, 2) + Math.pow(lenY2, 2));
                // 缩放比例
                let scaleNum = hypotenuse2 / hypotenuse1;
                me.updateImgChange('scale', scaleNum);
                // console.log('移动端 两个手指缩放：',  me.store.imgmouseStartP, imgmouseMoveP);
            }
            else {// pc/移动 单指移动
                // 计算平移的XY
                let imgmouseStartP = me.store.imgmouseStartP[0];
                let imgmouseMoveP = me.store.imgmouseMoveP[0];
                me.store.imgTransForXY = {
                    x: imgmouseMoveP['x'] - imgmouseStartP['x'],
                    y: imgmouseMoveP['y'] - imgmouseStartP['y']
                };
                // console.log('pc/移动端 单指移动：', imgmouseStartP, imgmouseMoveP, me.store.imgTransForXY);
                // 让图片移动
                if (Math.abs(me.store.imgTransForXY.x) < 10) {
                    me.store.imgTransForXY.x < 0 ? me.store.imgTransForXY.x = - 10 : me.store.imgTransForXY.x =  10;
                };
                if (Math.abs(me.store.imgTransForXY.y) < 10) {
                    me.store.imgTransForXY.y < 0 ? me.store.imgTransForXY.y = - 10 : me.store.imgTransForXY.y =  10;
                };
                me.updateImgChange('position');
            };
        };
        let ImgElemUpFn = function (e) {
            if (!me.store.rotateAngleStatus) {
                return false;
            };
            // 当前鼠标位置
            if (!me.store.fingerEenter ) return;
            me.store.imgMoveFinish = true;
            me.store.imgMoveStart = false;
            me.store.imgmouseStartP = [];
            me.store.imgmouseMoveP = [];
            // 检测图片边缘
            me.detectionImgPos();
        };
        if (!me.options.disableTouch) {
            me.base.addEventHandler(editorBox, 'mousedown', ImgElemDownFn);
            me.base.addEventHandler(editorBox, 'mousemove', me.base.throttle(ImgElemMoveFn, 300));
            me.base.addEventHandler(editorBox, 'mouseup', ImgElemUpFn);
            me.base.addEventHandler(editorBox, 'touchstart', ImgElemDownFn);
            me.base.addEventHandler(editorBox, 'touchmove', me.base.throttle(ImgElemMoveFn, 300));
            me.base.addEventHandler(editorBox, 'touchend', ImgElemUpFn);
        };
        // 3.工具栏行为_tool-redo
        // 撤销
        let redoFn = function () {
            closeResPage();
            console.log('redo');
            // 触发hook
            me.options.onRedo();
            // 图片归位
            me.setImgCenter('center');
            // 缩放复原
            me.updateImgChange('scale', 0);
            // 特殊处理旋转情况  不允许移动操作
            me.store.rotateAngleStatus = true;
            if (!me.store.rotateAngleStatus && me.options.disableTouch) {
                me.base.getEleById('_editor-2-arrowBox').style.opacity = '0';
            } else if (me.store.rotateAngleStatus && me.options.disableTouch) {
                me.base.getEleById('_editor-2-arrowBox').style.opacity = '1';
            };
        };
        // 旋转
        let rotateFn = function () {
            closeResPage();
            console.log('rotate')
            // 图片归位
            me.setImgCenter('rotate');
        };
        // 重选
        let selectFn = function () {
            closeResPage();
            let newUrl = prompt('输入新图片URL');
            if (newUrl && !/(\w+):\/\/([^/:]+)(:\d*)?([^# ]*)/.test(newUrl)) {
                return alert('url格式错误，请重新输入');
            };
            if (!newUrl) return;
            let img = new Image();
            img.src = newUrl;
            img.onerror = function () { 
                return alert('url无效，请重新输入');
            };
            img.onload = function () { 
                me.options.uploadImg = newUrl;
                // 渲染页面
                while (document.body.firstChild) {
                    document.body.removeChild(document.body.firstChild);
                };
                me.render();
            };
            img = null;
            console.log('select', newUrl);
        };
        // 选好了 _tool-ok
        let confirmFn = function () {
            closeResPage();
            console.log('confirmFn');
            // canvas绘制
            me.draw();
        };
        // 如果处于结果状态页面先关闭结果页面
        let closeResPage = async function () {
            me.base.getEleById('_canvas-box').style.display === 'block' && (me.base.getEleById('_canvas-box').style.display = 'none');
            await me.base.sleep();
        }
        this.base.addEventHandler(this.base.getEleById('_tool-redo'), 'click', redoFn);
        this.base.addEventHandler(this.base.getEleById('_tool-rotate'), 'click', rotateFn);
        this.base.addEventHandler(this.base.getEleById('_tool-select'), 'click', selectFn);
        this.base.addEventHandler(this.base.getEleById('_tool-ok'), 'click', confirmFn);

        // 4. 上下左右移动箭头按钮事件 _editor-top-arrow、_editor-bottom-arrow、_editor-left-arrow、_editor-right-arrow\_canvas-box、_editor-back-arrow
        let arrowChangeOp = function (type) {
            let step = Math.abs(options.disableTouchStepLen);
            switch (type) {
                case 'top':
                    me.store.rotateAngleStatus && me.updateImgChange('position', null, 'TB', - step);
                    break;
                case 'bottom':
                    me.store.rotateAngleStatus && me.updateImgChange('position', null, 'TB', step);
                    break;
                case 'left':
                    me.store.rotateAngleStatus && me.updateImgChange('position', null, 'LR', - step);
                    break;
                case 'right':
                    me.store.rotateAngleStatus && me.updateImgChange('position', null, 'LR', step);
                    break;
                case 'big':
                    me.updateImgChange('scale', 1.25);
                    // 触发hook
                    me.options.onScale('big');
                    break;
                case 'small':
                    me.updateImgChange('scale', .9);
                    // 触发hook
                    me.options.onScale('small');
                    break;
                default:
                    break;
            }
        };
        this.base.addEventHandler(this.base.getEleById('_editor-top-arrow'), 'click', () => {arrowChangeOp('top');});
        this.base.addEventHandler(this.base.getEleById('_editor-bottom-arrow'), 'click', () => {arrowChangeOp('bottom');});
        this.base.addEventHandler(this.base.getEleById('_editor-left-arrow'), 'click', () => {arrowChangeOp('left');});
        this.base.addEventHandler(this.base.getEleById('_editor-right-arrow'), 'click', () => {arrowChangeOp('right');});
        this.base.addEventHandler(this.base.getEleById('_editor-big-icon'), 'click', () => {arrowChangeOp('big');});
        this.base.addEventHandler(this.base.getEleById('_editor-small-icon'), 'click', () => {arrowChangeOp('small');});
        this.base.addEventHandler(this.base.getEleById('_editor-back-arrow'), 'click', () => {
            let downloadButton = me.base.getEleById('_download-button');
            let downloadTip = me.base.getEleById('_download-tip');
            downloadButton.disabled = false;
            me.base.removeClass(downloadButton, 'disabledCls');
            downloadButton.innerText = me.lang.downloadBtn;
            downloadTip.style.display = 'none';
            me.base.toggleShow(this.base.getEleById('_canvas-box'));
            downloadFlag = false;
        });

        // 编辑后的图片下载按钮
        this.base.addEventHandler(this.base.getEleById('_download-button'), 'click', () => {
            this.saveAsImage();
        });
    };
    // 绑定事件函数库（保证兼容性）
    bindEventStore(bindEle, eventType, customizeFn) {
        let me = this;
        // 点击事件处理
        let eventClickFn = function (e) {
            customizeFn && customizeFn(e);
            // 触发配置hook
            me.options.onClickHook(e, bindEle);
        };
        // 移动事件处理
        let eventMoveFn = function (e) {
            customizeFn && customizeFn(e);
            // 触发配置hook
            me.options.onMoveHook(e, bindEle);
        };
        // 接触结束事件处理
        let eventEndFn = function (e) {
            customizeFn && customizeFn(e);
            // 触发配置hook
            me.options.onEndHook(e, bindEle);
        };
        // 覆盖事件处理
        let eventEnterFn = function (e) {
            customizeFn && customizeFn(e);
            // 触发配置hook
            me.options.onEnterHook(e, bindEle);
        };
        if (!bindEle || !eventType) return;
        switch (eventType) {
            case 'click':
                addEventHandler(bindEle, 'touchstart', eventClickFn);
                addEventHandler(bindEle, 'mousedown', eventClickFn);
                // 针对pc
                addEventHandler(bindEle, 'mouseenter', eventEndFn);
                break;
            case 'move':
                addEventHandler(bindEle, 'touchmove', eventMoveFn);
                addEventHandler(bindEle, 'mousemove', eventMoveFn);
                break;
            case 'end':
                addEventHandler(bindEle, 'touchend', eventEndFn);
                addEventHandler(bindEle, 'mouseup', eventEndFn);
                addEventHandler(bindEle, 'touchcancel', eventEndFn);
                break;
            case 'enter':
                addEventHandler(bindEle, 'mouseenter', eventEnterFn);
                break;
            default:
                break;
        };
    };
    // 检查端
    mobilecheck() {
        try {
            let platform = navigator.platform || 'Win';
            if (/Android|webOS|iPhone|iPod|iPad|BlackBerry/i.test(navigator.userAgent)) {
                this.wapsetconfig();
            }
            // 如果是mac 在判断是否支持touchmove （ios13 ipad safari浏览器UA显示mac）以下三个条件都满足的就是UA有问题的ipad设备
            else if (platform.indexOf('Mac') > -1
                && ('ontouchend' in document)) {
                this.wapsetconfig();
            }
            // 兼容支持触屏的pc电脑 （surface）
            else if ('ontouchend' in document
                && platform.indexOf('Win') === -1 && platform.indexOf('Mac') === -1) {
                this.wapsetconfig();
            }
            else {
                this.pcsetconfig();
            }
        }
        catch (error) {
            this.wapsetconfig();
        }
    };
    // 移动端设置
    wapsetconfig() {
        this.devicetype = 'wap';
        this.eventclick = 'touchstart';
        this.eventmove = 'touchmove';
        this.eventend = 'touchend';
        this.eventend2 = 'touchcancel';
    };
    // pc端设置
    pcsetconfig() {
        this.devicetype = 'pc';
        this.eventclick = 'mousedown';
        this.eventmove = 'mousemove';
        this.eventend = 'mouseup';
    };
    initData() {
        // 获取设备宽高
        let {w, h} = this.base.getSViewportOffset();
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
        // console.log('initData:', this.store);
        this.setImgBoxWH();
        this.initSize();
    };
    // 处理裁剪框尺寸
    setImgBoxWH() {
        let me = this;
        let useSize = me.store.editorbox.value;
        let open = me.store.editorbox.open;
        switch(me.options.editrBoxModel) {
            case 'small':
                me.store.width =  me.store.minwidth;
                me.store.height = me.store.minheight;
                if (open && useSize >= 1) {
                    let width = me.store.width * useSize > me.store.maxwidth ? me.store.maxwidth : me.store.width * useSize;
                    let height = me.store.height * useSize > me.store.maxheight ? me.store.maxheight : me.store.height * useSize;
                    me.store.width =  width;
                    me.store.height = height;
                };
                break;
            case 'big':
                me.store.width =  me.store.maxwidth;
                me.store.height = me.store.maxheight;
                if (open && useSize < 1 && useSize > 0) {
                    let width = me.store.width * useSize < me.store.minwidth ? me.store.minwidth : me.store.width * useSize;
                    let height = me.store.height * useSize < me.store.minheight ? me.store.minheight : me.store.height * useSize;
                    me.store.width =  width;
                    me.store.height = height;
                };
                break;
            default:
                if (open && useSize < 1 && useSize > 0) {
                    let width = me.store.width * useSize < me.store.minwidth ? me.store.minwidth : me.store.width * useSize;
                    let height = me.store.height * useSize < me.store.minheight ? me.store.minheight : me.store.height * useSize;
                    me.store.width =  width;
                    me.store.height = height;
                } else if (open && useSize >= 1) {
                    let width = me.store.width * useSize > me.store.maxwidth ? me.store.maxwidth : me.store.width * useSize;
                    let height = me.store.height * useSize > me.store.maxheight ? me.store.maxheight : me.store.height * useSize;
                    me.store.width =  width;
                    me.store.height = height;
                };
                break;
        };
    };
    // 初始化尺寸
    initSize() {
        let me = this;
        // 设置编辑器body尺寸
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
        this.base.getEleById('_editor-box').style= `width:${this.store.width}px;height:${this.store.height}px;`;
        if (+this.store.equipmentW <= 460) {
            this.base.getEleById('_editor-middle-box').style = `width:${this.store.equipmentW * this.store.editorProportion}px;height:${this.store.height}px`;
            this.base.getEleById('_editor-right').style = `width:${(this.store.equipmentW * this.store.editorProportion - this.store.width) / 2}px;`;
            this.base.getEleById('_editor-left').style = `width:${(this.store.equipmentW * this.store.editorProportion - this.store.width) / 2}px;`;
            this.base.getEleById('_editor-bottom').style = `width:${this.store.equipmentW * this.store.editorProportion}px;
                                                            height:${((this.store.equipmentW * this.store.editorProportion) / this.store.editorWH - this.store.height) / 2}px`;
            this.base.getEleById('_editor-top').style = `width:${this.store.equipmentW * this.store.editorProportion}px;
                                                        height:${((this.store.equipmentW * this.store.editorProportion) / this.store.editorWH - this.store.height) / 2}px`;
            // 更新数据
            this.store.trimmingBoxleft = (this.store.equipmentW * this.store.editorProportion - this.store.width) / 2;
            this.store.trimmingBoxright = (this.store.equipmentW * this.store.editorProportion - this.store.width) / 2;
            this.store.trimmingBoxTop = ((this.store.equipmentW * this.store.editorProportion) / this.store.editorWH - this.store.height) / 2;
            this.store.trimmingBoxBottom = ((this.store.equipmentW * this.store.editorProportion) / this.store.editorWH - this.store.height) / 2;
        }
        else {
            this.base.getEleById('_editor-middle-box').style = `width:${this.options.editorW}px;height:${this.store.height}px`;
            this.base.getEleById('_editor-right').style = `width:${(this.options.editorW - this.store.width) / 2}px;`;
            this.base.getEleById('_editor-left').style = `width:${(this.options.editorW - this.store.width) / 2}px;`;
            this.base.getEleById('_editor-bottom').style = `width:${this.options.editorW}px;
                                                            height:${(this.options.editorH - this.store.height) / 2}px`;
            this.base.getEleById('_editor-top').style = `width:${this.options.editorW}px;
                                                        height:${(this.options.editorH - this.store.height) / 2}px`;
                // 更新数据
                this.store.trimmingBoxleft = (this.options.editorW - this.store.width) / 2;
                this.store.trimmingBoxright = (this.options.editorW - this.store.width) / 2;
                this.store.trimmingBoxTop = (this.options.editorH - this.store.height) / 2;
                this.store.trimmingBoxBottom = (this.options.editorH - this.store.height) / 2;
        };
        // 图片居中
        !me.base.getEleById('_editor-img').crossOrigin && (me.base.getEleById('_editor-img').crossOrigin = "Anonymous");
        me.setImgCenter();
        me.store.rotateAngleStatus = true;
    };
    // 图片变化更新 方向
    updateImgChange(type, scaleNum, directionType, directionNum) {
        let imgElem = this.base.getEleById('_editor-img');
        let me = this;
        var currentTransform;
        me.updateStore();
        switch (type) {
            case 'position':
                // 从新组合
                let afterImgLeft,
                    afterImgTop;
                // 变化后的imgLeft、imgTop
                if (me.options.disableTouch && directionType && directionNum) {
                    switch (directionType) {
                        case 'TB':
                            afterImgTop = me.store.imgTop + directionNum;
                            afterImgLeft = me.store.imgLeft;
                            break;
                        case 'LR':
                            afterImgLeft = me.store.imgLeft + directionNum;
                            afterImgTop = me.store.imgTop;
                            break;
                        default:
                            break;
                    };
                }
                else {
                    if (me.store.imgMoveFinish || !me.store.imgMoveStart) return;
                    afterImgLeft = me.store.imgLeft + me.store.imgTransForXY.x;
                    afterImgTop = me.store.imgTop + me.store.imgTransForXY.y;
                };
                // console.log('position=>', me.store.imgLeft, afterImgLeft, me.store.imgTop, afterImgTop);
                currentTransform = `translate3d(${afterImgLeft}px, ${afterImgTop}px, 0) scale(${me.store.imgScale}) rotate(${me.store.rotateAngle}deg)`;
                imgElem.style.transform = currentTransform;
                // 更新数据
                me.store.imgLeft = afterImgLeft;
                me.store.imgTop = afterImgTop;
                me.detectionImgPos();
                break;
            case 'scale':
                let resSacle = (scaleNum === 0) ? 1 : me.store.imgScale * scaleNum;
                // 更新数据
                // 实际允许缩小的比例
                let minHW = Math.min(me.store.imgHeight, me.store.imgWidth);
                let minScaleNum  = Math.max(me.store.width, me.store.height) / minHW;
                (+minScaleNum > +me.options.imgMinScale) && (me.options.imgMinScale = minScaleNum);
                if (+resSacle > me.options.imgMaxScale) {
                    me.store.imgScale = me.options.imgMaxScale;
                }
                else if (+resSacle < me.options.imgMinScale) {
                    me.store.imgScale = me.options.imgMinScale;
                }
                else {
                    me.store.imgScale = resSacle;
                };
                me.store.mapRealCutProportion = me.store.imgOriginScaleNum * me.store.imgScale;
                currentTransform = me.base.getEleById('_editor-img').style.transform;
                let reg = /(\s|^)scale\((\d*\.?\d*)\)(\s|$)/g;
                if (reg.test(currentTransform)) {
                    currentTransform = currentTransform.replace(reg, '');
                };
                currentTransform += ` scale(${me.store.imgScale})`;
                me.base.getEleById('_editor-img').style.transform = currentTransform;
                // 检测图片边缘
                me.detectionImgPos();
                break;
            default:
                console.log('操作错误');
                break;
        }
    };
    // 图片居中
    setImgCenter(type) {
        let me = this;
        let imgTop;
        let imgLeft;
        let setCenterFn = function (callback) {
            // 根据编辑器body宽高比例调整img实际尺寸
            let imgOriginWH, imgOriginScaleNum;
            let editorBodyWH = parseInt(me.base.getEleById('_editor-body').style.width) / parseInt(me.base.getEleById('_editor-body').style.height);
            let tempImgElm = new Image();
            tempImgElm.src = me.options.uploadImg;
            tempImgElm.onload = function () { 
                me.store.imgOriginWH = imgOriginWH = tempImgElm.width / tempImgElm.height;
                if (editorBodyWH > imgOriginWH) {
                    me.base.getEleById('_editor-img').style.height = '100%';
                    me.base.getEleById('_editor-img').style.width = 'auto';
                    me.store.imgOriginScaleNum = imgOriginScaleNum = me.base.getEleById('_editor-img').height / tempImgElm.height;
                }
                else {
                    me.store.imgOriginScaleNum = imgOriginScaleNum = me.base.getEleById('_editor-img').width / tempImgElm.width;
                };
                me.store.imgWidth = me.store.initImgEleWidth = tempImgElm.width * me.store.imgOriginScaleNum;
                me.store.imgHeight = me.store.initImgEleHeight = tempImgElm.height * me.store.imgOriginScaleNum;

                // 初始化居中
                if (editorBodyWH > imgOriginWH) {
                    // 图片平移距离
                    if (+me.store.equipmentW <= 460) {
                        imgTop = 0;
                        imgLeft = (me.store.equipmentW * me.store.editorProportion - me.store.imgWidth) / 2;;
                    }
                    else {
                        imgTop = 0;
                        imgLeft = (me.options.editorW - me.store.imgWidth) / 2;
                    };
                }
                else {
                    // 图片平移距离
                    if (+me.store.equipmentW <= 460) {
                        imgTop = ((me.store.equipmentW * me.store.editorProportion) / me.store.editorWH - me.store.imgHeight) / 2;
                        imgLeft = 0;
                    }
                    else {
                        imgTop = (me.options.editorH - me.store.imgHeight) / 2;
                        imgLeft = 0;
                    };
                };
                // 更新数据
                me.store.imgLeft = imgLeft;
                me.store.imgTop= imgTop;
                tempImgElm = null;
                callback && callback();
            };
        };
        if (!type) {
            setCenterFn(async function () { 
                me.base.getEleById('_editor-img').style.transform = `translate3d(${me.store.imgLeft}px, ${me.store.imgTop}px, 0) scale(${me.store.imgScale})`;
                await me.base.sleep(1000);
                me.detectionImgScale('init');
                me.detectionImgPos();
            });
        }
        else if (type && type === 'center') {
            setCenterFn(function () { 
                me.base.getEleById('_editor-img').style.transform = `translate3d(${me.store.imgLeft}px, ${me.store.imgTop}px, 0) scale(${me.store.imgScale})`;
                me.base.getEleById('_editor-img').style.transition = `none`;
                me.detectionImgScale();
            });
            me.store.rotateAngle = 0;
            setTimeout(_ => {
                me.base.getEleById('_editor-img').style.transform = `translate3d(${me.store.imgLeft}px, ${me.store.imgTop}px, 0) scale(${me.store.imgScale})`;
                me.base.getEleById('_editor-img').style.transition = `all .1s linear`;
            }, 300);
        }
        else if (type && type === 'rotate') {
            setCenterFn(function () { 
                me.base.getEleById('_editor-img').style.transform = `translate3d(${me.store.imgLeft}px, ${me.store.imgTop}px, 0) scale(${me.store.imgScale})`;
                me.detectionImgPos();
            });
            // 更新数据
            me.store.rotateAngle = me.store.rotateAngle + 90;
            // 标记现在是旋转状态且不为正
            me.store.rotateAngleStatus = false;
            if (me.store.rotateAngle % 360 === 0) {
                me.store.rotateAngleStatus = true;
            };
            // 如果当前已经旋转为正了就支持移动操作，否者不支持移动，只支持缩放和旋转
            if (!me.store.rotateAngleStatus && me.options.disableTouch) {
                    me.base.getEleById('_editor-2-arrowBox').style.opacity = '0';
            } else if (me.store.rotateAngleStatus && me.options.disableTouch) {
                me.base.getEleById('_editor-2-arrowBox').style.opacity = '1';
            };
            let currentTransform = me.base.getEleById('_editor-img').style.transform;
            let reg = /(\s|^)rotate\((\d*)deg\)(\s|$)/g;
            if (reg.test(currentTransform)) {
                currentTransform = currentTransform.replace(reg, '');
            };
            currentTransform += ` rotate(${me.store.rotateAngle}deg)`;
            me.base.getEleById('_editor-img').style.transform = currentTransform;
            me.detectionImgPos();
        };
    };
    // 检图片边缘---位置
    detectionImgPos(type) {
        let me = this;
        let imgElem = this.base.getEleById('_editor-img');
        if (this.store.limitMove) {
            return;
        };
        // 更新相关的数据
        me.updateStore();
        let left = me.store.imgLeft + me.store.imgWidth / 2;
        let top = me.store.imgTop + me.store.imgHeight / 2;
        let scale = me.store.imgScale;
        let imgWidth = me.store.imgWidth;
        let imgHeight = me.store.imgHeight;
        if (me.store.rotateAngle / 90 % 2) {
            imgWidth = me.store.imgHeight;
            imgHeight = me.store.imgWidth;
        };
        left = me.store.trimmingBoxleft + imgWidth * scale / 2 >= left
            ? left : me.store.trimmingBoxleft + imgWidth * scale / 2;
        left = me.store.trimmingBoxleft + me.store.width - imgWidth * scale / 2 <= left
            ? left : me.store.trimmingBoxleft + me.store.width - imgWidth * scale / 2;
        top = me.store.trimmingBoxTop + imgHeight * scale / 2 >= top
            ? top : me.store.trimmingBoxTop + imgHeight * scale / 2;
        top = me.store.trimmingBoxTop + me.store.height - imgHeight * scale / 2 <= top
            ? top : me.store.trimmingBoxTop + me.store.height - imgHeight * scale / 2;
        // 更新数据
        me.store.imgLeft = left - me.store.imgWidth / 2;
        me.store.imgTop = top - me.store.imgHeight / 2;
        // console.log('ok====>', me.store.imgLeft, me.store.imgTop, me.store.trimmingBoxleft, me.store.trimmingBoxTop, me.store.imgToCanvasX, me.store.imgToCanvasY)
        me.base.getEleById('_editor-img').style.transform = `translate3d(${me.store.imgLeft}px, ${me.store.imgTop}px, 0) scale(${me.store.imgScale}) rotate(${me.store.rotateAngle}deg)`;
    };
    // 检图片边缘---缩放
    detectionImgScale(init) {
        let me = this;
        let scale = this.store.imgScale;
        this.updateStore();
        let imgWidth = this.store.imgWidth;
        let imgHeight = this.store.imgHeight;
        // 根据图片width进行判断
        if (imgWidth && imgWidth * scale < this.store.width) {
            scale = this.store.width / imgWidth;
        };
        if (imgHeight && imgHeight * scale < this.store.height) {
            scale = Math.max(scale, this.store.height / imgHeight);
        };
        me.store.imgScale = scale;
        me.store.mapRealCutProportion = me.store.imgOriginScaleNum * me.store.imgScale;
        let currentTransform = me.base.getEleById('_editor-img').style.transform;
        let reg = /(\s|^)scale\((\d*\.?\d*)\)(\s|$)/g;
        if (reg.test(currentTransform)) {
            currentTransform = currentTransform.replace(reg, '');
        };
        currentTransform += ` scale(${me.store.imgScale})`;
        me.base.getEleById('_editor-img').style.transform = currentTransform;
        // 将首次初始化好的图片存起来一份
        if (init && !me.store.initImgEle) {
            let cloneToStoreImg = me.base.getEleById('_editor-img').cloneNode(true);
            me.store.initImgEle = cloneToStoreImg;
        };
    };
    // 更新store中的数据
    updateStore() {
        let me = this;
        // 更新图片的宽高
        this.store.imgWidth = parseInt(me.base.getEleById('_editor-img').width);
        this.store.imgHeight = parseInt(me.base.getEleById('_editor-img').height);
        // 更新剪裁框的宽高
        this.store.width = parseInt(me.base.getEleById('_editor-box').style.width);
        this.store.height = parseInt(me.base.getEleById('_editor-box').style.height);
        // 更新最新的裁剪框上下左右位置
        this.store.trimmingBoxleft = parseInt(me.base.getEleById('_editor-left').style.width);
        this.store.trimmingBoxright = parseInt(me.base.getEleById('_editor-right').style.width);
        this.store.trimmingBoxTop = parseInt(me.base.getEleById('_editor-top').style.height);
        this.store.trimmingBoxBottom = parseInt(me.base.getEleById('_editor-bottom').style.height);
    };
    // 获取并更新特定的对应属性值
    getCorrespondVal(type) {
        if (!type) return null;
        switch (type) {
            case 'imgTransLT':
                let currentImgTransform = me.base.getEleById('_editor-img').style.transform;
                break;
            case 'test':
                break;
            default:
                console.log('getCorrespondVal err');
                break;
        }
    };
    // 裁剪框
    updateEditorBoxChange() {};
    // canvas绘制
    draw() {
        let me = this;
        let img = me.base.getEleById('_editor-img');
        let canvas = me.base.getEleById('_canvas');
        canvas.width = me.store.width;
        canvas.height = me.store.height;
        let ctx = canvas.getContext("2d");
        let currentScaleNum = me.store.imgScale * me.store.imgOriginScaleNum;
        // 形变函数
        /**
         * @param  ctx:  画布
         * @param  img:  图片
         * @param  x     最终渲染x轴坐标
         * @param  y     最终渲染y轴坐标
         * @param  width     图片原始w
         * @param  height    图片原始h
         * @param  scale     缩放比例
         * @param  rotate     旋转角度
         */
        let transformFn = async function (ctx, img, imgx, imgy, imgwidth, imgheight, dx, dy, dwidth, dheight, scale, rotate, callback) {
            currentScaleNum = scale * me.store.imgOriginScaleNum;
            imgwidth = imgwidth / currentScaleNum;
            imgheight = imgheight / currentScaleNum;
            // 切换画布中心点->旋转画布->切回画布原来中心点// 此时画布已经旋转过
            ctx.translate(dx + dwidth / 2, dy + dheight / 2);
            let degrees =  rotate * Math.PI / 180;
            ctx.rotate(degrees);
            ctx.translate(-(dx + dwidth / 2), -(dy + dheight / 2));
            ctx.drawImage(img, imgx, imgy, imgwidth, imgheight, dx, dy, dwidth, dheight);
            filterFn(ctx, dx, dy, dwidth, dheight);
            me.base.getEleById('_loading-box').style.display = 'block';
            await me.base.sleep();
            me.base.getEleById('_canvas-box').style.display = 'block';
            me.base.getEleById('_loading-box').style.display = 'none';
            // callback();
        };

        // 滤镜函数
        let filterFn = function(_ctx, dx, dy, dwidth, dheight) {
            let imgData = _ctx.getImageData(dx, dy, dwidth, dheight);
            let data = imgData.data;//每个像素的data是个数组（红，绿，蓝，透明度）
            switch (me.store.imgFilter.style) {
                case 'rv':
                    // 反转滤镜
                    //遍历每个像素
                    for (let i = 0; i < data.length; i += 4) {
                        data[i + 0] = 255 - data[i + 0];
                        data[i + 1] = 255 - data[i + 1];
                        data[i + 2] = 255 - data[i + 2];
                        //这里只反转颜色，不管透明度
                    };
                    break;
                case "bw":
                    // 黑白滤镜
                    for (let i = 0; i < data.length; i += 4) {
                        let bwNum = +me.store.imgFilter.bwNum;
                        let average = (data[i + 0] + data[i + 1] + data[i + 2] + data[i + 3]) / 3 + bwNum;
                        data[i + 0] = average;   //红
                        data[i + 1] = average;   //绿
                        data[i + 2] = average;   //蓝
                    }
                    break;
                case 'lt':
                    // 调整亮度滤镜
                    // let ltNum = +me.store.imgFilter.ltNum > 255 ? 255 : +me.store.imgFilter.ltNum < 0 ? 0 : +me.store.imgFilter.ltNum;
                    let ltNum = +me.store.imgFilter.ltNum;
                    for (let i = 0; i < data.length; i += 4) {
                        data[i + 0] += ltNum;
                        data[i + 1] += ltNum;
                        data[i + 2] += ltNum;
                    };
                    break;
                case 'mk':
                    // 蒙层滤镜
                    let mkType = me.store.imgFilter.mkType;
                    let mkTypeNum = me.store.imgFilter.mkTypeNum;
                    let ljf_type,
                        ljf_num;
                    if (mkTypeNum && mkTypeNum.indexOf('_') !== -1) {
                        ljf_type = mkTypeNum.split('_')[0];
                        ljf_num = isNaN(mkTypeNum.split('_')[1]) ? 0 : +mkTypeNum.split('_')[1];
                    };
                    for (let i = 0; i < data.length; i += 4) {
                        let r = data[i + 0];
                        let g = data[i + 1];
                        let b = data[i + 2];
                        let average = (r + g + b) / 3;
                        if (mkType === 'red') {
                            data[i + 1] = 0;
                            data[i + 2] = 0;
                            data[i + 0] = average;
                        } else if (mkType === 'green') {
                            data[i + 1] = average;
                            data[i + 0] = 0;
                            data[i + 2] = 0;
                        } else if (mkType === 'blue') {
                            data[i + 2] = average;
                            data[i + 0] = 0;
                            data[i + 1] = 0;
                        } else {
                            data[i + 2] = 0;
                            data[i + 0] = average;
                            data[i + 1] = 0;
                        };
                        (ljf_type === 'r') && (data[i + 0] += ljf_num);
                        (ljf_type === 'g') && (data[i + 1] += ljf_num);
                        (ljf_type === 'b') && (data[i + 2] += ljf_num);
                    };
                    break;
                default:
                    break;
            };
            //在指定位置输出图片
            _ctx.putImageData(imgData, 0, 0, dx, dy, dwidth, dheight);
        };
        me.updateStore();
        me.store.mapRealCutProportionXDif = me.store.initImgEleWidth * (me.store.imgScale - 1);
        me.store.mapRealCutProportionYDif = me.store.initImgEleHeight * (me.store.imgScale - 1);
        me.store.imgToCanvasX = (me.store.trimmingBoxleft - me.store.imgLeft) / me.store.mapRealCutProportion
                                + me.store.mapRealCutProportionXDif * 0.5 / currentScaleNum;
        me.store.imgToCanvasY = (me.store.trimmingBoxTop - me.store.imgTop) / me.store.mapRealCutProportion
                                + me.store.mapRealCutProportionYDif * 0.5 / currentScaleNum;
        transformFn(ctx, img, me.store.imgToCanvasX, me.store.imgToCanvasY, me.store.width, me.store.height, 0, 0, me.store.width,  me.store.height, me.store.imgScale, me.store.rotateAngle);
    };
    // 将canvas转化成图片 下载
    saveAsImage() {
        if (downloadFlag) {
            return false;
        };
        let me = this;
        try {
            let canvas = me.base.getEleById('_canvas');
            let downloadTip =  me.base.getEleById('_download-tip');
            let downloadBtn =  me.base.getEleById('_download-button');
            let image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
            let a = document.createElement("a");
            a.id = 'link';
            document.body.appendChild(a);
            let link = document.getElementById('link');
            link.setAttribute('download', Date.now() + '.png');
            link.setAttribute('href', image);
            link.click();
            document.body.removeChild(link);
            downloadTip.innerText = me.lang.downloadSuc;
            downloadTip.style = 'color: green;';
            downloadTip.style.display = 'block';
            downloadFlag = true;
            downloadBtn.disabled = 'true';
            downloadBtn.innerText= me.lang.downloadBtned;
            me.base.addClass(downloadBtn, 'disabledCls');
        } catch (error) {
            downloadTip.innerText = me.lang.downloadFail;
            downloadTip.style = 'color: red;'
            me.base.toggleShow(downloadTip);
            downloadTip.style.display = 'block';
        };
    };
};
})(window);