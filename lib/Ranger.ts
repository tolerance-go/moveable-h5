export interface RangerOptions {
  id: string;
  start: number;
  end: number;
}

class Ranger {

  static Extra: number = 100;

  id: string;

  start: number;

  end: number;

  constructor(options: RangerOptions) {
    const { id, start, end } = options;
    this.id = id;
    this.start = start;
    this.end = end;
  }

  inRange(tick) {
    return tick >= this.start - Ranger.Extra && tick <= this.end + Ranger.Extra;
  }

  export() {
    return {
      id: this.id,
      start: this.start,
      end: this.end,
    };
  }
}

export default Ranger;
