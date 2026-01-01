import { JSX } from 'react';
import '../styles/navbar.css';
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
                    <div className="logo">Reform in Focus</div>
                    <ul className="nav-links">
                        <li><Link href="/">Home</Link></li>
                        <li><Link href="/explore">Explore Topics</Link></li>
                        <li><Link href="/learn">Understanding Reform</Link></li>
                        <li><Link href="/research">Research</Link></li>
                        <li><Link href="/subscribe">Subscribe</Link></li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}