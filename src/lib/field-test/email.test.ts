import { renderSubmissionNotification } from './email';
import type { SubmissionInput } from './submissions';

const base: SubmissionInput = {
  code: 'AB12',
  candidateName: 'Ada Lovelace',
  deptChoiceId: 'cold-email',
  deptChoiceLabel: 'Send the cold email today.',
  deptWhy: null,
  earlyChoiceId: 'jump-in',
  earlyChoiceLabel: "Jump in on whoever's behind.",
  story: 'Kept a personal project alive for months with nobody checking.',
  patternShown: [0, 1, 2, 3, 4],
  patternRecalled: [0, 1, 2, 3, 4],
  patternMatched: true,
};

describe('renderSubmissionNotification', () => {
  it('escapes HTML in candidate-supplied text so it cannot inject markup', () => {
    const html = renderSubmissionNotification({
      ...base,
      candidateName: '<script>alert(1)</script>',
    });
    expect(html).not.toContain('<script>alert');
    expect(html).toContain('&lt;script&gt;');
  });

  it('includes the reference code and candidate name', () => {
    const html = renderSubmissionNotification(base);
    expect(html).toContain('AB12');
    expect(html).toContain('Ada Lovelace completed the Field Test.');
  });

  it('only shows the why line when one was given', () => {
    const withoutWhy = renderSubmissionNotification(base);
    expect(withoutWhy).not.toContain('>Why<');

    const withWhy = renderSubmissionNotification({ ...base, deptWhy: 'Fastest way to find out.' });
    expect(withWhy).toContain('>Why<');
    expect(withWhy).toContain('Fastest way to find out.');
  });

  it('flags a mismatched pattern recall', () => {
    const html = renderSubmissionNotification({
      ...base,
      patternRecalled: [4, 3, 2, 1, 0],
      patternMatched: false,
    });
    expect(html).toContain('Did not match');
  });
});
