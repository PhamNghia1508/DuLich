import { Link } from 'wouter';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAF7]">
      <Navbar />
      <main className="flex-1 container py-24 text-center">
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold mb-4 text-[#1A1A1A]">
          404 — Page not found
        </h1>
        <p className="text-sm text-[#5A5A5A] mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link href="/" className="btn btn-primary">
          Back to home
        </Link>
      </main>
      <Footer />
    </div>
  );
}
