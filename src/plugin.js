import videojs from 'video.js';
import {version as VERSION} from '../package.json';

const Plugin = videojs.getPlugin('plugin');
const MenuButton = videojs.getComponent('MenuButton');
const MenuItem = videojs.getComponent('MenuItem');

// Default options for the plugin.
const defaults = {};

/**
 * Video quality item.
 */
class VideoQualityItem extends MenuItem {
  constructor(player, options) {
    super(player, options);
  }

  handleClick() {
    this.selected(true);
    this.player().qualitySelector().changeVideoQuality(this.options_.identify);
  }
}

class QualitySelectorMenu extends MenuButton {
  constructor(player, options) {
    super(player, options);
    this.addClass('vjs-quality-selector-menu');
  }

  createItems() {
    const player = this.player();
    const qualityLevels = player.options_.qualityLevels || [];
    let hasAuto = false;

    for (const level of qualityLevels) {
      if (level.label === 'auto') {
        hasAuto = true;
        break;
      }
    }

    if (!hasAuto) {
      qualityLevels.push({
        label: 'auto',
        identify: 'sd'
      });
    }

    return qualityLevels.map(item => {
      const menuItem = new VideoQualityItem(player, {
        label: item.label,
        identify: item.identify
      });

      if (item.label === 'auto') {
        this.el().innerHTML = `<span class='vjs-quality-selector-btn'>${item.label}</span>`;
        menuItem.addClass('vjs-selected');
      }
      return menuItem;
    });
  }
}

/**
 * An advanced Video.js plugin. For more information on the API
 *
 * See: https://blog.videojs.com/feature-spotlight-advanced-plugins/
 */
class QualitySelector extends Plugin {

  /**
   * Create a QualitySelector plugin instance.
   *
   * @param  {Player} player
   *         A Video.js Player instance.
   *
   * @param  {Object} [options]
   *         An optional options object.
   *
   *         While not a core part of the Video.js plugin architecture, a
   *         second argument of options is a convenient way to accept inputs
   *         from your plugin's caller.
   */
  constructor(player, options) {
    // the parent class will add player under this.player
    super(player);

    this.options = videojs.mergeOptions(defaults, options);

    this.player.ready(() => {
      this.player.addClass('vjs-quality-selector');
      this.player.getChild('controlBar').addChild(
        'qualityMenuButton', {}, this.player.children().length - 1);
    });
  }

  /**
   * Change video quality.
   */
  changeVideoQuality(identify) {
    const player = this.player;
    const currentPlayAt = player.currentTime();
    let src;
    const qualityAry = player.options_.qualityLevels || [];

    if (qualityAry.length !== 0) {
      for (const level of qualityAry) {
        if (level.identify === identify) {
          src = level.src;
          break;
        }
      }
      if (player.currentSrc() !== src) {
        player.src('//vjs.zencdn.net/v/oceans.mp4');
        player.load();
        player.currentTime(currentPlayAt);
        player.play();
      }
    }
  }
}

// Define default values for the plugin's `state` object here.
QualitySelector.defaultState = {};

// Include the version number.
QualitySelector.VERSION = VERSION;

// Register menu button.
videojs.registerComponent('qualityMenuButton', QualitySelectorMenu);

// Register the plugin with video.js.
videojs.registerPlugin('qualitySelector', QualitySelector);

export default QualitySelector;
