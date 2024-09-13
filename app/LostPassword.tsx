import React, { FC, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import * as yup from "yup";
import AuthFormConainer from "@/components/AuthFormConainer";
import { useNavigation } from "@react-navigation/native";
import { FormikHelpers } from "formik";
import catchAsyncError from "@/app/api/catchError";
import client from "@/app/api/client";
import Form from "@/components/Form";
import AuthInputField from "@/components/AuthInputField";
import SubmitBtn from "@/components/SubmitBtn";
import colors from "@/utils/colors";
import { Link } from "expo-router";

// Schema de validation
const lostPasswordSchema = yup.object().shape({
  email: yup.string().trim().email().required("Email is required!"),
});

interface Props {}

interface InitialValues {
  email: string;
}

const initialValues = {
  email: "",
};

const LostPassword: FC<Props> = (props) => {
  const [message, setMessage] = useState("");

  const handleSubmit = async (
    values: InitialValues,
    actions: FormikHelpers<InitialValues>
  ) => {
    try {
      const reponse = await fetch(client + "auth/forget-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(values),
      });

      if (!reponse.ok) {
        // Servor error
        let errorResponse = await reponse.json();
        const errorMessage = catchAsyncError(errorResponse.error);
      } else {
        const results = await reponse.json();
        setMessage(results.message);
        // navigation.navigate('SignIn');
      }
    } catch (erreur) {
      // Connexion errors
      console.error("Erreur lors de la requête:", erreur);
    }

    actions.setSubmitting(false);
  };

  return (
    <Form
      onSubmit={handleSubmit}
      initialValues={initialValues}
      validationSchema={lostPasswordSchema}
    >
      <AuthFormConainer
        heading="Mot de passe oublié"
        subHeading="Retour"
        // linkSubHeading={linkHeading}
      >
        <View style={styles.formContainer}>
          <Link href="/login" asChild>
            <Pressable>
              <Text style={styles.link}>Retour</Text>
            </Pressable>
          </Link>
          <AuthInputField
            name="email"
            placeholder="john@email.com"
            label="Please enter your email"
            autoCapitalize="none"
            containerStyle={styles.marginBottom}
          />
          <Text style={styles.message}>{message}</Text>
          <SubmitBtn title={"Envoyer".toLocaleUpperCase()} />
        </View>
      </AuthFormConainer>
    </Form>
  );
};

const styles = StyleSheet.create({
  formContainer: {
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
  message: {
    fontFamily: "Poppins-SemiBold",
    color: colors.SECONDARY,
    fontSize: 12,
    alignSelf: "center",
    textTransform: "capitalize",
  },
  linkContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
});

export default LostPassword;
