import {describe, it, expect} from 'vitest';
import {ABOUT_PAGE} from './about';

describe('ABOUT_PAGE content', () => {
  it('has all required meta fields', () => {
    expect(ABOUT_PAGE.meta.title).toBeDefined();
    expect(ABOUT_PAGE.meta.description).toBeDefined();
    expect(ABOUT_PAGE.meta.title).toContain('Isla Suds');
  });

  it('has hero content', () => {
    expect(ABOUT_PAGE.hero.title).toBeDefined();
    expect(ABOUT_PAGE.hero.subtitle).toBeDefined();
  });

  it('has founder story section', () => {
    expect(ABOUT_PAGE.founderStory.heading).toBeDefined();
    expect(ABOUT_PAGE.founderStory.content).toBeInstanceOf(Array);
    expect(ABOUT_PAGE.founderStory.content.length).toBeGreaterThan(0);
    // Verify content is authentic and personal (contains specific details)
    expect(ABOUT_PAGE.founderStory.content.join('')).toContain('Sarah');
    expect(ABOUT_PAGE.founderStory.content.join('')).toContain('kitchen');
  });

  it('has Isla namesake section with personal tone', () => {
    expect(ABOUT_PAGE.islaNameSake.heading).toBeDefined();
    expect(ABOUT_PAGE.islaNameSake.content).toBeInstanceOf(Array);
    expect(ABOUT_PAGE.islaNameSake.content.length).toBeGreaterThan(0);
    expect(ABOUT_PAGE.islaNameSake.content.join('')).toContain('Isla');
    expect(ABOUT_PAGE.islaNameSake.content.join('')).toContain('daughter');
  });

  it('has recipe heritage section', () => {
    expect(ABOUT_PAGE.recipeHeritage.heading).toBeDefined();
    expect(ABOUT_PAGE.recipeHeritage.content).toBeInstanceOf(Array);
    expect(ABOUT_PAGE.recipeHeritage.content.length).toBeGreaterThan(0);
  });

  it('has craftsmanship section', () => {
    expect(ABOUT_PAGE.craftsmanship.heading).toBeDefined();
    expect(ABOUT_PAGE.craftsmanship.content).toBeInstanceOf(Array);
    expect(ABOUT_PAGE.craftsmanship.content.length).toBeGreaterThan(0);
    expect(ABOUT_PAGE.craftsmanship.content.join('')).toContain('kitchen');
  });

  it('has image placeholder data', () => {
    expect(ABOUT_PAGE.images.founder).toBeDefined();
    expect(ABOUT_PAGE.images.founder.alt).toBeDefined();
    expect(ABOUT_PAGE.images.workshop).toBeDefined();
    expect(ABOUT_PAGE.images.workshop.alt).toBeDefined();
    expect(ABOUT_PAGE.images.market).toBeDefined();
    expect(ABOUT_PAGE.images.market.alt).toBeDefined();
  });

  it('uses warm, authentic voice (not marketing copy)', () => {
    const allContent = [
      ...ABOUT_PAGE.founderStory.content,
      ...ABOUT_PAGE.islaNameSake.content,
      ...ABOUT_PAGE.recipeHeritage.content,
      ...ABOUT_PAGE.craftsmanship.content,
    ].join(' ');

    // Should NOT contain vague marketing speak
    expect(allContent).not.toMatch(/artisanal/i);
    expect(allContent).not.toMatch(/curated/i);

    // Should contain specific, authentic details
    expect(allContent).toContain('farmers market');
    expect(allContent).toMatch(/kitchen|family|daughter/i);
  });

  it('keeps sections concise (1-3 paragraphs each)', () => {
    expect(ABOUT_PAGE.founderStory.content.length).toBeLessThanOrEqual(3);
    expect(ABOUT_PAGE.islaNameSake.content.length).toBeLessThanOrEqual(3);
    expect(ABOUT_PAGE.recipeHeritage.content.length).toBeLessThanOrEqual(3);
    expect(ABOUT_PAGE.craftsmanship.content.length).toBeLessThanOrEqual(3);
  });
});
