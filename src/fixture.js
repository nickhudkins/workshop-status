import { models } from './db';

Promise.all([
  models.workshop.findOrCreate({
    name: 'Test Workshop',
    slug: 'test-workshop'
  })
  models.workshop.findOrCreate({
    name: 'Sample Workshop',
    slug: 'sample-workshop'
  })
]).then(() => {
  console.log('Made Workshops.')
})
