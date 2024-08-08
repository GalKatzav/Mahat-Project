import React from "react";
import "../screensCSS/Registertion.css";
import { firebase, auth } from "../../services/firebase/FireStore";
import {
  getDocs,
  collection,
  setDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Registration = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm();
  const navigate = useNavigate();
  const usersCollectionReference = collection(firebase, "users");

  const checkUserExists = async (email, userName) => {
    const emailQuery = query(
      usersCollectionReference,
      where("email", "==", email)
    );
    const userNameQuery = query(
      usersCollectionReference,
      where("userName", "==", userName)
    );

    const emailSnapshot = await getDocs(emailQuery);
    const userNameSnapshot = await getDocs(userNameQuery);

    return !emailSnapshot.empty || !userNameSnapshot.empty;
  };

  const createUser = async (formData) => {
    try {
      const userExists = await checkUserExists(
        formData.email,
        formData.userName
      );

      if (userExists) {
        toast.error(
          "User with this email or username already exists. Please try again."
        );
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        const firebaseUser = userCredential.user;

        const newUser = {
          ...formData,
          id: firebaseUser.uid,
          email: formData.email,
          userName: formData.userName,
          fullName: formData.fullName,
          phone: formData.phone,
          district: formData.district,
        };
        await setDoc(doc(usersCollectionReference, firebaseUser.uid), newUser);

        toast.success("New user created successfully!");
        reset();
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (e) {
      console.error("Error adding document:", e);
      toast.error("An error occurred while creating the user.");
    }
  };

  return (
    <div className="Registration">
      <ToastContainer />
      <div className="registration-container">
        <form className="registration-form" onSubmit={handleSubmit(createUser)}>
          <h2>Create New User</h2>
          <div className="form-columns">
            <div className="left-column">
              <div className="input-group">
                <input
                  {...register("fullName", { required: true, minLength: 2 })}
                  type="text"
                  placeholder="Full Name"
                />
                {errors.fullName && (
                  <div className="error-message">
                    * Enter valid full name (min 2 chars)
                  </div>
                )}
              </div>
              <div className="input-group">
                <input
                  {...register("userName", { required: true, minLength: 2 })}
                  type="text"
                  placeholder="User Name"
                />
                {errors.userName && (
                  <div className="error-message">
                    * Enter valid user name (min 2 chars)
                  </div>
                )}
              </div>
              <div className="input-group">
                <input
                  {...register("phone", { required: true, minLength: 9 })}
                  type="text"
                  placeholder="Phone Number"
                />
                {errors.phone && (
                  <div className="error-message">
                    * Enter valid phone number (min 9 chars)
                  </div>
                )}
              </div>
              <div className="input-group">
                <input
                  {...register("email", {
                    required: true,
                    pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  })}
                  type="email"
                  placeholder="Email Address"
                />
                {errors.email && (
                  <div className="error-message">* Enter valid email</div>
                )}
              </div>
            </div>
            <div className="right-column">
              <div className="input-group">
                <input
                  {...register("password", {
                    required: true,
                    minLength: 8,
                    pattern:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  })}
                  type="password"
                  placeholder="Password"
                />
                {errors.password && (
                  <div className="error-message">
                    * Password must be at least 8 characters, include upper and
                    lower case letters, a number, and a special character.
                  </div>
                )}
              </div>
              <div className="input-group">
                <input
                  {...register("confirmPassword", {
                    required: true,
                    validate: (value) => value === getValues("password"),
                  })}
                  type="password"
                  placeholder="Confirm Password"
                />
                {errors.confirmPassword && (
                  <div className="error-message">* Passwords do not match</div>
                )}
              </div>
              <div className="district-group">
                <label>
                  <input
                    {...register("district", { required: true })}
                    type="radio"
                    value="Center District"
                  />
                  Center District
                </label>
                <label>
                  <input
                    {...register("district", { required: true })}
                    type="radio"
                    value="North District"
                  />
                  North District
                </label>
                <label>
                  <input
                    {...register("district", { required: true })}
                    type="radio"
                    value="South District"
                  />
                  South District
                </label>
                <label>
                  <input
                    {...register("district", { required: true })}
                    type="radio"
                    value="Jerusalem District"
                  />
                  Jerusalem District
                </label>
                <label>
                  <input
                    {...register("district", { required: true })}
                    type="radio"
                    value="Eilat District"
                  />
                  Eilat District
                </label>
                {errors.district && (
                  <div className="error-message">
                    * Please select a district
                  </div>
                )}
              </div>
            </div>
          </div>
          <button type="submit" className="save-button">
            ADD NEW USER
          </button>
        </form>
      </div>
    </div>
  );
};

export default Registration;
