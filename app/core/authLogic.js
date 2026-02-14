import { authFeature} from "./firebaseApp";
import { signInWithEmailAndPassword,createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/router";
export async function loginComponent(email,password){
    try{
        const result= await signInWithEmailAndPassword(authFeature,email,password);
        
            alert("You have logged in successfully!!!");
      
    }catch(err){
        console.log(JSON.stringify(err));
        alert("You have not registered yet.Kindly register to continue.")
        throw err;
    }
    }
  

export async function registerComponent(email,password){
    try{
        const result=await createUserWithEmailAndPassword(authFeature,email,password);
        alert("You have registered successfully!! Kindly Login to continue.");
        return result;
    }catch(err){
        console.error("Registration error:", err);
        
        // Provide user-friendly error messages
        if (err.code === 'auth/email-already-in-use') {
            alert("This email is already registered. Please login instead.");
            throw new Error("Email already in use");
        } else if (err.code === 'auth/invalid-email') {
            alert("Please enter a valid email address.");
            throw new Error("Invalid email");
        } else if (err.code === 'auth/weak-password') {
            alert("Password should be at least 6 characters.");
            throw new Error("Weak password");
        } else {
            alert("Registration failed. Please try again.");
            throw err;
        }
    }
}