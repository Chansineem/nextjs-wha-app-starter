// Suspense fallback ของ segment /dashboard
// จำเป็นภายใต้ cacheComponents: หน้า page.tsx เข้าถึง session (dynamic) จึงต้องมี
// boundary นี้เพื่อให้ layout shell prerender ได้ ส่วนหน้าค่อย stream ตามมา
export default function DashboardLoading() {
  return (
    <main className="mx-auto max-w-7xl space-y-6 px-4 py-8">
      <div className="space-y-2">
        <div className="h-7 w-40 animate-pulse rounded bg-muted" />
        <div className="h-4 w-72 animate-pulse rounded bg-muted" />
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-4xl bg-muted" />
        ))}
      </div>
      <div className="h-[380px] animate-pulse rounded-4xl bg-muted" />
      <div className="h-64 animate-pulse rounded-4xl bg-muted" />
    </main>
  );
}
