import { useEffect } from "react";
import { io } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
const URL = "http://localhost:5000";

useEffect(()=>{
    
})

export const socket = io(URL, {
    // autoConnect: true
});
