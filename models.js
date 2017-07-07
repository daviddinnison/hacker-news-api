const uuid = require('uuid');

const HackerBlog = {
  create: function(title, url) {
    console.log('Creating new story');
    const item = {
      title: title,
      id: uuid.v4(),
      url: url,
      votes: 0
    };
    this.items[item.id] = item;
    return item;
  },
  get: function() {
    console.log('Retrieving stories');
    return Object.keys(this.items).map(key => this.items[key]);
  },
  delete: function(id) {
    console.log(`Deleting story item \`${id}\``);
    delete this.items[id];
  },
  update: function(updatedItem) {
    console.log(`Voting for item \`${updatedItem.id}\``);
    const {id} = updatedItem;
    if (!(id in this.items)) {
      throw StorageException(
        `Can't update item \`${id}\` because doesn't exist.`)
    }
    this.items[updatedItem.id] = updatedItem;
    return updatedItem;
  }
};

function createHackerBlog() {
  const storage = Object.create(HackerBlog);
  storage.items = {};
  return storage;
}

module.exports = {
  HackerBlog: createHackerBlog()
}