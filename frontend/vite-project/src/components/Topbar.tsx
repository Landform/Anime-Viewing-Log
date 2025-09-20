// src/components/Topbar.tsx

const Topbar = () => {
  return (
    <header className="topbar">
      <div className="topbar-logo">K</div> {/* Using K as a simple logo */}
      <nav className="topbar-nav">
        <a href="#">Search</a>
        <a href="#">List</a>
        <a href="#">Explore</a>
        <a href="#">History</a>
      </nav>
      <div className="topbar-auth">
        <a href="/login">Log in</a>
        <button className="topbar-signup-btn">Sign up</button>
      </div>
    </header>
  );
};

export default Topbar;