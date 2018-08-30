# videojs-quality-selector

Video quality selector plugin

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Installation

- [Installation](#installation)
- [Config](#config)
- [Usage](#usage)
  - [`<script>` Tag](#script-tag)
  - [Browserify/CommonJS](#browserifycommonjs)
  - [RequireJS/AMD](#requirejsamd)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
## Installation

```sh
npm install --save videojs-quality-selector-plugin
```

## Config

```
qualityLevels = [{
  label: 'auto',
  identify: 'foo',
  src: 'bar'
}, {
  label: 'hd',
  identify: 'hd',
  src: 'bar1'
}]
```


## Usage

To include videojs-quality-selector on your website or web application, use any of the following methods.

### `<script>` Tag

This is the simplest case. Get the script in whatever way you prefer and include the plugin _after_ you include [video.js][videojs], so that the `videojs` global is available.

```html
<script src="//path/to/video.min.js"></script>
<script src="//path/to/videojs-quality-selector-plugin.min.js"></script>
<script>
  var player = videojs('my-video', {
    qualityLevels: [
      {
        label: 'auto',
        identify: 'foo',
        src: 'bar'
      }, {
        label: 'hd',
        identify: 'hd',
        src: 'bar1'
      }
    ]
  });

  player.qualitySelector();
</script>
```

### Browserify/CommonJS

When using with Browserify, install videojs-quality-selector-plugin via npm and `require` the plugin as you would any other module.

```js
var videojs = require('video.js');

// The actual plugin function is exported by this module, but it is also
// attached to the `Player.prototype`; so, there is no need to assign it
// to a variable.
require('videojs-quality-selector-plugin');

var player = videojs('my-video',{
  qualityLevels: [
    {
      label: 'auto',
      identify: 'foo',
      src: 'bar'
    }, {
      label: 'hd',
      identify: 'hd',
      src: 'bar1'
    }
  ]
});

player.qualitySelector();
```

### RequireJS/AMD

When using with RequireJS (or another AMD library), get the script in whatever way you prefer and `require` the plugin as you normally would:

```js
require(['video.js', 'videojs-quality-selector-plugin'], function(videojs) {
  var player = videojs('my-video', {
    qualityLevels: [
      {
        label: 'auto',
        identify: 'foo',
        src: 'bar'
      }, {
        label: 'hd',
        identify: 'hd',
        src: 'bar1'
      }
    ]
  });

  player.qualitySelector();
});
```

## License

Apache-2.0. Copyright (c) fatelei &lt;fatelei@gmail.com&gt;


[videojs]: http://videojs.com/
