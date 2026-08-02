import { BrowserRouter , Routes , Route } from "react-router";
import Body from "./components/Body"
import Login from "./components/Login"
import Profile from "./components/Profile"
import Feed from "./components/Feed"
import Connections from "./components/Connections"
import Requests from "./components/Requests"
import ForgotPassword from "./components/ForgotPassword"
import ResetPassword from "./components/ResetPassword"
import Admin from "./components/Admin"
import Chat from "./components/Chat"
import {Provider} from "react-redux"
import appStore from "./utils/appStore";
function App(){
  return(
    <>
    <Provider store={appStore}>
    <BrowserRouter basename="/">
    <Routes>
      <Route path="/" element={<Body/>}>
          {/* <Route index element={<h1>Welcome to DevTinder</h1>}/> */}
           <Route index element={<Feed/>}/>
          <Route path="login" element={<Login/>}/>
          <Route path="profile" element={<Profile/>}/>
          <Route path="connections" element={<Connections/>}/>
          <Route path="requests" element={<Requests/>}/>
          <Route path="forgot-password" element={<ForgotPassword/>}/>
          <Route path="reset-password/:token" element={<ResetPassword/>}/>
          <Route path="admin" element={<Admin/>}/>
          <Route path='/chat/:targetUserId' element={<Chat/>}/>
      </Route>
    </Routes> 
    
    </BrowserRouter>
    </Provider>
    </>
  );
}

export default App;