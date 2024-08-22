import { Button, Pressable, StyleSheet, TextInput } from "react-native";
import { Text, View } from "@/components/Themed";
import { useSession } from "./ctx";
import { Link, router, useNavigation } from "expo-router";
import Form from "@/components/Form";
import AuthFormConainer from "@/components/AuthFormConainer";
import AuthInputField from "@/components/AuthInputField";
import PassewordVisibilityIcon from "@/components/ui/PassewordVisibilityIcon";
import SubmitBtn from "@/components/SubmitBtn";
import AppLink from "@/components/ui/AppLink";
import { useEffect, useState } from "react";
import * as yup from 'yup';
import colors from "@/utils/colors";


// Schema de validation
const signInSchema = yup.object().shape({
  email: yup.string().trim().email().required('Email is required!'),
  password: yup.string().trim().min(8)
    .required('Password is required!'),
});
interface Props { }

const initialValues = {
  email: '',
  password: '',

};

interface SignInUserInfo {
  email: string;
  password: string;
};


export default function Login() {
  const { signIn, errorMessage, session, user } = useSession();
  const [secureEntry, setSecureEntry] = useState(true);
  const navigation = useNavigation();
  
  const togglePassword = () => {
    setSecureEntry(!secureEntry)
  };

  const linkHeading = () => {
    // navigation.navigate('SignUp')
  }

  const handleLogin = (values: SignInUserInfo) => {
    signIn(values.email, values.password);
    router.replace("/");
  };

  useEffect(() => {
    if (session) {
      router.replace('/'); 
    }
  }, [session]);

  return (

    <Form
      onSubmit={handleLogin}
      initialValues={initialValues}
      validationSchema={signInSchema}>
      <AuthFormConainer
        heading='Connexion'
        subHeading='Pas encore inscrit ? Inscription'
      // linkSubHeading={linkHeading}
      >
        <View style={styles.formContainer}>
          <Link href="/SignUp" asChild>
              <Pressable>
                <Text style={styles.link} >Pas encore inscrit ? Inscription</Text>
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
          {errorMessage && <Text style={{ color: 'red' }}>{errorMessage}</Text>}
          <SubmitBtn title={"Sign in".toLocaleUpperCase()} />

          <View style={styles.linkContainer}>
            <AppLink title='Mot de passe oublié ?' onPress={() => {
              // navigation.navigate('LostPassword')
            }} />
          </View>
        </View>
      </AuthFormConainer>
    </Form>
    // <View style={styles.container}>
    //   <Text style={styles.title}>Welcome! 🌈 </Text>
    //   <Text style={styles.paragraph}>
    //     This is a simple repo that emulates a login authentication workflow
    //     using Expo Router, focused on the navigation aspect.
    //   </Text>
    //   <View
    //     style={styles.separator}
    //     lightColor="#eee"
    //     darkColor="rgba(255,255,255,0.1)"
    //   />
    //   <TextInput placeholder="Username(not required)" style={styles.input} />
    //   <TextInput
    //     placeholder="Password(not required)"
    //     secureTextEntry
    //     style={styles.input}
    //   />
    //   <Button title="Login" onPress={handleLogin} />
    // </View>
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
    width: '100%',
    paddingHorizontal: 30
  },
  marginBottom: {
    marginBottom: 10,
  },
  link: {
    textAlign: "center",
    marginBottom:15,
    backgroundColor: "transparent",
    color: colors.SECONDARY,
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4
  }
});
