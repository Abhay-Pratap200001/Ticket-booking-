// shared decorative background used by both the login and register pages
const AuthLayout = ({ children }) => {
  return (
    <div className="relative min-h-[calc(100vh-72px)] bg-gradient-to-br from-indigo-50 via-white to-indigo-50 overflow-hidden flex items-center justify-center px-4 py-12">
      <div className="absolute top-10 right-10 w-40 h-40 bg-indigo-200/40 rounded-full blur-2xl"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-200/40 rounded-full blur-3xl"></div>
      <div className="absolute top-1/3 left-10 w-2 h-2 bg-indigo-400 rounded-full"></div>
      <div className="absolute bottom-24 right-20 w-2 h-2 bg-blue-400 rounded-full"></div>

      <div className="relative w-full max-w-md">{children}</div>
    </div>
  );
};

export default AuthLayout;
