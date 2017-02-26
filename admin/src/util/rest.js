import * as strings from '../strings';
import * as fromToken from '../apis/token';

export const getCollection = (endpoint) => (
  new Promise((resolve, reject) => {
    let collection;
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.addEventListener('load', () => {
      const status = xmlhttp.status;
      if (status !== 200) {
        reject({ message: status.toString() });
      }
      try {
        collection = JSON.parse(xmlhttp.responseText);
      } catch (error) {
        reject({ message: '500' });
        return;
      }
      resolve(collection);
    });
    xmlhttp.addEventListener('error', () => {
      reject({ message: '500' });
    });
    xmlhttp.addEventListener('abort', () => {
      reject({ message: '500' });
    });
    xmlhttp.open('GET', `${strings.SERVER_BASE_URL}${endpoint}`, true);
    xmlhttp.setRequestHeader('Authorization', `bearer ${fromToken.getElement()}`);
    xmlhttp.send();
  })
);
export const post = (endpoint, data) => (
  new Promise((resolve, reject) => {
    let element;
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.addEventListener('load', () => {
      const status = xmlhttp.status;
      if (status !== 200) {
        reject({ message: status.toString() });
      }
      try {
        element = JSON.parse(xmlhttp.responseText);
      } catch (error) {
        reject({ message: '500' });
        return;
      }
      resolve(element);
    });
    xmlhttp.addEventListener('error', () => {
      reject({ message: '500' });
    });
    xmlhttp.addEventListener('abort', () => {
      reject({ message: '500' });
    });
    xmlhttp.open('POST', `${strings.SERVER_BASE_URL}${endpoint}`, true);
    xmlhttp.setRequestHeader('Authorization', `bearer ${fromToken.getElement()}`);
    xmlhttp.setRequestHeader('Content-Type', 'application/json');
    xmlhttp.send(JSON.stringify(data));
  })
);
export const del = (endpoint, id) => (
  new Promise((resolve, reject) => {
    let element;
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.addEventListener('load', () => {
      const status = xmlhttp.status;
      if (status !== 200) {
        reject({ message: status.toString() });
      }
      try {
        element = JSON.parse(xmlhttp.responseText);
      } catch (error) {
        reject({ message: '500' });
        return;
      }
      resolve(element);
    });
    xmlhttp.addEventListener('error', () => {
      reject({ message: '500' });
    });
    xmlhttp.addEventListener('abort', () => {
      reject({ message: '500' });
    });
    xmlhttp.open('DELETE', `${strings.SERVER_BASE_URL}${endpoint}${id}`, true);
    xmlhttp.setRequestHeader('Authorization', `bearer ${fromToken.getElement()}`);
    xmlhttp.send();
  })
);
export const put = (endpoint, id, updates) => (
  new Promise((resolve, reject) => {
    let element;
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.addEventListener('load', () => {
      const status = xmlhttp.status;
      if (status !== 200) {
        reject({ message: status.toString() });
      }
      try {
        element = JSON.parse(xmlhttp.responseText);
      } catch (error) {
        reject({ message: '500' });
        return;
      }
      resolve(element);
    });
    xmlhttp.addEventListener('error', () => {
      reject({ message: '500' });
    });
    xmlhttp.addEventListener('abort', () => {
      reject({ message: '500' });
    });
    xmlhttp.open('PUT', `${strings.SERVER_BASE_URL}${endpoint}${id}`, true);
    xmlhttp.setRequestHeader('Authorization', `bearer ${fromToken.getElement()}`);
    xmlhttp.setRequestHeader('Content-Type', 'application/json');
    xmlhttp.send(JSON.stringify({ id, ...updates }));
  })
);
