import { Size, ValueOf } from '../class';
import { chunk, spline } from '../interpolation';
import {
  Element,
  ElementAttr,
  ElementAttrName,
  ElementAttrValue,
  ElementOption,
  Hook,
} from './Element';

export type ImageAttrName = keyof ImageAttr;

export interface ImageOption extends ElementOption {
  attrs: ImageAttr[];
}

export interface ImageAttr extends ElementAttr {
  size: Size;
  imgUrl: string;
}

export interface ImageHook extends Hook {
  attrName: ImageAttrName;
}

export type ImageAttrValue = ValueOf<ImageAttr>;

class ImageElement extends Element {
  type = 'image';

  pixiEle: PIXI.Sprite;

  hooks: ImageHook[];

  cacheImageUrl: string;

  attrs: ImageAttr[];

  constructor(options: ImageOption) {
    super(options);
    this.pixiEle = new PIXI.Sprite();
    this.pixiEle.anchor.set(0.5);
  }

  updateAttr(pixiEle, attrName: ImageAttrName, attr: ImageAttrValue) {
    super.updateAttr(pixiEle, attrName as ElementAttrName, attr as ElementAttrValue);
    if (attrName === 'size') {
      pixiEle.width = (attr as Size).width;
      pixiEle.height = (attr as Size).height;
    }
    if (attrName === 'imgUrl' && this.cacheImageUrl !== (attr as string)) {
      pixiEle.texture = PIXI.Texture.fromImage(attr as string);
      this.setCacheImageUrl(attr as string);
    }
  }

  setCacheImageUrl(imgUrl: string) {
    this.cacheImageUrl = imgUrl;
  }

  fillAttrs(attrName: ImageAttrName, attrs: any[], length: number) {
    switch (attrName) {
      case 'size':
        return spline(attrs.map(item => ({ x: item.width, y: item.height })), length).map(item => ({
          width: item.x,
          height: item.y,
        }));
      case 'imgUrl':
        return chunk(attrs, length);
    }
    return super.fillAttrs(attrName as ElementAttrName, attrs, length);
  }

  export() {
    return {
      id: this.id,
      enter: this.enter,
      leave: this.leave,
      attrs: this.attrs,
      hooks: this.hooks,
      type: 'image',
      zIndex: this.zIndex,
    };
  }
}

export default ImageElement;
