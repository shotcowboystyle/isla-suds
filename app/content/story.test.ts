import {describe, it, expect} from 'vitest';
import {STORY_FRAGMENTS} from './story';

import type {StoryFragment} from './story';

describe('Story Content', () => {
  it('exports STORY_FRAGMENTS as named export', () => {
    expect(STORY_FRAGMENTS).toBeDefined();
    expect(Array.isArray(STORY_FRAGMENTS)).toBe(true);
  });

  it('contains at least 3 story fragments matching PRD requirements', () => {
    expect(STORY_FRAGMENTS.length).toBeGreaterThanOrEqual(3);

    // Verify fragments match PRD copy (AC1) - all three required phrases
    const fragmentTexts = STORY_FRAGMENTS.map(
      (f) => `${f.title} ${f.subtitle} ${f.content}`,
    ).join(' ');

    expect(fragmentTexts).toContain('Named for our daughter');
    expect(fragmentTexts).toContain('Made in our kitchen');
    expect(fragmentTexts).toContain('A family recipe passed down');
  });

  it('all fragments have required fields: title, subtitle, content', () => {
    STORY_FRAGMENTS.forEach((fragment, index) => {
      expect(
        fragment.title,
        `Fragment ${index} missing title`,
      ).toBeDefined();
      expect(
        fragment.subtitle,
        `Fragment ${index} missing subtitle`,
      ).toBeDefined();
      expect(
        fragment.content,
        `Fragment ${index} missing content`,
      ).toBeDefined();

      expect(typeof fragment.title).toBe('string');
      expect(typeof fragment.subtitle).toBe('string');
      expect(typeof fragment.content).toBe('string');
    });
  });

  it('actions are optional but typed correctly when present', () => {
    STORY_FRAGMENTS.forEach((fragment, index) => {
      if (fragment.actions) {
        expect(
          Array.isArray(fragment.actions),
          `Fragment ${index} actions must be array`,
        ).toBe(true);

        fragment.actions.forEach((action, actionIndex) => {
          expect(
            action.label,
            `Fragment ${index} action ${actionIndex} missing label`,
          ).toBeDefined();
          expect(
            action.url,
            `Fragment ${index} action ${actionIndex} missing url`,
          ).toBeDefined();
          expect(typeof action.label).toBe('string');
          expect(typeof action.url).toBe('string');
        });
      }
    });
  });

  it('StoryFragment type is exported for component usage', () => {
    // Type check - this will fail at compile time if type isn't exported
    const testFragment: StoryFragment = {
      title: 'Test',
      subtitle: 'Test Subtitle',
      content: 'Test Content',
    };

    expect(testFragment).toBeDefined();
  });
});
