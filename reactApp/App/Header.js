import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as HeaderActions from './actions';
import PropTypes from 'prop-types';
import React from 'react';
import { Navbar, NavItem} from 'react-materialize';
import { Link } from 'react-router-dom';

// component part
const Header = ({links}) => {
  return (
    <div>
      <Navbar brand='Horizons GoogleDocs Lite' right>
        {links.map((link, id) => <NavItem key={id}><Link to={'/' + link}>{link.toUpperCase()}</Link></NavItem>)}
      </Navbar>
    </div>
  );
};

Header.propTypes = {
  links: PropTypes.array
};

const mapStateToProps = (state) => {
  return {
    links: state.header.links
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(HeaderActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);