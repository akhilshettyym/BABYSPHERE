import { createUserWithEmailAndPassword, updateProfile } from '../../config/firebaseConfig';
import { auth } from '../../config/firebaseConfig'; // Adjust the path to your Firebase config file

const submit = async () => {
    setIsSubmitting(true);
    try {
        const { email, password, username } = form;
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Update profile with the username
        await updateProfile(userCredential.user, { displayName: username });

        console.log("User signed up successfully:", userCredential.user);
        alert("Account created successfully!");

        // Redirect or reset the form
    } catch (error) {
        console.error("Error signing up:", error.message);
        alert(error.message);
    } finally {
        setIsSubmitting(false);
    }
};
