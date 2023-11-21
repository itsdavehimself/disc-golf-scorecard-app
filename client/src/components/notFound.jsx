import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="flex flex-col gap-10 w-full justify-center text-center text-black">
      <h1 className="text-2xl md:text-4xl font-semibold">
        Uh oh! Looks like you wandered off the fairway.
      </h1>
      <h2 className="text-xl md:text-2xl">This page doesn't exist.</h2>
      <Link to="/">
        <button className="bg-jade py-2 px-3 rounded-md text-white font-semibold cursor-pointer hover:bg-emerald transition-colors">
          Take me home
        </button>
      </Link>
    </section>
  );
}
