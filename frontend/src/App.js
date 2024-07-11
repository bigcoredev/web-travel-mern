import React from "react";
import "./App.css";
import Homepage from "./Pages/Homepage";
import { Route } from "react-router-dom";
import Chatpage from "./Pages/Chatpage";
import CapturePage from './components/CapturePage/CapturePage'
import MyPostsPage from './components/MyPostsPage/MyPostsPage'
import UserAccountPage from './components/UserAccountPage/UserAccountPage'
import NotificationsPage from './components/NotificationsPage/NotificationsPage'
import ExplorePage from './components/ExplorePage/ExplorePage'
import EditPostPage from "./components/MyPostsPage/EditPostPage";
import EditExplorePage from "./components/ExplorePage/EditExplorePage";
import Sidebar from "./components/Sidebar";
import AdminSidebar from "./components/Admin/AdminSidebar";
import MyPostPage from "./components/MyPostsPage/MyPostPage";
import DashboardPage from "./components/Admin/Dashboard/Dashboard";
import UsersPage from "./components/Admin/Users/Users";
import PostsPage from "./components/Admin/Posts/Posts";
import EnquiryPage from "./components/Admin/Enquiry/Enquiry";
// function App() {
class App extends React.Component {
  constructor(props) {
    super(props);

    // Moblie first
    this.state = {
      isOpen: false,
      isMobile: true
    };

    this.previousWidth = -1;
  }

  updateWidth() {
    const width = window.innerWidth;
    const widthLimit = 250;
    const isMobile = width <= widthLimit;
    const wasMobile = this.previousWidth <= widthLimit;

    if (isMobile !== wasMobile) {
      this.setState({
        isOpen: !isMobile
      });
    }

    this.previousWidth = width;
  }

  /**
   * Add event listener
   */
  componentDidMount() {
    this.updateWidth();
    window.addEventListener("resize", this.updateWidth.bind(this));
  }

  /**
   * Remove event listener
   */
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWidth.bind(this));
  }

  toggle = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };


  render() {
    return (
      <div className="App">
        <AdminSidebar toggle={this.toggle} isOpen={this.state.isOpen} />
        <Sidebar toggle={this.toggle} isOpen={this.state.isOpen} />
        <Route path="/" component={Homepage} exact />
        <Route path="/chats" component={Chatpage} />      
        <Route path="/capture" component={CapturePage} />
        <Route path="/posts" component={MyPostsPage} />
        <Route path="/post/:id" component={MyPostPage} />
        <Route path="/post_edit/:id" component={EditPostPage} />
        <Route path="/explore" component={ExplorePage} />     
        <Route path="/comment/:id" component={EditExplorePage} />     
        <Route path="/notifications" component={NotificationsPage} />
        <Route path="/account" component={UserAccountPage} />

        <Route path="/admin/dashboard" component={DashboardPage} />      
        <Route path="/admin/users" component={UsersPage} />      
        <Route path="/admin/posts" component={PostsPage} />      
        <Route path="/admin/enquiry" component={EnquiryPage} />      
      </div>
    );
  }
}

export default App;
