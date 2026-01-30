# Story 8.5: Generate Shareable Links

Status: ready-for-dev

## Story

As a **visitor**,
I want **to share Isla Suds with friends via a shareable link**,
so that **I can spread the word about products I love**.

## Acceptance Criteria

**Given** I want to share the site
**When** I look for a share option
**Then** I find a "Share" or "Tell a Friend" link:
- In footer
- On order confirmation page
- (Optional) After add-to-cart
**And** clicking generates a shareable URL with tracking parameter:
- Example: `islasuds.com/?ref=share_[uniqueId]`
**And** share options include: Copy Link, native share (mobile)
**And** share modal is accessible (Radix Dialog)

**FRs addressed:** FR32

## Tasks / Subtasks

- [ ] Create share link generator utility (AC: 1)
  - [ ] Generate unique referral IDs
  - [ ] Format URL with ref parameter
  - [ ] Store referral ID for tracking
- [ ] Add share link in footer (AC: 2)
  - [ ] "Tell a Friend" or "Share" link
  - [ ] Opens share modal
  - [ ] Accessible and visible
- [ ] Add share link on order confirmation (AC: 3)
  - [ ] Thank you page includes share CTA
  - [ ] Encourage word-of-mouth after purchase
  - [ ] Track share source
- [ ] Implement share modal component (AC: 4)
  - [ ] Radix Dialog for accessibility
  - [ ] Copy link button
  - [ ] Native share button (mobile)
  - [ ] Success feedback
- [ ] Track share link generation (AC: 5)
  - [ ] Event when user generates link
  - [ ] Track share source (footer, order confirmation)
  - [ ] Enable Story 8.6 (share click tracking)

## Dev Notes

### Critical Architecture Requirements

**Shareable Link Format:**
```
https://islasuds.com/?ref=share_[uniqueId]
```

**Referral ID Generation:**
- Unique per share action (not per user)
- Format: `share_[timestamp]_[randomString]`
- Example: `share_1738276800_a9b3c7`
- Short enough for easy sharing
- Unique enough to avoid collisions

**Share Sources:**
- `footer` - Global footer link
- `order_confirmation` - Thank you page
- `add_to_cart` - Post-purchase (optional enhancement)
- Each source tracked separately for attribution

### Technical Stack

| Component | Implementation |
|-----------|---------------|
| Share Modal | Radix Dialog |
| Copy to Clipboard | Navigator Clipboard API |
| Native Share | Navigator Share API (mobile) |
| Link Generation | Utility function |
| Analytics | trackEvent from Story 8.1 |

### File Structure

```
app/
  components/
    share/
      ShareModal.tsx                # Share dialog component
      ShareModal.test.tsx
      ShareButton.tsx               # Trigger button
  lib/
    share.ts                        # Share link utilities
    share.test.ts
  routes/
    orders.$id.tsx                  # Add share on order confirmation
  content/
    share.ts                        # Share copy and messages
```

### Share Link Utility

**New File: `app/lib/share.ts`**

```typescript
import { trackEvent } from '@/lib/analytics';

/**
 * Generate unique referral ID for share link
 */
export function generateReferralId(): string {
  const timestamp = Date.now().toString(36); // Base36 timestamp
  const random = Math.random().toString(36).substring(2, 8); // 6 random chars

  return `share_${timestamp}_${random}`;
}

/**
 * Generate shareable URL with referral tracking
 */
export function generateShareableLink(
  source: 'footer' | 'order_confirmation' | 'add_to_cart' = 'footer'
): string {
  const referralId = generateReferralId();
  const baseUrl = window.location.origin;
  const shareUrl = `${baseUrl}/?ref=${referralId}`;

  // Track share link generation
  trackEvent('share_link_generated', {
    referralId,
    source,
    timestamp: new Date().toISOString(),
  });

  console.debug(`[Share] Generated link: ${shareUrl} (source: ${source})`);

  return shareUrl;
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);

    return success;
  } catch (error) {
    console.error('[Share] Copy failed:', error);
    return false;
  }
}

/**
 * Check if native share is available (mobile)
 */
export function isNativeShareAvailable(): boolean {
  return typeof navigator.share !== 'undefined';
}

/**
 * Share via native share sheet (mobile)
 */
export async function shareViaNavigator(url: string, title: string, text: string): Promise<boolean> {
  try {
    if (!navigator.share) {
      return false;
    }

    await navigator.share({
      title,
      text,
      url,
    });

    return true;
  } catch (error) {
    // User cancelled or error occurred
    console.debug('[Share] Native share cancelled:', error);
    return false;
  }
}
```

### Share Modal Component

**New File: `app/components/share/ShareModal.tsx`**

