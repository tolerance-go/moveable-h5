import Viewport from 'pixi-viewport';
import * as PIXI from 'pixi.js';
import { Direction, Point, Size } from './class';
import TickMapper from './Mapper';
import Ranger from './Ranger';
import { divided, multiplied, multipliedObject } from './utils';
import { Element } from './Element/Element';
import ImageElement, { ImageAttr } from './Element/ImageElement';
import TextElement, { TextAttr } from './Element/TextElement';
import AudioElement from './Element/AudioElement';
import Loader from './Loader';

export interface StageOptions {
  worldSize: Size;
  direction?: Direction;
  debug?: boolean;
}

class Stage {
  loader: Loader = new Loader();

  nodes: Element[] = [];

  audioElements: AudioElement[] = [];

  imageElements: ImageElement[] = [];

  textElements: TextElement[] = [];

  app: PIXI.Application = null;

  viewPort: Viewport = null;

  direction: Direction;

  debug: boolean;

  rangers: Ranger[] = [];

  mounted: boolean = false;

  worldSize: Size;

  radio: number;

  audioDatas: AudioBuffer[] = [];

  arrayBuffers: AudioBuffer[] = [];

  constructor(options: StageOptions) {
    const { direction = 'y', worldSize, debug = false } = options;

    this.direction = direction;

    this.debug = debug;

    this.worldSize = worldSize;

    this.initRadio();

    this.initApp(options);

    this.initViewPort(options);
  }

  initRadio() {
    if (this.direction === 'y') {
      this.radio = divided(window.innerWidth, this.worldSize.width);
    }
    if (this.direction === 'x') {
      this.radio = divided(window.innerHeight, this.worldSize.height);
    }
  }

  initApp(options: StageOptions) {
    this.app = new PIXI.Application({
      transparent: true,
      width: window.innerWidth,
      height: window.innerHeight,
      resolution: window.devicePixelRatio,
    });
  }

  initViewPort(options: StageOptions) {
    const { worldSize, direction } = options;
    const comWorldSize = this.getworldSize(worldSize, direction);
    console.log('comWorldSize', comWorldSize);

    this.viewPort = this.app.stage.addChild(
      new Viewport({
        interaction: this.app.renderer.plugins.interaction,
        passiveWheel: false,
        screenHeight: window.innerHeight,
        screenWidth: window.innerWidth,
        worldHeight: comWorldSize.height,
        worldWidth: comWorldSize.width,
      })
    );

    this.viewPort
      .drag({
        factor: 0.15,
      })
      // .pinch()
      .clamp({
        direction: 'all',
      })
      // .clampZoom({
      //   minWidth: window.innerWidth,
      //   minHeight: window.innerHeight,
      //   maxWidth: comWorldSize.width,
      //   maxHeight: comWorldSize.height,
      // })
      .decelerate({
        friction: 0.95,
        // minSpeed: 1,
        // bounce: 100
      });

    this.viewPort.on('moved', this.onViewPortMoved.bind(this));
  }

  getworldSize = (worldSize: Size, direction: Direction): Size => {
    if (direction === 'y') {
      return {
        width: window.innerWidth,
        height: multiplied(worldSize.height, this.radio),
      };
    }

    return {
      width: multiplied(worldSize.width, this.radio),
      height: window.innerHeight,
    };
  };

  loadAssets = () => {
    this.loader.init(
      this.imageElements.reduce((arr, el) => {
        return arr.concat(el.attrs.map(attr => attr.imgUrl));
      }, []),
      this.audioElements.map(item => item.attrs[0].src)
    );

    this.loader.listen(item => {
      console.log(item);
    });

    this.loader.start();
  };

  mount(container: HTMLElement) {
    this.loadAssets();

    this.loadAudio()
      .then(() => this.showUserPlayAudioButton())
      .catch(error => console.error(error));

    container.appendChild(this.app.view);
    this.app.view.style.position = 'fixed';
    this.app.view.style.width = window.innerWidth + 'px';
    this.app.view.style.height = window.innerHeight + 'px';
    this.app.view.style.top = '0px';
    this.app.view.style.left = '0px';

    this.mounted = true;
    this.nodes
      .sort((nodeA, nodeB) => nodeA.zIndex - nodeB.zIndex)
      .forEach(node => node.onStageMount(this));

    this.onViewPortMoved();

    if (this.debug) {
      this.launchDebug();
    }
  }

