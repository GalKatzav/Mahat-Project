import React, { useEffect, useState } from "react";
import "../screensCSS/Registertion.css";
import { firebase } from "../../services/firebase/FireStore";
import { getDocs, collection, addDoc } from "firebase/firestore";
import { useForm } from "react-hook-form";

const Registration = () => {
  const [countUsers, setCountUsers] = useState(800100);
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm();

  const usersCollectionReference = collection(firebase, "users");

  useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await getDocs(usersCollectionReference);
        const maxId = data.docs.reduce(
          (max, doc) => Math.max(max, doc.data().id || 0),
          countUsers
        );
        setCountUsers(maxId + 1);
      } catch (e) {
        console.error("Cannot retrieve data from Firebase:", e);
      }
    };
    getUsers();
  }, [countUsers, usersCollectionReference]);

  const createUser = async (formData) => {
    try {
      const newUserId = countUsers;
      const newUser = { ...formData, id: newUserId };
      const docRef = await addDoc(usersCollectionReference, newUser);
      console.log("New user created with ID:", docRef.id);
      setCountUsers(newUserId + 1);
      reset();
    } catch (e) {
      console.error("Error adding document:", e);
    }
  };

  return (
    <div className="Registration">
      <div className="registration-container">
        <form className="registration-form" onSubmit={handleSubmit(createUser)}>
          <h2>Create New User</h2>
          <div className="form-columns">
            {/* Left Column */}
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
            {/* Right Column */}
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
              {/* District selection */}
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
          {/* Submit button */}
          <button type="submit" className="save-button">
            ADD NEW USER
          </button>
        </form>
      </div>
    </div>
  );
};

export default Registration;
