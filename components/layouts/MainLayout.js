import React from 'react';
import Header from '../Header';
import Footer from '../Footer';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24">
        {children}
      </main>
      <Footer />
    </div>
  );
}