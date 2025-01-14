import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="fixed top-8 w-full px-4 z-20">
      <div className="max-w-7xl mx-auto flex justify-between items-center bg-black border border-white rounded-lg px-4 sm:px-6 py-3">
        <Link
          to="/"
          className="font-mek text-2xl sm:text-4xl text-[#2DFF05] drop-shadow-[0_0_8px_#2DFF05]"
        >
          <span className="hidden sm:inline">$HACKATHON</span>
          <span className="sm:hidden">$H</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <a
            href="https://dexscreener.com/base/0x3dF58A5737130FdC180D360dDd3EFBa34e5801cb"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2 sm:px-4 py-1 sm:py-2 border border-[#2DFF05] rounded text-[#2DFF05] hover:bg-[#2DFF05] hover:bg-opacity-20 transition-colors font-mek text-sm sm:text-2xl"
          >
            <span className="text-sm sm:text-2xl">DEX</span>
          </a>

          <a
            href="https://app.uniswap.org/swap?chain=base&outputCurrency=0x3dF58A5737130FdC180D360dDd3EFBa34e5801cb"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2 sm:px-4 py-1 sm:py-2 border border-[#2DFF05] rounded text-[#2DFF05] hover:bg-[#2DFF05] hover:bg-opacity-20 transition-colors font-mek text-sm sm:text-2xl"
          >
            <span className="text-sm sm:text-2xl">BUY</span>
          </a>

          <Link
            to="/week-one"
            className="px-2 sm:px-4 py-1 sm:py-2 border border-[#2DFF05] rounded text-[#2DFF05] hover:bg-[#2DFF05] hover:bg-opacity-20 transition-colors font-mek text-sm sm:text-2xl"
          >
            <span className="text-sm sm:text-2xl">Week 1</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
