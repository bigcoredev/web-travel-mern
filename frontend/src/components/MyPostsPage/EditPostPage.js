import React, { useState, useEffect } from 'react';
import axios from "axios";
import './MyPostsPage.css';
import { useParams } from 'react-router-dom'
import { useToast } from "@chakra-ui/toast";
import { Form, Button, Image } from 'react-bootstrap';
import Rating from '../Rating';

const EditPostPage = () => {
  const { id: postId} = useParams();
  const toast = useToast();
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState("");
// const [locations, setLocations] = useState([]);
  const [rating, setRating] = useState();
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

    // const {data} = await axios.get("/api/post/location", config);
    // const locs = data.message;
    // setLocations(locs);

      const res = (await axios.post("/api/post/edit", {"id": postId}, config)).data.message;
      if(res[0].isPublic===false)
        document.getElementById("chkPrivate").checked = true;
      else
        document.getElementById("chkPublic").checked = true;
      setTitle(res[0].title);
      setDetails(res[0].details);
      setLocation(res[0].location);
      setRating(res[0].rating);
      setPublic(res[0].isPublic);
      setImage(res[0].image);
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

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append('image', e.target.files[0]);
    try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const res = await axios.post("/api/upload", formData, config);
        toast({
          title: "Success!",
          description: res.message,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
        setImage(res.data.image);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the locations",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  }

  const setChkPublic = async (val, chk_id) => {
    if(chk_id===1){
      if(document.getElementById("chkPublic").checked){
        document.getElementById("chkPrivate").checked = false;
        setPublic(true);
      }
      else{
        document.getElementById("chkPrivate").checked = true;
        setPublic(false);
      }
    }
    else{
      if(document.getElementById("chkPrivate").checked){
        document.getElementById("chkPublic").checked = false;
        setPublic(false);
      }
      else{
        document.getElementById("chkPublic").checked = true;
        setPublic(true);
      }
    }
  }

  const submitHandler = async () => {
    if(!title)
      toast({title: "Error Occured!", description: "Input Post Title", status: "error", position: "top-right", duration: 5000, isClosable: true,});
    if(!details)
      toast({title: "Error Occured!", description: "Input Post Details", status: "error", position: "top-right", duration: 5000, isClosable: true,});
    if(!image)
      toast({title: "Error Occured!", description: "Import Post Image", status: "error", position: "top-right", duration: 5000, isClosable: true,});
    if(location==='Select location details')
      toast({title: "Error Occured!", description: "Select Location", status: "error", position: "top-right", duration: 5000, isClosable: true,});
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const reqData = {"id":postId, "sender": user._id, "title": title, "details": details, "location": location, "isPublic": isPublic, "image": image, "rating": rating};
      const { data } = await axios.post("/api/post/update", reqData, config);
      if(data.state==="OK")
        toast({title: "Success!", description: "Post updated successfully.", status: "success", position: "top-right", duration: 5000, isClosable: true,});
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to updating post",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  }

  const goBack = async () => {
    window.history.back();
  }

  return (
    <div className="capturePage-container w-100">
      <div className="content-container">
        <div className="post-container">
          <Form>
            <Form.Group controlId='title' className='my-2'>
                <Form.Label>Title</Form.Label>
                <Form.Control type='text' placeholder='Enter post title here' value={title} onChange={(e)=>setTitle(e.target.value)}></Form.Control>
            </Form.Group>
            <Form.Group controlId='details' className='my-2'>
                <Form.Label>Details</Form.Label>
                <Form.Control type='text' placeholder='Enter post details here' value={details} onChange={(e)=>setDetails(e.target.value)}></Form.Control>
            </Form.Group>
            <Form.Group controlId='select-dropdown' className='my-2'>
              <Form.Label>Location</Form.Label>
              <Form.Control type='text' placeholder='Enter post location here' value={location} onChange={(e)=>setLocation(e.target.value)}></Form.Control>
              {/* <Form.Control as='select' value={location} onChange={(e) => setLocation(e.target.value)}>
                <option>Select location details</option>
                {locations && (locations.map((item)=>(
                  <option>{item.location}</option>
                  ))
                )}
              </Form.Control> */}
            </Form.Group>
            <Form.Group controlId='image' className='my-2'>
              <Form.Label>Image</Form.Label>
              <Image src={image} className="thumb-img"></Image>
              <Form.Control type='file' className="mt-2" onChange={uploadFileHandler}></Form.Control>
            </Form.Group>
            <Form.Group controlId='rating' className='my-2'>
                <Form.Label>Rating</Form.Label>
                <Rating value={rating}/>
                <Form.Control className="mt-2" type='text' placeholder='Enter rating here' value={rating} onChange={(e)=>setRating(e.target.value)}></Form.Control>
            </Form.Group>
            <Form.Label>Privacy</Form.Label>
            <Form.Group controlId='privacy' className='post-privacy'>
              <div class="row">
                <div class="col">
                  <Form.Check type='radio' label='Public' id='chkPublic' name='chkPublic' value='Public' onChange={(e) => setChkPublic(e.target.value, 1)}></Form.Check>
                </div>
                <div class="col">
                  <Form.Check type='radio' label='Private' id='chkPrivate' name='chkPrivate' value='Private' onChange={(e) => setChkPublic(e.target.value, 2)}></Form.Check>
                </div>
              </div>
            </Form.Group>                
            <div class="post-buttons mt-3">
              <Button variant='success' onClick={submitHandler}>Update</Button>
              <Button variant='warning' onClick={goBack}>Go Back</Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default EditPostPage;
