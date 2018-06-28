if ('serviceWorker' in navigator) {

  navigator.serviceWorker
    .register('./sw.js', { scope: './' })
    .then((registration) => {
      console.log("Yaaay! Service Worker registered");

      if (registration.waiting) {
        registration.waiting.postMessage({action: 'skipWaiting'});
      }
    })
    .catch((err) => {
      console.log("Could not register Service Worked", err);
    })

}

let getCurrencies = () => {
  const url = `https://free.currencyconverterapi.com/api/v5/currencies`;
  return getResponse(url);
}

let getResponse = (url) => {
  return new Promise((resolve, reject) => {

    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          let result = xhr.responseText;
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
}

class CurrencyConversion {
  constructor(currencyFrom, currencyTo) {
    this.currencyFrom = currencyFrom;
    this.currencyTo = currencyTo;
  }

  convert() {
    const url = `https://free.currencyconverterapi.com/api/v5/convert?q=${this.currencyFrom}_${this.currencyTo}`;
    return getResponse(url);
  }
}

