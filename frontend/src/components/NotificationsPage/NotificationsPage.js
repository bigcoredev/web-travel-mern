import React, { useState, useEffect } from 'react';
import './NotificationsPage.css';
import { Table, Button } from 'react-bootstrap';
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import { useToast } from "@chakra-ui/toast";


const NotificationsPage = () => {
  const [posts, setPosts] = useState([]);
  const [posts2, setPosts2] = useState([]);
  const [notificationsCount, setCount] = useState(0);

  const toast = useToast();

  const user = JSON.parse(localStorage.getItem("userInfo"));
  const fetchPosts = async () => {
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
      const {data} = await axios.post("/api/post/index", {"sender": user._id}, config);
      let arr_tmp = [];
      let cnt_tmp = 0;
      data.message.forEach((post)=>{
        post.reviews.forEach((review)=>{
          if(!review.noticed){
            arr_tmp.push({
              _id : post._id,
              title : post.title,
              sender : {
                _id : review.user._id,
                name : review.user.email,
              },
              comment : review.comment,
              liked : review.liked,
            });
            cnt_tmp++;
          }
        });
      });
      setPosts(arr_tmp);

      const data_notify = (await axios.post("/api/post/notified_posts", {"sender": user._id}, config)).data.message;
      setPosts2(data_notify);
      setCount(cnt_tmp + data_notify.length);
    } catch (error) { }
  };

  const deleteHandler = async(postId, userId) => {
    try{
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.post("/api/post/notify", {userId, postId}, config);
      toast({
        title: "Notified Success!",
        description: "Remove From Notifications",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      fetchPosts();
    } catch (err) {
      toast({
        title: "Error Occured!",
        description: "Failed to Close Notifications",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  }

  const notifyHandler = async(postId) => {
    try{
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const userId = user._id;
      await axios.post("/api/post/notify2", {userId, postId}, config);
      toast({
        title: "Notified Success!",
        description: "Remove From Notifications",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      fetchPosts();
    } catch (err) {
      toast({
        title: "Error Occured!",
        description: "Failed to Close Notifications",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  }

  useEffect(() => {
    const isDarkMode = localStorage.getItem("isDarkMode");
    if (isDarkMode === "true") {
      document.documentElement.dataset.bsTheme = "dark";
    }
    // Mock fetching posts
    fetchPosts();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="notificationPage-container w-100">
      <div className="notifications-container">
        <div className="notification-details">
          <div className="notifications-header">Notifications</div>
          <div className="notification-icon">
          <i className={`fa fa-2x fa-bell ${notificationsCount > 0 ? 'fa-shake' : ""}`} size={24} />
          {notificationsCount > 0 && (
            <div className="notification-count bg-info">
              {notificationsCount}
            </div>
          )}
        </div>
          {notificationsCount>0?(
            <>
          <div className="notification-action">
            <Table striped hover responsive className="table-md">
              <thead>
                  <tr>
                      <th>Notification</th>
                      <th>Sender</th>
                      <th>Post Title</th>
                      <th>Comment</th>
                      <th>Like</th>
                      <th></th>
                  </tr>
              </thead>
              <tbody>
                {posts2.map((post, i)=>(
                  <tr key={i}>
                    <td className='text-warning'>New</td>
                    <td>{post.sender.name}</td>
                    <td>{post.title}</td>
                    <td></td>
                    <td></td>
                    <td>
                        <Button variant='info' className='btn-sm' onClick={()=>notifyHandler(post._id)}>
                            <FaTimes style={{color: 'white'}}/>
                        </Button>
                    </td>
                  </tr>
                ))}
                {posts.map((post, i)=>(
                  <tr key={i}>
                    <td className='text-info'>Comment</td>
                    <td>{post.sender.name}</td>
                    <td>{post.title}</td>
                    <td>{post.comment}</td>
                    {post.liked?(<td>Like</td>):(<td></td>)}
                    <td>
                        <Button variant='info' className='btn-sm' onClick={()=>deleteHandler(post._id, post.sender._id)}>
                            <FaTimes style={{color: 'white'}}/>
                        </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          </>
          ):(
            <div className="notification-message">
              Currently, nothing to report!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;