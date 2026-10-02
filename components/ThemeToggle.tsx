'use client';

export default function ThemeToggle() {
  const toggleTheme = () => {
    const dark = document.documentElement.classList.toggle('dark');
    try {
      localStorage.setItem('theme', dark ? 'dark' : 'light');
    } catch {
      // The toggle still works when the browser blocks local storage.
    }
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="relative inline-flex h-6 w-11 items-center rounded-full bg-black p-0.5 transition-colors dark:bg-white"
      aria-label="Toggle theme"
    >
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-black transition-transform dark:translate-x-5 dark:bg-black dark:text-white">
        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      </span>
    </button>
  );
}
