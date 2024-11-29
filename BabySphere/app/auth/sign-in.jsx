import { signInWithEmailAndPassword } from '../../config/firebaseConfig';
import { auth } from '../../config/firebaseConfig';

const submit = async () => {
    setIsSubmitting(true);
    try {
        const { email, password } = form;
        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        console.log("User signed in successfully:", userCredential.user);
        alert("Welcome back!");
        
        // Navigate to a protected page or reset form
    } catch (error) {
        console.error("Error signing in:", error.message);
        alert(error.message);
    } finally {
        setIsSubmitting(false);
    }
};
