type NavbarProps = {
  toggleSidebar: () => void;
};

const Navbar = ({ toggleSidebar }: NavbarProps) => {
  return (
    <div className="navbar">
      <button className="toggle-btn" onClick={toggleSidebar}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-panel-left-icon lucide-panel-left"><rect width="20" height="20" x="3" y="3" rx="2"/><path d="M9 3v18"/></svg>
      </button>

      <div className="navbar-right">
        <div className="encrypted-badge">
          <span className="encrypted-dot"></span>
          Encrypted
        </div>

        <div className="profile">
          <div className="avatar">A</div>
          <div className="profile-info">
            <p className="profile-name">Alex Johnson</p>
            <small className="profile-email">swapneethpunna@msitprogram.net</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;