import React,{useEffect} from 'react';
import UserLayout from '@/layout/UserLayout';
import DashBoardLayout from '@/layout/DashboardLayout';
import { getAllPosts } from '@/config/redux/action/postAction';
import { getAllUsers } from '@/config/redux/action/authAction';
import { useRouter } from 'next/router';
import {useDispatch,useSelector} from 'react-redux';
import { BASE_URL } from '@/config';
import styles from "./index.module.css";
export default function Discoverpage() {

  const authState = useSelector((state) => state.auth)

  const dispatch = useDispatch();
  const router = useRouter();

useEffect(() => {
    if(!authState.all_profiles_fetched){
      dispatch(getAllUsers());
    }
},[])



  return (
    <UserLayout>
        
         
   <DashBoardLayout>
    <div>
        <h1>Discover</h1>

        <div className={styles.allUserProfile}>
          {authState.all_profiles_fetched && authState.all_users.map((user) => {
            return (
              <div onClick={() =>{ 
                router.push(`/view_profile/${user.userId.username}`)}
              } 
                className={styles.userCard}>
                <img className={styles.userCard__image} src={`${BASE_URL}/${user.userId.profilePicture}`} alt='profile'/>
                <div className="div">
                <h1>{user.userId.name}</h1>
                <p>{user.userId.username}</p>
                </div>
              </div>
            )
          })}
        </div>
    </div>
    </DashBoardLayout>

    </UserLayout>
  )
}
