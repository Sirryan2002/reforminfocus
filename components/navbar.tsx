import { JSX } from 'react';
import Link from 'next/link';

/**
 * Navbar component for the Reform in Focus website.
 * Provides navigation links to various sections of the site.
 *
 * @returns {JSX.Element} The rendered Navbar component.
 */
export default function Navbar(): JSX.Element {
    return (
        <nav>
            <div className="container">
                <div className="nav-container">
                    <Logo />
                    <ul className="nav-links">
                        <li><Link href="/">Home</Link></li>
                        <li><Link href="/topics">Explore Topics</Link></li>
                        <li><Link href="/understanding-reform">Understanding Reform</Link></li>
                        <li><Link href="/research">Research</Link></li>
                        <li><Link href="/subscribe">Subscribe</Link></li>
                        <li><Link href="/search">Search</Link></li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

const Logo = () => {
    return (
        <Link href="/" className ="logo">
            <div className="logo">Reform in Focus</div>
        </Link>
    );
}