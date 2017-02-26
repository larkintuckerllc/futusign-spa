const SCREEN_SELECTED = 'screen_selected';
export const getScreenSelected = () =>
  window.localStorage.getItem(SCREEN_SELECTED);
export const setScreenSelected = (value) => {
  window.localStorage.setItem(SCREEN_SELECTED, value);
};
export const removeScreenSelected = () => {
  window.localStorage.removeItem(SCREEN_SELECTED);
};