```typescript
import { useState } from 'react';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import {
  generateShareableLink,
  copyToClipboard,
  isNativeShareAvailable,
  shareViaNavigator,
} from '@/lib/share';
import { trackEvent } from '@/lib/analytics';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  source: 'footer' | 'order_confirmation' | 'add_to_cart';
}

export function ShareModal({ isOpen, onClose, source }: ShareModalProps) {
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const handleOpen = () => {
    // Generate fresh link when modal opens
    const url = generateShareableLink(source);
    setShareUrl(url);
    setCopied(false);
  };

  const handleCopyLink = async () => {
    const success = await copyToClipboard(shareUrl);

    if (success) {
      setCopied(true);
      trackEvent('share_link_copied', {
        source,
        shareUrl,
      });

      // Reset after 3 seconds
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleNativeShare = async () => {
    const success = await shareViaNavigator(
      shareUrl,
      'Isla Suds - Handcrafted Soaps',
      'Check out these amazing handcrafted soaps from Isla Suds!'
    );

    if (success) {
      trackEvent('share_native_opened', {
        source,
        shareUrl,
      });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} onOpenAutoFocus={handleOpen}>
      <Dialog.Content aria-labelledby="share-title">
        <Dialog.Header>
          <Dialog.Title id="share-title">Share Isla Suds</Dialog.Title>
          <Dialog.Description>
            Help spread the word about these handcrafted soaps.
          </Dialog.Description>
        </Dialog.Header>

        <div className="space-y-4 py-4">
          {/* Share URL Display */}
          <div className="rounded-md bg-canvas-elevated p-3">
            <p className="text-sm text-text-muted break-all">{shareUrl}</p>
          </div>

          {/* Copy Link Button */}
          <Button
            onClick={handleCopyLink}
            variant="primary"
            fullWidth
            aria-label={copied ? 'Link copied' : 'Copy link to clipboard'}
          >
            {copied ? '✓ Copied!' : 'Copy Link'}
          </Button>

          {/* Native Share Button (Mobile) */}
          {isNativeShareAvailable() && (
            <Button
              onClick={handleNativeShare}
              variant="secondary"
              fullWidth
              aria-label="Open share menu"
            >
              Share via...
            </Button>
          )}
        </div>

        <Dialog.Footer>
          <p className="text-xs text-text-muted text-center">
            Your friends will get the same warm welcome.
          </p>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
}
```

### Share Button Component

**New File: `app/components/share/ShareButton.tsx`**

```typescript
import { useState } from 'react';
import { ShareModal } from './ShareModal';

interface ShareButtonProps {
  source: 'footer' | 'order_confirmation' | 'add_to_cart';
  children: React.ReactNode;
  className?: string;
}

export function ShareButton({ source, children, className }: ShareButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={className}
        aria-label="Share Isla Suds with friends"
      >
        {children}
      </button>

      <ShareModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        source={source}
      />
    </>
  );
}
```

### Footer Integration

**Modify: `app/components/layout/Footer.tsx`**

```typescript
import { ShareButton } from '@/components/share/ShareButton';

export function Footer() {
  return (
    <footer className="bg-canvas-base border-t border-text-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Navigation Links */}
          <div>
            <h3 className="text-fluid-heading mb-4">Navigate</h3>
            <ul className="space-y-2">
              <li><a href="/">Home</a></li>
              <li><a href="/about">About</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="/wholesale">Wholesale</a></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-fluid-heading mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="/policies/privacy">Privacy Policy</a></li>
              <li><a href="/policies/terms">Terms of Service</a></li>
            </ul>
          </div>

          {/* Share Link */}
          <div>
            <h3 className="text-fluid-heading mb-4">Share the Love</h3>
            <ShareButton source="footer" className="text-accent-primary hover:text-accent-hover">
              Tell a Friend →
            </ShareButton>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-text-muted/20 text-center">
          <p className="text-sm text-text-muted">
            © {new Date().getFullYear()} Isla Suds. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
```

### Order Confirmation Integration

**Modify: `app/routes/orders.$id.tsx`**

```typescript
import { ShareButton } from '@/components/share/ShareButton';

export default function OrderConfirmation() {
  // ... existing order confirmation logic

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Order confirmation details */}
        <h1 className="text-fluid-display mb-4">Thank You!</h1>
        <p className="text-fluid-body mb-8">
          Your soap is on its way. We can't wait for you to try it.
        </p>

        {/* Order summary */}
        {/* ... */}

        {/* Share CTA */}
        <div className="mt-12 p-6 bg-canvas-elevated rounded-lg text-center">
          <h2 className="text-fluid-heading mb-2">Love what you ordered?</h2>
          <p className="text-fluid-body text-text-muted mb-4">
            Share Isla Suds with friends who'd appreciate handcrafted quality.
          </p>

          <ShareButton
            source="order_confirmation"
            className="inline-flex items-center justify-center px-6 py-3 bg-accent-primary text-white rounded-md hover:bg-accent-hover transition"
          >
            Share with Friends
          </ShareButton>
        </div>
      </div>
    </div>
  );
}
```

