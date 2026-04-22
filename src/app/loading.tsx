export default function Loading() {
  return (
    <div className="flex min-h-screen items-top justify-center bg-zinc-50 dark:bg-black">
      <div className="h-full grid gap-6 sm:grid-cols-2 lg:grid-cols-3 p-4 sm:p-6 lg:p-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-lg overflow-hidden bg-gray-200 dark:bg-zinc-800 w-72 h-64"
          />
        ))}
      </div>
    </div>
  );
}
