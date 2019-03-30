import { ValueOf } from '../class';
import { chunk, step } from '../interpolation';
import { Element, ElementAttr, ElementAttrName, ElementAttrValue, ElementOption } from './Element';

export interface TextOption extends ElementOption {
  attrs: TextAttr[];
}

export interface TextAttr extends ElementAttr {
  text: string;
  style: {
    wordWrapWidth: number;
  };
  fontSize: number;
}

export type TextAttrName = keyof TextAttr;

export type TextAttrValue = ValueOf<TextAttr>;

class TextElement extends Element {
  type = 'text';

  pixiEle: PIXI.Text;

  cacheTextStyleId: number;

  attrs: TextAttr[];

  constructor(options: TextOption) {
    super(options);

    this.pixiEle = new PIXI.Text();

    this.pixiEle.anchor.set(0.5);
  }

  updateAttr(pixiEle, attrName: TextAttrName, attr: TextAttrValue) {
    super.updateAttr(pixiEle, attrName as ElementAttrName, attr as ElementAttrValue);

    if (attrName === 'text') {
      pixiEle.text = attr;
    }

    if (attrName === 'style') {
      const styleAttr = attr as TextAttrValue & { id: number };
      if (styleAttr.id === undefined || this.cacheTextStyleId !== styleAttr.id) {
        pixiEle.style = new PIXI.TextStyle(styleAttr as object);
        this.cacheTextStyleId = styleAttr.id;
      }
    }

    if (attrName === 'fontSize') {
      if (pixiEle.style.fontSize !== attr) {
        pixiEle.style.fontSize = attr;
      }
    }
  }

  fillAttrs(attrName: TextAttrName, attrs: any[], length: number) {
    switch (attrName) {
      case 'text':
        return chunk(attrs, length);
      case 'fontSize':
        return step(attrs, length);
      case 'style':
        return chunk(attrs, length).map((item, index) => {
          return {
            ...item,
            id: index,
          };
        });
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
      type: 'text',
      zIndex: this.zIndex,
    };
  }
}

export default TextElement;
