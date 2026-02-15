import { authFeature, db } from "@/lib/firebase";
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword 
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export async function loginComponent(email, password) {
  const result = await signInWithEmailAndPassword(authFeature, email, password);
  return result;
}

export async function registerComponent(email, password) {
  const result = await createUserWithEmailAndPassword(
    authFeature,
    email,
    password
  );

  const user = result.user;

  await setDoc(doc(db, "users", user.uid), {
    email: user.email,
    level: 1,
    xp: 0,
    streak: 0,
    title: "Novice",
    createdAt: new Date()
  });

  return result;
}