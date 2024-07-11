import React, { useState, useEffect } from 'react';
import axios from "axios";
import './ExplorePage.css';
import { useParams } from 'react-router-dom'
import { useToast } from "@chakra-ui/toast";
import {Form, Button, Image, Row, Col } from 'react-bootstrap';
// import Comment from "../Comment";
import Rating from '../Rating';

const EditExplorePage = () => {
  const { id: postId} = useParams();
  const toast = useToast();
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState("");
  const [rating, setRating] = useState();
  const [comment, setComment] = useState("");
  const [liked, setLiked] = useState(false);
//  const [locationFile, setLocationFile] = useState([]);
  const [isPublic, setPublic] = useState(false);

  const user = JSON.parse(localStorage.getItem("userInfo"));
  // const [ logoutApiCall ] = useLogoutMutation();

  const fetchData = async () => {
    // console.log(user._id);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const res = (await axios.post("/api/post/edit", {"id": postId}, config)).data.message;
      res.forEach((post)=>{
        post.liked = false;
        post.comment = "";
        post.reviews.forEach((review)=>{
          if(review.user._id===user._id){
            post.liked = review.liked;
            post.comment = review.comment;
          }
        });
      });
      setTitle(res[0].title);
      setDetails(res[0].details);
      setLocation(res[0].location);
      setRating(res[0].rating);
      setPublic(res[0].isPublic);
      setImage(res[0].image);
      setComment(res[0].comment);
      setLiked(res[0].liked);
      // if(res[0].liked===false)
      //   document.getElementById("chkYes").checked = true;
      // else
      //   document.getElementById("chkNo").checked = true;
    } catch (error) {
      toast({
        title: "Error Ocurred!",
        description: "Failed to Load Data",
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

    fetchData();
    // eslint-disable-next-line
  }, []);

  // const setYesNo = async (val, chk_id) => {
  //   if(chk_id===1){
  //     if(document.getElementById("chkYes").checked){
  //       document.getElementById("chkNo").checked = false;
  //       setPublic(true);
  //     }
  //     else{
  //       document.getElementById("chkNo").checked = true;
  //       setPublic(false);
  //     }
  //   }
  //   else{
  //     if(document.getElementById("chkNo").checked){
  //       document.getElementById("chkYes").checked = false;
  //       setPublic(false);
  //     }
  //     else{
  //       document.getElementById("chkYes").checked = true;
  //       setPublic(true);
  //     }
  //   }
  // }

  const submitHandler = async () => {
    if(!comment)
      toast({title: "Error Occured!", description: "Input Comment", status: "error", position: "top-right", duration: 5000, isClosable: true,});
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const {data} = await axios.post("/api/post/comment_post", {"userId": user._id, "postId": postId, "comment": comment, "liked": liked}, config);
      if(data.state==="OK")
        toast({title: "Success!", description: "Post commented successfully.", status: "success", position: "top-right", duration: 5000, isClosable: true,});
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to commenting post",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  }

  return (
    <div className="capturePage-container w-100">
      <div className="content-container">
        <div className="w-75 border rounded shadow-sm">
        <Row >
          <Col md={12}>
            <span className="explore-post-title">- {title} -</span>
            <div className="explore-img-container mt-2">
              <Image src={image} className="explore-img"/>
            </div>
            <div className="p-4">
              <Row className="my-2">
                <Col md={3}><span><strong>Details :</strong></span></Col>
                <Col md={9}>{details}</Col>
              </Row>
              <Row className="my-2">
                <Col md={3}><span><strong>Location :</strong></span></Col>
                <Col md={9}>{location}</Col>
              </Row>
              <Row className="my-2">
                <Col md={3}><span><strong>Rating :</strong></span></Col>
                <Col md={9}><Rating value={rating}/></Col>
              </Row>
              <Row className="my-2">
                <Col md={3}><span><strong>Privacy :</strong></span></Col>
                <Col md={9}>{isPublic?("Public"):("Private")}</Col>
              </Row>
              {/* <Row className="my-2">
                <Col md={3}><span><strong>Like the Post :</strong></span></Col>
                <Col md={9}>
                  <Button variant='success btn-sm' onClick={submitHandler}>Like</Button>
                  <Button variant='success btn-sm' onClick={submitHandler}>UnLike</Button>
                  <Form.Check type='radio' label='Yes' id='chkYes' name='chkYes' value='Yes' onChange={(e) => setYesNo(e.target.value, 1)}></Form.Check>
                  <Form.Check type='radio' label='No' id='chkNo' name='chkNo' value='No' onChange={(e) => setYesNo(e.target.value, 2)}></Form.Check>
                </Col>
              </Row> */}
              <Row className="my-2">
                <Col md={3}><span><strong>Your Comment :</strong></span></Col>
                <Col md={9}>
                  <Form.Control type='text' placeholder='Enter comment here' value={comment} onChange={(e)=>setComment(e.target.value)}></Form.Control>
                </Col>
              </Row>
              <Row>
                <Col md={5}></Col>
                <Col md={2}>
                  <Button variant='primary' className='my-2' onClick={submitHandler}>Submit</Button>
                </Col>
                <Col md={5}></Col>
              </Row>
            </div>
          </Col>
        </Row>
        </div>
      </div>
    </div>
  );
};

export default EditExplorePage;