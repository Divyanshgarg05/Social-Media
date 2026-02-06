import React,{ useEffect} from 'react'
import UserLayout from '@/layout/UserLayout'
import DashBoardLayout from '@/layout/DashboardLayout'
import { useDispatch } from 'react-redux';
import { getMyConnectionRequests ,AcceptConnection} from '@/config/redux/action/authAction';
import { BASE_URL } from '@/config';
import { useSelector } from 'react-redux';
import styles from "./index.module.css";
import { useRouter } from 'next/router';

export default function MyConnectionsPage() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  useEffect(() => {
   
    dispatch(getMyConnectionRequests({token :localStorage.getItem("token")}));
  }, []);

  const router = useRouter();

  useEffect(() => {
    if(authState.connectionRequests.length != 0){
      console.log("Connection requests:", authState.connectionRequests);
    }
  }, [authState.connectionRequests]);

  return (
   <UserLayout>
        
         
   <DashBoardLayout>
    <div style={{display:"flex",flexDirection:"column",gap:"1.7rem"}}>
        <h4>My Connection Requests</h4>

        {authState.connectionRequests.length === 0 && <h1>No connection request pending</h1>}

        {authState.connectionRequests.length != 0 && authState.connectionRequests.filter((connection) => connection.status_accepted === null).map((user,index) => {
         return(
          <div onClick={() => {
            router.push(`/view_profile/${user.userId.username}`);
          }} className={styles.userCard} key={index}>
            <div style={{display:"flex",alignItems:"center",gap:"1.2rem",justifyContent:"space-between"}}> 
              <div className={styles.profilePicture}> 
                <img src={`${BASE_URL}/${user.userId.profilePicture}`} alt="Profile Picture" />
              </div>
              <div className={styles.userInfo}>
                <h2>{user.userId.name}</h2>
                <p>{user.userId.username}</p>
              </div>

              <button onClick={(e) => {
                e.stopPropagation();
                dispatch(AcceptConnection({
                  token: localStorage.getItem("token"),
                  connectionId : user._id,
                  action:"accept"
                }))
              }} className={styles.connectedButton}>Accept</button>
          
               </div>
          </div>
         )
})}


<h4>My Network</h4>


{authState.connectionRequests.filter((connection) => connection.status_accepted !== null).map((user,index) => {
    return(
          <div onClick={() => {
            router.push(`/view_profile/${user.userId.username}`);
          }} className={styles.userCard} key={index}>
            <div style={{display:"flex",alignItems:"center",gap:"1.2rem",justifyContent:"space-between"}}> 
              <div className={styles.profilePicture}> 
                <img src={`${BASE_URL}/${user.userId.profilePicture}`} alt="Profile Picture" />
              </div>
              <div className={styles.userInfo}>
                <h2>{user.userId.name}</h2>
                <p>{user.userId.username}</p>
              </div>

             
               </div>
          </div>
         )
})}




    </div>
    </DashBoardLayout>

    </UserLayout>
  )
}
