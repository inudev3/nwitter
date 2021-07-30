import Router from "components/Router";
import React, { useEffect, useState } from "react";
import {authService}from "fBase";
import "../styles.css";
// 

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => { // onauthstatechanged를 component가 mount될 때 한번만 쓰기 위해 useEffect를 씀
    authService.onAuthStateChanged((user) => { //firebase 에서 로그인되거나 초기화가 되면 변화를 캐치하는 observer 메소드, 마운트되면 setInit을 하구 유저유무에 따라 setisLoggedin을 함
      user? setUserObj(user): setUserObj(null);
      
      setInit(true);
    })
  }, []); //
  const refreshUser = () => {
    console.log(authService.currentUser.displayName);
    setUserObj({ ...authService.currentUser }); // authService.currentUser와 user는 같은 reference를 가리키며, 따라서 새로운 object를 생성해줘야 setState로 re-render함
 }
  return (
    <>
      {init ? <Router refreshUser={refreshUser} isLoggedIn={Boolean(userObj)} userObj={userObj}/> : "Initializing..."}
      <footer>&copy; Nwitter{new Date().getFullYear()}</footer>
    </>
  );
}

export default App;
