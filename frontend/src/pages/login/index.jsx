import UserLayout from "@/layout/UserLayout";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import styles from "./style.module.css";
import { loginUser, registerUser } from "@/config/redux/action/authAction";
import { emptyMessage } from "@/config/redux/reducer/authReducer";
function LoginComponent() {
  const authState = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();
  const [userLoginMethod, setUserLoginMethod] = useState(false);

  const [email, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [name, setname] = useState("");

  useEffect(() => {
    // check the reducer's LoggedIn flag (capital L)
    if (authState.LoggedIn) {
      router.push("/dashboard");
    }
  }, [authState.LoggedIn]);

  useEffect(() => {
    if(localStorage.getItem("token")){
      router.push("/dashboard")
    }
  }, [])


  useEffect(() => {
    dispatch(emptyMessage());
    
  },[userLoginMethod]);

  const handleRegister = async () => {
    console.log("Registering");

    dispatch(registerUser({username,password,email,name}))
  };

  const handleLogin = () => {
    console.log("Login...");
    dispatch(loginUser({email,password}))
  }

  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          <div className={styles.cardContainer_left}>
            <p className={styles.cardleft_heading}>
              {userLoginMethod ? "Sign In" : "Sign Up"}
            </p>
            <p style={{ color: authState.isError ? "red" : "green" }}>
              {authState.message}
            </p>

            <div className={styles.inputContainers}>
              {!userLoginMethod && (
                <div className={styles.inputRow}>
                  <input
                    onChange={(e) => setUsername(e.target.value)}
                    className={styles.inputField}
                    type="text"
                    placeholder="username"
                  ></input>
                  <input
                    onChange={(e) => setname(e.target.value)}
                    className={styles.inputField}
                    type="text"
                    placeholder="name"
                  ></input>
                </div>
              )}

              <input
                onChange={(e) => setEmailAddress(e.target.value)}
                className={styles.inputField}
                type="text"
                placeholder="email"
              ></input>
              <input
                onChange={(e) => setPassword(e.target.value)}
                className={styles.inputField}
                type="text"
                placeholder="password"
              ></input>

              <div
                onClick={() => {
                  if (userLoginMethod) {
                    handleLogin();
                  } else {
                    handleRegister();
                  }
                }}
                className={styles.buttonWithOutline}
              >
                <p>{userLoginMethod ? "Sign In" : "Sign Up"}</p>
              </div>
            </div>
          </div>
          <div className={styles.cardContainer_right}>

            
            
            {userLoginMethod ? <p>Don't Have an account</p> : <p>Already Have an Account</p>}
              <div
                onClick={() => {
                  
                 setUserLoginMethod(!userLoginMethod)
                }} style={{color : "black" , textAlign:"center"}}
                className={styles.buttonWithOutline}
              >
                <p>{userLoginMethod ? "Sign Up" : "Sign In"}</p>
              </div>
            </div>
          </div>
        </div>
      
    </UserLayout>
  );
}

export default LoginComponent;
