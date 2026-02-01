import { JSX, useState } from 'react';
import Link from 'next/link';

/**
 * Navbar component for the Reform in Focus website.
 * Provides navigation links to various sections of the site.
 * Includes responsive hamburger menu for mobile devices.
 *
 * @returns {JSX.Element} The rendered Navbar component.
 */
export default function Navbar(): JSX.Element {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    return (
        <nav>
            <div className="container">
                <div className="nav-container">
                    <Logo />

                    {/* Desktop Navigation */}
                    <ul className="nav-links">
                        <li><Link href="/">Home</Link></li>
                        <li><Link href="/topics">Explore Topics</Link></li>
                        <li><Link href="/understanding-reform">Understanding Reform</Link></li>
                        <li><Link href="/research">Research</Link></li>
                        <li><Link href="/subscribe">Subscribe</Link></li>
                        <li><Link href="/search">Search</Link></li>
                    </ul>

                    {/* Mobile Hamburger Button */}
                    <button
                        className={`hamburger ${mobileMenuOpen ? 'active' : ''}`}
                        onClick={toggleMobileMenu}
                        aria-label="Toggle mobile menu"
                        aria-expanded={mobileMenuOpen}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="mobile-menu">
                        <ul className="mobile-nav-links">
                            <li><Link href="/" onClick={closeMobileMenu}>Home</Link></li>
                            <li><Link href="/topics" onClick={closeMobileMenu}>Explore Topics</Link></li>
                            <li><Link href="/understanding-reform" onClick={closeMobileMenu}>Understanding Reform</Link></li>
                            <li><Link href="/research" onClick={closeMobileMenu}>Research</Link></li>
                            <li><Link href="/subscribe" onClick={closeMobileMenu}>Subscribe</Link></li>
                            <li><Link href="/search" onClick={closeMobileMenu}>Search</Link></li>
                        </ul>
                    </div>
                )}
            </div>
        </nav>
    );
}

const Logo = () => {
    return (
        <Link href="/" className="logo">
            <div className="logo-text">Reform in Focus</div>
        </Link>
    );
}
