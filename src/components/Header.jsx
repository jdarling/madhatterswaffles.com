import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../assets/logo_color.png';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/menu', label: 'Menu' },
  { to: '/schedule', label: 'Find Us' },
];

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = () => setIsOpen(false);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <NavLink to="/" className="brand" aria-label="Mad Hatter's Waffles home">
          <img src={logo} alt="Mad Hatter's Waffles logo" className="brand-logo" />
          <span className="brand-text">Mad Hatter&apos;s Waffles</span>
        </NavLink>
        <button
          className="nav-toggle"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span />
          <span />
          <span />
        </button>
        <nav className={`site-nav${isOpen ? ' open' : ''}`} aria-label="Primary">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? 'nav-link nav-link-active' : 'nav-link'
              }
              end={item.to === '/'}
              onClick={handleNavClick}
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
