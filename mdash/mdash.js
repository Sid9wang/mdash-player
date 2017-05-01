import $ from "jquery";
import Parser from './Parser';
import MediaHandler from './MediaHandler';

export default class mdash {

  constructor(url, selector) {
    this.url = url;
    this.selector = selector;

    const start = function(data) {
      this.config = new Parser(this.url, data);
      console.log('MPD Loaded');
      this.init();
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

}
