import { useEffect } from "react";

export default function WeekOne() {
  useEffect(() => {
    document.title = "Week One | Weekly $Hackathon";
  }, []);

  return (
    <div className="min-h-screen bg-black w-screen text-white px-4 pt-36 pb-24 sm:px-6 sm:py-28 md:px-8">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        {/* Title Section */}
        <div className="bg-[#2a2a2a] p-4 sm:p-6 rounded-lg">
          <h1 className="font-mek text-2xl sm:text-3xl md:text-4xl font-bold text-center text-[#2DFF05] drop-shadow-[0_0_8px_#2DFF05]">
            $HACKATHON: Week One
          </h1>
          <p className="text-sm sm:text-base text-gray-400 text-center mt-2">
            Build the Ultimate Frames v2 Starter Experience
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-[#2a2a2a] p-4 sm:p-6 rounded-lg">
          <h2 className="font-mek text-lg sm:text-xl font-bold text-[#2DFF05] drop-shadow-[0_0_8px_#2DFF05] flex items-center gap-2">
            <span>🎯</span> Mission
          </h2>
          <p className="mt-2 text-sm sm:text-base">
            Build a production-ready website + Frame v2 that helps developers
            start building frames immediately
          </p>
        </div>

        {/* Build Requirements Section */}
        <div className="bg-[#2a2a2a] p-4 sm:p-6 rounded-lg">
          <h2 className="font-mek text-lg sm:text-xl font-bold text-[#2DFF05] drop-shadow-[0_0_8px_#2DFF05] flex items-center gap-2">
            <span>🛠️</span> Build Requirements
          </h2>
          <ul className="mt-2 space-y-1.5 sm:space-y-2 list-disc list-inside text-sm sm:text-base">
            <li>Production deployed website + Frame v2</li>
            <li>
              Ready-to-clone GitHub repo (created after Jan 9). Needs to be a
              fork of{" "}
              <a
                href="https://github.com/weeklyhackathon/week-1"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2DFF05] hover:text-[#2DFF05] hover:underline"
              >
                https://github.com/weeklyhackathon/week-1
              </a>
            </li>
            <li>
              Must use an open source license allowing reuse and modification
              for any purpose
            </li>
            <li>Mobile friendly</li>
            <li>Interactive examples + quick-start guide</li>
          </ul>
        </div>

        {/* Submit Section */}
        <div className="bg-[#2a2a2a] p-4 sm:p-6 rounded-lg">
          <h2 className="font-mek text-lg sm:text-xl font-bold text-[#2DFF05] drop-shadow-[0_0_8px_#2DFF05] flex items-center gap-2">
            <span>📝</span> Submit Via
          </h2>
          <p className="mt-2 text-sm sm:text-base">TBA soon. Stay tuned.</p>
        </div>

        {/* Timeline Section */}
        <div className="bg-[#2a2a2a] p-4 sm:p-6 rounded-lg">
          <h2 className="font-mek text-lg sm:text-xl font-bold text-[#2DFF05] drop-shadow-[0_0_8px_#2DFF05] flex items-center gap-2">
            <span>⏰</span> Timeline
          </h2>
          <p className="mt-2 text-sm sm:text-base">
            Deadline: Jan 16, 23:59 UTC
          </p>
        </div>

        {/* Prize Section */}
        <div className="bg-[#2a2a2a] p-4 sm:p-6 rounded-lg">
          <h2 className="font-mek text-lg sm:text-xl font-bold text-[#2DFF05] drop-shadow-[0_0_8px_#2DFF05] flex items-center gap-2">
            <span>💰</span> Prize Pool (more than $7k USD)
            <span className="text-xs text-gray-400">
              <a
                href="https://basescan.org/address/0x838eB07d7F2De4a86f43D55d2817702686852BA8"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#2DFF05] text-lg"
              >
                check weeklyhackathon.eth on base to see updated rewards
              </a>
            </span>
          </h2>
          <ul className="mt-2 space-y-1.5 sm:space-y-2 list-disc list-inside text-sm sm:text-base">
            <li>All $HACKATHON Clanker fees</li>
            <li>12-month free: Neynar, Buoy, Orbiter - first week sponsors-</li>
            <li>
              <small>
                you may be surprised to see the $ in tokens on that wallet. its
                that low because 4k usd on $hackathon was added to a one sided
                LP (more
                details)[https://x.com/jpfraneto/status/1878532545286910249]
              </small>
            </li>
          </ul>
        </div>

        {/* Judging Section */}
        <div className="bg-[#2a2a2a] p-4 sm:p-6 rounded-lg">
          <h2 className="font-mek text-lg sm:text-xl font-bold text-[#2DFF05] drop-shadow-[0_0_8px_#2DFF05] flex items-center gap-2">
            <span>🏆</span> Judging Criteria
          </h2>
          <ol className="mt-2 space-y-1.5 sm:space-y-2 list-decimal list-inside text-sm sm:text-base">
            <li>Production readiness</li>
            <li>Time to first Frame</li>
            <li>UX & mobile design</li>
            <li>Creative Frame v2 features</li>
          </ol>
        </div>

        {/* FAQ */}
        <div className="bg-[#2a2a2a] p-4 sm:p-6 rounded-lg">
          <h2 className="font-mek text-lg sm:text-xl font-bold text-[#2DFF05] drop-shadow-[0_0_8px_#2DFF05] flex items-center gap-2">
            <span>🏆</span> Questions?
          </h2>
          <div className="mt-2 space-y-1.5 sm:space-y-2 list-decimal list-inside text-sm sm:text-base">
            <p>
              <a
                href="https://warpcast.com/~/inbox/create/16098?text=gm"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#2DFF05]"
              >
                DC @jpfraneto
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
