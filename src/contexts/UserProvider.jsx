//UserProvider.jsx
import { useContext, useState } from "react";
import { UserContext } from "./UserContext";
import API_BASE from "../lib/apiBase";
export function UserProvider ({children}) {
 // const initialUser = {
 // isLoggedIn: false,
 // name: '',
 // email: ''
 // };
 const initialUser = JSON.parse(localStorage.getItem("session")) ?? {
 isLoggedIn: false, name: '', email: ''
 };
 const API_URL = API_BASE;
 const [user, setUser] = useState(initialUser);
 const login = async (email, password) => {
 try {
 const result = await fetch(`${API_URL}/api/user/login`, {
 method: "POST",
 headers: { 'Content-Type': 'application/json'
 },
 body: JSON.stringify({
 email: email,
 password: password
 }),
 credentials: "include"
 });
 if (result.status !== 200) {
 console.log("Login failed with status: ", result.status);
 return false;
 }
 else {
 console.log("result: ", result);
 const newUser = { isLoggedIn: true, name: '', email: email };
 setUser(newUser);
 localStorage.setItem("session", JSON.stringify(newUser));
 return true;
 }
 }
 catch (error) {
 console.log("Login Exception: ", error);
 return false;
 }
 }
 const logout = async () => {
 const result = await fetch(`${API_URL}/api/user/logout`, {
 method: "POST",
 credentials: "include"
 });
 const newUser = { isLoggedIn: false, name: '', email: '' };
 setUser(newUser);
 localStorage.setItem("session", JSON.stringify(newUser));
 }
 return (
 <UserContext.Provider value={{user, login, logout}}>
 {children}
 </UserContext.Provider>
 );
}
export function useUser () {
 return useContext(UserContext);
} 
