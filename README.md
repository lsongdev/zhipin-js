## zhipin

> simple javascript api for boss zhipin

[![zhipin](https://img.shields.io/npm/v/zhipin.svg)](https://npmjs.org/zhipin)
[![Build Status](https://travis-ci.org/song940/zhipin.svg?branch=master)](https://travis-ci.org/song940/zhipin)

### Installation

```bash
$ yarn add zhipin
```

### Example

```js
const zhipin = require('zhipin')({
  cookie: '-- PUT YOUR COOKIE HERE --'
});

(async () => {
  const joblist = await zhipin.joblist();
  const [ job ] = joblist.data;
  const { encryptJobId } = job;
  const { geekList } = await zhipin.list(encryptJobId);
  const [ geek ] = geekList;
  const response = await zhipin.greeting(jobId, geek);
  console.log(response);
})();
```

### Contributing
- Fork this Repo first
- Clone your Repo
- Install dependencies by `$ npm install`
- Checkout a feature branch
- Feel free to add your features
- Make sure your features are fully tested
- Publish your local branch, Open a pull request
- Enjoy hacking <3

### MIT

This work is licensed under the [MIT license](./LICENSE).

---
