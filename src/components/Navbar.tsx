'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Logo } from './Logo';
import ScrollToTop from './ScrollToTop';
import { CloseIcon, MenuIcon } from '@muzammil328/icon';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [activeSection, setActiveSection] = useState('home');

  const navItems = useMemo(
    () => [
      { label: 'Home', id: '/' },
      { label: 'About', id: '/about' },
      { label: 'Portfolio', id: '/portfolio' },
      { label: 'Blog', id: '/blogs' },
      { label: 'Contact', id: '/contact' },
    ],
    []
  );

  const scrollToSection = (sectionId: string) => {
    if (sectionId === 'home') {
      window.location.href = '/';
      return;
    }

    // Handle external path with anchor (e.g., "/#portfolio")
    if (sectionId.startsWith('/')) {
      window.location.href = sectionId;
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100; // Offset for fixed navbar
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setActiveSection(sectionId);
    }
  };

  useEffect(() => {
    // Handle hash navigation on page load
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash) {
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            const offset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth',
            });
          }
        }, 100);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);

    const handleScroll = () => {
      const sections = navItems.map(item => item.id).filter(id => !id.startsWith('/'));
      const scrollPosition = window.scrollY + 150;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section) {
          const sectionTop = section.offsetTop;
          if (scrollPosition >= sectionTop) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }

      // If at top, set home as active
      if (window.scrollY < 100) {
        setActiveSection('home');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navItems]);

  const handleNavItemClick = (id: string) => {
    scrollToSection(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="relative flex items-center justify-between container mx-auto rounded-full md:py-4 py-2 px-4 lg:px-8 border md:mt-2">
      <div className="flex items-center gap-24">
        <Logo />
      </div>
      <ul className="lg:block hidden">
        {navItems.map(item => (
          <button
            key={item.id}
            className="inline-block mx-6 font-medium cursor-pointer relative group bg-transparent border-none p-0"
            onClick={() => handleNavItemClick(item.id)}
          >
            <span
              className={`relative z-10 transition-colors duration-300 ${
                activeSection === item.id ? 'text-primary' : 'text-foreground hover:text-primary'
              }`}
            >
              {item.label}
            </span>
            {/* Hover line animation - starts from center, expands left-right */}
            <span className="absolute bottom-0 left-1/2 h-0.5 bg-primary transform -translate-x-1/2 w-0 group-hover:w-full transition-all duration-500 ease-out origin-center"></span>
          </button>
        ))}
      </ul>
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Toggle mobile menu"
          aria-expanded={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen(prev => !prev)}
          className="cursor-pointer lg:hidden border border-border h-10 w-10 rounded-full transition-all duration-300 flex items-center justify-center"
        >
          {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
        <Link
          href="https://wa.me/923100810327"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex bg-primary text-primary-foreground px-8 py-2 font-semibold rounded-full uppercase"
        >
          Let&apos;s Talk
        </Link>
      </div>

      <div
        className={`absolute left-0 right-0 top-[calc(100%+0.75rem)] z-50 rounded-2xl border border-border bg-background p-3 shadow-lg lg:hidden origin-top transform transition-all duration-250 ease-out ${
          isMobileMenuOpen
            ? 'translate-y-0 scale-y-100 opacity-100 dark:bg-black bg-white pointer-events-auto'
            : '-translate-y-1 scale-y-95 opacity-0 pointer-events-none'
        }`}
      >
        <ul className="space-y-1">
          {navItems.map(item => (
            <li key={`mobile-${item.id}`}>
              <button
                type="button"
                onClick={() => handleNavItemClick(item.id)}
                className={`cursor-pointer w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                  activeSection === item.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                {item.label}
              </button>
            </li>
          ))}
          <li className="pt-1 sm:hidden">
            <Link
              href="https://wa.me/923100810327"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold uppercase text-primary-foreground"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Let&apos;s Talk
            </Link>
          </li>
        </ul>
      </div>
      <ScrollToTop />
    </nav>
  );
}
