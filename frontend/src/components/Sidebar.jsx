import React from 'react'
// import { useHistory } from 'react-router-dom';
import { Nav, Button } from "react-bootstrap";
import classNames from "classnames";

class Sidebar extends React.Component {
  // const history = useHistory();
  // const logoutHandler = () => {
  //   localStorage.removeItem("userInfo");
  //   history.push("/");
  // };
  logoutHandler() {
    localStorage.removeItem("userInfo");
    window.location.href="/";
  }

  render(){
    return (
      <div id='mySidebar' name='mySidebar' className={classNames("sidebar", { "is-open": this.props.isOpen })}>
        <div className="sidebar-header">
          <Button variant="link" onClick={this.props.toggle}>
            <i className="fa fa-list toggle-icon" pull="right"/>
          </Button>
        </div>

        <Nav className="px-4 pt-2">
          <Nav.Item className="">
            <Nav.Link href="/capture" className="">
              <i className="fa fa-cloud-upload sidebar-item-icon" />
              <span className="sidebar-item-text">Capture</span>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item className="">
            <Nav.Link href="/posts">
              <i className="fa fa-home sidebar-item-icon" />
              <span className="sidebar-item-text">My Posts</span>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item className="">
            <Nav.Link href="/explore">
              <i className="fa fa-eye sidebar-item-icon" />
              <span className="sidebar-item-text">Explore</span>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item className="">
            <Nav.Link href="/chats">
              <i className="fa fa-comment sidebar-item-icon" />
              <span className="sidebar-item-text">Chat</span>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item className="">
            <Nav.Link href="/notifications">
              <i className="fa fa-bell sidebar-item-icon" />
              <span className="sidebar-item-text">Notifications</span>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item className="">
            <Nav.Link href="/account" >
              <i className="fa fa-user sidebar-item-icon" />
              <span className="sidebar-item-text">User Account</span>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item className="">
            <Nav.Link onClick={this.logoutHandler} >
              <i className="fa fa-sign-out sidebar-item-icon" />
              <span className="sidebar-item-text">Logout</span>
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </div>
    );
  }
}

export default Sidebar