import React, { useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { Context } from "../context";
import Head from "next/head";
import styles from "../styles/Login.module.css";
import { FcGoogle } from "react-icons/fc";
import GoogleLogin from "react-google-login";

const Login = () => {
  const router = useRouter();
  const { state, dispatch } = useContext(Context);
  const { user } = state;

  useEffect(() => {
    if (user) router.push("/");
  }, [user]);

  const responseGoogle = (response) => {
    if (!response.error) {
      dispatch({
        type: "LOGIN",
        payload: response,
      });
    }
  };

  return (
    <div className={styles.login}>
      <Head>
        <title>Login</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <GoogleLogin
        clientId="867085794944-ejrn5svll7cilh29dv48obs92pkldm8k.apps.googleusercontent.com"
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        cookiePolicy={"single_host_origin"}
        isSignedIn={true}
        render={(renderProps) => (
          <button
            className={styles.googleButton}
            onClick={renderProps.onClick}
            disabled={renderProps.disabled}
          >
            <FcGoogle className={styles.icon} />
            Sign in with Google
          </button>
        )}
      />
    </div>
  );
};

export default Login;
