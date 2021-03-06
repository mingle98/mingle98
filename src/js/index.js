import './editor';
import '../css/index.css';

const options = {
  // 弹窗模式或则嵌入模式
  module: 'dialog1',
  // 主体编辑器容器id
  id: 'editorBox',
  // 编辑器工具容器id
  toolid: 'toolBox',
  // 嵌入模式下自定义编辑器主体宽高（最佳适配比例是2:3）（视口宽>460px生效）
  editorW: 400,
  editorH: 600,
  // 编辑器主体的width（视口宽<460px生效，默认0.9）
  editorProportion: 0.9,
  // 编辑器工具主体的width（视口宽<460px生效，默认0.9）
  // editorToolProportion: 0.6,
  // 编辑器主体宽高比例（视口宽<460px生效，默认2/3）
  editorWH: 2 / 3,
  // 裁剪框尺寸模式 默认模式上default（小屏是设备尺寸的0.7)、小尺寸模式samll（小屏是设备尺寸的0.4）、大尺寸模式big（小屏是设备尺寸的0.9）
  editrBoxModel: 'default',
  // 是否禁用手指拖动功能
  disableTouch: true,
  // 禁用手指拖动功能时自定义步长 单位px
  disableTouchStepLen: 40,
  // 传入的图片
  // uploadImg: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Flmg.jj20.com%2Fup%2Fallimg%2F1113%2F061H0105942%2F20061G05942-6-1200.jpg&refer=http%3A%2F%2Flmg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1646912102&t=f9ada21c8724ba0a36aaafd908f31a23',
  uploadImg: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fblog%2F202012%2F04%2F20201204182229_e1a0a.thumb.1000_0.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1638869603&t=0ac37cac7c77e0e7253f4f0c8d6d8851',
  // uploadImg: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201608%2F12%2F20160812204518_SyX8M.thumb.700_0.jpeg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1638869925&t=47cfa3559bb538068255d6bee03a379a',
  // 渲染页面时触发hook
  onRender() {
    console.log('render....');
  },
  onInit() {
    console.log('init...');
  },
  // 缩放动作发生前触发
  onScale() {
    console.log('onScale...');
  },
  // 撤销动作发生前触发
  onRedo() {
    console.log('onRedo...');
  },
  // 发生节点事件d对应事件触发时触发,可以获取当前事件节点和事件对象
  onClickHook() {
    console.log('onClickHook...');
  },
  onMoveHook() {
    console.log('onMoveHook...');
  },
  onEndHook() {
    console.log('onEndHook...');
  },
};
window.mingleSDK && window.mingleSDK.initImgEditor(options);
