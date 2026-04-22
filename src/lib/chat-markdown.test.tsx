import { render } from '@testing-library/react';

import { renderChatMarkdown } from '@/lib/chat-markdown';

function renderText(text: string) {
  return render(<div data-testid="out">{renderChatMarkdown(text)}</div>);
}

describe('renderChatMarkdown', () => {
  it('renders plain text unchanged', () => {
    const { getByTestId } = renderText('hello world');
    expect(getByTestId('out').textContent).toBe('hello world');
  });

  it('renders **bold** as <strong>', () => {
    const { container } = renderText('this is **bold** text');
    const strong = container.querySelector('strong');
    expect(strong?.textContent).toBe('bold');
  });

  it('renders *italic* as <em>', () => {
    const { container } = renderText('this is *italic* text');
    expect(container.querySelector('em')?.textContent).toBe('italic');
  });

  it('renders `code` as <code>', () => {
    const { container } = renderText('use `npm run dev`');
    expect(container.querySelector('code')?.textContent).toBe('npm run dev');
  });

  it('renders explicit internal [label](/path) link', () => {
    const { container } = renderText('see [projects](/garage) page');
    const link = container.querySelector('a[href="/garage"]');
    expect(link?.textContent).toBe('projects');
  });

  it('renders explicit external link with target=_blank', () => {
    const { container } = renderText('visit [site](https://example.com)');
    const link = container.querySelector('a[href="https://example.com"]');
    expect(link?.getAttribute('target')).toBe('_blank');
    expect(link?.getAttribute('rel')).toContain('noopener');
  });

  it('refuses unsafe hrefs like javascript:', () => {
    const { container } = renderText('[x](javascript:alert(1))');
    expect(container.querySelector('a')).toBeNull();
    expect(container.textContent).toContain('x');
  });

  it('autolinks "Garage" to /garage', () => {
    const { container } = renderText('check out my Garage for projects');
    const link = container.querySelector('a[href="/garage"]');
    expect(link?.textContent).toBe('Garage');
  });

  it('prefers longer pattern "Garage world" over "Garage"', () => {
    const { container } = renderText('visit the Garage world today');
    const links = container.querySelectorAll('a[href="/garage"]');
    expect(links.length).toBe(1);
    expect(links[0].textContent).toBe('Garage world');
  });

  it('only autolinks first occurrence per href in a message', () => {
    const { container } = renderText('Garage is cool, Garage has projects');
    const links = container.querySelectorAll('a[href="/garage"]');
    expect(links.length).toBe(1);
  });

  it('autolinks GitHub as external', () => {
    const { container } = renderText('find me on GitHub');
    const link = container.querySelector('a[target="_blank"]');
    expect(link?.getAttribute('href')).toContain('github.com');
    expect(link?.textContent).toBe('GitHub');
  });

  it('combines bold and autolink in one message', () => {
    const { container } = renderText('**proud** of my Garage');
    expect(container.querySelector('strong')?.textContent).toBe('proud');
    expect(container.querySelector('a[href="/garage"]')?.textContent).toBe('Garage');
  });

  it('matches autolink case-insensitively', () => {
    const { container } = renderText('check GITHUB');
    const link = container.querySelector('a[target="_blank"]');
    expect(link?.textContent).toBe('GITHUB');
  });

  it('does not match autolink inside a larger word', () => {
    const { container } = renderText('garagerocks is not a world');
    expect(container.querySelector('a[href="/garage"]')).toBeNull();
  });

  it('preserves newlines in plain text', () => {
    const { getByTestId } = renderText('line one\nline two');
    expect(getByTestId('out').textContent).toBe('line one\nline two');
  });

  it('autolinks keywords inside **bold**', () => {
    const { container } = renderText('check out the **Garage** world');
    const strong = container.querySelector('strong');
    expect(strong).not.toBeNull();
    const link = strong?.querySelector('a[href="/garage"]');
    expect(link?.textContent).toBe('Garage');
  });

  it('bold-nested autolink still enforces first-occurrence per href', () => {
    const { container } = renderText('**Garage** is great, and Garage rocks');
    expect(container.querySelectorAll('a[href="/garage"]').length).toBe(1);
  });
});
