import * as fromRest from '../util/rest';

export const getCollection = () =>
  fromRest.getCollection('/api/screens_playables/');

export const update = (updates) =>
  fromRest.post('/api/actions/update_screens_playables', updates);
