import React, { useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/toast";
import './Enquiry.css';

const EnquiryPage = () => {
  const [question1, setQuestion1] = useState("");
  const [question2, setQuestion2] = useState("");
  const [question3, setQuestion3] = useState("");
  const [answer1, setAnswer1] = useState("");
  const [answer2, setAnswer2] = useState("");
  const [answer3, setAnswer3] = useState("");
  const toast = useToast();
  const user = JSON.parse(localStorage.getItem("userInfo"));

  const submitHandler = async() => {
    if(question1==='' || question2==='' || question3==='' || answer1==="" || answer2==="" || answer3===""){
      toast({
        title: "Error Occured!",
        description: "All Field Value must input correctly.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    try{
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const reqData = {question1, question2, question3, answer1, answer2, answer3};
      const { data } = await axios.post("/api/admin/update_faqs", reqData, config);
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
      if(data.state==="OK"){
        toast({
          title: "Successful!",
          description: "FAQs are updated successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });  
      }
    }
    catch(error){}
  }

  const resetHandler = async() => {
    setQuestion1("");
    setQuestion2("");
    setQuestion3("");
    setAnswer1("");
    setAnswer2("");
    setAnswer3("");
  }

  useEffect(() => {
    const fetchFaqs = async () => {
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
    fetchFaqs();
  }, []);

  return (
    <div className="dashboard-container w-100">
      <div className="dashboard-content-container">
        <div className="pagetitle">
          <h1>Enquiry - FAQs</h1>
        </div>

        <section className="section dashboard">
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-4">
                      <div className="row">
                        <h5 className="card-title">FAQ 1</h5>
                        <div className="col-md-12">
                          <div className="form-floating">
                            <input type="text" className="form-control" id="floatingName" placeholder="Your Name" onChange={(e)=>setQuestion1(e.target.value)} value={question1}/>
                            <label htmlFor="floatingName">Question 1</label>
                          </div>
                        </div>
                        <div className="col-12 py-2">
                          <div className="form-floating">
                            <textarea className="faq-textarea form-control" placeholder="Address" id="floatingTextarea" style={{height: "100px"}} onChange={(e)=>setAnswer1(e.target.value)} value={answer1}></textarea>
                            <label htmlFor="floatingTextarea">Answer 1</label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="row">
                        <h5 className="card-title">FAQ 2</h5>
                        <div className="col-md-12">
                          <div className="form-floating">
                            <input type="text" className="form-control" id="floatingName" placeholder="Your Name" onChange={(e)=>setQuestion2(e.target.value)} value={question2}/>
                            <label htmlFor="floatingName">Question 2</label>
                          </div>
                        </div>
                        <div className="col-12 py-2">
                          <div className="form-floating">
                            <textarea className="faq-textarea form-control" placeholder="Address" id="floatingTextarea" style={{height: "100px"}} onChange={(e)=>setAnswer2(e.target.value)} value={answer2}></textarea>
                            <label htmlFor="floatingTextarea">Answer 2</label>
                          </div>
                        </div>
                        <div className="text-center faq-buttons py-2">
                          <button type="submit" className="btn btn-success" onClick={submitHandler}>Submit</button>
                          <button type="reset" className="btn btn-danger" onClick={resetHandler}>Reset</button>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="row">
                        <h5 className="card-title">FAQ 3</h5>
                        <div className="col-md-12">
                          <div className="form-floating">
                            <input type="text" className="form-control" id="floatingName" placeholder="Your Name" onChange={(e)=>setQuestion3(e.target.value)} value={question3}/>
                            <label htmlFor="floatingName">Question 3</label>
                          </div>
                        </div>
                        <div className="col-12 py-2">
                          <div className="form-floating">
                            <textarea className="faq-textarea form-control" placeholder="Address" id="floatingTextarea" style={{height: "100px"}} onChange={(e)=>setAnswer3(e.target.value)} value={answer3}></textarea>
                            <label htmlFor="floatingTextarea">Answer 3</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default EnquiryPage;