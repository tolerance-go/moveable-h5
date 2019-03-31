import React from 'react';
import Stage from '../lib/Stage';
import TextElement from '../lib/Element/TextElement';
import AudioElement from '../lib/Element/AudioElement';
import ImageElement from '../lib/Element/ImageElement';
import Ranger from '../lib/Ranger';

const PUBLIC_PATH = process.env.NODE_ENV === 'development' ? '/' : '/moveable-h5/';

export default class Test extends React.Component {
  componentDidMount = () => {
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

    if (document.readyState === 'complete') {
      stage.mount(document.body);
    } else {
      window.onload = () => {
        stage.mount(document.body);
      };
    }
  };

  render() {
    return (
      <a
        style={{ position: 'absolute', top: 15, left: 20, zIndex: 100 }}
        href="https://github.com/tolerance-go/moveable-h5"
      >
        github
      </a>
    );
  }
}
