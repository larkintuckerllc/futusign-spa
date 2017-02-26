import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import pdfjsLib from 'pdfjs-dist';
import { getFile } from '../../../util/rest';
import { convertDataURIToBinary } from '../../../util/misc';
import * as fromOfflinePlaying from '../../../ducks/offlinePlaying';
import styles from './index.scss';

pdfjsLib.PDFJS.workerSrc = './pdf.worker.bundle.js';
class Slideshow extends Component {
  constructor() {
    super();
    this.handleFile = this.handleFile.bind(this);
    this.handleDocument = this.handleDocument.bind(this);
    this.renderPlayable = this.renderPlayable.bind(this);
    this.renderPage = this.renderPage.bind(this);
    this.handlePage = this.handlePage.bind(this);
  }
  componentDidMount() {
    const { slideDurationList, urlList } = this.props;
    const rootEl = document.getElementById(styles.root);
    this.rootWidth = rootEl.offsetWidth;
    this.rootHeight = rootEl.offsetHeight;
    this.canvasOddEl = document.getElementById(styles.rootCanvasOdd);
    this.canvasEvenEl = document.getElementById(styles.rootCanvasEven);
    this.coverEl = document.getElementById(styles.rootCover);
    this.slideDurationList = slideDurationList;
    this.urlList = urlList;
    this.slideDuration = 2;
    this.start();
  }
  componentWillReceiveProps(nextProps) {
    const { idList } = this.props;
    const nextIdList = nextProps.idList;
    if (idList.join() !== nextIdList.join()) {
      window.clearTimeout(this.renderTimeout);
      this.slideDurationList = nextProps.slideDurationList;
      this.urlList = nextProps.urlList;
      this.slideDuration = 2;
      this.start();
    }
  }
  shouldComponentUpdate() {
    return false;
  }
  componentWillUnmount() {
    window.clearTimeout(this.renderTimeout);
  }
  start() {
    this.first = true;
    this.odd = true;
    this.iList = 0;
    this.renderPlayable();
  }
  handleFile(file) {
    const { setOfflinePlaying } = this.props;
    const loadingTask = pdfjsLib.getDocument(convertDataURIToBinary(file));
    loadingTask.promise.then(
      this.handleDocument,
      () => {
        setOfflinePlaying(true);
      }
    );
  }
  handleDocument(pdfDocument) {
    this.pdfDocument = pdfDocument;
    this.iPage = 1;
    this.numPages = pdfDocument.numPages;
    this.renderPage();
  }
  handlePage(pdfPage) {
    let viewport = pdfPage.getViewport(1);
    const pdfWidth = viewport.width;
    const pdfHeight = viewport.height;
    const scaleX = this.rootWidth / pdfWidth;
    const scaleY = this.rootHeight / pdfHeight;
    const scale = Math.min(scaleX, scaleY);
    this.renderCanvasEl.width = pdfWidth * scale;
    this.renderCanvasEl.height = pdfHeight * scale;
    viewport = pdfPage.getViewport(scale);
    pdfPage.render({
      canvasContext: this.renderCanvasEl.getContext('2d'),
      viewport,
    });
  }
  renderPage() {
    const { setOfflinePlaying } = this.props;
    this.renderCanvasEl = this.odd ? this.canvasOddEl : this.canvasEvenEl;
    const renderedCanvasEl = !this.odd ? this.canvasOddEl : this.canvasEvenEl;
    this.renderCanvasEl.style.display = 'none';
    renderedCanvasEl.style.display = 'block';
    this.coverEl.style.opacity = 0;
    window.setTimeout(() => {
      this.coverEl.style.opacity = 1;
    }, (this.slideDuration - 1) * 1000);
    this.pdfDocument.getPage(this.iPage).then(
      this.handlePage,
      () => {
        setOfflinePlaying(true);
      });
    this.first = false;
    this.odd = !this.odd;
    this.iPage += 1;
    if (this.iPage <= this.numPages) {
      this.renderTimeout = window.setTimeout(this.renderPage, this.slideDuration * 1000);
      this.slideDuration = this.slideDurationList[this.iList];
    } else {
      const lastIList = this.iList;
      this.iList = this.iList < this.urlList.length - 1
        ? this.iList + 1 : 0;
      this.renderTimeout = window.setTimeout(this.renderPlayable, this.slideDuration * 1000);
      this.slideDuration = this.slideDurationList[lastIList];
    }
  }
  renderPlayable() {
    const { setOfflinePlaying } = this.props;
    getFile(this.urlList[this.iList])
      .then(
        this.handleFile,
        () => {
          setOfflinePlaying(true);
        });
  }
  render() {
    return (
      <div id={styles.root}>
        <canvas id={styles.rootCanvasOdd} className={styles.rootCanvas} />
        <canvas id={styles.rootCanvasEven} className={styles.rootCanvas} />
        <div id={styles.rootCover} />
      </div>
    );
  }
}
Slideshow.propTypes = {
  idList: PropTypes.array.isRequired,
  setOfflinePlaying: PropTypes.func.isRequired,
  slideDurationList: PropTypes.array.isRequired,
  urlList: PropTypes.array.isRequired,
};
export default connect(
  null,
  {
    setOfflinePlaying: fromOfflinePlaying.setOfflinePlaying,
  }
)(Slideshow);
