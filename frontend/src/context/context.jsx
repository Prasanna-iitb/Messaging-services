import { useContext , createContext , useState , useEffect } from "react";
import {useNavigate} from "react-router-dom"
const ChatContext = createContext();

const ChatProvider = ({children}) => {

    const [loggedUser, setLoggedUser] = useState(JSON.parse(sessionStorage.getItem('userInfo')) || null);

    const navigate = useNavigate();

    useEffect(()=>{
        const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
        if(!userInfo){
          if (location.pathname !== '/' && location.pathname !== '/signup') {
            navigate("/");
          }
        }
        else{
          setLoggedUser(userInfo)
        }
    }, [navigate]);

    //now return the variables to be used globally
    return (
        <ChatContext.Provider
          value={{
            loggedUser,
            setLoggedUser,
          }}
        >
          {children}
        </ChatContext.Provider>
      );

}

export const ChatState = () => {
    return useContext(ChatContext);
};

export default ChatProvider