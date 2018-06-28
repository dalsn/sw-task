'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

if ('serviceWorker' in navigator) {

  navigator.serviceWorker.register('./sw.js', { scope: './' }).then(function (registration) {
    console.log("Yaaay! Service Worker registered");

    if (registration.waiting) {
      registration.waiting.postMessage({ action: 'skipWaiting' });
    }
  }).catch(function (err) {
    console.log("Could not register Service Worked", err);
  });
}

var getCurrencies = function getCurrencies() {
  var url = 'https://free.currencyconverterapi.com/api/v5/currencies';
  return getResponse(url);
};

var getResponse = function getResponse(url) {
  return new Promise(function (resolve, reject) {

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          var result = xhr.responseText;
          result = JSON.parse(result);
          resolve(result);
        } else {
          reject(xhr);
        }
      }
    };

    xhr.open("GET", url, true);
    xhr.send();
  });
};

var CurrencyConversion = function () {
  function CurrencyConversion(currencyFrom, currencyTo) {
    _classCallCheck(this, CurrencyConversion);

    this.currencyFrom = currencyFrom;
    this.currencyTo = currencyTo;
  }

  _createClass(CurrencyConversion, [{
    key: 'convert',
    value: function convert() {
      var url = 'https://free.currencyconverterapi.com/api/v5/convert?q=' + this.currencyFrom + '_' + this.currencyTo;
      return getResponse(url);
    }
  }]);

  return CurrencyConversion;
}();