// Suspense fallback ของ segment /dashboard/products (จำเป็นใต้ cacheComponents
// เพราะ page.tsx อ่าน session ซึ่งเป็น dynamic data)
export default function ProductsLoading() {
  return (
    <main className="mx-auto max-w-7xl space-y-6 px-4 py-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-40 animate-pulse rounded bg-muted" />
          <div className="h-4 w-64 animate-pulse rounded bg-muted" />
        </div>
        <div className="h-9 w-28 animate-pulse rounded-4xl bg-muted" />
      </div>
      <div className="h-9 w-full max-w-sm animate-pulse rounded-4xl bg-muted" />
      <div className="h-96 animate-pulse rounded-4xl bg-muted" />
    </main>
  );
}
