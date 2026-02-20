import { useRef, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useUser } from "../contexts/UserProvider";
import API_BASE from "../lib/apiBase";

export default function Login() {
  const API_URL = API_BASE;
  const { user, login } = useUser();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [controlState, setControlState] = useState({
    isLoggingIn: false,
    isLoginError: false,
    isRegistering: false,
    isRegisterError: false,
    isRegisterOk: false,
    registerMessage: "",
  });

  const usernameRef = useRef();
  const firstnameRef = useRef();
  const lastnameRef = useRef();
  const emailRef = useRef();
  const passRef = useRef();

  async function onLogin() {
    setControlState((prev) => ({
      ...prev,
      isLoggingIn: true,
      isLoginError: false,
      isRegisterError: false,
      isRegisterOk: false,
      registerMessage: "",
    }));

    const email = emailRef.current.value.trim();
    const pass = passRef.current.value;
    const result = await login(email, pass);

    setControlState((prev) => ({
      ...prev,
      isLoggingIn: false,
      isLoginError: !result,
    }));
  }

  async function onRegister() {
    const username = usernameRef.current.value.trim();
    const firstname = firstnameRef.current.value.trim();
    const lastname = lastnameRef.current.value.trim();
    const email = emailRef.current.value.trim();
    const password = passRef.current.value;

    if (!username || !firstname || !lastname || !email || !password) {
      setControlState((prev) => ({
        ...prev,
        isRegisterError: true,
        isRegisterOk: false,
        registerMessage: "Please fill in all fields.",
      }));
      return;
    }

    setControlState((prev) => ({
      ...prev,
      isRegistering: true,
      isLoginError: false,
      isRegisterError: false,
      isRegisterOk: false,
      registerMessage: "",
    }));

    try {
      const response = await fetch(`${API_URL}/api/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          firstname,
          lastname,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setControlState((prev) => ({
          ...prev,
          isRegistering: false,
          isRegisterError: true,
          isRegisterOk: false,
          registerMessage: data.message || "Register failed",
        }));
        return;
      }

      setControlState((prev) => ({
        ...prev,
        isRegistering: false,
        isRegisterError: false,
        isRegisterOk: true,
        registerMessage: "Account created. Logging in...",
      }));

      const loginResult = await login(email, password);
      if (!loginResult) {
        setControlState((prev) => ({
          ...prev,
          isRegisterError: true,
          isRegisterOk: false,
          registerMessage: "Account created. Please login manually.",
        }));
      }
    } catch {
      setControlState((prev) => ({
        ...prev,
        isRegistering: false,
        isRegisterError: true,
        isRegisterOk: false,
        registerMessage: "Register failed",
      }));
    }
  }

  function toggleMode() {
    setControlState((prev) => ({
      ...prev,
      isLoginError: false,
      isRegisterError: false,
      isRegisterOk: false,
      registerMessage: "",
    }));
    setIsRegisterMode((prev) => !prev);
  }

  if (user.isLoggedIn) {
    return <Navigate to="/profile" replace />;
  }

  return (
    <main className="page-shell auth-shell">
      <section className="card auth-card">
        <div className="card-header">
          <h1>{isRegisterMode ? "Create Account" : "Welcome Back"}</h1>
          <p>
            {isRegisterMode
              ? "Create your account to manage your profile."
              : "Sign in to manage your profile and image."}
          </p>
        </div>

        <div className="mode-toggle" role="tablist" aria-label="Auth mode">
          <button
            type="button"
            className={!isRegisterMode ? "tab-button active" : "tab-button"}
            onClick={() => !isRegisterMode || toggleMode()}
          >
            Login
          </button>
          <button
            type="button"
            className={isRegisterMode ? "tab-button active" : "tab-button"}
            onClick={() => isRegisterMode || toggleMode()}
          >
            Register
          </button>
        </div>

        <div className="form-grid">
          {isRegisterMode && (
            <>
              <label htmlFor="username">Username</label>
              <input id="username" type="text" ref={usernameRef} />

              <label htmlFor="firstname">First Name</label>
              <input id="firstname" type="text" ref={firstnameRef} />

              <label htmlFor="lastname">Last Name</label>
              <input id="lastname" type="text" ref={lastnameRef} />
            </>
          )}

          <label htmlFor="email">Email</label>
          <input id="email" type="email" ref={emailRef} />

          <label htmlFor="password">Password</label>
          <input id="password" type="password" ref={passRef} />
        </div>

        <div className="button-row">
          {isRegisterMode ? (
            <button
              type="button"
              className="btn-primary"
              onClick={onRegister}
              disabled={controlState.isRegistering}
            >
              {controlState.isRegistering ? "Creating..." : "Create Account"}
            </button>
          ) : (
            <button
              type="button"
              className="btn-primary"
              onClick={onLogin}
              disabled={controlState.isLoggingIn}
            >
              {controlState.isLoggingIn ? "Signing in..." : "Login"}
            </button>
          )}

          <Link to="/" className="btn-subtle">
            Back Home
          </Link>
        </div>

        {controlState.isLoginError && (
          <div className="alert error">Invalid email or password.</div>
        )}
        {controlState.isRegisterError && (
          <div className="alert error">{controlState.registerMessage}</div>
        )}
        {controlState.isRegisterOk && (
          <div className="alert success">{controlState.registerMessage}</div>
        )}
      </section>
    </main>
  );
}
