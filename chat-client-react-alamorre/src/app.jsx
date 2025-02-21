import { useEffect, useState } from "react";

import AuthPage from "./authPage";
import ChatsPage from "./chatsPage";

function App() {
  const [user, setUser] = useState();

  useEffect(()=>{
    // Simulate fetching user data from a server
    // const fetchedUser = await fetchUserDataFromServer();
    // setUser(fetchedUser);
    // setUser(user); // Simulated user data for testing purposes
    setUser({ username: "adam", secret: "pass1234" }); // Uncomment this line to fetch actual user data from the server

  }, [])

  if (!user) {
    return <AuthPage onAuth={(user) => setUser(user)} />;
  } else {
    return <ChatsPage user={user} />;
  }
}

export default App;
