/**
 * Wholesale Portal Header
 *
 * Minimal header for B2B wholesale portal featuring:
 * - Logo link to dashboard
 * - Partner name display
 * - Logout button with confirmation dialog
 * - Full keyboard accessibility (Escape to close, focus management)
 *
 * Story: 7.2
 */

import {useState, useEffect, useRef} from 'react';
import {Link, useFetcher} from 'react-router';
import {wholesaleContent} from '~/content/wholesale';
import {WHOLESALE_ROUTES} from '~/content/wholesale-routes';
import {cn} from '~/utils/cn';

export interface WholesaleHeaderProps {
  customerName: string;
}

export function WholesaleHeader({customerName}: WholesaleHeaderProps) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const fetcher = useFetcher();
  const logoutButtonRef = useRef<HTMLButtonElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = () => {
    fetcher.submit(null, {
      method: 'POST',
      action: WHOLESALE_ROUTES.LOGOUT,
    });
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Close dialog when clicking overlay (not dialog content)
    if (e.target === e.currentTarget) {
      setShowLogoutConfirm(false);
    }
  };

  // Keyboard accessibility: Escape to close, focus management
  useEffect(() => {
    if (!showLogoutConfirm) return;

    // Auto-focus confirm button when dialog opens
    confirmButtonRef.current?.focus();

    // Handle Escape key to close dialog
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowLogoutConfirm(false);
      }
    };

    document.addEventListener('keydown', handleEscape);

    // Cleanup and restore focus to logout button
    return () => {
      document.removeEventListener('keydown', handleEscape);
      logoutButtonRef.current?.focus();
    };
  }, [showLogoutConfirm]);

  return (
    <>
      <header
        className={cn(
          'flex items-center justify-between',
          'min-h-16 px-4 sm:px-6 lg:px-8',
          'border-b border-[--text-muted]/20',
          'bg-canvas-elevated',
        )}
      >
        {/* Logo & Navigation */}
        <div className="flex items-center gap-6">
          <Link
            to={WHOLESALE_ROUTES.DASHBOARD}
            className={cn(
              'text-xl font-semibold text-[--text-primary]',
              'hover:text-[--text-muted] transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[--text-primary]',
              'rounded-sm',
            )}
          >
            Isla Suds
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-4">
            <Link
              to={WHOLESALE_ROUTES.DASHBOARD}
              className={cn(
                'text-sm font-medium text-[--text-primary]',
                'hover:text-[--text-muted] transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[--text-primary]',
                'rounded-sm',
              )}
            >
              Dashboard
            </Link>
            <Link
              to={WHOLESALE_ROUTES.ORDERS}
              className={cn(
                'text-sm font-medium text-[--text-primary]',
                'hover:text-[--text-muted] transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[--text-primary]',
                'rounded-sm',
              )}
            >
              Order History
            </Link>
          </nav>
        </div>

        {/* Partner Info & Actions */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Partner Name */}
          <span className="text-sm text-[--text-muted] hidden sm:inline">
            {wholesaleContent.header.welcomePrefix}, {customerName}
          </span>

          {/* Logout Button */}
          <button
            ref={logoutButtonRef}
            type="button"
            onClick={handleLogoutClick}
            className={cn(
              'inline-flex items-center justify-center',
              'min-h-[44px] min-w-[44px] px-4 py-2',
              'text-sm font-medium',
              'text-[--text-primary] hover:text-[--text-muted]',
              'border border-[--text-muted]/30 rounded-md',
              'hover:bg-canvas-base transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[--text-primary]',
            )}
          >
            {wholesaleContent.auth.logoutButton}
          </button>
        </div>
      </header>

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-dialog-title"
          onClick={handleOverlayClick}
        >
          <div className="bg-canvas-elevated rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h2
              id="logout-dialog-title"
              className="text-lg font-semibold text-[--text-primary] mb-2"
            >
              {wholesaleContent.logout.confirmTitle}
            </h2>
            <p className="text-sm text-[--text-muted] mb-6">
              {wholesaleContent.logout.confirmMessage}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={handleCancelLogout}
                className={cn(
                  'px-4 py-2 text-sm font-medium',
                  'text-[--text-primary] border border-[--text-muted]/30 rounded-md',
                  'hover:bg-canvas-base transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[--text-primary]',
                )}
              >
                {wholesaleContent.logout.cancelButton}
              </button>
              <button
                ref={confirmButtonRef}
                type="button"
                onClick={handleConfirmLogout}
                className={cn(
                  'px-4 py-2 text-sm font-medium',
                  'text-canvas-base bg-[--text-primary] rounded-md',
                  'hover:opacity-90 transition-opacity',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[--text-primary]',
                )}
              >
                {wholesaleContent.logout.confirmButton}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
