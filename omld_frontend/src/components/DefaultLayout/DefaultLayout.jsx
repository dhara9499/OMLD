import {Link, Navigate, Outlet} from "react-router-dom";
import {useStateContext} from "../../context/ContextProvider";
import axiosClient from "../../axios-client.js";
import {useEffect} from "react";
import Header from "../../pages/Header/Header.jsx";
import 'bootstrap/dist/css/bootstrap.min.css'; 


export default function DefaultLayout() {
  const {user, token, setUser, setToken, notification} = useStateContext();

  if (!token) {
    return <Navigate to="/login"/>
  }

  const onLogout = ev => {
    ev.preventDefault()

    axiosClient.post('/logout')
      .then(() => {
        setUser({})
        setToken(null)
      })
  }

  useEffect(() => {
    axiosClient.get('/user')
      .then(({data}) => {
         setUser(data)
      })
  }, [])

  return (
    <div id="defaultLayout">
      <div className="content">
        <header>
          <div class="header"><Header /></div>
        </header>
        <main>
          <Outlet/>
        </main>
        {notification &&
          <div className="notification">
            {notification}
          </div>
        }
      </div>
    </div>
  )
}
