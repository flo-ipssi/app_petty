import React, { FC, useState } from 'react';
import { Pressable, StyleSheet, Text, View, } from 'react-native';
import * as yup from 'yup';
import AuthFormConainer from '@/components/AuthFormConainer';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { FormikHelpers } from 'formik';
import client from '@/app/api/client';
// import { useDispatch } from 'react-redux';
import catchAsyncError from '@/app/api/catchError';
import Form from '@/components/Form';
import AuthInputField from '@/components/AuthInputField';
import PassewordVisibilityIcon from '@/components/ui/PassewordVisibilityIcon';
import SubmitBtn from '@/components/SubmitBtn';
import AppLink from '@/components/ui/AppLink';
import { Link, useRouter } from 'expo-router';
import colors from '@/utils/colors';
import Toast from 'react-native-toast-message';

// Schema de validation
const signupSchema = yup.object().shape({
  name: yup.string().trim().min(3).required('Name is required!'),
  phone: yup.string()
    .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits')
    .required('Phone number is required!'),
  email: yup.string().trim().email().required('Email is required!'),
  password: yup.string().trim().min(8)
    // .matches(
    //   /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@/#\$%\^&\*])[a-zA-Z\d!@/#\$%\^&\*]+$/,
    //   'Password is too simple!',
    // )
    .matches(/^(?=.*[a-zA-Z\d])(?=.*[!@/#$%^&*]).*$/, 'Password is too simple!')
    .required('Password is required!'),
});

interface Props { }

interface NewUser {
  name: '';
  email: '';
  phone: '';
  password: '';
}


const initialValues = {
  name: '',
  email: '',
  password: '',
};

const SignUp: FC<Props> = props => {
  const router = useRouter()
  const [secureEntry, setSecureEntry] = useState(true);

  // const dispatch = useDispatch()

  const togglePassword = () => {
    setSecureEntry(!secureEntry)
  };

  const linkHeading = () => {
    // navigation.navigate('SignIn')
  }

  const handleSubmit = async (
    values: NewUser,
    actions: FormikHelpers<NewUser>
  ) => {
    actions.setSubmitting(true);

    const showToast = (type: 'success' | 'error', text1: string, text2: string) => {
      Toast.show({ type, text1, text2 });
    };

    try {
      const response = await fetch(`${client}auth/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        showToast('error', 'Erreur', errorResponse.error);
      } else {
        showToast('success', 'Vérification', 'Checker votre email 👋');
        const resultat = await response.json();
        router.push(`/Verification?userInfo=${JSON.stringify(resultat.user)}`);
      }
    } catch (error) {
      console.error(error);
      showToast('error', 'Erreur', error as string);
    } finally {
      actions.setSubmitting(false);
    }
  };
  // <AuthInputField
  // name="phone"
  //   placeholder="06.XX.XX.XX.XX"
  //   label="Please enter your phone"
  //   keyboardType="email-address"
  //   autoCapitalize="none"
  //   containerStyle={styles.marginBottom}
  // />
  return (
    <Form
      onSubmit={handleSubmit}
      initialValues={initialValues}
      validationSchema={signupSchema}>
      <AuthFormConainer
        heading='Inscription'
        subHeading='Déjà inscrit ? Connexion'
      // linkSubHeading={linkHeading}
      >
        <View style={styles.formContainer}>
          <Link href="/login" asChild>
            <Pressable>
              <Text style={styles.link} >Déjà inscrit ? Connexion</Text>
            </Pressable>
          </Link>
          <AuthInputField
            name="name"
            placeholder="John Doe"
            label="Please enter your name"
            containerStyle={styles.marginBottom}
          />
          {/* <AuthInputField
            name="phone"
            placeholder="06.XX.XX.XX.XX"
            label="Please enter your phone"
            autoCapitalize="none"
            containerStyle={styles.marginBottom}
          /> */}
          <AuthInputField
            name="email"
            placeholder="john@semail.com"
            label="Please enter your email"
            autoCapitalize="none"
            containerStyle={styles.marginBottom}
          />
          <AuthInputField
            name="password"
            placeholder="********"
            label="Please enter your password"
            autoCapitalize="none"
            secureTextEntry={secureEntry}
            rightIcon={<PassewordVisibilityIcon privateIcon={secureEntry} />}
            onRightIconPress={togglePassword}
          />

          <SubmitBtn title={"Sign up".toLocaleUpperCase()} />

        </View>
      </AuthFormConainer>
    </Form>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    width: '100%',
    paddingHorizontal: 30,
  },
  link: {
    textAlign: "center",
    marginBottom: 15,
    backgroundColor: "transparent",
    color: colors.SECONDARY,
  },
  marginBottom: {
    marginBottom: 10,
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4
  }
});

export default SignUp;
