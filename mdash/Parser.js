import $ from 'jquery';

export default class Parser {

  constructor(url, data) {
    this.xml = $(data);
    this.url = url;
  }

  getType() {
    if (!this.type) {
      this.type = this.xml.find('MPD').attr('type');
    }
    return this.type;
  }

  getBaseUrl() {
    if (!this.base_url) {
      let base = this.xml.find('BaseURL').val();
      if (base.startsWith('./')) {
        this.base_url = this.url.substr(0, this.url.lastIndexOf('/') + 1) + base.substr(2);
      } else if (base.startsWith('http://') || base.startsWith('https://')) {
        this.base_url = base;
      } else {
        this.base_url = this.url.substr(0, this.url.lastIndexOf('/') + 1) + base;
      }
    }
    return this.base_url;
  }

  getMime(contentType) {
    const dom = this.xml.find('AdaptationSet[contentType=' + contentType + ']');
    return dom.attr('mimeType');
  }

  getRepresentation(contentType) {
    const dom = this.xml.find('AdaptationSet[contentType=' + contentType + ']');
    const reps = dom.find('Representation');
    let result = [];
    for (const d of reps) {
      result.push({
        id: $(d).attr('id'),
        codecs: $(d).attr('codecs'),
        bitrate: parseInt($(d).attr('bandwidth'))
      });
    }
    result.sort(function(x, y) {
      return x.bitrate - y.bitrate;
    });
    return result;
  }

  getTemplate(contentType) {
    const total_time = parseFloat(
      /([0-9]*[.])?[0-9]+/
      .exec($(this.xml.find('MPD')[0]).attr('mediaPresentationDuration'))
    );
    const dom = this.xml.find('AdaptationSet[contentType=' + contentType + ']');
    const reps = dom.find('SegmentTemplate');
    let duration = parseInt(reps.attr('duration'));
    if (reps.attr('timescale')) {
      duration = duration / parseInt(reps.attr('timescale'));
    }
    let frags = Math.trunc(total_time / duration);
    if (total_time % duration !== 0) {
      frags += 1;
    }
    // console.log(frags);
    return {
      duration: duration,
      frags: frags,
      template: reps.attr('media'),
      start: parseInt(reps.attr('startNumber')),
      init: reps.attr('initialization')
    };
  }

}
