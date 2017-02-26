import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as fromReactRouterRedux from 'react-router-redux';
import * as fromFolders from '../../../ducks/folders';
import * as fromPlayables from '../../../ducks/playables';
import * as fromSnackbars from '../../../ducks/snackbars';
import * as fromScreens from '../../../ducks/screens';
import * as fromRoutesBlocking from '../../../ducks/routesBlocking';
import * as fromToggle from '../../../ducks/toggle';
import SelectPlayablesView from './SelectPlayablesView';
import SelectPlayablesEditor from './SelectPlayablesEditor';
import SelectPlayablesChanges from './SelectPlayablesChanges';
import SelectPlayablesPlaying from './SelectPlayablesPlaying';
import SelectPlayablesMedia from './SelectPlayablesMedia';
import SelectPlayablesMediaItem from './SelectPlayablesMediaItem';
import SelectPlayablesPlayingItem from './SelectPlayablesPlayingItem';
import SelectPlayablesChangesItem from './SelectPlayablesChangesItem';

class SelectPlayables extends Component {
  constructor() {
    super();
    this.handleFinishClick = this.handleFinishClick.bind(this);
  }
  componentWillMount() {
    this.setState({ initialProps: true });
  }
  componentDidMount() {
    const {
      prevPathname,
      push,
      resetPlayablesPlayableAdded,
      resetPlayablesPlayableRemoved,
      resetUpdateError,
      setToggle,
      toggle,
    } = this.props;
    if (prevPathname !== '/') push('/');
    resetUpdateError();
    resetPlayablesPlayableAdded();
    resetPlayablesPlayableRemoved();
    setToggle(!toggle);
  }
  componentWillReceiveProps() {
    this.setState({ initialProps: false });
  }
  handleFinishClick() {
    const {
      addedPlayables,
      addSnackbar,
      foldersScreensSelected,
      push,
      removedPlayables,
      resetFoldersFolderSelected,
      resetFoldersScreensSelected,
      resetIsFolderHighlight,
      resetIsFolderOpen,
      resetIsScreenHighlight,
      resetIsScreenOpen,
      setRoutesBlocking,
      setIsAllSelectedFolders,
      update,
    } = this.props;
    setRoutesBlocking(true);
    update(
      foldersScreensSelected.map(o => o.id),
      addedPlayables.map(o => o.id),
      removedPlayables.map(o => o.id)
    )
    .then(
      () => {
        resetFoldersFolderSelected();
        resetFoldersScreensSelected();
        resetIsFolderHighlight();
        resetIsFolderOpen();
        resetIsScreenHighlight();
        resetIsScreenOpen();
        setIsAllSelectedFolders(false);
        addSnackbar({ message: 'Successfully applied changes.' });
        push('/');
        setRoutesBlocking(false);
      },
      (error) => {
        if (process.env.NODE_ENV !== 'production'
          && error.name !== 'ServerException') {
          window.console.log(error);
          return;
        }
        setRoutesBlocking(false);
      }
    );
  }
  render() {
    const { initialProps } = this.state;
    const {
      addedPlayables,
      foldersScreensSelected,
      foldersScreensSelectedPlayablesWithCount,
      playables,
      prevPathname,
      push,
      removedPlayables,
      updateError,
    } = this.props;
    if (initialProps) return null;
    if (prevPathname !== '/') return null;
    const addedRemovedPlayables = [...addedPlayables, ...removedPlayables];
    return (
      <SelectPlayablesView
        countAddedRemovedPlayables={addedRemovedPlayables.length}
        foldersScreensSelected={foldersScreensSelected}
        handleFinishClick={this.handleFinishClick}
        push={push}
        updateError={updateError}
      >
        <SelectPlayablesEditor>
          <SelectPlayablesPlaying>
            {foldersScreensSelectedPlayablesWithCount.map((playableWithCount) => (
              <SelectPlayablesPlayingItem
                key={playableWithCount.playable.id}
                playableId={playableWithCount.playable.id}
                playableName={playableWithCount.playable.name}
                playableThumbnailUrl={playableWithCount.playable.thumbnailUrl}
                count={playableWithCount.count}
              />
            ))}
          </SelectPlayablesPlaying>
          <SelectPlayablesMedia>
            {playables.map((playable) => (
              <SelectPlayablesMediaItem
                key={playable.id}
                playableId={playable.id}
                playableName={playable.name}
                playableThumbnailUrl={playable.thumbnailUrl}
              />
            ))}
          </SelectPlayablesMedia>
        </SelectPlayablesEditor>
        <SelectPlayablesChanges>
          {addedRemovedPlayables.map((playable) => (
            <SelectPlayablesChangesItem
              key={playable.id}
              playableId={playable.id}
              playableName={playable.name}
              playableThumbnailUrl={playable.thumbnailUrl}
            />
          ))}
        </SelectPlayablesChanges>
      </SelectPlayablesView>
    );
  }
}
SelectPlayables.propTypes = {
  addedPlayables: PropTypes.array.isRequired,
  addSnackbar: PropTypes.func.isRequired,
  foldersScreensSelected: PropTypes.array.isRequired,
  foldersScreensSelectedPlayablesWithCount: PropTypes.array.isRequired,
  playables: PropTypes.array.isRequired,
  prevPathname: PropTypes.string.isRequired,
  push: PropTypes.func.isRequired,
  removedPlayables: PropTypes.array.isRequired,
  resetPlayablesPlayableAdded: PropTypes.func.isRequired,
  resetPlayablesPlayableRemoved: PropTypes.func.isRequired,
  resetFoldersFolderSelected: PropTypes.func.isRequired,
  resetFoldersScreensSelected: PropTypes.func.isRequired,
  resetIsFolderHighlight: PropTypes.func.isRequired,
  resetIsFolderOpen: PropTypes.func.isRequired,
  resetIsScreenHighlight: PropTypes.func.isRequired,
  resetIsScreenOpen: PropTypes.func.isRequired,
  resetUpdateError: PropTypes.func.isRequired,
  setIsAllSelectedFolders: PropTypes.func.isRequired,
  setRoutesBlocking: PropTypes.func.isRequired,
  setToggle: PropTypes.func.isRequired,
  toggle: PropTypes.bool.isRequired,
  update: PropTypes.func.isRequired,
  updateError: PropTypes.string,
};
export default connect(
  state => ({
    addedPlayables: fromPlayables.getAddedPlayables(state),
    foldersScreensSelected: fromFolders.getFoldersScreensSelected(state),
    foldersScreensSelectedPlayablesWithCount:
      fromFolders.getFoldersScreensSelectedPlayablesWithCount(state),
    playables: fromPlayables.getPlayables(state),
    removedPlayables: fromPlayables.getRemovedPlayables(state),
    toggle: fromToggle.getToggle(state),
    // SHORTENED BECAUSE TOO LONG
    updateError:
      fromFolders.getUpdateFoldersScreensSelectedAddedRemovedPlayablesErrorMessage(state),
  }), {
    addSnackbar: fromSnackbars.addSnackbar,
    push: fromReactRouterRedux.push,
    resetPlayablesPlayableAdded: fromPlayables.resetPlayablesPlayableAdded,
    resetPlayablesPlayableRemoved: fromPlayables.resetPlayablesPlayableRemoved,
    resetFoldersFolderSelected: fromFolders.resetFoldersFolderSelected,
    resetFoldersScreensSelected: fromFolders.resetFoldersScreensSelected,
    resetIsFolderHighlight: fromFolders.resetIsFolderHighlight,
    resetIsFolderOpen: fromFolders.resetIsFolderOpen,
    resetIsScreenHighlight: fromScreens.resetIsScreenHighlight,
    resetIsScreenOpen: fromScreens.resetIsScreenOpen,
    // SHORTENED BECAUSE TOO LONG
    resetUpdateError: fromFolders
      .resetUpdateFoldersScreensSelectedAddedRemovedPlayablesError,
    setIsAllSelectedFolders: fromFolders.setIsAllSelectedFolders,
    setRoutesBlocking: fromRoutesBlocking.setRoutesBlocking,
    setToggle: fromToggle.setToggle,
    // SHORTENED BECAUSE TOO LONG
    update: fromFolders.updateFoldersScreensSelectedAddedRemovedPlayables,
  }
)(SelectPlayables);
