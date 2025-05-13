// utils/googleSignIn.js
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

WebBrowser.maybeCompleteAuthSession();

export async function signInWithGoogleAsync(setRolePickerVisible, setCurrentUserData) {
  const [request, response, promptAsync] = Google.useAuthRequest({
      clientId: '158473300904-4qg6m53aic6gtp2ttjlcg19b0rihshhi.apps.googleusercontent.com',
    });

  if (response?.type === 'success') {
    const { id_token } = response.params;
    const credential = GoogleAuthProvider.credential(id_token);
    const userCredential = await signInWithCredential(auth, credential);
    const user = userCredential.user;

    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      return userData.role;  // Already has a role, return it
    } else {
      // New user: trigger role selection modal
      setRolePickerVisible(true);
      setCurrentUserData({ uid: user.uid, email: user.email, name: user.displayName });
      return null;
    }
  }
}