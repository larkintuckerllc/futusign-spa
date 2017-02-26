import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as fromReactRouterRedux from 'react-router-redux';
import * as fromFolders from '../../../ducks/folders';
import * as fromScreens from '../../../ducks/screens';
import * as fromToggle from '../../../ducks/toggle';
import SelectScreensView from './SelectScreensView';
import SelectScreensFolders from './SelectScreensFolders';
import SelectScreensFolder from './SelectScreensFolder';
import SelectScreensMap from './SelectScreensMap';

class SelectScreens extends Component {
  componentWillMount() {
    this.setState({ initialProps: true });
  }
  componentDidMount() {
    const {
      prevPathname,
      resetFoldersFolderSelected,
      resetFoldersScreensSelected,
      resetIsFolderHighlight,
      resetIsFolderOpen,
      resetIsScreenHighlight,
      resetIsScreenOpen,
      setIsAllSelectedFolders,
      setToggle,
      toggle,
    } = this.props;
    if (prevPathname !== '/select_playables') {
      resetIsScreenHighlight();
      resetIsScreenOpen();
      resetIsFolderHighlight();
      resetIsFolderOpen();
      resetFoldersScreensSelected();
      resetFoldersFolderSelected();
      setIsAllSelectedFolders(false);
    }
    setToggle(!toggle);
  }
  componentWillReceiveProps() {
    this.setState({ initialProps: false });
  }
  render() {
    const { initialProps } = this.state;
    const {
      folders,
      foldersScreensSelected,
      isAllSelectedFolders,
      push,
      setIsAllSelectedFolders,
    } = this.props;
    if (initialProps) return null;
    return (
      <SelectScreensView
        foldersScreensSelected={foldersScreensSelected}
        push={push}
      >
        <SelectScreensFolders
          isAllSelectedFolders={isAllSelectedFolders}
          setIsAllSelectedFolders={setIsAllSelectedFolders}
        >
          {folders.map((folder) => (
            <SelectScreensFolder
              key={folder.id}
              folderId={folder.id}
              folderName={folder.name}
            />
          ))}
        </SelectScreensFolders>
        <SelectScreensMap />
      </SelectScreensView>
    );
  }
}
SelectScreens.propTypes = {
  foldersScreensSelected: PropTypes.array.isRequired,
  folders: PropTypes.array.isRequired,
  isAllSelectedFolders: PropTypes.bool.isRequired,
  prevPathname: PropTypes.string.isRequired,
  push: PropTypes.func.isRequired,
  resetFoldersFolderSelected: PropTypes.func.isRequired,
  resetFoldersScreensSelected: PropTypes.func.isRequired,
  resetIsFolderHighlight: PropTypes.func.isRequired,
  resetIsFolderOpen: PropTypes.func.isRequired,
  resetIsScreenHighlight: PropTypes.func.isRequired,
  resetIsScreenOpen: PropTypes.func.isRequired,
  setIsAllSelectedFolders: PropTypes.func.isRequired,
  setToggle: PropTypes.func.isRequired,
  toggle: PropTypes.bool.isRequired,
};
export default connect(
  state => ({
    folders: fromFolders.getFolders(state),
    foldersScreensSelected:
      fromFolders.getFoldersScreensSelected(state),
    isAllSelectedFolders:
      fromFolders.getIsAllSelectedFolders(state),
    toggle: fromToggle.getToggle(state),
  }), {
    resetFoldersFolderSelected: fromFolders.resetFoldersFolderSelected,
    resetFoldersScreensSelected: fromFolders.resetFoldersScreensSelected,
    resetIsFolderHighlight: fromFolders.resetIsFolderHighlight,
    resetIsFolderOpen: fromFolders.resetIsFolderOpen,
    resetIsScreenHighlight: fromScreens.resetIsScreenHighlight,
    resetIsScreenOpen: fromScreens.resetIsScreenOpen,
    push: fromReactRouterRedux.push,
    setIsAllSelectedFolders: fromFolders.setIsAllSelectedFolders,
    setToggle: fromToggle.setToggle,
  }
)(SelectScreens);
