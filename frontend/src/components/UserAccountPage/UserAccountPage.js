import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Table } from 'react-bootstrap';
import { Input } from "@chakra-ui/input";
import { useToast } from "@chakra-ui/toast";
import "./UserAccountPage.css";
import Rating from '../Rating';

const UserAccountPage = () => {
  const [activeTab, setActiveTab] = useState("details");
  const [profile, setProfile] = useState([]);
  const [edit, setEdit] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const toast = useToast();

  const [name, setName] = useState();
  const [firstname, setFirstname] = useState();
  const [lastname, setLastname] = useState();
  const [email, setEmail] = useState();
  const [phone, setPhone] = useState();
  const [pic, setPic] = useState();
  const [picLoading, setPicLoading] = useState(false);
  const [posts1, setPosts1] = useState([]);
  const [posts2, setPosts2] = useState([]);

  const [question1, setQuestion1] = useState("");
  const [question2, setQuestion2] = useState("");
  const [question3, setQuestion3] = useState("");
  const [answer1, setAnswer1] = useState("");
  const [answer2, setAnswer2] = useState("");
  const [answer3, setAnswer3] = useState("");

  const user = JSON.parse(localStorage.getItem("userInfo"));

  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };
  const id = user._id;

  const fetchFaqs = async () => {
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

      const {data} = await axios.get("/api/admin/faqs", config);
      data.message.forEach((faq)=>{
        if(faq.no===1){
          setQuestion1(faq.question);
          setAnswer1(faq.answer);
        }
        if(faq.no===2){
          setQuestion2(faq.question);
          setAnswer2(faq.answer);
        }
        if(faq.no===3){
          setQuestion3(faq.question);
          setAnswer3(faq.answer);
        }
      });
    } catch (error) { }
  };

  useEffect(() => {
    const isDark = localStorage.getItem("isDarkMode");
    if (isDark === "true") {
      // window.document.documentElement.classList.add("dark");
      document.documentElement.dataset.bsTheme = "dark";
      setIsDarkMode(isDark);
    }

    fetchFaqs();
    fetchLikedPosts();
    fetchStarsPosts();

    const getUserById = async () => {
      const { data } = await axios.get(`/api/user/${id}`, config);
      setProfile(data);
    };
    getUserById();
    
    if(user) {
      setName(user.name);
      setFirstname(user.firstname);
      setLastname(user.lastname);
      setEmail(user.email);
      setPhone(user.phone);
    }else{
      return;
    }
    // eslint-disable-next-line
  }, []);

  const fetchLikedPosts = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const {data} = await axios.post("/api/post/explore", {"sender": user._id}, config);
      let arr_tmp = [];
      data.message.forEach((post)=>{
        post.reviews.forEach((review)=>{
          if(review.user._id === user._id && review.liked===true){
            arr_tmp.push({
              _id : post._id,
              title : post.title,
              location : post.location,
              sender : {
                _id : post.sender._id,
                name : post.sender.email,
              },
              comment : review.comment,
            });
          }
        });
      });
      setPosts1(arr_tmp);
    } catch (error) {}
  };

  const fetchStarsPosts = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const {data} = await axios.post("/api/post/index", {"sender": user._id}, config);
      let arr_tmp = [];
      data.message.forEach((post)=>{
        if(post.rating>0){
          arr_tmp.push({
            _id : post._id,
            title : post.title,
            location : post.location,
            rating : post.rating,
          });
        }
      });
      setPosts2(arr_tmp);
    } catch (error) {}
  };

  const toggleDarkMode = () => {
    // window.document.documentElement.classList.toggle("dark");
    if(document.documentElement.dataset.bsTheme === "dark"){
      document.documentElement.dataset.bsTheme = "";
      localStorage.setItem("isDarkMode", "false");
    }
    else{
      document.documentElement.dataset.bsTheme = "dark";
      localStorage.setItem("isDarkMode", "true");
    }
  }

  const getContent = () => {
    switch (activeTab) {
      case "details": case "likes":
        return <div>
          <Table striped hover responsive className="table-md">
            <thead>
                <tr>
                    <th>Sender</th>
                    <th>Post Title</th>
                    <th>Location</th>
                    <th>My Comment</th>
                </tr>
            </thead>
            <tbody>
              {posts1.map((post, i)=>(
                <tr key={i}>
                  <td>{post.sender.name}</td>
                  <td>{post.title}</td>
                  <td>{post.location}</td>
                  <td>{post.comment}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>;
      case "stars":
        return (
          <div>
            <Table striped hover responsive className="table-md">
            <thead>
                <tr>
                    <th>Post Title</th>
                    <th>Location</th>
                    <th>Rating</th>
                </tr>
            </thead>
            <tbody>
              {posts2.map((post, i)=>(
                <tr key={i}>
                  <td>{post.title}</td>
                  <td>{post.location}</td>
                  <td><Rating value={post.rating}/></td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>);
      case "settings":
        return (
          <>
          <ul className="nav nav-tabs" id="myTab" role="tablist">
            <li className="nav-item-user" role="presentation">
              <button className="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#notifications" type="button" role="tab" aria-controls="notifications" aria-selected="true">Notifications</button>
            </li>
            <li className="nav-item-user" role="presentation">
              <button className="nav-link" id="contact-tab" data-bs-toggle="tab" data-bs-target="#theme" type="button" role="tab" aria-controls="theme" aria-selected="false">Theme</button>
            </li>
          </ul>
          <div className="tab-content-user pt-2" id="myTabContent">
            <div className="tab-pane fade show active" id="notifications" role="tabpanel" aria-labelledby="home-tab">
              <div className="row mb-5">
                <label className="col-sm-2 col-form-label">Posts</label>
                <div className="col-sm-10">
                  <div className="form-check form-switch mt-3">
                    <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault" />
                    <label className="form-check-label" htmlFor="flexSwitchCheckDefault">New Posts</label>
                  </div>
                  <div className="form-check form-switch mt-3">
                    <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault" />
                    <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Likes</label>
                  </div>
                  <div className="form-check form-switch mt-3">
                    <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault" />
                    <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Comments</label>
                  </div>
                </div>
              </div>
            </div>
            <div className="tab-pane fade" id="theme" role="tabpanel" aria-labelledby="contact-tab">
              <div className="row mb-5">
                <label className="col-sm-2 col-form-label">Theme Switch</label>
                <div className="col-sm-10">
                  <div className="form-check form-switch mt-3">
                    <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault" onChange={toggleDarkMode}
                    value={isDarkMode}/>
                    <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Dark Mode</label>
                  </div>
                </div>
              </div>
            </div>
          </div></>
        );
      case "help":
        return (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">FAQ</h5>

            <div className="accordion accordion-flush" id="faq-group-1">

              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button className="accordion-button collapsed" data-bs-target="#faqsOne-1" type="button" data-bs-toggle="collapse">
                    {question1}
                  </button>
                </h2>
                <div id="faqsOne-1" className="accordion-collapse collapse" data-bs-parent="#faq-group-1">
                  <div className="accordion-body bg-white">
                    {answer1}
                  </div>
                </div>
              </div>

              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button className="accordion-button collapsed" data-bs-target="#faqsOne-2" type="button" data-bs-toggle="collapse">
                    {question2}
                  </button>
                </h2>
                <div id="faqsOne-2" className="accordion-collapse collapse" data-bs-parent="#faq-group-1">
                  <div className="accordion-body bg-white">
                    {answer2}
                  </div>
                </div>
              </div>

              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button className="accordion-button collapsed" data-bs-target="#faqsOne-3" type="button" data-bs-toggle="collapse">
                    {question3}
                  </button>
                </h2>
                <div id="faqsOne-3" className="accordion-collapse collapse" data-bs-parent="#faq-group-1">
                  <div className="accordion-body bg-white">
                    {answer3}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
        );
      default:
        return <div>Select a tab to view content.</div>;
    }
  };

  const profileEditHandler = () => {
    setEdit(true);
  };

  const updateHandler = async () => {
   
    setPicLoading(true);
    if (!name || !email || !firstname || !lastname || !phone) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
    
    console.log(name, firstname, lastname, email, pic, phone);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.put(
        `/api/user/update/${id}`,
        {
          name,
          firstname,
          lastname,
          email,
          phone,
          pic,
        },
        config
      );
      console.log(data);
      toast({
        title: "Profile Updated Successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setPicLoading(false);
      setEdit(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
    }
  };

  const postDetails = async (pics) => {
    setPicLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    console.log("pics", pics);

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("image", pics);

      const response = await axios({
        method: "post",
        url: "/api/upload",
        data: data,
        headers: { "Content-Type": "multipart/form-data" },
      });
      setPic(response.data.image);
      setPicLoading(false);

      console.log("sucessPic", pic);
    } else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
  };

  return (
    <div className="userAccountPage-container w-100">
      <div className="account-details-container">
        <div className="user-details">
          <div className="user-details-header">
            <h1>My Account Details</h1>
            {edit === false ? (
              <i
                className="fa fa-edit edit-icon"
                onClick={profileEditHandler}
              />
            ) : (
              <i
                className="fa fa-arrow-left edit-icon"
                onClick={(e) => setEdit(false)}
              />
            )}
          </div>
          {edit === false ? (
            <>
              <img src={profile.pic} alt="User" className="user-account-image" />
              <div className="user-info">
                <p>
                  <strong>Username:</strong> {profile.name}
                </p>
                <p>
                  <strong>First Name:</strong> {profile.firstname}
                </p>
                <p>
                  <strong>Last Name:</strong> {profile.lastname}
                </p>
                <p>
                  <strong>Email:</strong> {profile.email}
                </p>
                <p>
                  <strong>Phone No:</strong> {profile.phone}
                </p>
              </div>
            </>
          ) : (
            <>
              <FormControl id="first-name" isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                  value={name}
                  placeholder="Enter Your Name"
                  onChange={(e) => setName(e.target.value)}
                />
              </FormControl>
              <FormControl id="firstname" isRequired>
                <FormLabel>FirstName</FormLabel>
                <Input
                  value={firstname}
                  placeholder="Enter Your First Name"
                  onChange={(e) => setFirstname(e.target.value)}
                />
              </FormControl>
              <FormControl id="lastname" isRequired>
                <FormLabel>LastName</FormLabel>
                <Input
                  value={lastname}
                  placeholder="Enter Your Name"
                  onChange={(e) => setLastname(e.target.value)}
                />
              </FormControl>
              <FormControl id="email" isRequired>
                <FormLabel>Email Address</FormLabel>
                <Input
                  value={email}
                  type="email"
                  placeholder="Enter Your Email Address"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
              <FormControl id="phone" isRequired>
                <FormLabel>PhoneNumber</FormLabel>
                <Input
                  value={phone}
                  type="text"
                  placeholder="Enter Your PhoneNumber"
                  onChange={(e) => setPhone(e.target.value)}
                />
              </FormControl>
              <FormControl id="pic">
                <FormLabel>Upload your Picture</FormLabel>
                <Input
                  type="file"
                  p={1.5}
                  onChange={(e) => postDetails(e.target.files[0])}
                />
              </FormControl>
              <Button
                colorScheme="blue"
                width="100%"
                style={{ marginTop: 15 }}
                onClick={updateHandler}
                isLoading={picLoading}
              >
                Update
              </Button>
            </>
          )}
        </div>

        {/* Tabs for liked posts, settings, etc. */}
        <div className="account-tabs">
          <i
            className="fa fa-heart tab-icon"
            onClick={() => setActiveTab("likes")}
          />
          <i
            className="fa fa-star tab-icon"
            onClick={() => setActiveTab("stars")}
          />
          {/* <i
            className="fa fa-paint-brush tab-icon"
            onClick={() => setActiveTab("paint")}
          /> */}
          <i
            className="fa fa-cog tab-icon"
            onClick={() => setActiveTab("settings")}
          />
          <i
            className="fa fa-question-circle tab-icon"
            onClick={() => setActiveTab("help")}
          />
        </div>

        {/* The content area where the tab content will be displayed */}
        <div className="tab-content">
          {getContent()}
          {/* Content based on active tab goes here */}
        </div>
      </div>
    </div>
  );
};

export default UserAccountPage;
