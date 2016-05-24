# Ember-scroll-box

A **scroll-box** provides CSS hooks that allow styling when the content is scrolled to the
top or bottom and triggers actions at configurable scroll thresholds.
The component has been designed with performance in mind and as such throttles
its scroll handling. All functionality is covered by a suite of tests.

## How to install

``ember install Ember-scroll-box``

## Using the CSS hooks to style shadows/indicators

Given a **scroll-box** with some content:

```
Template:

{{#scroll-box class="my-container"}}
  {{#each items as |item|}}
    <div>Some repeated content</div>
  {{/each}}
{{/scroll-box}}

CSS:

.my-container {
  height: 100px;
}
```

When the content is scrolled to the top the ``.scroll-box--at-top`` class will be present and... when the content is scrolled to the bottom the ``.scroll-box--at-bottom`` class will be present.

The following CSS can be applied to show shadows at the top and bottom when content overflows (including a fancy transition for when the shadows appears/disappears):

```
.scroll-box {
  overflow: hidden;
}
.scroll-box_body {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
}
.scroll-box::before,
.scroll-box::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  box-shadow: 0 0 5px 4px rgba(0,0,0,0.4);
  z-index: 1;
  transition: opacity 400ms;
  opacity: 0;
}
.scroll-box::before {
  top: 0;
}
.scroll-box::after {
  bottom: 0;
}
.scroll-box:not(.scroll-box--at-top)::before,
.scroll-box:not(.scroll-box--at-bottom)::after {
  opacity: 1;
}
```

Note: To provide CSS hooks that are useful for styling scroll
indicators, one additional inner div ``.scroll-box_body`` is used. Sadly without this element it
is not possible (aside from a few limited or ugly techniques) to style the
top/bottom of a scrollable area.

## Using the actions for infinite scroll

Given a **scroll-box** with a hooked up nearBottom action:

```
Template:

{{#scroll-box
  class="my-container"
  nearBottom="loadMoreContent"
  thresholdBottom=100}}
  {{#each items as |item|}}
    <div>Some repeated content</div>
  {{/each}}
{{/scroll-box}}

CSS:

.my-container {
  height: 100px;
}
```

As you can imagine, this will trigger the outer context's **loadMoreContent** action when content scrolls withint 100px of the bottom. You can then handle retrieving more records and push them to the **items** array. **nearTop**, **thresholdTop**, **atTop** and **atBottom** are also available.

# How to collaborate on this addon

* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `npm test` (Runs `ember try:testall` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://ember-cli.com/](http://ember-cli.com/).
