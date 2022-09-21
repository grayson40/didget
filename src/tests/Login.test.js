import { auth } from '../firebase'
import { signInWithEmailAndPassword } from "firebase/auth";

// Test user fields
const email = 'unit-test@email.com';
const password = 'password'

// Testing wrong password error
test('Sign in with incorrect credentials should throw error', async () => {
  let error = '';

  // Attempt to sign in
  try {
    await signInWithEmailAndPassword(auth, email, 'wrong-password');
  } catch (err) {
    error = err.toString();
  }

  // Expect error message
  expect(error).toEqual(
    "FirebaseError: Firebase: Error (auth/wrong-password)."
  );
});

// Testing user not found error
test('Sign in with incorrect credentials should throw error', async () => {
  let error = '';

  // Attempt to sign in
  try {
    await signInWithEmailAndPassword(auth, 'no-email@email.com', password);
  } catch (err) {
    error = err.toString();
  }

  // Expect error message
  expect(error).toEqual(
    "FirebaseError: Firebase: Error (auth/user-not-found)."
  );
});

// Testing successful login
test('Sign in with correct credentials should be successful', async () => {

  // Attempt to sign in
  const user = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  // Expect user to be not null
  expect(user.user).toBeTruthy();
});
