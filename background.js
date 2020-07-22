//   'https://api.weibo.com/2/short_url/shorten.json'
//       source : '560331235'
//       url_long: \https://github.com/TonyRenHK/Link_Copy.git

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  console.log(request)
  $.ajax({
    type: request.type,
    url: request.url,
    data: request.data,
    async: false,
    success: (r)=>sendResponse(r)
  });
});
