import { useEffect } from "react";

export default function WeekTwo() {
  useEffect(() => {
    document.title = "Week Two | Weekly $Hackathon";
  }, []);

  return (
    <div className="min-h-screen bg-black w-screen text-white px-4 pt-36 pb-24 sm:px-6 sm:py-28 md:px-8">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        {/* Title Section */}
        <div className="bg-[#2a2a2a] p-4 sm:p-6 rounded-lg">
          <h1 className="font-mek text-2xl sm:text-3xl md:text-4xl font-bold text-center text-[#2DFF05] drop-shadow-[0_0_8px_#2DFF05]">
            $HACKATHON: Week Two
          </h1>
          <p className="text-sm sm:text-base text-gray-400 text-center mt-2">
            Build AI Agents to Judge Hackathon Projects
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-[#2a2a2a] p-4 sm:p-6 rounded-lg">
          <h2 className="font-mek text-lg sm:text-xl font-bold text-[#2DFF05] drop-shadow-[0_0_8px_#2DFF05] flex items-center gap-2">
            <span>🎯</span> Mission
          </h2>
          <p className="mt-2 text-sm sm:text-base">
            Create a system of three or more AI agents that work together to
            evaluate and select the top 8 finalists from weekly hackathon
            submissions. The agents should coordinate and communicate to make
            informed decisions about project quality and potential.
          </p>
        </div>

        {/* Build Requirements Section */}
        <div className="bg-[#2a2a2a] p-4 sm:p-6 rounded-lg">
          <h2 className="font-mek text-lg sm:text-xl font-bold text-[#2DFF05] drop-shadow-[0_0_8px_#2DFF05] flex items-center gap-2">
            <span>🛠️</span> Build Requirements
          </h2>
          <ul className="mt-2 space-y-1.5 sm:space-y-2 list-disc list-inside text-sm sm:text-base">
            <li>Individual submissions only - no teams</li>
            <li>Minimum of 3 AI agents in the cluster</li>
            <li>Agents must coordinate to select 8 finalists</li>
            <li>MVP approach - focus on core functionality</li>
            <li>Must analyze GitHub repo history to evaluate hackers</li>
            <li>Must document agent methodology and reasoning</li>
            <li>Must use an open source license</li>
          </ul>
        </div>

        {/* Submit Section */}
        <div className="bg-[#2a2a2a] p-4 sm:p-6 rounded-lg">
          <h2 className="font-mek text-lg sm:text-xl font-bold text-[#2DFF05] drop-shadow-[0_0_8px_#2DFF05] flex items-center gap-2">
            <span>📝</span> Submit Via
          </h2>
          <p className="mt-2 text-sm sm:text-base">
            <a
              href="https://forms.gle/C2KgGfGFB3tZKoCv9"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2DFF05] hover:underline"
            >
              Submit your project here
            </a>
          </p>
        </div>

        {/* Timeline Section */}
        <div className="bg-[#2a2a2a] p-4 sm:p-6 rounded-lg">
          <h2 className="font-mek text-lg sm:text-xl font-bold text-[#2DFF05] drop-shadow-[0_0_8px_#2DFF05] flex items-center gap-2">
            <span>⏰</span> Timeline
          </h2>
          <ul className="mt-2 space-y-1.5 sm:space-y-2 list-disc list-inside text-sm sm:text-base">
            <li>Submission Deadline: January 23, 2024, 23:59 UTC</li>
            <li>
              Voting Period: Starts January 23, 2024, 23:59 UTC (24 hours)
            </li>
          </ul>
        </div>

        {/* Judging Section */}
        <div className="bg-[#2a2a2a] p-4 sm:p-6 rounded-lg">
          <h2 className="font-mek text-lg sm:text-xl font-bold text-[#2DFF05] drop-shadow-[0_0_8px_#2DFF05] flex items-center gap-2">
            <span>🏆</span> Judging Criteria
          </h2>
          <ol className="mt-2 space-y-1.5 sm:space-y-2 list-decimal list-inside text-sm sm:text-base">
            <li>Effectiveness of coordination between agents</li>
            <li>Clarity of decision-making process</li>
            <li>Code quality and documentation</li>
            <li>Scalability and robustness</li>
            <li>Innovation in approach</li>
          </ol>
        </div>

        {/* FAQ */}
        <div className="bg-[#2a2a2a] p-4 sm:p-6 rounded-lg">
          <h2 className="font-mek text-lg sm:text-xl font-bold text-[#2DFF05] drop-shadow-[0_0_8px_#2DFF05] flex items-center gap-2">
            <span>❓</span> Questions?
          </h2>
          <div className="mt-2 space-y-1.5 sm:space-y-2 list-decimal list-inside text-sm sm:text-base">
            <p>
              <a
                href="https://warpcast.com/~/inbox/create/16098?text=gm"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#2DFF05]"
              >
                DM @jpfraneto on Warpcast
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
