import Link from 'next/link';
import { Event } from '../types/types';

const EventCard = ({ event }: { event: Event }) => {
  return (
    <div className="border border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white dark:bg-gray-800">
      <Link href={`/${event.id}`}>
        {/* The button wraps the image to create a hover overlay effect.
            `group` on the parent lets child elements react to the parent's
            hover state via the `group-hover:` Tailwind variant. */}
        <button className="w-full relative group focus:outline-none mb-4 hover:cursor-pointer">
          {/* Overlay: hidden by default, fades in on hover via group-hover:opacity-100 */}
          <span className="absolute inset-0  flex items-center justify-center rounded-md opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <span className="absolute inset-0 bg-black bg-opacity-40 rounded-md"></span>
            <span className="relative text-white text-center text-lg font-semibold">
              {event.title}
            </span>
          </span>

          {/* Image fades out on hover so the overlay text is legible */}
          <img
            src={event.imgUrl}
            alt={event.title}
            className="w-full h-48 object-cover rounded-md  transition-opacity duration-200 group-hover:opacity-20"
          />
        </button>
      </Link>

      <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
        {event.title}
      </h2>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        {event.description}
      </p>
      <div className="text-sm text-gray-500 dark:text-gray-400">
        <p>
          Aika: {event.date} {event.time}
        </p>
        <p>Sijainti: {event.location}</p>
      </div>
    </div>
  );
};

export default EventCard;
