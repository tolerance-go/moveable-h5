# Moveable

<a href="https://996.icu"><img src="https://img.shields.io/badge/link-996.icu-red.svg"></a>

受网易环保宣传 H5（[她在挣扎48小时后死去，无人知晓](https://c.m.163.com/nc/qa/activity/dada_protection/index.html?spssid=d5e997b4dba188b54fe6143b32fd12a2&spsw=25&spss=other)） 启发，该项目允许在网页及移动端运行一种 `根据浏览器滚动位置变化而变化页面`，底层使用 canvas 实现

# 思路

<div align=center>
<image src='./assets/intro.svg' width="750">
</div>

# 如何使用

clone 项目到本地，安装依赖后，执行 `yarn/npm run test:serve` 编译完成后，即可进入测试页面（[在线访问](https://tolerance-go.github.io/moveable-h5/)，[demo code](https://github.com/tolerance-go/moveable-h5/blob/master/pages/index.tsx)），库文件存放在 `lib` 仅供参考

```js
const stage = new Stage({
  worldSize: { width: 475, height: 1500 },
  direction: 'y',
  debug: true,
});

const text1 = new TextElement({
  id: 'text1',
  enter: 0,
  leave: Infinity,
  attrs: [
    {
      fontSize: 14,
      text: '文本1',
      style: {
        wordWrapWidth: 300,
      },
      position: { x: 100, y: 135 },
      skew: { x: 0, y: 0 },
      rotation: 0,
      alpha: 1,
    },
    {
      fontSize: 38,
      text: '文本1变换内容和样式',
      style: {
        wordWrapWidth: 300,
      },
      position: { x: 200, y: 450 },
      skew: { x: 0, y: 0 },
      rotation: 0,
      alpha: 1,
    },
  ],
  hooks: [
    { rangerId: 'ranger1', attrName: 'position', length: 500 },
    { rangerId: 'ranger1', attrName: 'fontSize', length: 500 },
    { rangerId: 'ranger1', attrName: 'text', length: 100 },
  ],
  zIndex: 1,
});

const image1 = new ImageElement({
  id: '1547308602934',
  enter: 0,
  leave: Infinity,
  attrs: [
    {
      size: { width: 50, height: 100 },
      position: { x: 300, y: 200 },
      imgUrl: `${PUBLIC_PATH}image/cat.png`,
      skew: { x: 0, y: 0 },
      rotation: 0,
      alpha: 1,
    },
    {
      size: { width: 150, height: 300 },
      position: { x: 400, y: 600 },
      imgUrl: `${PUBLIC_PATH}image/cat.png`,
      skew: { x: 0, y: 0 },
      rotation: 1,
      alpha: 1,
    },
  ],
  hooks: [
    { rangerId: 'ranger2', attrName: 'position', length: 500 },
    { rangerId: 'ranger1', attrName: 'size', length: 500 },
    { rangerId: 'ranger1', attrName: 'rotation', length: 500 },
  ],
  zIndex: 1,
});

const audio1 = new AudioElement({
  id: 'audio1',
  enter: 0,
  leave: Infinity,
  attrs: [
    {
      volume: 1,
      src: `${PUBLIC_PATH}audio/xjzw.mp3`,
    },
    {
      volume: -1,
      src: `${PUBLIC_PATH}audio/xjzw.mp3`,
    },
  ],
  hooks: [{ rangerId: 'ranger1', attrName: 'volume', length: 500 }],
  zIndex: 1,
});

const audio2 = new AudioElement({
  id: 'audio2',
  enter: 100,
  leave: Infinity,
  attrs: [
    {
      volume: 1,
      src: `${PUBLIC_PATH}audio/ghyjn.mp3`,
    },
    {
      volume: -1,
      src: `${PUBLIC_PATH}audio/ghyjn.mp3`,
    },
  ],
  hooks: [{ rangerId: 'ranger2', attrName: 'volume', length: 500 }],
  zIndex: 1,
});

const ranger1 = new Ranger({
  id: 'ranger1',
  start: 0,
  end: 200,
});

const ranger2 = new Ranger({
  id: 'ranger2',
  start: 100,
  end: 300,
});

stage.addRanger(ranger1);
stage.addRanger(ranger2);
stage.addElement(text1);
stage.addElement(image1);
stage.addElement(audio1);
stage.addElement(audio2);
```

# 感谢

- pixi-view.js
