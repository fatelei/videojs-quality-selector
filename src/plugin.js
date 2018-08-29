import videojs from 'video.js';
import {version as VERSION} from '../package.json';

const Plugin = videojs.getPlugin('plugin');
const Menu = videojs.getComponent('Menu');
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
    this.updateSelectMenu = options.updateSelectMenu;
  }

  handleClick() {
    this.updateSelectMenu(this.options_.identify);
    this.player().qualitySelector().changeVideoQuality(this.options_.identify);
  }
}

class QualityMenu extends Menu {
  constructor(player, options) {
    super(player, options);
  }
}

class QualitySelectorMenuButton extends MenuButton {
  constructor(player, options) {
    super(player, options);
    this.addClass('vjs-quality-selector-menu');
    this.bindUpdateSelectMenu = this.updateSelectMenu.bind(this);
    this.createItems();
  }

  updateSelectMenu(identify) {
    const player = this.player();
    const qualityLevels = player.options_.qualityLevels || [];

    const menuItems = this.children()[1].children();

    for (const [index, level] of qualityLevels.entries()) {
      if (menuItems[index].el().classList.contains('vjs-selected')) {
        menuItems[index].el().classList.remove('vjs-selected');
      }

      if (level.identify === identify) {
        this.el().getElementsByClassName('vjs-quality-selector-btn')[0].textContent = level.label;
        menuItems[index].el().classList.add('vjs-selected');
      }
    }
  }

  createMenu() {
    const menu = new QualityMenu(this.player, this.options_);
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

    qualityLevels.forEach(item => {
      const menuItem = new VideoQualityItem(player, {
        label: item.label,
        identify: item.identify,
        updateSelectMenu: videojs.bind(this, this.updateSelectMenu)
      });

      if (item.label === 'auto') {
        this.el().innerHTML = `<span class='vjs-quality-selector-btn'>${item.label}</span>`;
        if (player.currentSrc().length === 0) {
          player.src(item.src);
        }
        menuItem.addClass('vjs-selected');
      }
      menu.addItem(menuItem);
    });
    return menu;
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
      if (typeof src !== 'undefined' && player.currentSrc() !== src) {
        player.src({
          src
        });
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
videojs.registerComponent('qualityMenuButton', QualitySelectorMenuButton);

// Register the plugin with video.js.
videojs.registerPlugin('qualitySelector', QualitySelector);

export default QualitySelector;
