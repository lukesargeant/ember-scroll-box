/* jshint expr:true */
import { run, later } from '@ember/runloop';

import { A } from '@ember/array';
import { expect } from 'chai';
import {
  describeComponent,
  it
} from 'ember-mocha';
import {
  describe,
  beforeEach
} from 'mocha';
import hbs from 'htmlbars-inline-precompile';

// Set any properties with this.set('myProperty', 'value');
// Handle any actions with

describeComponent(
  'scroll-box',
  'Integration: ScrollBoxComponent',
  {
    integration: true
  },
  function() {

    describe('Given a scroll box', function() {

      beforeEach(function() {
        this.render(hbs`
          {{#scroll-box class="subject"}}
            some content
          {{/scroll-box}}
        `);
      });

      it('has scroll-box--at-top css class', function() {
        expect(this.$('.subject').is('.scroll-box--at-top')).to.be.true;
      });

      it('has scroll-box--at-bottom css class', function() {
        expect(this.$('.subject').is('.scroll-box--at-bottom')).to.be.true;
      });

    });

    describe('Given a scroll box with overflowing content', function() {

      beforeEach(function() {
        this.on('atTopSpy', () => this.set('atTop', true));
        this.on('atBottomSpy', () => this.set('atBottom', true));
        this.on('nearTopSpy', () => this.set('enteredUpperThreshold', true));
        this.on('nearBottomSpy', () => this.set('enteredLowerThreshold', true));
        this.set('items', A(Array(100).fill(1)));
        this.render(hbs`
          <style>
            .test-item {
              height: 50px;
            }
          </style>
          {{#scroll-box class="subject"
            atTop="atTopSpy"
            atBottom="atBottomSpy"
            nearTop="nearTopSpy"
            nearBottom="nearBottomSpy"
            upperThreshold=100
            lowerThreshold=100}}
            {{#each items}}
              <div class="test-item">Some content</div>
            {{/each}}
          {{/scroll-box}}
        `);
      });

      it('has scroll-box--at-top css class', function() {
        expect(this.$('.subject').is('.scroll-box--at-top')).to.be.true;
      });
      it('does not have scroll-box--at-bottom css class', function() {
        expect(this.$('.subject').is('.scroll-box--at-bottom')).to.be.false;
      });

      describe('When content overflows above and below', function() {
        beforeEach(function(done) {
          run(() => this.$('.scroll-box_body').scrollTop(10).trigger('scroll'));
          later(done, 100);
        });
        it('does not have scroll-box--at-top css class', function() {
          expect(this.$('.subject').is('.scroll-box--at-top')).to.be.false;
        });
        it('does not have scroll-box--at-bottom css class', function() {
          expect(this.$('.subject').is('.scroll-box--at-bottom')).to.be.false;
        });
      });

      describe('When it is scrolled to the top', function() {
        beforeEach(function(done) {
          run(() => this.$('.scroll-box_body').scrollTop(0).trigger('scroll'));
          later(done, 100);
        });
        it('has scroll-box--at-top css class', function() {
          expect(this.$('.subject').is('.scroll-box--at-top')).to.be.true;
        });
        it('does not have scroll-box--at-bottom css class', function() {
          expect(this.$('.subject').is('.scroll-box--at-bottom')).to.be.false;
        });
        it('triggers an atTop action', function() {
          expect(this.get('atTop')).to.be.true;
        });
      });

      describe('When it is scrolled to the bottom', function() {
        beforeEach(function(done) {
          run(() => this.$('.scroll-box_body').scrollTop(10000).trigger('scroll'));
          later(done, 100);
        });
        it('has scroll-box--at-bottom css class', function() {
          expect(this.$('.subject').is('.scroll-box--at-bottom')).to.be.true;
        });
        it('does not have scroll-box--at-top css class', function() {
          expect(this.$('.subject').is('.scroll-box--at-top')).to.be.false;
        });
        it('triggers an atBottom action', function() {
          expect(this.get('atBottom')).to.be.true;
        });
      });

      describe('When it is scrolled into the upper threshold', function() {
        beforeEach(function(done) {
          run(() => this.$('.scroll-box_body').scrollTop(10).trigger('scroll'));
          later(done, 100);
        });
        it('triggers a nearTop action', function() {
          expect(this.get('enteredUpperThreshold')).to.be.true;
        });
      });

      describe('When it is scrolled into the lower threshold', function() {
        beforeEach(function(done) {
          run(() => this.$('.scroll-box_body').scrollTop(4900).trigger('scroll'));
          later(done, 100);
        });
        it('triggers a nearBottom action', function() {
          expect(this.get('enteredLowerThreshold')).to.be.true;
        });
      });
    });
  }
);
