import React, { useState, useEffect } from 'react';
import axios from "axios";
import './MyPostsPage.css';
import { useParams } from 'react-router-dom'
import { useToast } from "@chakra-ui/toast";
import { Button } from 'react-bootstrap';
import Rating from '../Rating';

const MyPostPage = () => {
  const { id: postId} = useParams();
  const toast = useToast();
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState("");
  const [rating, setRating] = useState();
//  const [locationFile, setLocationFile] = useState([]);
  const [isPublic, setPublic] = useState(false);
  const [isMine, setMine] = useState(false);
  const [name, setName] = useState("");
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
//      console.log(res[0]);
      if(res){
        if(res[0].sender.email === user.email) setMine(true);
        setName(res[0].sender.name);
        setTitle(res[0].title);
        setDetails(res[0].details);
        setLocation(res[0].location);
        setRating(res[0].rating);
        setPublic(res[0].isPublic);
        setImage(res[0].image);
      }
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

  const goBack = async () => {
    window.history.back();
  }

  return (
    <div className="capturePage-container w-100">
      <div className="content-container">
        <div className="post">
          {isMine?(
            <div className="post-title">
              My POST : {title}
            </div>
          ):(
            <div className="post-title">
              {name}'s POST : {title}
            </div>
          )}
          <div className = "post-image-container">
            <img src={image} alt="" className="post-image" />
          </div>
          <div className="post-details">
            Details: {details}
          </div>
          <div className="post-details post-locations">
            Location: {location}
          </div>
          <div className="post-rating">
            Rating : <Rating value={rating}/>
          </div>
          <div className="post-details">
            Privacy: {isPublic? "Public" : "Private"}
          </div>
          <div className = "post-image-container">
            <Button variant='primary' className='my-2' onClick={goBack}>Go Back</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPostPage;
