import React, { useState, useEffect } from "react";
import axios from "axios";
//import { useToast } from "@chakra-ui/toast";
import './Posts.css';

const PostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [postCnt, setPostCnt] = useState(0);

//  const toast = useToast();

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
  
        const {data} = await axios.post("/api/admin/posts", {"today": "ALL"}, config);
        setPosts(data.message);
        setPostCnt(data.message.length);
      } catch (error) { }
    };

    fetchPosts();
  }, []);

  return (
    <div className="dashboard-container w-100">
      <div className="dashboard-content-container">
        <div className="pagetitle">
          <h1>Users</h1>
        </div>

        <section className="section dashboard">
          <div className="row">
            {/* <!-- Posts Today --> */}
            <div className="col-12">
              <div className="card top-selling overflow-auto">
                <div className="posts-card-body pb-0">
                  <h5 className="card-title p-3">Posts <span>| {postCnt}</span></h5>

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
                          <td className='td-image'><img src={post.image} alt="" /></td>
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
        </section>
      </div>
    </div>
  );
};

export default PostsPage;