import $ from 'jquery';
import MediaLoader from './MediaLoader';

export default class MediaHandler {

  constructor(config, selector) {
    this.config = config;

    this.video_dom = $(selector);
    this.video_dom.attr('src', '');
    const check_audio = this.video_dom.find('audio');
    if (check_audio.length > 0) {
      check_audio.attr('src', '');
      check_audio.remove();
      this.video_dom.empty();
    }

    this.audio_dom = $('<audio>');
    this.video_dom.append(this.audio_dom);

    this.video = new MediaLoader(this.config, this.video_dom, 0);
    this.audio = new MediaLoader(this.config, this.audio_dom, 0);

    this.audio_dom.get(0).currentTime = 0;
    this.video_dom.get(0).currentTime = 0;

    const pause_audio = function() {
      this.audio_dom.get(0).pause();
    };
    const play_audio = function() {
      this.audio_dom.get(0).play();
    };
    const sync_av = function() {
      this.audio_dom.get(0).currentTime = this.video_dom.get(0).currentTime;
    };

    this.video_dom.on('pause', pause_audio.bind(this));
    this.video_dom.on('play', play_audio.bind(this));
    this.video_dom.on('seeked', sync_av.bind(this));

  }

  toggleVolume() {
    if (this.audio_dom.get(0).muted) {
      this.audio_dom.get(0).muted = false;
    } else {
      this.audio_dom.get(0).muted = true;
    }
  }

  changeVideoQuality(index) {
    this.video = new MediaLoader(this.config, this.video_dom, index);
    this.audio_dom.get(0).currentTime = 0;
  }

}
