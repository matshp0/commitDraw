import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './components/Grid';
import GitHubLogin from './components/Authorization';

const MainApp = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<GitHubLogin />} />
        <Route path="/callback" element={<GitHubLogin />} />
      </Routes>
    </BrowserRouter>
  );
};

export default MainApp;
