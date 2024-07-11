import React, { useState, useEffect } from 'react';
import axios from "axios";
import './MyPostsPage.css';
//import { useToast } from "@chakra-ui/toast";
import { Row, Col, Card } from 'react-bootstrap';
import {Link} from 'react-router-dom';
import Rating from '../Rating';
import FormContainer from '../FormContainer';

const MyPostsPage = () => {
  const [posts, setPosts] = useState([]);
//  const toast = useToast();

  useEffect(() => {
    const isDarkMode = localStorage.getItem("isDarkMode");
    if (isDarkMode === "true") {
      document.documentElement.dataset.bsTheme = "dark";
    }
    // Mock fetching posts
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
  
        const {data} = await axios.post("/api/post/index", {"sender": user._id}, config);
        setPosts(data.message);
      } catch (error) {
        // toast({title: "Error Occured!", description: "Failed to Load the Posts", status: "error", duration: 5000, isClosable: true, position: "top-right"});
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="myPostsPage-container w-100">
      <div className="content-container">
        {/* Mapping through each post and rendering them */}
        <FormContainer>
        <Row>
        {posts.map(post => (
          <Col key={post._id} sm={12} md={6} lg={4} xl={3}>
            <Card className="p-3 rounded">
              <Link to={`/post/${post._id}`}>
                  <Card.Img src={post.image} className="post-image"/>
              </Link>

              <Card.Body>
                <Link to={`/post/${post._id}`}>
                    <Card.Title as="div">
                        <strong>{post.title}</strong>
                    </Card.Title>
                </Link>

                <Card.Text as='div' className='post-description'>
                    <strong>{post.details}</strong>
                </Card.Text>

                <Card.Text as='h3' className='post-date'>
                    <strong>{post.updatedAt.substring(0,10)}</strong>
                </Card.Text>

                <Card.Text as='div' className="post-location">
                    <strong>{post.location}</strong>
                </Card.Text>
 
                <Card.Text as='div'>
                  <Rating value={post.rating}/>
                </Card.Text>

              </Card.Body>
              <Link className="post-edit-button" to={`/post_edit/${post._id}`}>
                  Edit
              </Link>
            </Card>
          </Col>
        ))}
        </Row>
        </FormContainer>
      </div>
    </div>
  );
};

export default MyPostsPage;