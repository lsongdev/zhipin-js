
const http = require('http');
const https = require('https');
const qs = require('querystring');
const assert = require('assert');

const request = (method, url, payload, headers) => {
  const client = url.startsWith('https://') ? https : http;
  return new Promise((resolve, reject) => {
    const req = client.request(url, {
      method,
      headers,
    }, resolve);
    req.once('error', reject);
    req.end(payload);
  });
};

const get = (url, headers) =>
  request('get', url, '', headers);

const post = (url, payload, headers) =>
  request('post', url, payload, headers);

const readStream = stream => {
  const buffer = [];
  return new Promise((resolve, reject) => {
    stream
      .on('error', reject)
      .on('data', chunk => buffer.push(chunk))
      .on('end', () => resolve(Buffer.concat(buffer)))
  });
};

const formatResponse = response => {
  assert.equal(response.statusCode, 200);
  return Promise
    .resolve(response)
    .then(readStream)
    .then(JSON.parse)
    .then(data => {
      assert.equal(data.code, 0, data.message);
      return data.zpData;
    })
};

const zhipin = ({ cookie }) => {
  const headers = {
    cookie,
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'authority': 'www.zhipin.com',
    'referer': 'https://www.zhipin.com/vue/index/',
    'x-requested-with': 'XMLHttpRequest',
    'x-anti-request-token': 'd41d8cd98f00b204e9800998ecf8427e',
    'content-type': 'application/x-www-form-urlencoded',
    'accept': 'application/json, text/plain, */*',
    'accept-encoding': 'gzip, deflate, br',
    'accept-language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7,zh-TW;q=0.6,ja;q=0.5,es;q=0.4,it;q=0.3,fr;q=0.2,mt;q=0.1,da;q=0.1,la;q=0.1',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36',
  };
  return {
    search(keyword) {
      return Promise.resolve({ keyword });
    },
    /**
     * joblist
     * @param {*} keyword 
     * @param {*} options 
     */
    joblist(keyword, options) {
      const query = qs.stringify(Object.assign({
        page: 1,
        type: 0,
        status: 0,
        searchStr: keyword,
        _: Date.now()
      }, options));
      const url = `https://www.zhipin.com/wapi/zpboss/h5/job/joblist/data.json?${query}`;
      return Promise
        .resolve()
        .then(() => get(url, headers))
        .then(formatResponse)
    },
    list(jobid, options) {
      return this.recommendGeekList(jobid, options);
    },
    /**
     * recommendGeekList
     * @param {*} jobid 
     * @param {*} options 
     */
    recommendGeekList(jobid, options) {
      const now = Date.now();
      const query = qs.stringify(Object.assign({
        jobid,
        page: 1,
        _: now,
        status: 0,
        degree: 0,
        source: 1,
        salary: 0,
        school: -1,
        age: '16,-1',
        refresh: now,
        experience: 0,
        intention: -1,
        switchJobFrequency: -1,
      }, options));
      const url = `https://www.zhipin.com/wapi/zpboss/h5/boss/recommendGeekList?${query}`;
      return Promise
        .resolve()
        .then(() => get(url, headers))
        .then(formatResponse)
    },
    /**
     * geek
     */
    geek(uid) {
      const url = `https://www.zhipin.com/wapi/zpboss/h5/chat/geek.json?uid=${uid}&geekSource=0`;
      return Promise
        .resolve()
        .then(() => get(url, headers))
        .then(formatResponse)
        .then(res => res.data)
    },
    /**
     * greeting
     * @param {*} jid 
     * @param {*} geek 
     */
    greeting(jid, geek) {
      const { encryptGeekId: gid, geekCard } = geek;
      const { lid, expectId, securityId } = geekCard;
      const now = Date.now();
      const url = `https://www.zhipin.com/wapi/zpboss/h5/chat/start?_=${now}`;
      const payload = {
        jid,
        gid,
        lid,
        suid: '',
        from: '',
        expectId,
        securityId
      };
      return Promise
        .resolve()
        .then(() => post(url, qs.stringify(payload), headers))
        .then(formatResponse)
        .then(res => {
          if (res.status === 1) return res;
          return res;
        })
    },
    /**
     * requestResume
     * @param {*} to 
     */
    requestResume(to) {
      const url = `https://www.zhipin.com/chat/requestResume.json?to=${to}&toSource=0&_=` + Date.now();
      return Promise
        .resolve()
        .then(() => get(url, headers))
        .then(readStream)
        .then(JSON.parse)
        .then(res => {
          if (res.result === 1) return res.email;
          return res;
        });
    },
    /**
     * acceptResume
     * @param {*} to 
     * @param {*} mid 
     */
    acceptResume(to, mid) {
      const url = `https://www.zhipin.com/chat/acceptResume.json?to=${to}&mid=${mid}&aid=41&action=0&extend=&_=` + Date.now();
      return Promise
        .resolve()
        .then(() => get(url, headers))
        .then(formatResponse)
    },
    /**
     * downloadResume
     * @param {*} geekId 
     */
    downloadResume(geekId) {
      const url = `https://docdownload.zhipin.com/wapi/zpgeek/resume/attachment/download4boss/${geekId}`;
      return Promise
        .resolve()
        .then(() => get(url, headers))
        .then(readStream)
    }
  };
};

module.exports = zhipin;