### Share Copy Content

**New File: `app/content/share.ts`**

```typescript
/**
 * Share-related copy and messages
 */

export const shareCopy = {
  // Modal
  modalTitle: 'Share Isla Suds',
  modalDescription: 'Help spread the word about these handcrafted soaps.',
  modalFooter: 'Your friends will get the same warm welcome.',

  // Buttons
  copyButton: 'Copy Link',
  copyButtonSuccess: '✓ Copied!',
  nativeShareButton: 'Share via...',

  // Footer
  footerHeading: 'Share the Love',
  footerLinkText: 'Tell a Friend →',

  // Order Confirmation
  orderConfirmationHeading: 'Love what you ordered?',
  orderConfirmationSubheading: 'Share Isla Suds with friends who'd appreciate handcrafted quality.',
  orderConfirmationButton: 'Share with Friends',

  // Native Share
  shareTitle: 'Isla Suds - Handcrafted Soaps',
  shareText: 'Check out these amazing handcrafted soaps from Isla Suds!',
};
```

### Testing Strategy

**Unit Tests: `app/lib/share.test.ts`**

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  generateReferralId,
  generateShareableLink,
  copyToClipboard,
  isNativeShareAvailable,
} from './share';
import * as analytics from '@/lib/analytics';

vi.mock('@/lib/analytics');

describe('Share Utilities', () => {
  const mockTrackEvent = vi.spyOn(analytics, 'trackEvent');

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('generates unique referral ID', () => {
    const id1 = generateReferralId();
    const id2 = generateReferralId();

    expect(id1).toMatch(/^share_[a-z0-9]+_[a-z0-9]+$/);
    expect(id2).toMatch(/^share_[a-z0-9]+_[a-z0-9]+$/);
    expect(id1).not.toBe(id2); // Unique
  });

  it('generates shareable link with ref parameter', () => {
    const link = generateShareableLink('footer');

    expect(link).toMatch(/^https?:\/\/.+\?ref=share_[a-z0-9_]+$/);
    expect(mockTrackEvent).toHaveBeenCalledWith('share_link_generated', {
      referralId: expect.stringMatching(/^share_[a-z0-9_]+$/),
      source: 'footer',
      timestamp: expect.any(String),
    });
  });

  it('copies text to clipboard', async () => {
    const mockWriteText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: { writeText: mockWriteText },
    });

    const success = await copyToClipboard('test text');

    expect(success).toBe(true);
    expect(mockWriteText).toHaveBeenCalledWith('test text');
  });

  it('detects native share availability', () => {
    // Mock navigator.share exists
    Object.assign(navigator, {
      share: vi.fn(),
    });

    expect(isNativeShareAvailable()).toBe(true);

    // Mock navigator.share doesn't exist
    delete (navigator as any).share;

    expect(isNativeShareAvailable()).toBe(false);
  });
});
```

**Component Tests: `app/components/share/ShareModal.test.tsx`**

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ShareModal } from './ShareModal';
import * as share from '@/lib/share';

vi.mock('@/lib/share');
vi.mock('@/lib/analytics');

describe('ShareModal', () => {
  it('generates share link when opened', async () => {
    const mockGenerateLink = vi.spyOn(share, 'generateShareableLink')
      .mockReturnValue('https://islasuds.com/?ref=share_test123');

    render(
      <ShareModal isOpen={true} onClose={() => {}} source="footer" />
    );

    await waitFor(() => {
      expect(mockGenerateLink).toHaveBeenCalledWith('footer');
    });

    expect(screen.getByText('https://islasuds.com/?ref=share_test123')).toBeInTheDocument();
  });

  it('copies link to clipboard on button click', async () => {
    const user = userEvent.setup();
    const mockCopy = vi.spyOn(share, 'copyToClipboard').mockResolvedValue(true);

    render(
      <ShareModal isOpen={true} onClose={() => {}} source="footer" />
    );

    const copyButton = screen.getByRole('button', { name: /copy link/i });
    await user.click(copyButton);

    expect(mockCopy).toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.getByText('✓ Copied!')).toBeInTheDocument();
    });
  });

  it('shows native share button on mobile', () => {
    vi.spyOn(share, 'isNativeShareAvailable').mockReturnValue(true);

    render(
      <ShareModal isOpen={true} onClose={() => {}} source="footer" />
    );

    expect(screen.getByText('Share via...')).toBeInTheDocument();
  });

  it('hides native share button on desktop', () => {
    vi.spyOn(share, 'isNativeShareAvailable').mockReturnValue(false);

    render(
      <ShareModal isOpen={true} onClose={() => {}} source="footer" />
    );

    expect(screen.queryByText('Share via...')).not.toBeInTheDocument();
  });
});
```

