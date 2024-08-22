import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import * as yup from 'yup';
import AuthFormConainer from '@/components/AuthFormConainer';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { FormikHelpers } from 'formik';
import catchAsyncError from '@/app/api/catchError';
import { useDispatch } from 'react-redux';
import client from '@/app/api/client';
import Form from '@/components/Form';
import AuthInputField from '@/components/AuthInputField';
import SubmitBtn from '@/components/SubmitBtn';

// Schema de validation
const lostPasswordSchema = yup.object().shape({
  email: yup.string().trim().email().required('Email is required!')
});

interface Props { }

interface InitialValues {
  email: string;
}

const initialValues = {
  email: ''
};

const LostPassword: FC<Props> = props => {
  const navigation = useNavigation();
  // const dispatch = useDispatch()

  const linkHeading = () => {
    navigation.goBack()
  }

  const handleSubmit = async (
    values: InitialValues,
    actions: FormikHelpers<InitialValues>) => {
    try {

      const reponse = await fetch(client + "auth/forget-password", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*', 
        },
        body: JSON.stringify(values),
      });
      

      if (!reponse.ok) {
        // Servor error
        let errorResponse = await reponse.json();
        const errorMessage = catchAsyncError(errorResponse.error);
      } else {
        const results = await reponse.json();
        // navigation.navigate('SignIn');
      }

    } catch (erreur) {
      // Connexion errors
      console.error('Erreur lors de la requête:', erreur);
    }

    actions.setSubmitting(false)

  }

  return (
    <Form
      onSubmit={handleSubmit}
      initialValues={initialValues}
      validationSchema={lostPasswordSchema}>
      <AuthFormConainer
        heading='Mot de passe oublié'
        subHeading='Retour'
        // linkSubHeading={linkHeading}
      >
        <View style={styles.formContainer}>
          <AuthInputField
            name="email"
            placeholder="john@email.com"
            label="Please enter your email"
            autoCapitalize="none"
            containerStyle={styles.marginBottom}
          />
          <SubmitBtn title={"Envoyer".toLocaleUpperCase()} />

        </View>
      </AuthFormConainer>
    </Form>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    width: '100%',
    paddingHorizontal: 30, // padding in the x direction (left and the right)
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

export default LostPassword;
