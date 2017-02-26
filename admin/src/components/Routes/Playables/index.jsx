import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import * as fromPlayables from '../../../ducks/playables';
import * as fromModalOpen from '../../../ducks/modalOpen';
import * as fromPlayableOpen from '../../../ducks/playableOpen';
import * as fromRoutesBlocking from '../../../ducks/routesBlocking';
import * as fromSnackbars from '../../../ducks/snackbars';
import PlayablesView from './PlayablesView';
import PlayablesUpload from './PlayablesUpload';
import PlayablesList from './PlayablesList';
import Playable from './Playable';
import Modal from '../../Modal';
import PlayablesDetail from './PlayablesDetail';
import PlayablesRemove from './PlayablesRemove';

const Playables = ({
  addSnackbar,
  playableOpen,
  playables,
  removePlayable,
  setModalOpen,
  setPlayableOpen,
  setRoutesBlocking,
}) => (
  <PlayablesView>
    <Modal title={playableOpen !== null ? playableOpen.name : ''}>
      <PlayablesDetail
        playable={playableOpen}
      />
      <PlayablesRemove
        addSnackbar={addSnackbar}
        playable={playableOpen}
        removePlayable={removePlayable}
        setModalOpen={setModalOpen}
        setRoutesBlocking={setRoutesBlocking}
      />
    </Modal>
    <PlayablesUpload />
    <PlayablesList>
      {playables.map(playable => (
        <Playable
          key={playable.id}
          playable={playable}
          setModalOpen={setModalOpen}
          setPlayableOpen={setPlayableOpen}
        />
      ))}
    </PlayablesList>
  </PlayablesView>
);
Playables.propTypes = {
  addSnackbar: PropTypes.func.isRequired,
  removePlayable: PropTypes.func.isRequired,
  playableOpen: PropTypes.object,
  playables: PropTypes.array.isRequired,
  setModalOpen: PropTypes.func.isRequired,
  setPlayableOpen: PropTypes.func.isRequired,
  setRoutesBlocking: PropTypes.func.isRequired,
};
export default connect(
  state => ({
    playableOpen: fromPlayableOpen.getPlayableOpen(state),
    playables: fromPlayables.getPlayables(state),
  }), {
    addSnackbar: fromSnackbars.addSnackbar,
    removePlayable: fromPlayables.removePlayable,
    setModalOpen: fromModalOpen.setModalOpen,
    setPlayableOpen: fromPlayableOpen.setPlayableOpen,
    setRoutesBlocking: fromRoutesBlocking.setRoutesBlocking,
  }
)(Playables);
