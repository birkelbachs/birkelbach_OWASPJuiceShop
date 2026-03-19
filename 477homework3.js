const http = require("http");
const { URLSearchParams } = require("url");

// Local development port for the demo login page.
const PORT = 3000;

// Returns the full HTML page, including styles, form markup, and browser-side JavaScript.
function renderPage(message = "", isError = false) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Juice Shop Style Login</title>
  <style>
    :root {
      --page-bg: #2f2f2f;
      --topbar: #5c7686;
      --card-bg: #454545;
      --card-border: #5f5f5f;
      --input-border: #7d7d7d;
      --text-main: #f5f5f5;
      --text-muted: #bfbfbf;
      --accent: #aed36f;
      --google: #5b9827;
      --button: #686868;
    }

    * {
      box-sizing: border-box;
    }

    /* page background */
    body {
      margin: 0;
      font-family: Arial, sans-serif;
      background: var(--page-bg);
      min-height: 100vh;
      color: var(--text-main);
    }

    /* nav bar */
    .topbar {
      min-height: 88px;
      background: var(--topbar);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 18px 28px;
    }

    /* titles in header */
    .brand,
    .nav {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    /* icons in header */
    .menu-icon,
    .nav-icon {
      font-size: 24px;
      color: white;
    }

    /* logo square */
    .logo-box {
      width: 42px;
      height: 42px;
      border-radius: 8px;
      background: #f1b533;
      color: white;
      font-weight: bold;
      display: grid;
      place-items: center;
      font-size: 22px;
    }

    /* main title in header. */
    .brand-title {
      font-size: 24px;
      font-weight: 500;
    }

    .nav {
      gap: 18px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 8px;
      color: white;
      font-size: 18px;
    }

    /* centers the login card */
    main {
      min-height: calc(100vh - 88px);
      display: grid;
      place-items: start center;
      padding: 34px 20px 60px;
    }

    /* card container of the login form */
    .card {
      width: min(92vw, 460px);
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 8px;
      padding: 30px 26px;
    }

    /* main heading */
    h1 {
      margin: 0 0 28px;
      text-align: left;
      color: var(--text-main);
      font-size: 28px;
      font-weight: 600;
    }

    .field-wrap {
      position: relative;
      margin-bottom: 22px;
    }

    /* email and password inputs */
    input[type="email"],
    input[type="password"] {
      width: 100%;
      padding: 16px 52px 16px 16px;
      background: transparent;
      border: 1px solid var(--input-border);
      border-radius: 8px;
      color: var(--text-main);
      font-size: 16px;
      outline: none;
    }

    /* default color inside form inputs */
    input::placeholder {
      color: var(--text-muted);
    }

    /* password visibility toggle */
    .eye {
      position: absolute;
      right: 14px;
      top: 50%;
      transform: translateY(-50%);
      border: 0;
      background: none;
      color: white;
      font-size: 20px;
      cursor: pointer;
    }

    /* status message after validation. */
    .message {
      margin-bottom: 20px;
      padding: 12px 14px;
      border-radius: 8px;
      font-size: 16px;
      background: ${isError ? "#5c2f32" : "#34543b"};
      color: ${isError ? "#ffd7da" : "#ddf1df"};
      border: 1px solid ${isError ? "#bb6c74" : "#7db08a"};
    }

    /* style for forgot password and signup links */
    .forgot,
    .signup {
      color: var(--accent);
      text-decoration: none;
      font-size: 14px;
      font-weight: 600;
      display: inline-block;
    }

    .forgot {
      margin: 4px 0 26px;
    }

    /* button layout */
    .login-button,
    .google-button {
      width: 100%;
      margin: 0 auto;
      display: block;
      padding: 13px;
      border: 0;
      border-radius: 8px;
      color: white;
      font-size: 16px;
      cursor: pointer;
    }

    /* main login button */
    .login-button {
      background: var(--button);
      color: #e2e2e2;
      font-weight: 600;
    }

    /* remember me label */
    .remember {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      margin: 20px 0 24px;
      font-size: 14px;
      color: var(--text-main);
    }

    /* checkbox */
    .remember input {
      width: 18px;
      height: 18px;
      accent-color: var(--accent);
    }

    /* borizontal bar with "or" */
    .divider {
      display: flex;
      align-items: center;
      gap: 14px;
      color: white;
      margin: 0 0 24px;
      font-size: 15px;
      font-weight: 600;
    }

    /* bars on both sides of "or" */
    .divider::before,
    .divider::after {
      content: "";
      flex: 1;
      height: 1px;
      background: #bdbdbd;
    }

    /* green login button */
    .google-button {
      background: var(--google);
      font-weight: 700;
      line-height: 1.2;
    }

    /* "G"  on Google button */
    .google-button span {
      font-size: 20px;
      margin-right: 6px;
      vertical-align: middle;
    }

    /* gitHub repo link */
    .hint {
      margin-top: 34px;
      font-size: 14px;
      color: #d5d5d5;
      text-align: center;
      line-height: 1.5;
    }

    /* bottom signup prompt */
    .signup {
      display: block;
      text-align: center;
      margin-top: 28px;
    }

  </style>
</head>
<body>
  <header class="topbar">
    <div class="brand">
      <div class="menu-icon">☰</div>
      <div class="logo-box">JS</div>
      <div class="brand-title">OWASP Juice Shop</div>
    </div>
    <div class="nav">
      <div class="nav-item"><span class="nav-icon">⌕</span></div>
      <div class="nav-item"><span>Account</span></div>
      <div class="nav-item">
        <span>Your Basket</span>
      </div>
      <div class="nav-item"><span>EN</span></div>
    </div>
  </header>

  <main>
    <div class="card">
      <h1>Login</h1>
      ${message ? `<div class="message">${message}</div>` : ""}
      <form id="loginForm" method="POST" action="/login">
        <div class="field-wrap">
          <input id="email" name="email" type="email" placeholder="Email*" />
        </div>

        <div class="field-wrap">
          <input id="password" name="password" type="password" placeholder="Password*" />
          <button class="eye" id="togglePassword" type="button" aria-label="Show password">o</button>
        </div>

        <a class="forgot" href="#">Forgot your password?</a>

        <button class="login-button" type="submit">Log in</button>

        <label class="remember">
          <input type="checkbox" name="remember" />
          <span>Remember me</span>
        </label>

        <div class="divider">or</div>

        <button class="google-button" type="button">
          <span>G</span>Log in with<br />Google
        </button>
      </form>

      <a class="signup" href="#">Not yet a customer?</a>

      <div class="hint">
        GitHub repo:
        https://github.com/birkelbachs/birkelbach_OWASPJuiceShop
      </div>
    </div>
  </main>

  <script>
    // grabs form and password controls so validation can be handled in the browser
    const form = document.getElementById("loginForm");
    const togglePassword = document.getElementById("togglePassword");
    const passwordInput = document.getElementById("password");

    // wwitches password between hidden and visible text
    togglePassword.addEventListener("click", () => {
      const isHidden = passwordInput.type === "password";
      passwordInput.type = isHidden ? "text" : "password";
      togglePassword.textContent = isHidden ? "◐" : "◉";
    });

    // ensures input fields are correct
    form.addEventListener("submit", (event) => {
      const email = document.getElementById("email").value.trim();
      const password = passwordInput.value.trim();

      if (!email || !password) {
        event.preventDefault();
        alert("Email and password cannot be empty.");
        return;
      }

      if (!email.includes("@")) {
        event.preventDefault();
        alert("Email must contain @.");
        return;
      }

      if (password.length < 8) {
        event.preventDefault();
        alert("Password must be at least 8 characters long.");
      }
    });
  </script>
</body>
</html>`;
}

// server-side validation 
function validateCredentials(email, password) {
  if (!email || !password) {
    return "Email and password cannot be empty.";
  }

  if (!email.includes("@")) {
    return 'Email must contain "@".';
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters long.";
  }

  return "";
}

// node server 
const server = http.createServer((req, res) => {
  // renders the login page 
  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(renderPage());
    return;
  }

  // accepts submitted form data, validates it, and gives feedback
  if (req.method === "POST" && req.url === "/login") {
    let body = "";

    // collects incoming POST 
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    // parses submitted form values 
    req.on("end", () => {
      const params = new URLSearchParams(body);
      const email = (params.get("email") || "").trim();
      const password = (params.get("password") || "").trim();
      const error = validateCredentials(email, password);

      res.writeHead(200, { "Content-Type": "text/html" });

      if (error) {
        res.end(renderPage(error, true));
        return;
      }

      // displays success message 
      res.end(renderPage("Login input passed both client-side and server-side validation."));
    });

    return;
  }

  // fallback response 
  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Page not found.");
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
