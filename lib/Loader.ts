class Loader {
  private listeners: ((event: {
    done: number;
    total: number;
    url: string;
    data: any;
  }) => void)[] = [];

  private assetsLength: number = 0;

  private assets: any = {};

  private done: number = 0;

  private imgsUrl: string[] = [];

  private audiosUrl: string[] = [];

  constructor(imgsUrl: string[] = [], audiosUrl: string[] = []) {
    this.init(imgsUrl, audiosUrl);
  }

  public init(imgsUrl: string[] = [], audiosUrl: string[] = []) {
    this.imgsUrl = imgsUrl;
    this.audiosUrl = audiosUrl;
    this.assetsLength = imgsUrl.length + audiosUrl.length;
  }

  public start() {
    this.imgsUrl.forEach(url => {
      this.fetch({
        responseType: 'arraybuffer',
        url,
      }).then(({ request, response }) => {
        const blob = new Blob([response], { type: request.getResponseHeader('Content-Type') });
        const blobURL = URL.createObjectURL(blob);
        console.log('the blob URL is: ' + blobURL);
        this.assets[url] = blobURL;
        this._complete({
          data: blobURL,
          url,
        });
      });
    });

    this.audiosUrl.forEach(url => {
      this.fetch({
        responseType: 'arraybuffer',
        url,
      }).then(({ request, response }) => {
        this.assets[url] = response;
        this._complete({
          data: response,
          url,
        });
      });
    });
  }

  public listen(cb) {
    this.listeners.push(cb);
  }

  public get(name: string) {
    return this.assets[name];
  }

  public get complete(): boolean {
    return this.done === this.assetsLength;
  }

  private _complete(item) {
    this.listeners.forEach(listen => {
      this.done += 1;
      listen({
        done: this.done,
        total: this.assetsLength,
        ...item,
      });
    });
  }

  private fetch(options: {
    responseType: XMLHttpRequestResponseType;
    url: string;
    method?: string;
  }) {
    const { url, responseType, method = 'GET' } = options;
    return new Promise((resolve, reject) => {
      let request = new XMLHttpRequest();
      request.open(method, url, true);
      request.responseType = responseType;
      request.onload = () => {
        resolve({
          response: request.response,
          request,
        });
      };
      request.onerror = () => {
        this.fetch(options).then(data => resolve(data));
      };
      request.send();
    });
  }
}

export default Loader;
