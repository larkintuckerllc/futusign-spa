import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import brand from './brand.png';
import styles from './index.scss';

const RootMenu = ({ removeToken }) => (
  <nav id={styles.root} className="navbar navbar-default">
    <div className="container-fluid">
      <div className="navbar-header">
        <button
          type="button"
          className="navbar-toggle collapsed"
          data-toggle="collapse"
          data-target="#bs-example-navbar-collapse-1"
          aria-expanded="false"
        >
          <span className="sr-only">Toggle navigation</span>
          <span className="icon-bar" />
          <span className="icon-bar" />
          <span className="icon-bar" />
        </button>
        <div className="navbar-brand">
          <a href="https://www.futusign.com/">
            <img width="83" height="28" alt="Brand" src={brand} />
          </a>
        </div>
      </div>
      <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
        <ul className="nav navbar-nav">
          <li><Link to="/">Dashboard</Link></li>
          <li><Link to="/media">Media</Link></li>
        </ul>
        <div className="navbar-form navbar-right">
          <ul className="nav navbar-nav">
            <li><a onClick={removeToken}>Logout</a></li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
);
RootMenu.propTypes = {
  removeToken: PropTypes.func.isRequired,
};
export default RootMenu;
