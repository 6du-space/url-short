$(() => {
  chrome.tabs.query({
    active: true,
    lastFocusedWindow: true
  }, (tabs) => {
    var tab = tabs[0];
    var title = tab.title;
    const url = tab.url;
    const textarea = document.getElementById("LinkTextarea")
    textarea.value = title + ' : ' + url;
    new QRious({
      element: document.getElementById('qrcode'),
      value: url,
      size: 512
    });
    const state = $("#state")
    if (['http', 'https'].indexOf(new URL(url).protocol.slice(0, -1)) < 0) {
      console.log(state)
      state.remove()
      return
    }
    $.ajax({
      type: "GET",
      url: 'https://api.weibo.com/2/short_url/shorten.json',
      xhrFields: {
        withCredentials: false // 携带跨域cookie
      },
      data: {
        source: '560331235',
        url_long: url
      },
      fail: () => {
        state.html("短网址生成失败").removeClass('spin')
      },
      success: (data) => {
        var urls = data.urls
        if (urls && urls[0]) {
          var url_short = urls[0].url_short
          if (url_short && (url_short.length < url.length)) {
            url_short = url_short.replace("http://", "https://")
            textarea.value = textarea.value.replace(url, url_short)
            setTimeout(
              () => {
                $(textarea).focus()
                const len = title.length;
                textarea.setSelectionRange(len, len);
              },
              100
            )
            CopyFunction()
          }
        }
        state.remove()
      }
    });

    CopyFunction()
  });


});


document.addEventListener('DOMContentLoaded', () => {
  var Copybutton = document.getElementById('Copybutton');
  Copybutton.addEventListener('click', function() {
    CopyFunction();
  });


});

function CopyFunction() {
  var copyFrom = $('<textarea/>');
  copyFrom.text(document.getElementById("LinkTextarea").value);
  $('body').append(copyFrom);
  copyFrom.select();
  document.execCommand('copy');
  copyFrom.remove();
  document.getElementById("TooltipId").style.display = "";

  setTimeout(function() {
    document.getElementById("TooltipId").style.display = "none";
  }, 9000);
}