### Business Insights

**What the founder learns:**

1. **Share Adoption:**
   - How many users generate share links?
   - Which source drives most shares? (footer vs order confirmation)
   - Mobile vs desktop sharing patterns

2. **Share Timing:**
   - When do users share? (immediately, post-purchase, later)
   - Does sharing correlate with product exploration?

3. **Conversion from Shares:**
   - Story 8.6 tracks share link clicks
   - Attribution: purchases from shared links
   - Word-of-mouth effectiveness

### Edge Cases

**No Clipboard API (Older Browsers):**
- Fallback to execCommand('copy')
- Still functional, just less elegant
- Rare in modern browsers

**Native Share Cancelled:**
- User opens share sheet, then cancels
- Not an error, just user choice
- Don't track as successful share

**Duplicate Link Generation:**
- Each click generates new referral ID
- Allows tracking multiple shares by same user
- Each share uniquely attributed

### Privacy & Performance

**Privacy:**
- Referral IDs are random (no user identity)
- Links are public (anyone can use)
- No PII in share links
- Respects DNT

**Performance:**
- Modal uses Radix Dialog (accessible, performant)
- Link generation is instant (<1ms)
- No network calls until share (analytics batched)

### Anti-Patterns to Avoid

- ❌ Don't force sharing (make it optional)
- ❌ Don't track who shares (privacy concern)
- ❌ Don't reuse same referral ID (can't attribute clicks)
- ❌ Don't make share links long/ugly (UX harm)
- ❌ Don't forget accessibility (keyboard, screen readers)

### Future Enhancements (Document as TODOs)

1. **Social Media Integration:**
   - Pre-populated posts for Twitter, Facebook
   - Product-specific share (share a specific soap)
   - Image sharing (product photos)

2. **Referral Rewards:**
   - Discount for sharer and recipient
   - Track successful referrals
   - Gamification (leaderboard)

3. **Email Sharing:**
   - "Email a Friend" option
   - Pre-written email template
   - Warm, personal tone

### References

- [Source: epics.md#Story 8.5] - Shareable link requirements
- [Source: architecture.md#Component File Structure] - Share component location
- [Source: Story 8.1] - Analytics infrastructure (trackEvent)
- [Source: components/ui/Dialog.tsx] - Radix Dialog component

### Dependencies

**Story 8.1 Complete:** Analytics infrastructure (trackEvent)
**Story 1.5 Complete:** Radix UI Dialog primitive
**Epic 4 Complete:** Footer exists
**Epic 6 Complete:** Order confirmation page exists

**Enables:**
- Story 8.6: Track Share Link Clicks (uses referral IDs generated here)
- Word-of-mouth marketing channel
- Attribution tracking for organic growth

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (SM Agent - YOLO Mode)

### Completion Notes

Story created with comprehensive context analysis:
- Share link utility with unique referral ID generation
- ShareModal component with Radix Dialog for accessibility
- Copy to clipboard with fallback for older browsers
- Native share API integration for mobile
- Footer and order confirmation integration
- Share analytics tracking (link generated, copied, native share opened)
- Source tracking (footer, order confirmation, add-to-cart)
- Complete test coverage (unit + component tests)
- Share copy content centralized
- Business insights on share adoption and timing
- Edge case handling (no clipboard, share cancelled)
- Privacy safeguards (random referral IDs, no user tracking)
- Performance optimization (instant link generation)

**Foundation for word-of-mouth marketing** - Enables organic growth through customer sharing.

### File List

Files to create:
- app/lib/share.ts (share utilities)
- app/lib/share.test.ts (unit tests)
- app/components/share/ShareModal.tsx (share dialog)
- app/components/share/ShareModal.test.tsx (component tests)
- app/components/share/ShareButton.tsx (trigger button)
- app/content/share.ts (share copy)

Files to modify:
- app/components/layout/Footer.tsx (add share button)
- app/routes/orders.$id.tsx (add share CTA on order confirmation)

Files to verify:
- app/components/ui/Dialog.tsx (Radix Dialog component from Story 1.5)
- app/lib/analytics.ts (trackEvent from Story 8.1)
