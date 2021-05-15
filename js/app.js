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
      console.log("Could not register Service Worker", err);
    })

}

let getCurrencies = () => {
  const url = `https://free.currconv.com/api/v7/currencies?apiKey=b42b01ab2c1f29eb112b`;
  return getResponse(url);
}

let getResponse = (url) => {
  //I'm using this because for some reason I couldn't figure out
  //why fetch() has refused to work as expected within this file
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
    this.apiKey = 'b42b01ab2c1f29eb112b';

    if ('serviceWorker' in navigator) {
      this.dbPromise = idb.open('currency', 1, (upgradeDb) => {
        let store = upgradeDb.createObjectStore('currencies', {
          keyPath: 'id'
        });
        store.createIndex('by-id', 'id');
      });
    }
  }

  convert() {
    const id = `${this.currencyFrom}_${this.currencyTo}`;

    if (navigator.onLine) return this.getRate(id);

    return this.dbPromise.then((db) => {
      if (!db) return;

      const tx = db.transaction('currencies', 'readwrite');
      const index = tx.objectStore('currencies').index('by-id');

      return index.get(id).then((response) => {
        if (!response)
          alert('No Internet connection found!');
        return response;
      })
    })
  }

  getRate(id) {
    const url = `https://free.currconv.com/api/v7/convert?apiKey=${this.apiKey}&q=${id}`;

    return this.dbPromise.then((db) => {
      return getResponse(url).then((response) => {
        let obj = response.results[`${this.currencyFrom}_${this.currencyTo}`];
        if (!db) return obj;

        const tx1 = db.transaction('currencies', 'readwrite');
        const store1 = tx1.objectStore('currencies');
        store1.put(obj);

        return obj;
      })
    })
  }
}

