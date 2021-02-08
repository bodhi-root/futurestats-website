import React from "react";
import {Navbar, Nav, NavItem, NavDropdown, MenuItem} from "react-bootstrap";
import {withPrefix} from "gatsby";

export default function NavBar() {
  return(

      <Navbar inverse fixedTop>
        <Navbar.Header>
          <Navbar.Brand>
            <a href={withPrefix("/")}>Futurestats</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>

        <Navbar.Collapse>
          <Nav pullRight>
            <NavItem eventKey={1} href={withPrefix("/about")}>
              About
            </NavItem>
            <NavItem eventKey={2} href={withPrefix("/blog")}>
              Blog
            </NavItem>
            <NavDropdown eventKey={3} title="Links" id="navbar-links-dropdown">
              <MenuItem eventKey={3.1} href="https://bodhi-root.github.io/public-wiki/">Dan's Notes</MenuItem>
              <MenuItem eventKey={3.2} href="https://bodhi-root.github.io/gambling-stats-bookdown/">Gambling &amp; Statistics</MenuItem>
              <MenuItem eventKey={3.3} href="https://bodhi-root.github.io/guitar-tabs/">Guitar Tabs</MenuItem>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
  );
}
