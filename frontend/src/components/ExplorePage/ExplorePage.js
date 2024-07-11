import React, { useState, useEffect } from 'react';
import axios from "axios";
import './ExplorePage.css';
import { useToast } from "@chakra-ui/toast";
import {Row, Col, Card } from 'react-bootstrap';
import {Link} from 'react-router-dom';
import Rating from '../Rating';
import FormContainer from '../FormContainer';

const ExplorePage = () => {
  const [posts, setPosts] = useState([]);
  const toast = useToast();

  const user = JSON.parse(localStorage.getItem("userInfo"));
  const changeLikedPost  = async (postId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const {data} = await axios.post("/api/post/like_post", {"userId": user._id, "postId": postId}, config);
      data.message.forEach((post)=>{
        post.liked = false;
        post.comment = "";
        post.reviews.forEach((review)=>{
          if(review.user._id===user._id){
            post.liked = review.liked;
            post.comment = review.comment;
          }
        });
      });
      setPosts(data.message);
      toast({
        title: "Success!",
        description: "Liked Post Changed Successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Posts",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

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
  
        const {data} = await axios.post("/api/post/explore", {"sender": user._id}, config);
        data.message.forEach((post)=>{
          post.liked = false;
          post.comment = "";
          post.reviews.forEach((review)=>{
            if(review.user._id===user._id){
              post.liked = review.liked;
              post.comment = review.comment;
            }
          });
        });
        setPosts(data.message);
      } catch (error) {
        // toast({title: "Error Occured!", description: "Failed to Load the Posts", status: "error", duration: 5000, isClosable: true, position: "top-right"});
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="explorePage-container w-100">
      <div className="content-container">
        {/* Mapping through each post and rendering them */}
        <FormContainer>
        
        <Row>
        {posts.map(post => (
          <Col key={post._id} sm={12} md={6} lg={4} xl={3}>
            <Card className="my-3 p-3 rounded">
              <Card.Img src={post.sender.pic} className="user-image" variant="top"/>
              <Card.Text as="div" className='user-info'>
                  <strong>{post.sender.name}</strong>
              </Card.Text>


              <Card.Body className="">
              <div onClick={(e)=>changeLikedPost(post._id)}>
                  <Card.Img src={post.image} className="post-image" variant="top"/>
                  {post.liked? (<Card.Img src="/images/tick.png" className="liked-image"/>) : (<div className="liked-image"></div>)}
              </div>
                <Link to={`/post/${post._id}`}>
                    <Card.Title as="div" className='post-title'>
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

                <Card.Text as='div' className="post-comment">
                    - {post.comment} -
                </Card.Text>
              </Card.Body>

              <Link className="post-edit-button" to={`/comment/${post._id}`}>
                  Comment
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

export default ExplorePage;