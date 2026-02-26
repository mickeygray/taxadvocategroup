import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import PhoneLink from "./PhoneLink";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
      }
    };
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  return (
    <header className={`navbar${isScrolled ? " navbar-scrolled" : ""}`}>
      <div className="logo-slogan-row">
        <Link to="/" className="logo-link">
          <img
            src="/images/tax-advocate-group-logo-small.png"
            alt="Tax Advocate Group - Home"
            width="200"
            height="60"
          />
        </Link>
      </div>
      <div className="navbar-container">
        {!isMobile && (
          <nav className="nav-menu" aria-label="Main navigation">
            <ul className="nav-list">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li
                className="dropdown"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => {
                  setIsDropdownOpen(false);
                  setActiveSubmenu(null);
                }}
              >
                <Link to="/our-tax-services" aria-haspopup="true" aria-expanded={isDropdownOpen}>
                  Services <span aria-hidden="true">&#9660;</span>
                </Link>
                {isDropdownOpen && (
                  <ul className="dropdown-menu" role="menu">
                    <li
                      className="has-submenu"
                      onMouseEnter={() => setActiveSubmenu("tax-relief")}
                      onMouseLeave={() => setActiveSubmenu(null)}
                    >
                      <Link to="/tax-relief" role="menuitem">
                        Tax Relief <span className="arrow" aria-hidden="true">&#9654;</span>
                      </Link>
                      {activeSubmenu === "tax-relief" && (
                        <ul className="submenu" role="menu">
                          <li><Link to="/tax-relief/tax-consultation" role="menuitem">Tax Consultation</Link></li>
                          <li><Link to="/tax-relief/tax-preparation" role="menuitem">Tax Preparation</Link></li>
                          <li><Link to="/tax-relief/tax-settlement" role="menuitem">Tax Settlement</Link></li>
                        </ul>
                      )}
                    </li>
                    <li
                      className="has-submenu"
                      onMouseEnter={() => setActiveSubmenu("tax-resolution")}
                      onMouseLeave={() => setActiveSubmenu(null)}
                    >
                      <Link to="/tax-resolution" role="menuitem">
                        Tax Resolution <span className="arrow" aria-hidden="true">&#9654;</span>
                      </Link>
                      {activeSubmenu === "tax-resolution" && (
                        <ul className="submenu" role="menu">
                          <li><Link to="/tax-resolution/tax-representation" role="menuitem">Tax Representation</Link></li>
                          <li><Link to="/tax-resolution/dealing-with-the-irs" role="menuitem">Dealing with the IRS</Link></li>
                          <li><Link to="/tax-resolution/irs-innocent-spouse" role="menuitem">Innocent Spouse Relief</Link></li>
                          <li><Link to="/tax-resolution/state-tax-relief" role="menuitem">State Tax Relief</Link></li>
                          <li><Link to="/tax-resolution/statute-of-limitations" role="menuitem">Statute of Limitations</Link></li>
                          <li><Link to="/tax-resolution/tax-prep-and-planning" role="menuitem">Tax Preparation &amp; Planning</Link></li>
                        </ul>
                      )}
                    </li>
                    <li
                      className="has-submenu"
                      onMouseEnter={() => setActiveSubmenu("tax-negotiation")}
                      onMouseLeave={() => setActiveSubmenu(null)}
                    >
                      <Link to="/tax-negotiation" role="menuitem">
                        Tax Negotiation <span className="arrow" aria-hidden="true">&#9654;</span>
                      </Link>
                      {activeSubmenu === "tax-negotiation" && (
                        <ul className="submenu" role="menu">
                          <li><Link to="/tax-negotiation/offer-in-compromise" role="menuitem">Offer in Compromise</Link></li>
                          <li><Link to="/tax-negotiation/currently-not-collectible" role="menuitem">Currently Not Collectible</Link></li>
                          <li><Link to="/tax-negotiation/penalty-abatement" role="menuitem">Penalty Abatement</Link></li>
                          <li><Link to="/tax-negotiation/installment-agreement" role="menuitem">Installment Agreement</Link></li>
                        </ul>
                      )}
                    </li>
                    <li>
                      <Link to="/tax-protection-plans" role="menuitem">Tax Protection Plans</Link>
                    </li>
                  </ul>
                )}
              </li>
              <li>
                <Link to="/tax-faqs">Tax FAQs</Link>
              </li>
              <li>
                <Link to="/about-us">About Us</Link>
              </li>
              <li>
                <Link to="/contact-us">Contact Us</Link>
              </li>
              <li>
                <Link to="/tax-news">Tax News</Link>
              </li>
              <li className="nav-phone">
                <PhoneLink rawNumber="18005171807" />
              </li>
            </ul>
          </nav>
        )}

        {isMobile && (
          <>
            <button
              className="mobile-menu-icon"
              onClick={toggleMenu}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? "\u2715" : "\u2630"}
            </button>
            {isMenuOpen && (
              <nav className="mobile-menu" aria-label="Mobile navigation">
                <ul>
                  <li><Link to="/" onClick={closeMenu}>Home</Link></li>
                  <li><Link to="/our-tax-services" onClick={closeMenu}>Services</Link></li>
                  <li><Link to="/tax-faqs" onClick={closeMenu}>Tax FAQs</Link></li>
                  <li><Link to="/about-us" onClick={closeMenu}>About Us</Link></li>
                  <li><Link to="/contact-us" onClick={closeMenu}>Contact Us</Link></li>
                  <li><Link to="/tax-news" onClick={closeMenu}>Tax News</Link></li>
                  <li className="nav-phone">
                    <PhoneLink rawNumber="18005171807" />
                  </li>
                </ul>
              </nav>
            )}
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
