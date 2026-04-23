// Next.js automatically shows this file while the sibling page.tsx is loading.
// It works via React Suspense under the hood — no extra wiring needed.
// The skeleton layout intentionally mirrors the real event grid so the transition
// feels smooth rather than jarring.
export default function Loading() {
  return (
    <div className="flex min-h-screen items-top justify-center bg-zinc-50">
      <div className="h-full grid gap-6 sm:grid-cols-2 lg:grid-cols-3 p-4 sm:p-6 lg:p-8">
        {/* Array.from creates an array of N empty slots so we can map over it —
            there's no built-in way to loop N times in JSX without an array */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-lg overflow-hidden bg-gray-200 w-72 h-64"
          />
        ))}
      </div>
    </div>
  );
}