  addElement(element: Element) {
    if (this.mounted) {
      element.onStageMount(this);
    }

    element.enter = multiplied(this.radio, element.enter);
    element.leave = multiplied(this.radio, element.leave);
    element.attrs = element.attrs.map(attr => {
      if ((attr as any).text) {
        const imageAttr = attr as TextAttr;
        return {
          ...attr,
          fontSize: multiplied(this.radio, imageAttr.fontSize),
          position: multipliedObject(imageAttr.position, this.radio),
          style: {
            ...imageAttr.style,
            wordWrapWidth: multiplied(this.radio, imageAttr.style.wordWrapWidth),
          },
        };
      }

      if ((attr as any).size) {
        const imageAttr = attr as ImageAttr;
        return {
          ...attr,
          size: multipliedObject(imageAttr.size, this.radio),
          position: multipliedObject(imageAttr.position, this.radio),
        };
      }

      if ('volume' in attr) {
        return attr;
      }

      return {
        ...attr,
        position: multipliedObject(attr.position, this.radio),
      };
    });

    this.nodes.push(element);

    if (element.type === 'audio') {
      this.audioElements.push(element as AudioElement);
    }

    if (element.type === 'text') {
      this.textElements.push(element as TextElement);
    }

    if (element.type === 'image') {
      this.imageElements.push(element as ImageElement);
    }
  }

  addRanger(ranger: Ranger) {
    ranger.start = multiplied(this.radio, ranger.start);
    ranger.end = multiplied(this.radio, ranger.end);

    ranger.end =
      ranger.end - window.innerHeight < ranger.start ? ranger.end : ranger.end - window.innerHeight;

    this.rangers.push(ranger);
  }

  getRanger(id: string) {
    return this.rangers.find(item => item.id === id);
  }

  getNode(id: string) {
    return this.nodes.find(item => item.id === id);
  }

  onViewPortMoved() {
    const tick = this.getTick();
    this.nodes.forEach(node => {
      if (node.inRange(tick) && !node.mounted) {
        node.onEnterStage(this);
      }
      node.mappers.forEach((mapper: TickMapper) => {
        if (mapper.inRange(tick)) {
          node.onUpdate(mapper.attrName, mapper.getValue(tick));
        }
      });
      if (!node.inRange(tick) && node.mounted) {
        node.onLeaveStage(this);
      }
    });
  }

  getTick() {
    const { top, left } = this.viewPort;
    this.debug && console.log('this.viewPort.top', this.viewPort.top);
    if (this.direction === 'y') {
      return top < 0 ? 0 : top;
    } else {
      return left < 0 ? 0 : left;
    }
  }

  async loadAudio() {
    this.arrayBuffers = await Promise.all(
      this.audioElements.map((audioElement, index) => {
        return this.requestAudioData(audioElement.attrs[0].src);
      })
    );
  }

  requestAudioData(url) {
    return new Promise<AudioBuffer>((resolve, reject) => {
      let request = new XMLHttpRequest();
      request.open('GET', url, true);
      request.responseType = 'arraybuffer';
      request.onload = () => {
        resolve(request.response);
      };
      request.onerror = function() {
        reject('BufferLoader: XHR error');
      };
      request.send();
    });
  }

  showUserPlayAudioButton() {
    const openAudioElement = document.createElement('button');
    openAudioElement.style.position = 'fixed';
    openAudioElement.style.top = 15 + 'px';
    openAudioElement.style.right = 15 + 'px';
    openAudioElement.textContent = 'give audio';

    openAudioElement.onclick = async () => {
      await Promise.all(
        this.arrayBuffers.map((audioBuffer, index) =>
          this.audioElements[index].initialAudioContext(audioBuffer).then(result => {
            if (!result) return;
            if (this.audioElements[index].inRange(this.getTick())) {
              this.audioElements[index].paly();
            }
          })
        )
      );

      openAudioElement.onclick = null;
      document.body.removeChild(openAudioElement);
    };

    document.body.appendChild(openAudioElement);
  }

  launchDebug() {
    this.border(this.viewPort.position, {
      height: this.viewPort.worldHeight,
      width: this.viewPort.worldWidth,
    });
    this.border(this.viewPort.position, {
      height: this.viewPort.screenHeight,
      width: this.viewPort.screenWidth,
    });
  }

  line(x, y, width, height) {
    const line = this.app.stage.addChild(new PIXI.Sprite(PIXI.Texture.WHITE));
    line.tint = 0xff0000;
    line.position.set(x, y);
    line.width = width;
    line.height = height;
    return () => {
      this.app.stage.removeChild(line);
    };
  }

  border(position: Point, size: Size, thickness: number = 10) {
    const { width, height } = size;
    const { x, y } = position;
    const line1 = this.line(x, y, width, thickness);
    const line2 = this.line(x, y, thickness, height);
    const line3 = this.line(x + width - thickness, y, thickness, height);
    const line4 = this.line(x, y + height - thickness, width, thickness);
    return () => {
      line1();
      line2();
      line3();
      line4();
    };
  }
}

export default Stage;
