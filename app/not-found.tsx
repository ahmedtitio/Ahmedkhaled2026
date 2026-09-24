
"use client";

import { Button } from './components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="text-center px-6 py-12 max-w-md mx-auto">
        {/* Error Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
            <span className="text-4xl font-bold" style={{ color: 'var(--color-accent)' }}>404</span>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
          Page Not Found
        </h1>

        <p className="text-lg mb-8" style={{ color: 'var(--color-text-secondary)' }}>
          Sorry, the page you are looking for doesn&apos;t exist or has been moved.
        </p>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button
            onClick={handleGoHome}
            className="w-full"
            style={{
              backgroundColor: 'var(--color-cta)',
              color: 'var(--color-cta-text)'
            }}
          >
            <Home className="w-4 h-4 mr-2" />
            Go to Home
          </Button>

          <Button
            onClick={handleGoBack}
            variant="outline"
            className="w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>

        {/* Additional Help */}
        <div className="mt-8 pt-8 border-t" style={{ borderColor: 'var(--color-border)' }}>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            If you believe this is an error, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
}
