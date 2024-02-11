import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDetails.css'; // Import your CSS file
import { Link } from 'react-router-dom';
const AdminDetails = () => {
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        const response = await axios.get('https://apptest-88ck.onrender.com/admin', {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'), // Assuming you store the JWT token in localStorage
          },
        });
        console.log(response.data);
        setAdmins(response.data);
      } catch (error) {
        console.error('Error fetching admin details:', error);
      }
    };

    fetchAdminDetails();
  }, []);

  return (
    <div className="admin-details-container">
      <h1>Admin Details</h1>
      <Link to="/signup">
						<button>
							Add Admins
						</button>
					</Link>
                    <br />
      <div className="admin-list">
        {admins.map(admin => (
          <div key={admin._id} className="admin-card">
            <h2>{admin.companyName}</h2>
            <p>Email: {admin.email}</p>
            <p>Password: {admin.password}</p>
            <p>Phone Number: {admin.phoneNumber}</p>
            <p>Alternative Number: {admin.alternativeNumber}</p>
            <p>Plan: {admin.plan}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDetails;
