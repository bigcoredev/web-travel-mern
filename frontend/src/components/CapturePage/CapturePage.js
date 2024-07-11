import React, { useState, useEffect } from "react";
import axios from "axios";
import './CapturePage.css';
import { useToast } from "@chakra-ui/toast";
import {Form, Button } from 'react-bootstrap';

const CapturePage = () => {
  const toast = useToast();

  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState("");
//  const [locations, setLocations] = useState([]);
//  const [locationFile, setLocationFile] = useState([]);
  const [isPublic, setPublic] = useState(false);

  const user = JSON.parse(localStorage.getItem("userInfo"));
//   const [ logoutApiCall ] = useLogoutMutation();

//   const fetchLocations = async () => {
//     try {
//       const config = {
//         headers: {
//           Authorization: `Bearer ${user.token}`,
//         },
//       };

//       const {data} = await axios.get("/api/post/location", config);
//       const locs = data.message;
//      setLocations(locs);
//     } catch (error) {
//       toast({
//         title: "Error Occured!",
//         description: "Failed to Load the locations",
//         status: "error",
//         duration: 5000,
//         isClosable: true,
//         position: "bottom-left",
//       });
//     }
//   };

  useEffect(() => {
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

    const isDarkMode = localStorage.getItem("isDarkMode");
    if (isDarkMode === "true") {
      document.documentElement.dataset.bsTheme = "dark";
    }

//    fetchLocations();
    if(isPublic===false)
      document.getElementById("chkPrivate").checked = true;
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
/*  const handleUpload = async () => {
    if(locationFile.length>0){
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post("/api/post/location/import", locationFile, config);
      const locs = data.message;
      setLocations(locs);
    }
  };

  const uploadLocations = async (file) => {
    let fileReader = new FileReader();

    fileReader.onloadend = () => {
      const content = fileReader.result;
      const lines = content.split('\n');
      setLocationFile(lines);
    };

    fileReader.readAsText(file);
  };
*/

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
      const reqData = {"sender": user._id, "title": title, "details": details, "location": location, "isPublic": isPublic, "image": image};
      const { data } = await axios.post("/api/post/submit", reqData, config);
      if(data.state==="OK"){
        toast({title: "Success!", description: "Post submitted successfully.", status: "success", position: "top-right", duration: 5000, isClosable: true,});
        document.location.href = "/posts";
      }
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to submit post",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
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
                <Form.Control type='text' placeholder='Enter location here' value={location} onChange={(e)=>setLocation(e.target.value)}></Form.Control>
              {/* <Form.Control as='select' value={location} onChange={(e) => setLocation(e.target.value)}>
                <option>Select location details</option>
                {locations && (locations.map((item)=>(
                  <option key={item.location}>{item.location}</option>
                  ))
                )}
              </Form.Control> */}
            </Form.Group>
            <Form.Group controlId='image' className='my-2'>
              <Form.Label>Image</Form.Label>
              <Form.Control type='file' onChange={uploadFileHandler}></Form.Control>
            </Form.Group>
            <Form.Group controlId='privacy' className='my-2'>
              <Form.Check type='radio' label='Public' id='chkPublic' name='chkPublic' value='Public' onChange={(e) => setChkPublic(e.target.value, 1)}></Form.Check>
              <Form.Check type='radio' label='Private' id='chkPrivate' name='chkPrivate' value='Private' onChange={(e) => setChkPublic(e.target.value, 2)}></Form.Check>
            </Form.Group>                
            <Button variant='primary' className='my-2' onClick={submitHandler}>Submit</Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default CapturePage;
