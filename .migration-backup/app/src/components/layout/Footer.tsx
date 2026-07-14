'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Compass, Shield, Star, Globe, Mail, MapPin } from 'lucide-react';
import { UI_LANGUAGES } from '@/data/mockData';

export default function Footer() {
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [selectedLang, setSelectedLang] = useState('en');

  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'KRW'];

  return (
    <footer className="site-footer dark-surface bg-[#1C3A2E] text-white pt-16 pb-8 border-t border-[#142A21]">
      <div className="container">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Column 1: Brand & Socials */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-[#C4614A] text-white p-1.5 rounded-md flex items-center justify-center">
                <Compass size={20} className="stroke-[1.75]" />
              </div>
              <span className="font-[family-name:var(--font-playfair)] text-xl font-bold tracking-tight">
                LocaLink
              </span>
            </Link>
            <p className="text-sm text-[#7C9080] leading-relaxed max-w-[280px]">
              Explore Vietnam with someone who truly gets you. Find verified local guides matched to your style.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#142A21] flex items-center justify-center text-[#7C9080] hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051C.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#142A21] flex items-center justify-center text-[#7C9080] hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Travelers */}
          <div className="flex flex-col gap-4">
            <h4 className="font-sans text-xs font-semibold uppercase tracking-wider text-[#7C9080]">
              For Travelers
            </h4>
            <nav className="flex flex-col gap-2.5 text-sm text-[#7C9080]">
              <Link href="/guides" className="hover:text-white transition-colors">Find a Guide</Link>
              <Link href="/#how-it-works" className="hover:text-white transition-colors">How It Works</Link>
              <Link href="/#safety" className="hover:text-white transition-colors">Safety & Trust</Link>
              <Link href="/guides?tab=experiences" className="hover:text-white transition-colors">Popular Experiences</Link>
            </nav>
          </div>

          {/* Column 3: Guides */}
          <div className="flex flex-col gap-4">
            <h4 className="font-sans text-xs font-semibold uppercase tracking-wider text-[#7C9080]">
              For Local Guides
            </h4>
            <nav className="flex flex-col gap-2.5 text-sm text-[#7C9080]">
              <Link href="/guide-dashboard" className="hover:text-white transition-colors">Become a Guide</Link>
              <Link href="/guide-dashboard" className="hover:text-white transition-colors">Guide Dashboard</Link>
              <Link href="/guide-dashboard" className="hover:text-white transition-colors">Earnings & Payouts</Link>
              <Link href="/guide-dashboard" className="hover:text-white transition-colors">Guide Community</Link>
            </nav>
          </div>

          {/* Column 4: Contact & Settings */}
          <div className="flex flex-col gap-4">
            <h4 className="font-sans text-xs font-semibold uppercase tracking-wider text-[#7C9080]">
              Contact & Language
            </h4>
            <div className="flex flex-col gap-2 text-sm text-[#7C9080] mb-2">
              <div className="flex items-center gap-2">
                <Mail size={14} />
                <a href="mailto:hello@localink.co" className="hover:text-white transition-colors">hello@localink.co</a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} />
                <span>Ho Chi Minh City, Vietnam</span>
              </div>
            </div>

            {/* Selectors */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <select
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value)}
                  className="w-full bg-[#142A21] text-xs text-[#7C9080] border border-[#2A5243] rounded-md px-3 py-1.5 outline-none hover:text-white transition-colors cursor-pointer appearance-none"
                  aria-label="Select Language"
                >
                  {UI_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative flex-1">
                <select
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                  className="w-full bg-[#142A21] text-xs text-[#7C9080] border border-[#2A5243] rounded-md px-3 py-1.5 outline-none hover:text-white transition-colors cursor-pointer appearance-none"
                  aria-label="Select Currency"
                >
                  {currencies.map((curr) => (
                    <option key={curr} value={curr}>
                      {curr}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-[#142A21] my-8" />

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-between items-center gap-6 text-[#7C9080] text-xs">
          <div className="flex flex-wrap items-center gap-6">
            <span className="flex items-center gap-1.5">
              <Shield size={14} className="text-[#C4614A]" /> All Guides Verified
            </span>
            <span className="flex items-center gap-1.5">
              <Star size={14} className="text-[#C4614A] fill-[#C4614A]" /> 4.9+ Rated Experiences
            </span>
            <span className="flex items-center gap-1.5">
              <Globe size={14} className="text-[#C4614A]" /> Multilingual Support
            </span>
          </div>

          <div className="flex gap-4">
            <Link href="/" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center text-xs text-[#7C9080]">
          © {new Date().getFullYear()} LocaLink. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
