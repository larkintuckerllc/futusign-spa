import * as strings from '../strings';
import * as fromToken from './token';
import * as fromRest from '../util/rest';

export const getCollection = () =>
  fromRest.getCollection('/api/playables/');
export const del = (id) =>
  fromRest.del('/api/playables/', id);
export const post = (data, file) => (
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
    const formData = new window.FormData();
    formData.append('file', file);
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('slideDuration', data.slideDuration);
    xmlhttp.open('POST', `${strings.SERVER_BASE_URL}/api/playables/`, true);
    xmlhttp.setRequestHeader('Authorization', `bearer ${fromToken.getElement()}`);
    xmlhttp.send(formData);
  })
);
