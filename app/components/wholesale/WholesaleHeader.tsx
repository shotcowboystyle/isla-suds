import {useState, useEffect, useRef} from 'react';
import {Link, useFetcher, useLocation} from 'react-router';
import {wholesaleContent} from '~/content/wholesale';
import {WHOLESALE_ROUTES} from '~/content/wholesale-routes';
import {useClickOutside} from '~/hooks/use-click-outside';
import {cn} from '~/utils/cn';

export interface WholesaleHeaderProps {
  customerName: string;
}

export function WholesaleHeader({customerName}: WholesaleHeaderProps) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const fetcher = useFetcher();
  const location = useLocation();
  const isOrderPage = location.pathname === WHOLESALE_ROUTES.ORDER;
  const logoutButtonRef = useRef<HTMLButtonElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  const ref = useRef<HTMLButtonElement>(null);
  useClickOutside(ref, () => {
    setShowLogoutConfirm(false);
  });

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = () => {
    fetcher
      .submit(null, {
        method: 'POST',
        action: WHOLESALE_ROUTES.LOGOUT,
      })
      .catch(() => {
        setShowLogoutConfirm(false);
      });
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirm(false);
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
              to={WHOLESALE_ROUTES.ORDER}
              aria-current={isOrderPage ? 'page' : undefined}
              className={cn(
                'text-sm font-medium text-[--text-primary]',
                'hover:text-[--text-muted] transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[--text-primary]',
                'rounded-sm',
                isOrderPage && 'underline decoration-[--text-primary]',
              )}
            >
              {wholesaleContent.header.newOrderLink}
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

        <div className="flex items-center gap-4 sm:gap-6">
          <span className="text-sm text-[--text-muted] hidden sm:inline">
            {wholesaleContent.header.welcomePrefix}, {customerName}
          </span>

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

      {showLogoutConfirm && (
        <div
          ref={ref}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-dialog-title"
        >
          <div className="bg-canvas-elevated rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h2 id="logout-dialog-title" className="text-lg font-semibold text-[--text-primary] mb-2">
              {wholesaleContent.logout.confirmTitle}
            </h2>
            <p className="text-sm text-[--text-muted] mb-6">{wholesaleContent.logout.confirmMessage}</p>
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
