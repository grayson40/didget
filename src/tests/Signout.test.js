import { auth } from '../firebase'
import { signOut, signInWithEmailAndPassword } from "firebase/auth";

const email = 'unit-test@email.com';
const password = 'password';

// Testing successful sign out
test('Sign out should be successful', async () => {

  // Attempt to sign in
  await signInWithEmailAndPassword(auth, email, password);

  // Attempt to sign out
  await signOut(auth);

  // Expect user email to be changed
  expect(auth.currentUser).toBeNull();
});