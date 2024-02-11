import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";

const Signup = () => {
	const [data, setData] = useState({
		companyName: "",
		phoneNumber: "",
		alternativeNumber:  "",
		plan: "",
		email: "",
		password: "",
	});
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const url = "https://apptest-88ck.onrender.com/register-company";
			const { data: res } = await axios.post(url, data);
			navigate("/s-admin");
			console.log(res.message);
		} catch (error) {
			if (
				error.response &&
				error.response.status >= 400 &&
				error.response.status <= 500
			) {
				setError(error.response.data.message);
			}
		}
	};

	return (
		<div className={styles.signup_container}>
			<div className={styles.signup_form_container}>
				{/* <div className={styles.left}>
					<h1>Welcome Back</h1>
					<Link to="/login">
						<button type="button" className={styles.white_btn}>
							Sign in
						</button>
					</Link>
				</div> */}
				<div className={styles.left}>
					<form className={styles.form_container} onSubmit={handleSubmit}>
						<h1>Create Account</h1>
						<input
							type="text"
							placeholder="Company Name"
							name="companyName"
							onChange={handleChange}
							value={data.companyName}
							required
							className={styles.input}
						/>
						<input
							type="email"
							placeholder="Email"
							name="email"
							onChange={handleChange}
							value={data.email}
							required
							className={styles.input}
						/>
						<input
							type="password"
							placeholder="Password"
							name="password"
							onChange={handleChange}
							value={data.password}
							required
							className={styles.input}
						/>
						<input
							type="text"
							placeholder="Phone Number"
							name="phoneNumber"
							onChange={handleChange}
							value={data.phoneNumber}
							required
							className={styles.input}
						/>
						<input
							type="text"
							placeholder="Alternative Number"
							name="alternativeNumber"
							onChange={handleChange}
							value={data.alternativeNumber}
							required
							className={styles.input}
						/>
						<input
							type="text"
							placeholder="Plan in months"
							name="plan"
							onChange={handleChange}
							value={data.plan}
							required
							className={styles.input}
						/>
						
						{error && <div className={styles.error_msg}>{error}</div>}
						<button type="submit" className={styles.green_btn}>
							Sign Up
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Signup;