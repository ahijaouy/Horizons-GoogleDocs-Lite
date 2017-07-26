import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as HeaderActions from './actions';
import PropTypes from 'prop-types';
import React from 'react';
import { Navbar, NavItem} from 'react-materialize';
import { Link } from 'react-router-dom';

// component part
const Header = ({links, updateLinks}) => {
  return (
      <Navbar id="navbar_login" brand='Dom Docs Portal' right className="purple darken-4">
        {links.map((link, id) => (
          <NavItem key={id}>
            <Link to={'/' + link} onClick={() => updateLinks(link) }>
              {link.toUpperCase()}
            </Link>
          </NavItem>))}
      </Navbar>
  );
};

Header.propTypes = {
  links: PropTypes.array,
  updateLinks: PropTypes.func
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
