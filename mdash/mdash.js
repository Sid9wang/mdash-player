import $ from "jquery";
import Parser from './Parser';
import MediaHandler from './MediaHandler';

export default class mdash {

  constructor(url, selector, callback) {
    this.url = url;
    this.selector = selector;

    const start = function(data) {
      this.config = new Parser(this.url, data);
      console.log('MPD Loaded');
      this.init();
      if (callback) {
        callback();
      }
    };

    $.ajax({
      url: this.url,
      type: 'GET'
    })
    .done(start.bind(this))
    .fail(function() {
      console.log('cannot load MPD');
    });
  }

  init() {
    this.mediaHandler = new MediaHandler(this.config, this.selector);
  }

  toggleVolume() {
    this.mediaHandler.toggleVolume();
  }

  changeVideoQuality(index) {
    const vm = this;
    return function() {
      vm.mediaHandler.changeVideoQuality(index);
    };
  }

  getVideoRep() {
    return this.config.getRepresentation('video');
  }

}
