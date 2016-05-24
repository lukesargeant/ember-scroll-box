import Ember from 'ember';

let NUMBER_OF_ITEMS = 500;
let counter = 0;

function getItem() {
  return Ember.Object.create({
    name: `Item ${counter++}`,
    index: counter,
    lastUpdated: 0
  });
}

function getItems() {
  let items = Ember.A([]);
  for (let i = 0; i < NUMBER_OF_ITEMS; i++) {
    items.pushObject(getItem());
  }
  return items;
}

export default Ember.Route.extend({

  model() {
    let items = getItems();
    return { items };
  }

});
