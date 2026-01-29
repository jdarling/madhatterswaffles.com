import { NavLink } from 'react-router-dom';
import logo from '../assets/logo_color.png';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/menu', label: 'Menu' },
  { to: '/schedule', label: 'Find Us' },
];

function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <NavLink to="/" className="brand" aria-label="Mad Hatter's Waffles home">
          <img src={logo} alt="Mad Hatter's Waffles logo" className="brand-logo" />
          <span className="brand-text">Mad Hatter&apos;s Waffles</span>
        </NavLink>
        <nav className="site-nav" aria-label="Primary">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? 'nav-link nav-link-active' : 'nav-link'
              }
              end={item.to === '/'}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Header;
