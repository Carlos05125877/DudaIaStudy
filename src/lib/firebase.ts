'use client';

import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "studio-3596570368-24a1e",
  appId: "1:196483799878:web:390ad0432807b010352347",
  apiKey: "AIzaSyC21n_x-04_g1Ilsy_GGPdlGqa-1yOoGPg",
  authDomain: "studio-3596570368-24a1e.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "196483799878"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

if (typeof window !== 'undefined') {
  const appCheck = getAppCheck(app);
  appCheck.activate(
    new ReCaptchaV3Provider('6Ld-pB8pAAAAAOLS_p_s-6G23a_id3Fj-i_TNU_n'),
    true
  );
}

export { app };
