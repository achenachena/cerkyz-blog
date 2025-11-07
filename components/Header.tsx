import Link from 'next/link';

export default function Header() {
  return (
    <header className="border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-4xl mx-auto px-6 py-6">
        <div className="flex items-baseline justify-between">
          <Link href="/">
            <h1 className="text-2xl font-bold">Cerkyz&apos;s blog</h1>
          </Link>
          <nav className="flex gap-6 text-sm items-center">
            <Link href="/search" className="hover:opacity-60">Search</Link>
            <Link href="/rss.xml" className="hover:opacity-60">RSS</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
