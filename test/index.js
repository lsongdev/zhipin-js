const test = require('./test');
const assert = require('assert');
const zhipin = require('..')({
  cookie: 'wt=4PD4GtFCwhqAUQvh'  
});

(async () => {

  var geekList;
  var jobId = '2eefd809ca8024f103By3du-ElY~';

  await test('zhipin#list', async () => {
    const list = await zhipin.list(jobId);
    assert.ok(list);
    ({ geekList } = list);
    assert.ok(Array.isArray(geekList));
  });

  await test('zhipin#geek', async () => {
    await zhipin.geek(51499445);
  });

  await test('zhipin#greeting', async () => {
    const [ geek ] = geekList;
    const res = await zhipin.greeting(jobId, geek);
    assert.ok(res);
  });

})();