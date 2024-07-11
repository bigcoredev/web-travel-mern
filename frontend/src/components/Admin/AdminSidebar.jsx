import React from 'react'
// import { useHistory } from 'react-router-dom';
import { Nav, Button } from "react-bootstrap";
import classNames from "classnames";

class AdminSidebar extends React.Component {
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
      <div id='AdminSidebar' name='AdminSidebar' className={classNames("sidebar", { "is-open": this.props.isOpen })}>
        <div className="sidebar-header">
          <Button variant="link" onClick={this.props.toggle}>
            <i className="fa fa-list toggle-icon" pull="right"/>
          </Button>
        </div>

        <Nav className="px-4 pt-2">
          <Nav.Item className="">
            <Nav.Link href="/admin/dashboard" className="">
              <i className="fa fa-home sidebar-item-icon" />
              <span className="sidebar-item-text">Dashboard</span>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item className="">
            <Nav.Link href="/admin/users">
              <i className="fa fa-user sidebar-item-icon" />
              <span className="sidebar-item-text">Users</span>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item className="">
            <Nav.Link href="/admin/posts">
              <i className="fa fa-cloud-upload sidebar-item-icon" />
              <span className="sidebar-item-text">Posts</span>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item className="">
            <Nav.Link href="/admin/enquiry">
              <i className="fa fa-comment sidebar-item-icon" />
              <span className="sidebar-item-text">Enquiry</span>
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

export default AdminSidebar