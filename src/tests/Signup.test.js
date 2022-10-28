import { auth } from '../firebase'
import { createUserWithEmailAndPassword } from "firebase/auth";

// Test user fields
const email = 'unit-test@email.com';
const password = 'password'

// Testing email already in use error
test('Sign up with email in use should throw an error', async () => {
  let error = '';

  // Attempt to create user
  try {
    await createUserWithEmailAndPassword(auth, email, password);
  } catch (err) {
    error = err.toString();
  }

  // Expect error message
  expect(error).toEqual(
    "FirebaseError: Firebase: Error (auth/email-already-in-use)."
  );
});

// Useless comment tee hee

// Testing invalid email error
test('Sign up with email in use should throw an error', async () => {
  let error = '';

  // Attempt to create user
  try {
    await createUserWithEmailAndPassword(auth, 'email', password);
  } catch (err) {
    error = err.toString();
  }

  // Expect error message
  expect(error).toEqual(
    "FirebaseError: Firebase: Error (auth/invalid-email)."
  );
});

// // Testing successful sign up
// test('Sign up with unique email and password should create a user', async () => {
//   const user = await createUserWithEmailAndPassword(
//     auth,
//     'email@email.com',
//     password
//   );

//   // Expect user to be not null
//   expect(user.user).toBeTruthy();
// });
