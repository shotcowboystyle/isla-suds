import {describe, expect, it} from 'vitest';
import {SCENTS, scentForHandle, splitDescription} from './product-page';

describe('scentForHandle', () => {
  it('maps every live handle to its scent', () => {
    expect(scentForHandle('eucalyptus')).toBe('eucalyptus');
    expect(scentForHandle('lavender')).toBe('lavender');
    expect(scentForHandle('lemongrass')).toBe('lemongrass');
    expect(scentForHandle('rosemary-sea-salt')).toBe('rosemary');
  });

  it('falls back to eucalyptus for unknown products', () => {
    expect(scentForHandle('gift-card')).toBe('eucalyptus');
    expect(SCENTS[scentForHandle('gift-card')]).toBeDefined();
  });
});

describe('splitDescription', () => {
  it('strips pasted citation tokens', () => {
    const {lede} = splitDescription('Fresh and clean.[ppl-ai-file-upload.s3.amazonaws] Made by hand. More here.');
    expect(lede).toBe('Fresh and clean. Made by hand.');
  });

  it('keeps everything after the second sentence, punctuation or not', () => {
    expect(splitDescription('One. Two. Three. And a tail')).toEqual({lede: 'One. Two.', rest: 'Three. And a tail'});
  });

  it('handles short and unpunctuated text', () => {
    expect(splitDescription('Just one line')).toEqual({lede: 'Just one line', rest: ''});
    expect(splitDescription('')).toEqual({lede: '', rest: ''});
  });
});
