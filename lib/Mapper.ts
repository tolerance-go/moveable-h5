import { scaleLinear } from 'd3-scale';
import { AttrName, ImageAttrValue } from './Element/Element';
import Ranger from './Ranger';

export interface TickMapperOption {
  attrName: AttrName;
  ranger: Ranger;
  values: ImageAttrValue[];
}

export abstract class Mapper {
  abstract getValue(...args: any[]): any;
  abstract inRange(...args: any[]): boolean;
}

class TickMapper extends Mapper {
  attrName: AttrName;
  ranger: Ranger;
  values: ImageAttrValue[];

  constructor(option: TickMapperOption) {
    super();
    const { attrName, ranger, values } = option;

    this.attrName = attrName;
    this.ranger = ranger;
    this.values = values;

    this.indexScale = scaleLinear()
      .domain([ranger.start, ranger.end])
      .range([0, values.length - 1 < 0 ? 0 : values.length - 1])
      .clamp(true);
  }

  indexScale: (domain: number) => number;

  getValue(tick: number) {
    const val = this.values[Math.round(this.indexScale(tick))];
    return val;
  }

  inRange(tick) {
    return this.ranger.inRange(tick);
  }
}

export default TickMapper;
