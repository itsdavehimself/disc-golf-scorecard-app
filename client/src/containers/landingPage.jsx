import { Link } from 'react-router-dom';
import dashboardImg from '../assets/images/phone_dashboard.png';
import scorecardImg from '../assets/images/phone_scorecard.png';
import friendsImg from '../assets/images/phone_friends.png';
import myStatsImg from '../assets/images/phone_my_stats.png';
import newRoundImg from '../assets/images/phone_newround.png';
import friendStatsImg from '../assets/images/phone_friend_stats.png';

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col justify-center items-center bg-hero-pattern h-[80vh] w-screen bg-cover bg-bottom md:bg-cover md:bg-center ">
        <h2 className=" text-off-white text-4xl font-semibold text-center px-1 pb-5">
          Your disc golf scorecard companion
        </h2>
        <p className="text-off-white text-lg px-5 text-center pb-5">
          Elevate your disc golf game and keep track of your best rounds. Tee
          off to a new level of fun!
        </p>
        <Link to={'/signup'}>
          <button className="bg-jade px-4 py-3 text-xl rounded-md text-off-white font-semibold cursor-pointer hover:bg-emerald transition-colors ">
            Get Started
          </button>
        </Link>
      </div>
    </div>
  );
}
