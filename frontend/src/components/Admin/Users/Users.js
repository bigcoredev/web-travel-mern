import React, { useState, useEffect } from "react";
import axios from "axios";
//import { useToast } from "@chakra-ui/toast";
import './Users.css';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [userCnt, setUserCnt] = useState(0);

//  const toast = useToast();
  useEffect(() => {
    const fetchUsers = async () => {
      const user = JSON.parse(localStorage.getItem("userInfo"));
      try {
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
  
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
  
        const {data} = await axios.post("/api/admin/users", {"today": "ALL"}, config);
        setUsers(data.message);
        setUserCnt(data.message.length);
      } catch (error) { }
    };
    fetchUsers();
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
                <div className="card-body pb-0">
                  <h5 className="card-title">Users <span>| {userCnt}</span></h5>

                  <table className="table table-borderless">
                    <thead>
                      <tr>
                        <th scope="col">Preview</th>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Phone</th>
                        <th scope="col">Start Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user, i)=>(
                        <tr key={i}>
                          <td className='td-image'><img src={user.pic} alt="" /></td>
                          <td><span className="text-primary fw-bold">{user.name}</span></td>
                          <td>{user.email}</td>
                          <td>{user.phone}</td>
                          <td className="fw-bold">{user.createdAt}</td>
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

export default UsersPage;