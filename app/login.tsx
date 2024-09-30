import { Button, Pressable, StyleSheet, TextInput, ActivityIndicator } from "react-native";
import { Text, View } from "@/components/Themed";
import { useSession } from "./ctx";
import { Link, router, useNavigation, useRouter } from "expo-router";
import Form from "@/components/Form";
import AuthFormConainer from "@/components/AuthFormConainer";
import AuthInputField from "@/components/AuthInputField";
import PassewordVisibilityIcon from "@/components/ui/PassewordVisibilityIcon";
import SubmitBtn from "@/components/SubmitBtn";
import AppLink from "@/components/ui/AppLink";
import { useEffect, useState } from "react";
import * as yup from "yup";
import colors from "@/utils/colors";

// Schema de validation
const signInSchema = yup.object().shape({
  email: yup.string().trim().email().required("Email is required!"),
  password: yup.string().trim().min(8).required("Password is required!"),
});

interface Props {}

const initialValues = {
  email: "",
  password: "",
};

interface SignInUserInfo {
  email: string;
  password: string;
}

export default function Login() {
  const { signIn, errorMessage, session } = useSession();
  const [secureEntry, setSecureEntry] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false); // État de chargement
  const router = useRouter();

  const togglePassword = () => {
    setSecureEntry(!secureEntry);
  };

  const handleLogin = async (values: SignInUserInfo) => {
    setIsSubmitting(true); // Active le loader
    try {
      await signIn(values.email, values.password);
    } finally {
      setIsSubmitting(false); // Désactive le loader après la requête
    }
  };

  useEffect(() => {
    if (session) {
      router.replace("/");
    }
  }, [session]);

  return (
    <Form
      onSubmit={handleLogin}
      initialValues={initialValues}
      validationSchema={signInSchema}
    >
      <AuthFormConainer
        heading="Connexion"
        subHeading="Pas encore inscrit ? Inscription"
      >
        <View style={styles.formContainer}>
          <Link href="/SignUp" asChild>
            <Pressable>
              <Text style={styles.link}>Pas encore inscrit ? Inscription</Text>
            </Pressable>
          </Link>
          <AuthInputField
            name="email"
            placeholder="john@email.com"
            label="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            containerStyle={styles.marginBottom}
          />
          <AuthInputField
            name="password"
            placeholder="********"
            label="Mot de passe"
            autoCapitalize="none"
            secureTextEntry={secureEntry}
            rightIcon={<PassewordVisibilityIcon privateIcon={secureEntry} />}
            onRightIconPress={togglePassword}
          />
          {errorMessage && <Text style={{ color: "red" }}>{errorMessage}</Text>}

          {/* Afficher un spinner si en cours de chargement */}
          {isSubmitting ? (
            <ActivityIndicator size="large" color={colors.PRIMARY} />
          ) : (
            <SubmitBtn title={"Sign in".toLocaleUpperCase()} />
          )}

          <View style={styles.linkContainer}>
            <Link href="/LostPassword">
              <AppLink title="Mot de passe oublié ?" />
            </Link>
          </View>
        </View>
      </AuthFormConainer>
    </Form>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    textAlign: "center",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  input: {
    width: "80%",
    borderWidth: 1,
    borderColor: "#000",
    padding: 10,
    margin: 10,
    borderRadius: 4,
  },
  formContainer: {
    backgroundColor: "transparent",
    width: "100%",
    paddingHorizontal: 30,
  },
  marginBottom: {
    marginBottom: 10,
  },
  link: {
    textAlign: "center",
    marginBottom: 15,
    backgroundColor: "transparent",
    color: colors.SECONDARY,
  },
  linkContainer: {
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
});
