import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="flex flex-col gap-16 md:grid md:grid-cols-2 md:gap-0 border-t border-light-gray px-8 md:px-24 xl:px-72 pt-12 pb-24">
      <section className="flex flex-col mx-auto gap-4">
        <h3 className="text-3xl md:text-xl font-semibold">About the project</h3>
        <p className="text-sm">
          ChainSeeker is my first ever full-stack web development project,
          dedicated to creating a utility app tailored for disc golf
          enthusiasts. As an avid disc golfer myself, I developed this
          application to meet the unique needs of the disc golf community. This
          project is more than just a showcase of my skills; it&apos;s a passion
          project born out of my love for disc golf. ChainSeeker was crafted
          with the goal of enhancing the disc golf experience, initially for my
          personal use and that of a few friends. See you on the fairway!
        </p>
      </section>
      <section className="md:mx-auto">
        <div className="flex flex-col items-start gap-4">
          <h3 className="text-3xl md:text-xl font-semibold">Links</h3>
          <Link
            to="https://github.com/itsdavehimself/disc-golf-scorecard-app#readme"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="hover:text-gray transition-all">
              Project Repository
            </button>
          </Link>

          <Link
            to="https://github.com/itsdavehimself"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="hover:text-gray transition-all">
              David&apos;s Github
            </button>
          </Link>
        </div>
      </section>
    </footer>
  );
}
