import { fetchEventById } from '@/src/lib/dataFetching';

const EventPage = async ({
  params,
}: {
  params: Promise<{ event: string }>;
}) => {
  const resolvedParams = await params;
  const eventIdNumber = parseInt(resolvedParams.event, 10);
  const event = await fetchEventById(eventIdNumber);

  if (!event) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <p className="text-gray-700 dark:text-gray-300">Tapahtumaa ei löydy.</p>
      </div>
    );
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black p-4">
      <div className="max-w-3xl w-full">
        <h1>{event.title}</h1>
      </div>
    </div>
  );
};

export default EventPage;
