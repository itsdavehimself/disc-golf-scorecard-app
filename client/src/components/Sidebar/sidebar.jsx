export default function Sidebar() {
  return (
    <div className="bg-white md:w-80">
      <div className="hidden md:flex flex-col pt-16 items-start pl-5">
        <button>Scorecards</button>
        <button>Friends</button>
        <button>Courses</button>
      </div>
    </div>
  );
}
