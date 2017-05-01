import $ from 'jquery';

export default class MediaLoader {

  constructor(config, dom) {
    this.type = dom.prop('nodeName').toLowerCase();

    this.config = config;
    this.dom = dom;

    this.mime = config.getMime(this.type);
    this.reps = config.getRepresentation(this.type);
    this.template = config.getTemplate(this.type);

    this.current_rep = 0;
    this.buffer_queue = [];
    this.total_byte = 0;

    this.mediaSource = new window.MediaSource();
    this.dom.attr('src', window.URL.createObjectURL(this.mediaSource));
    $(this.mediaSource).on('sourceopen', this.start.bind(this));
  }

  start() {
    this.sourceBuffer = this.mediaSource.addSourceBuffer(this.getMime());
    console.log(this.type + ' source buffer initialized');
    const callback = function(data) {
      // console.log(data.byteLength);
      // append init buffer
      this.sourceBuffer.appendBuffer(data);
      // load more data
      this.loadMore();
      this.dom.get(0).play();
    };
    this.ajaxBuffer(callback.bind(this));
  }

  loadMore() {
    const callback = function(data) {
      // console.log(data.byteLength);
      this.total_byte += data.byteLength;
      this.buffer_queue.push(data);
      this.loadFromQueue();
      if (this.shouldSleep()) {
        // stop loading, set timeupdate checker
      } else {
        // continue loading data
        this.loadMore();
      }
    };
    this.ajaxBuffer(callback.bind(this));
  }

  loadFromQueue() {
    if (!this.sourceBuffer.updating) {
      const data = this.buffer_queue.shift();
      if (data) {
        this.sourceBuffer.appendBuffer(data);
        $(this.sourceBuffer).one('updateend', this.loadFromQueue.bind(this));
      }
    }
  }

  shouldSleep() {
    const sec = this.total_byte * 8 / this.reps[this.current_rep].bitrate;
    // console.log(this.total_byte);
    // console.log(this.reps[this.current_rep].bitrate / 8);
    // console.log(sec);
    return this.template.frags <= this.current_frag_number;
  }

  getNextUrl() {
    const id = this.reps[this.current_rep].id;
    if (this.current_frag_number === undefined) {
      this.current_frag_number = 0;
      return this.config.getBaseUrl() +
        this.template.init.replace(/\$RepresentationID\$/g, id);
    }
    return this.config.getBaseUrl() +
      this.template.template.replace(/\$RepresentationID\$/g, id)
      .replace(/\$Number\$/g, this.getNextFragNumber());
  }

  getNextFragNumber() {
    const temp = this.current_frag_number;
    this.current_frag_number += 1;
    return this.template.start + temp;
  }

  getMime() {
    return this.mime + '; codecs="' + this.reps[this.current_rep].codecs + '"';
  }

  ajaxBuffer(callback) {
    const url = this.getNextUrl();
    console.log(url);
    var xhrequest = new XMLHttpRequest();
    xhrequest.open("GET", url);
    xhrequest.responseType = "arraybuffer";
    xhrequest.onreadystatechange = function () {
      if (xhrequest.readyState === 4) {
        if (xhrequest.status === 200) {
          callback(new Uint8Array(xhrequest.response));
        }
      }
    };
    xhrequest.send();
  }

}
