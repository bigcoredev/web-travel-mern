import React, { useState, useEffect } from "react";
import axios from "axios";
import './Dashboard.css';

const DashboardPage = () => {
  const [posts, setPosts] = useState([]);
  const [postCnt, setPostCnt] = useState(0);
  const [chatCnt, setChatCnt] = useState(0);
  const [userCnt, setUserCnt] = useState(0);
  const [top_posts, setTopPosts] = useState([]);


  useEffect(() => {
    const fetchPosts = async () => {
      const user = JSON.parse(localStorage.getItem("userInfo"));
      if(user){
        if(user.email==="superadmin@gmail.com"){
          document.getElementById('mySidebar').style.display="none";
          document.getElementById('AdminSidebar').style.display="block";  
        }
        else{
          document.getElementById('mySidebar').style.display="block";
          document.getElementById('AdminSidebar').style.display="none";  
        }
      }
  
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
  
        const timeElapsed = Date.now();
        const today = new Date(timeElapsed);
  
        const {data} = await axios.post("/api/admin/posts", {"today": today.toISOString().substring(0,10)}, config);
        setPosts(data.message);
        setPostCnt(data.message.length);
      } catch (error) { }
    };
  
    const fetchChats = async () => {
      const user = JSON.parse(localStorage.getItem("userInfo"));
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
  
        const timeElapsed = Date.now();
        const today = new Date(timeElapsed);
  
        const {data} = await axios.post("/api/admin/chats", {"today": today.toISOString().substring(0,10)}, config);
        setChatCnt(data.message.length);
      } catch (error) { }
    };
  
    const fetchUsers = async () => {
      const user = JSON.parse(localStorage.getItem("userInfo"));
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
  
        const timeElapsed = Date.now();
        const today = new Date(timeElapsed);
  
        const {data} = await axios.post("/api/admin/users", {"today": today.toISOString().substring(0,10)}, config);
        setUserCnt(data.message.length);
      } catch (error) { }
    };
  
    const fetchTopPosts = async () => {
      const user = JSON.parse(localStorage.getItem("userInfo"));
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
  
        // const timeElapsed = Date.now();
        // const today = new Date(timeElapsed);
  
        const {data} = await axios.get("/api/admin/top_posts", config);
        setTopPosts(data.message);
      } catch (error) { }
    };
  
    fetchPosts();
    fetchChats();
    fetchUsers();
    fetchTopPosts();
  }, []);

  return (
    <div className="dashboard-container w-100">
      <div className="dashboard-content-container">
        <div className="pagetitle">
          <h1>Admin Dashboard</h1>
        </div>

        <section className="section dashboard">
          <div className="row">

            {/* <!-- Left side columns --> */}
            <div className="col-lg-8">
              <div className="row">

                {/* <!-- Sales Card --> */}
                <div className="col-xxl-4 col-md-6">
                  <div className="card info-card sales-card">
                    <div className="card-body">
                      <h5 className="card-title">Posts <span>| Today</span></h5>

                      <div className="d-flex align-items-center">
                        <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                          <i className="bi bi-hearts"></i>
                        </div>
                        <div className="ps-3">
                          <h6>{postCnt}</h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <!-- Chats Card --> */}
                <div className="col-xxl-4 col-md-6">
                  <div className="card info-card revenue-card">
                    <div className="card-body">
                      <h5 className="card-title">Chats <span>| Today</span></h5>

                      <div className="d-flex align-items-center">
                        <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                          <i className="bi bi-chat-heart"></i>
                        </div>
                        <div className="ps-3">
                          <h6>{chatCnt}</h6>
                          {/* <span className="text-success small pt-1 fw-bold">8%</span> <span className="text-muted small pt-2 ps-1">increase</span> */}
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* <!-- Users Card --> */}
                <div className="col-xxl-4 col-xl-12">

                  <div className="card info-card customers-card">
                    <div className="card-body">
                      <h5 className="card-title">Users <span>| This Year</span></h5>

                      <div className="d-flex align-items-center">
                        <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                          <i className="bi bi-people"></i>
                        </div>
                        <div className="ps-3">
                          <h6>{userCnt}</h6>
                          {/* <span className="text-danger small pt-1 fw-bold">12%</span> <span className="text-muted small pt-2 ps-1">decrease</span> */}
                        </div>
                      </div>

                    </div>
                  </div>

                </div>
                {/* <!-- End Customers Card --> */}

                {/* <!-- Posts Today --> */}
                <div className="col-12">
                  <div className="card top-selling overflow-auto">
                    <div className="card-body pb-0">
                      <h5 className="card-title">Posts <span>| Today</span></h5>

                      <table className="table table-borderless">
                        <thead>
                          <tr>
                            <th scope="col">Preview</th>
                            <th scope="col">Title</th>
                            <th scope="col">Location</th>
                            <th scope="col">Sender</th>
                          </tr>
                        </thead>
                        <tbody>
                          {posts.map((post, i)=>(
                            <tr key={i}>
                              <th scope="row"><img src={post.image} alt="" /></th>
                              <td><span className="text-primary fw-bold">{post.title}</span></td>
                              <td>{post.location}</td>
                              <td className="fw-bold">{post.sender.name}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <!-- End Left side columns --> */}

            {/* <!-- Right side columns --> */}
            <div className="col-lg-4">
              {/* <!-- Top Commented Posts --> */}
              <div className="card">
                <div className="card-body pb-0">
                  <h5 className="card-title">Top Commented Posts</h5>

                  <div className="news">
                    {top_posts.map((post, i)=>(
                      <div className="post-item clearfix" key={i}>
                        <img src={post.image} alt=""/>
                        <h4>{post.title}<span className="badge bg-info text-primary">{post.reviews.length}</span></h4>
                        <p>{post.details}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* <!-- End Right side columns --> */}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;