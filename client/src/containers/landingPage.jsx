import { Link } from 'react-router-dom';
import dashboardImg from '../assets/images/phone_dashboard.png';
import scorecardImg from '../assets/images/phone_scorecard.png';
import friendsImg from '../assets/images/phone_friends.png';
import friendStatsImg from '../assets/images/phone_friend_stats.png';
import ReviewCard from '../components/ReviewCard';
import RevealOnScroll from '../components/RevealOnScroll';
import Footer from '../components/Footer';

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col justify-center items-center bg-hero-pattern h-[100vh] bg-cover bg-bottom md:bg-cover md:bg-center ">
        <h2 className=" text-white text-4xl xl:text-5xl font-semibold text-center px-1 pb-5">
          Your disc golf scorecard companion
        </h2>
        <p className="text-white text-lg xl:text-xl px-5 text-center pb-5">
          Elevate your disc golf game and keep track of your best rounds. Tee
          off to a new level of fun!
        </p>
        <Link to={'/signup'}>
          <button className="bg-jade px-4 py-3 text-xl rounded-md text-white font-semibold cursor-pointer hover:bg-emerald transition-colors ">
            Get Started
          </button>
        </Link>
      </div>
      <div className="flex md:grid md:grid-cols-2 md:gap-28 lg:gap-18 pt-48 md:pt-36 px-12 text-black">
        <div className="hidden md:flex justify-center">
          <RevealOnScroll>
            <div className="relative">
              <img
                src={dashboardImg}
                alt="Dashboard"
                className="w-11/12 lg:w-96"
              ></img>
              <img
                src={scorecardImg}
                alt="Scorecard"
                className="w-11/12 lg:w-96 absolute top-16 left-24"
              ></img>
            </div>
          </RevealOnScroll>
        </div>
        <div className="flex flex-col justify-center gap-6 mx-auto xl:pr-44">
          <h2 className="text-4xl font-semibold">
            Seamless Disc Golf Adventure, Anywhere.
          </h2>
          <p className="text-lg">
            Embark on a new disc golf journey with ChainSeeker—a powerful
            companion that redefines how you track your rounds. Whether on the
            course or at home, its user-friendly, mobile-responsive design
            seamlessly adapts to your lifestyle. Say goodbye to scorekeeping
            headaches—the intuitive app lets you focus on the game&apos;s joy.
            Discover the simplicity of ChainSeeker, and let your disc golf
            experience shine without unnecessary complexities.
          </p>
          <Link to={'/signup'}>
            <button className="bg-jade px-4 py-3 text-xl rounded-md text-white font-semibold cursor-pointer hover:bg-emerald transition-colors ">
              Start Tracking
            </button>
          </Link>
        </div>
      </div>
      <div className="flex md:grid md:grid-cols-2 md:gap-28 lg:gap-18 py-48 md:pt-36 px-12 text-black">
        <div className="hidden md:flex justify-center">
          <RevealOnScroll>
            <div className="relative">
              <img
                src={friendsImg}
                alt="Dashboard"
                className="w-11/12 lg:w-96"
              ></img>
              <img
                src={friendStatsImg}
                alt="Scorecard"
                className="w-11/12 lg:w-96 absolute top-16 left-24"
              ></img>
            </div>
          </RevealOnScroll>
        </div>
        <div className="flex flex-col justify-center gap-6 mx-auto xl:pr-44">
          <h2 className="text-4xl font-semibold">
            Play With Friends, Compare Your Stats.
          </h2>
          <p className="text-lg">
            Elevate your disc golf camaraderie with ChainSeeker&apos;s
            personalized touch. Create profiles for friends, effortlessly
            tracking and comparing their stats within the intuitive app. Uncover
            the friendly competition as you gauge your performance against
            theirs, turning every round into a shared victory. The simplicity of
            profile creation and stat tracking ensures a seamless experience,
            fostering a community where your disc golf journeys intertwine, and
            the joy of friendly competition takes center stage.
          </p>
          <Link to={'/signup'}>
            <button className="bg-jade px-4 py-3 text-xl rounded-md text-white font-semibold cursor-pointer hover:bg-emerald transition-colors ">
              Join the Game
            </button>
          </Link>
        </div>
      </div>
      <div className="flex flex-col items-center px-8 xl:px-72 pb-36 text-black bg-off-white">
        <h2 className="text-4xl font-semibold py-20 text-center">
          What&apos;s the tee about ChainSeeker?
        </h2>
        <div className="flex flex-wrap justify-center gap-6">
          <RevealOnScroll>
            <div className="flex justify-center">
              <ReviewCard
                review="ChainSeeker is a disc golf dream! Creating profiles for friends makes it epic. So easy to use, and tracking my stats is a game-changer."
                username="discmaster42"
              />
            </div>
          </RevealOnScroll>
          <RevealOnScroll>
            <div className="flex justify-center">
              <ReviewCard
                review="My go-to app! Creating profiles for friends adds a social twist. Incredibly easy to use, plus stat tracking? Awesome! Perfect disc golf companion."
                username="FairwayFred"
              />
            </div>
          </RevealOnScroll>
          <RevealOnScroll>
            <div className="flex justify-center">
              <ReviewCard
                review="Fantastic app! Creating profiles for friends enhances the fun. User-friendly, stat tracking is a blast. A must for disc golfers!"
                username="BirdBirdieBrian"
              />
            </div>
          </RevealOnScroll>
          <RevealOnScroll>
            <div className="flex justify-center">
              <ReviewCard
                review="Simplifies scoring. Friend profiles add a cool dimension. Effortless to use, love tracking my stats. Top-notch disc golf companion!"
                username="ChillDude22"
              />
            </div>
          </RevealOnScroll>
          <RevealOnScroll>
            <div className="flex justify-center">
              <ReviewCard
                review="This app rocks! Friend profiles amp up the competition. User-friendly, intuitive design. Tracking stats? Seamless. Best disc golf tool ever!"
                username="TreeDodger"
              />
            </div>
          </RevealOnScroll>
          <RevealOnScroll>
            <div className="flex justify-center">
              <ReviewCard
                review="Excels in every way! Love creating profiles for friends. User-friendly and efficient. Stat tracking is a bonus. Elevates the disc golf experience!"
                username="ParManRyan"
              />
            </div>
          </RevealOnScroll>
        </div>
      </div>
      <Footer />
    </div>
  );
}
