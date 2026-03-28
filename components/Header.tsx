import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/config';

export default function Header() {
  return (
    <header className="border-b border-border">
      <div className="max-w-4xl mx-auto px-6 py-6">
        <div className="flex items-baseline justify-between">
          <Link href="/">
            <h1 className="text-2xl font-bold">{SITE_CONFIG.title}</h1>
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
