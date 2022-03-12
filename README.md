# imgEditor

#### 介绍
纯js的图片编辑器sdk
![输入图片说明](editorSDK/%E6%88%AA%E5%B1%8F2022-03-12%20%E4%B8%8B%E5%8D%8811.47.49.png)

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
    参数说明
|  参数 |  值类型 | 说明  |  是否必须 |
|---|---|---|---|
| module |  string |  传入dialog表示弹层模式，否则嵌入模式 |  是 |
|  id |  string |  图片编辑器主体挂在的节点的id，仅嵌入模式下有效，可不传 | 否  |
|  toolid |  string |  图片编辑工具bar挂在的节点的id，仅嵌入模式下有效，可不传 | 否  |
|  editorW |  number |  自定义图片编辑器的宽(仅视口>460px时候该配置生效，最佳适配宽高比是2:3) | 否  |
|  editorH |  number |  自定义图片编辑器的高(仅视口>460px时候该配置生效，最佳适配宽高比是2:3) | 否  |
|  editorProportion |  number |  编辑器主体的width（视口宽<460px生效，默认0.9） | 否  |
|  editorToolProportion |  number |  编辑器工具主体的width（视口宽<460px生效，默认0.9） | 否  |
|  disableTouch |  boolean |  是否禁用手指拖动功能，默认true | 否  |
|  editorWH |  number | 编辑器主体宽高比例（视口宽<460px生效，默认2/3适配最优） | 否  |
|  disableTouchStepLen |  number | 禁用手指拖动功能时自定义步长 单位px，默认值30 | 否  |
|  uploadImg |  string | 传入的图片url,现在暂时支持线上url | 是  |



    api说明
|  api |  说明  |  |   |
|---|---|---|---|
| onRender |  渲染组件时候触发的回调函数 |  |   |
|  onInit | 初始化阶段触发的回调  |   |   |
|  onScale | 缩放动作发生前触发的回调  |   |   |
|  onRedo | 撤销动作发生前触发的回调  |   |   |
|  onClickHook（e, element） |图片节点click事件事件时触发,可以获取当前事件节点和事件对象  |   |   |
|  onMoveHook（e, element） |图片节点move事件时触发,可以获取当前事件节点和事件对象  |   |   |
|  onEndHook（e, element） |图片节点结束接触时触发,可以获取当前事件节点和事件对象  |   |   |


#### 说明
 _**该jssdk代码完全原创，未复用他人代码成果，仅学习使用，请勿用于其他用途！欢迎学习交流，作者信息如下：
邮箱：2293188960@qq.com
微信：ZML15372285979**_ 
