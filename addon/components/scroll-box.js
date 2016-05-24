import Ember from 'ember';
import layout from '../templates/components/scroll-box';

/**
 * Time in milliseconds between recomputing state in response to scroll events.
 * @type {Number}
 */
const THROTTLE = 50;

/**
 * A component that wraps scrollable content.
 * Triggered actions and provides CSS hooks when content has scrolled near the
 * top or bottom. Useful for creating infinite scroll implementations or styling
 * scroll shadows/loading spinners.
 * @class ScrollBoxComponent
 */
const ScrollBoxComponent = Ember.Component.extend({
  layout,
  classNames: ['scroll-box'],

  /**
   * Number of pixels the scrollable element is currently scrolled from its top.
   * @type {Number}
   */
  scrollTop: 0,

  /**
   * Whether the start of the scrollable area is currently in view.
   * @type {Boolean}
   */
  isAtTop: false,

  /**
   * Whether the end of the scrollable area is currently in view.
   * @type {Boolean}
   */
  isAtBottom: false,

  /**
   * Whether the start of the scrollable area is scrolled within a threshold.
   * @type {Boolean}
   */
  isInThresholdTop: false,

  /**
   * Whether the end of the scrollable area is scrolled within a threshold.
   * @type {Boolean}
   */
  isInThresholdBottom: false,

  /**
   * The threshold that should be used when calculating isInThresholdTop.
   * @type {Number}
   */
  thresholdTop: 50,

  /**
   * The threshold that should be used when calculating isInThresholdBottom.
   * @type {Number}
   */
  thresholdBottom: 50,

  /**
   * Use a computed to cache the element used to actually contain and scroll the
   * yielded content.
   * @type {Ember.$}
   */
  $scrollBody: Ember.computed(function() {
    return this.$().children('.scroll-box_body');
  }),

  /**
   * Override lifecycle hook to set up a throttled scroll event handler and
   * kick off the initial calculations to determine current scroll position.
   */
  didInsertElement() {
    // The handle scroll handler must be bound to appease jQuery's on/off.
    this._handleScroll = Ember.run.bind(this, this._handleScroll);
    let $scrollBody = this.get('$scrollBody');
    $scrollBody.on('scroll', this._handleScroll);
    this._checkScroll();
    this._super(...arguments);
  },

  /**
   * Handle the scroll event by throttling the check scroll logic.
   * @return {[type]} [description]
   */
  _handleScroll() {
    Ember.run.throttle(this, this._checkScroll, THROTTLE, false);
  },

  /**
   * Calculate logical properties: atTop, atBottom, nearTop, nearBottom.
   */
  _checkScroll() {
    let $scrollBody = this.get('$scrollBody');
    let scrollTop = $scrollBody.scrollTop();
    let height = $scrollBody.height();
    let scrollHeight = $scrollBody.get(0).scrollHeight;
    let scrollBottom = scrollHeight - (scrollTop + height);
    this.set('scrollTop', scrollTop);
    this.set('isAtTop', scrollTop === 0);
    this.set('isAtBottom', scrollBottom === 0);
    this.set('isInThresholdTop', scrollTop < this.get('thresholdTop'));
    this.set('isInThresholdBottom', scrollBottom < this.get('thresholdBottom'));
  },

  _isAtTopChange: Ember.observer('isAtTop', function() {
    let isAtTop = this.get('isAtTop');
    this.$().toggleClass('scroll-box--at-top', isAtTop);
    this.sendAction('atTop');
  }),

  _isAtBottomChange: Ember.observer('isAtBottom', function() {
    let isAtBottom = this.get('isAtBottom');
    this.$().toggleClass('scroll-box--at-bottom', isAtBottom);
    this.sendAction('atBottom');
  }),

  _isInThresholdTopChange: Ember.observer('isInThresholdTop', function() {
    if (this.get('isInThresholdTop')) {
      this.sendAction('nearTop');
    }
  }),

  _isInThresholdBottomChange: Ember.observer('isInThresholdBottom', function() {
    if (this.get('isInThresholdBottom')) {
      this.sendAction('nearBottom');
    }
  }),

  /**
   * Override lifecycle hook to ensure we remove the scroll event handler.
   * @return {[type]} [description]
   */
  willDestroyElement() {
    let $scrollBody = this.get('$scrollBody');
    $scrollBody.off('scroll', this._handleScroll);
    this._super(...arguments);
  }
});

export default ScrollBoxComponent;
