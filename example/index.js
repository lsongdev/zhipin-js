const zhipin = require('..')({
  cookie:  `wt2=Dr6YuKBN3hd9j2zHO0k24HXHvczp_ffFUfsLBrkCYt9aGAzZksN_zaF2swiGi1hdSNjIpunpnQNScdhp8Z0OkKA~~; `
});

(async () => {

  const joblist = await zhipin.joblist();
  const [ job ] = joblist.data;
  const { encryptJobId } = job;
  const { geekList } = await zhipin.list(encryptJobId);
  
  // geekList.forEach(geek => {
  //   console.log(geek.geekCard);
  // });

  const [ geek ] = geekList;

  const resp = await zhipin.greeting(encryptJobId, geek);
  console.log(resp);

  // console.log(_geek);

  // const geek = await zhipin.geek(28165590);
  // console.log(geek);

  // const res = await zhipin.requestResume(28165590);
  // console.log(res);

  // const resume = await zhipin.downloadResume('d684359a44018fe003J62NW6Flc~');
  // console.log(resume);

})();