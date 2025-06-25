const App = () => {
  return (
    <div className="flex flex-col items-center p-4 min-h-screen justify-center">
      <a
        href='https://github.com/login/oauth/authorize?scope=user:email&client_id=Ov23liTvR87mmKv1HAby'
        className="text-base px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white border border-gray-500 rounded-lg hover:from-gray-700 hover:to-gray-800 flex items-center space-x-3 mb-4 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out font-inter font-semibold"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.33.615-4.035-1.605-4.035-1.605-.54-1.365-1.32-1.725-1.32-1.725-1.08-.735.09-.72.09-.72 1.2.075 1.83 1.245 1.83 1.245 1.065 1.815 2.79 1.29 3.465.99.105-.78.42-1.29.765-1.59-2.67-.3-5.475-1.335-5.475-5.94 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.545 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.92 1.23 3.225 0 4.62-2.805 5.64-5.475 5.94.435.375.825 1.095.825 2.205 0 1.59-.015 2.865-.015 3.255 0 .315.225.69.825.57C20.565 21.795 24 17.31 24 12c0-6.63-5.37-12-12-12z" />
        </svg>
        <span>Sign in with GitHub</span>
      </a>
    </div>
  );
};

export default App;
