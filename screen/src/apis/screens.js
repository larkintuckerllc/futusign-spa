import * as fromRest from '../util/rest';

// eslint-disable-next-line
export const get = () =>
  fromRest.get('/api/screens/');
