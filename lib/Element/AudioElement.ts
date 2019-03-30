import { ValueOf } from '../class';
import { step } from '../interpolation';
import Stage from '../Stage';
import { Element, ElementAttr, ElementOption } from './Element';

export interface AudioOption extends ElementOption {
  attrs: AudioAttr[];
}

export interface AudioAttr extends ElementAttr {
  volume: number;
  src: string;
}

export type AudioAttrName = keyof AudioAttr;

export type AudioAttrValue = ValueOf<AudioAttr>;

class AudioElement extends Element {
  type = 'audio';

  audioContext: AudioContext = null;

  bufferSource: AudioBufferSourceNode = null;

  isStart = false;

  cacheTextStyleId: number;

  attrs: AudioAttr[];

  cacheImageUrl: string;

  played: boolean = false;

  started: boolean = false;

  gainNode = null;

  cacheVolume = null;

  constructor(options: AudioOption) {
    super(options);
  }

  decodeAudioData(arrayBuffer): Promise<AudioBuffer> {
    return new Promise((resolve, reject) => {
      this.audioContext.decodeAudioData(arrayBuffer, buffer => {
        if (!buffer) {
          return reject('decodeAudioData fail');
        } else {
          resolve(buffer);
        }
      });
    });
  }

  initialAudioContext = async audioBuffer => {
    try {
      const _window: any = window;
      this.audioContext = new (_window.AudioContext ||
        _window.webkitAudioContext ||
        _window.mozAudioContext ||
        _window.msAudioContext)();

      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);

      this.bufferSource = this.audioContext.createBufferSource();
      const buffer = await this.decodeAudioData(audioBuffer);
      this.bufferSource.buffer = buffer;
      this.bufferSource.loop = false;
      this.bufferSource.connect(this.audioContext.destination);
      this.bufferSource.connect(this.gainNode);
      return true;
    } catch (error) {
      return false;
    }
  };

  paly() {
    if (this.cacheVolume !== null) {
      this.gainNode.gain.value = this.cacheVolume;
      this.cacheVolume = null;
    }

    if (!this.played) {
      if (this.started) {
        this.audioContext.resume();
      } else {
        this.started = true;
        this.bufferSource.start();
      }

      this.played = true;
    }
  }

  pause() {
    if (this.played) {
      this.audioContext.suspend();
      this.played = false;
    }
  }

  updateAttr(pixiEle, attrName: AudioAttrName, attr: AudioAttrValue) {
    if (attrName === 'volume') {
      if (!this.gainNode) {
        this.cacheVolume = attr;
      }
      this.gainNode && (this.gainNode.gain.value = attr);
    }
  }

  fillAttrs(attrName: AudioAttrName, attrs: any[], length: number) {
    switch (attrName) {
      case 'volume':
        return step(attrs, length);
    }
    return [];
  }

  canPlay() {
    return !!this.audioContext;
  }

  onEnterStage(stage: Stage) {
    this.mounted = true;
    this.stage = stage;
    this.updatePixiEle(this.pixiEle, this.attrs[0]);
    if (this.canPlay() && !this.played) {
      this.paly();
    }
  }

  onLeaveStage(stage: Stage) {
    if (this.played) {
      this.pause();
    }
    this.mounted = false;
  }

  export() {
    return {
      id: this.id,
      enter: this.enter,
      leave: this.leave,
      attrs: this.attrs,
      hooks: this.hooks,
      type: 'audio',
      zIndex: this.zIndex,
    };
  }
}

export default AudioElement;
