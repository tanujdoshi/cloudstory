import logo from "./logo.svg";
import "./App.css";
import Navigation from "./components/Navigation";
import HomePage from "./components/HomePage";
import LoginForm from "./components/LoginForm";
import RegistrationPage from "./components/RegistrationPage";
import ArticleUploadForm from "./components/ArticleUploadForm";
import ArticleDetail from "./components/ArticleDetail";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import "./css/global.css";

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div>
          <Navigation />
          <Routes>
            <Route exact path="/" element={<HomePage />} />
            <Route exact path="/login" element={<LoginForm />} />
            <Route exact path="/register" element={<RegistrationPage />} />
            <Route exact path="/upload" element={<ArticleUploadForm />} />
            <Route exact path="/detail/:id" element={<ArticleDetail />} />
          </Routes>
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;
