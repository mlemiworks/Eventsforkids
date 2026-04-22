// Shown by Next.js while the event detail page is fetching its data.
// Mirrors the structure of the real page (banner → title → metadata row →
// description) so the layout doesn't shift when content arrives.
export default function Loading() {
  return (
    <div className="animate-pulse bg-zinc-50 dark:bg-black">
      <div className="w-full h-72 bg-gray-200 dark:bg-zinc-800" />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="h-8 bg-gray-200 dark:bg-zinc-800 rounded w-2/3 mb-6" />
        <div className="flex gap-8 mb-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i}>
              <div className="h-3 bg-gray-200 dark:bg-zinc-800 rounded w-16 mb-2" />
              <div className="h-5 bg-gray-200 dark:bg-zinc-800 rounded w-24" />
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-full" />
          <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-5/6" />
          <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-4/6" />
        </div>
      </div>
    </div>
  );
}
