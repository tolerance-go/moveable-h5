import { Point, ValueOf } from '../class';
import { spline, step } from '../interpolation';
import TickMapper, { Mapper } from '../Mapper';
import Stage from '../Stage';

export interface ElementOption {
  id: string;
  attrs: ElementAttr[];
  leave: number;
  enter: number;
  zIndex?: number;
  hooks?: Hook[];
}

export interface ElementAttr {
  position?: Point;
  skew?: Point;
  rotation?: number;
  alpha?: number;
}

export type ElementAttrValue = ValueOf<ElementAttr>;

export type ElementAttrName = keyof ElementAttr;

export interface StageLifeCyle {
  onUpdate: (attrName: ElementAttrName, attr: ElementAttrValue) => void;
  onEnterStage: (stage: Stage) => void;
  onLeaveStage: (stage: Stage) => void;
  onStageMount: (stage: Stage) => void;
}

export interface Hook {
  rangerId: string;
  attrName: string;
  length: number;
}

export abstract class Element implements StageLifeCyle {
  type: string;

  id: string;

  pixiEle: any;

  enter: number;

  leave: number;

  zIndex: number;

  attrs: ElementAttr[] = [];

  hooks: Hook[] = [];

  mappers: Mapper[] = [];

  mounted: boolean = false;

  stage: Stage;

  constructor(options: ElementOption) {
    const { id, attrs, enter, leave, zIndex, hooks = [] } = options;

    this.id = id;
    this.enter = enter;
    this.leave = leave;
    this.zIndex = zIndex;
    this.attrs = attrs;
    this.hooks = hooks;
  }

  onStageMount(stage: Stage) {
    const mappers = this.hooks.map(meta => {
      const { rangerId, attrName, length } = meta;
      const ranger = stage.getRanger(rangerId);

      const attrs = this.attrs.map(item => item[attrName]);
      const fillAttrs = this.fillAttrs(attrName, attrs, length);
      return new TickMapper({
        attrName,
        ranger,
        values: fillAttrs,
      });
    });
    this.mappers = mappers;
  }

  onUpdate(attrName: ElementAttrName, attr: ElementAttrValue) {
    this.updateAttr(this.pixiEle, attrName, attr);
  }

  onEnterStage(stage: Stage) {
    this.mounted = true;
    this.stage = stage;
    this.updatePixiEle(this.pixiEle, this.attrs[0]);
    stage.viewPort.addChild(this.pixiEle);
  }

  updatePixiEle(pixiEle, attr: ElementAttr) {
    for (const attrItem in attr) {
      this.updateAttr(pixiEle, attrItem as ElementAttrName, attr[attrItem]);
    }
  }

  updateAttr(pixiEle, attrName: ElementAttrName, attr: ElementAttrValue) {
    if (attrName === 'position') {
      pixiEle.position.x = (attr as Point).x;
      pixiEle.position.y = (attr as Point).y;
    }
    if (attrName === 'skew') {
      pixiEle.skew.x = (attr as Point).x;
      pixiEle.skew.y = (attr as Point).y;
    }
    if (attrName === 'rotation') {
      pixiEle.rotation = attr as number;
    }
    if (attrName === 'alpha') {
      pixiEle.alpha = attr as number;
    }
  }

  fillAttrs(attrName: ElementAttrName, attrs: any[], length: number) {
    switch (attrName) {
      case 'skew':
      case 'position':
        return spline(attrs, length);
      case 'rotation':
      case 'alpha':
        return step(attrs, length);
    }
  }

  onLeaveStage(stage: Stage) {
    stage.viewPort.removeChild(this.pixiEle);
    this.mounted = false;
  }

  hookRanger(hook: Hook) {
    this.hooks.push(hook);
  }

  inRange(tick) {
    return tick >= this.enter && tick <= this.leave;
  }

  abstract export(): void;
}

export default Image;
