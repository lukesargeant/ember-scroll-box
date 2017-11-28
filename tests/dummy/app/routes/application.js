import Route from '@ember/routing/route';
import { A } from '@ember/array';
import EmberObject from '@ember/object';

let NUMBER_OF_ITEMS = 500;
let counter = 0;

function getItem() {
  return EmberObject.create({
    name: `Item ${counter++}`,
    index: counter,
    lastUpdated: 0
  });
}

function getItems() {
  let items = A([]);
  for (let i = 0; i < NUMBER_OF_ITEMS; i++) {
    items.pushObject(getItem());
  }
  return items;
}

export default Route.extend({

  model() {
    let items = getItems();
    return { items };
  }

});
