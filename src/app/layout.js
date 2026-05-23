// Adapted from: Gemini in response to creating a root layout for our event booking application using Next.js and React.

import { AuthProvider } from '../context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar';
import './globals.css';

export const metadata = {
  title: 'Event Management System',
  description: 'Book and manage events easily.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {/* Navbar sits at the top of every page */}
          <Navbar />
          
          {/* Main content pushes down slightly from the Navbar */}
          <main className="min-h-screen pt-4 pb-12">
            {children}
          </main>
          
          {/* Global toast notifications */}
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}