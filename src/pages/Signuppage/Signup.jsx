import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { authService } from "../../api/services/authService";
import { toast } from "sonner";
import { useSignup } from "../../hooks/queries/auth";
import ButtonLoadingSpinner from "../../components/ButtonLoadingSpinners";

function Signup() {
  const [fullname, setfullname] = useState("");
  const [phonenumber, setphonenumber] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [showPassword, setshowPassword] = useState(false);
  // const [showConfirmPassword, setshowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { mutate: signupMutation, isLoading, error } = useSignup();

  // Add error states
  const [errors, setErrors] = useState({
    fullname: "",
    phonenumber: "",
    email: "",
    password: "",
    // confirmPassword: "",
  });

  function reset() {
    setfullname("");
    setphonenumber("");
    setemail("");
    setpassword("");
    setconfirmPassword("");
  }

  // Validation functions
 const validateFullName = (value) => {
  if (value.trim().length < 3) {
    return "Full name must be at least 3 characters long";
  }
  return "";
};


  const validatePhone = (value) => {
    if (!/^\d{10}$/.test(value)) {
      return "Phone number must be 10 digits";
    }
    return "";
  };

  const validateEmail = (value) => {
    if (value && !/\S+@\S+\.\S+/.test(value)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const validatePassword = (value) => {
  if (value.length < 8) {
    return "Password must be at least 8 characters long";
  }
  return "";
};


  // Update handlers with validation
  const handleFullName = (e) => {
    const value = e.target.value;
    setfullname(value);
    setErrors((prev) => ({ ...prev, fullname: validateFullName(value) }));
  };

  const handlePhone = (e) => {
    const value = e.target.value;
    setphonenumber(value);
    setErrors((prev) => ({ ...prev, phonenumber: validatePhone(value) }));
  };

  const handleEmail = (e) => {
    const value = e.target.value;
    setemail(value);
    setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
  };

  const handlePassword = (e) => {
    const value = e.target.value;
    setpassword(value);
    setErrors((prev) => ({
      ...prev,
      password: validatePassword(value),
    }));

    // if (confirmPassword.length > 0) {
    //   setErrors((prev) => ({
    //     ...prev,
    //     confirmPassword:
    //       value !== confirmPassword ? "Passwords do not match" : "",
    //   }));
    // }
  };

  // const handleConfirmPassword = (e) => {
  //   const value = e.target.value;
  //   setconfirmPassword(value);
  //   setErrors((prev) => ({
  //     ...prev,
  //     confirmPassword: value !== password ? "Passwords do not match" : "",
  //   }));
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {
      fullname: validateFullName(fullname),
      phonenumber: validatePhone(phonenumber),
      email: validateEmail(email),
      password: validatePassword(password),
      // confirmPassword:
      //   password !== confirmPassword ? "Passwords do not match" : "",
    };

    setErrors(newErrors);

    // Check if there are any errors
    if (Object.values(newErrors).some((error) => error !== "")) {
      return;
    }

    // Call signupMutation with proper error handling
    signupMutation(
      { username: fullname, phonenumber, email, password },
      {
        onSuccess: () => {
          reset();
        },
        onError: (error) => {
          const errorMessage = error.response?.data?.message || "Signup failed";
          toast.error(errorMessage);
          // Optionally set server-side error in the errors state
          setErrors((prev) => ({
            ...prev,
            server: errorMessage,
          }));
        },
      }
    );
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h1>Signup</h1>
        <p className="signup-subtitle">Create an account to start shopping</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="fullName"
              value={fullname}
              onChange={handleFullName}
              placeholder="Full name *"
              required
            />
            {errors.fullname && (
              <div className="error-message">{errors.fullname}</div>
            )}
          </div>

          <div className="form-group phone-input">
            <select className="country-code">
              <option value="+91">+91</option>
            </select>
            <input
              type="tel"
              name="phoneNumber"
              value={phonenumber}
              onChange={handlePhone}
              placeholder="Phone Number *"
              required
            />
          </div>
          {errors.phonenumber && (
            <div
              className="error-message"
              style={{ color: "red", fontSize: "12px" }}
            >
              {errors.phonenumber}
            </div>
          )}

          <div className="form-group">
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleEmail}
              placeholder="Email Address *"
              required
            />
            {errors.email && (
              <div className="error-message">{errors.email}</div>
            )}
          </div>

          <div className="form-group password-input">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={handlePassword}
              placeholder="Password *"
              required
            />
            <span
              className="password-toggle"
              onClick={() => setshowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
            {errors.password && (
              <div className="error-message">{errors.password}</div>
            )}
          </div>

          {/* <div className="form-group password-input">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleConfirmPassword}
              placeholder="Confirm Password *"
              required
            />
            <span
              className="password-toggle"
              onClick={() => setshowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
            {errors.confirmPassword && (
              <div className="error-message">{errors.confirmPassword}</div>
            )}
          </div> */}

          <button type="submit" className="signup-button">
            {isLoading ? <ButtonLoadingSpinner /> : "Continue"}
          </button>

          <div className="terms-text">
            By continuing, you agree to our{" "}
            <Link to="/terms">Terms of Service</Link> &{" "}
            <Link to="/privacy">Privacy Policy</Link>
          </div>
        </form>

        <div className="login-link">
          <div className="separator">Already have an account?</div>
          <Link to="/login" className="login-button">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
