# imgEditor

#### 介绍
纯js的图片编辑器sdk

#### 软件架构
纯javascript技术实现


#### 安装教程

1. 先在您需要的html中引入editor.js文件和index.css文件
2. 在您的html准备两个div容器用于承载编辑器主体和工具栏主体，且容器需要有id用于挂件编辑器dom
3. 根据您的需要正确配置您需要的项目，并且实例化编辑器

#### 使用说明
具体配置demo如下：
```
         let options = {
                // 弹窗模式或则嵌入模式
                module: 'dialog1',
                // 主体编辑器容器id
                id: 'editorBox',
                // 编辑器工具容器id
                toolid: 'toolBox',
                editorW: 400,
                editorH: 600,
                // 编辑器主体的width（视口宽<460px生效，默认0.9）
                editorProportion: 0.9,
                // 编辑器工具主体的width（视口宽<460px生效，默认0.9）
                // editorToolProportion: 0.6,
                // 编辑器主体宽高比例（视口宽<460px生效，默认2/3）
                editorWH: 2 / 3,
                // 是否禁用手指拖动功能
                disableTouch: true,
                // 禁用手指拖动功能时自定义步长 单位px
                disableTouchStepLen: 40,
                // 传入的图片
                uploadImg: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fblog%2F202012%2F04%2F20201204182229_e1a0a.thumb.1000_0.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1638869603&t=0ac37cac7c77e0e7253f4f0c8d6d8851',
                // uploadImg: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201608%2F12%2F20160812204518_SyX8M.thumb.700_0.jpeg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1638869925&t=47cfa3559bb538068255d6bee03a379a',
                // 渲染页面时触发hook
                onRender: function () { 
                    console.log('render....');
                },
                onInit: function () { 
                    console.log('init...')
                },
                // 缩放动作发生前触发
                onScale: function () { 
                    console.log('onScale...')
                },
                // 撤销动作发生前触发
                onRedo: function () { 
                    console.log('onRedo...')
                },
                // 发生节点事件d对应事件触发时触发,可以获取当前事件节点和事件对象
                onClickHook: function () {
                    console.log('onClickHook...')
                },
                onMoveHook: function () {
                    console.log('onMoveHook...')
                },
                onEndHook: function () {
                    console.log('onEndHook...')
                }
            };

            let editorInstance = new ImgEditor(options);
```


#### 详细说明
|  参数 |  值类型 | 说明  |   |
|---|---|---|---|
| module |  string |  传入dialog表示弹层模式，否则嵌入模式 |   |
|   |   |   |   |





#### 特技

1.  使用 Readme\_XXX.md 来支持不同的语言，例如 Readme\_en.md, Readme\_zh.md
2.  Gitee 官方博客 [blog.gitee.com](https://blog.gitee.com)
3.  你可以 [https://gitee.com/explore](https://gitee.com/explore) 这个地址来了解 Gitee 上的优秀开源项目
4.  [GVP](https://gitee.com/gvp) 全称是 Gitee 最有价值开源项目，是综合评定出的优秀开源项目
5.  Gitee 官方提供的使用手册 [https://gitee.com/help](https://gitee.com/help)
6.  Gitee 封面人物是一档用来展示 Gitee 会员风采的栏目 [https://gitee.com/gitee-stars/](https://gitee.com/gitee-stars/)
