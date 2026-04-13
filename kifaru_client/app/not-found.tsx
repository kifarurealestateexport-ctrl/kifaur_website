import Link from 'next/link'
import { Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-brand-cream">
      <div className="text-center px-4 max-w-md">
        <div className="relative mb-8">
          <p className="font-heading font-bold text-[120px] leading-none text-brand-navy/10 select-none">404</p>
          <div className="absolute inset-0 flex items-center justify-center">
            <Search size={48} className="mx-auto text-brand-red opacity-60" />
          </div>
        </div>
        <h1 className="font-heading text-2xl font-bold text-brand-navy mb-3">Page Not Found</h1>
        <p className="text-sm text-gray-500 leading-relaxed mb-8">
          Looks like this page has been demolished! The page you're looking for doesn't exist or may have been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-primary flex items-center gap-2"><Home size={15} />Back to Home</Link>
          <Link href="/properties" className="btn-outline">Browse Properties</Link>
        </div>
      </div>
    </div>
  )
}
