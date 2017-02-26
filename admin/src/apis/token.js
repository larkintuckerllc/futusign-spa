import * as strings from '../strings';

let token = window.localStorage.getItem('token');
export const getElement = () => token;
export const post = (username, password) => (
  new Promise((resolve, reject) => {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.addEventListener('load', () => {
      const status = xmlhttp.status;
      if (status !== 200) {
        reject({ message: status.toString() });
      }
      try {
        token = JSON.parse(xmlhttp.responseText).token;
      } catch (error) {
        reject({ message: '500' });
        return;
      }
      if (!token) {
        reject({ message: '500' });
        return;
      }
      window.localStorage.setItem('token', token);
      resolve(token);
    });
    xmlhttp.addEventListener('error', () => {
      reject({ message: '500' });
    });
    xmlhttp.addEventListener('abort', () => {
      reject({ message: '500' });
    });
    xmlhttp.open('POST', `${strings.SERVER_BASE_URL}/api/login/`, true);
    xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xmlhttp.send(`username=${username}&password=${password}`);
  })
);
export const del = () => {
  const oldToken = token;
  token = null;
  window.localStorage.removeItem('token');
  return oldToken;
};
