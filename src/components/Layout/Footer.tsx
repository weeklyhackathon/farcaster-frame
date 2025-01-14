export default function Footer() {
  return (
    <footer className="fixed bottom-0 w-full bg-black bg-opacity-80 backdrop-blur-sm py-2 sm:py-4 px-2 sm:px-4">
      <div className="max-w-7xl mx-auto flex justify-center items-center gap-4 sm:gap-8">
        <a
          href="https://t.me/weeklyhackathon"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#2DFF05] hover:text-[#2DFF05]/80 transition-colors"
          aria-label="Join our Telegram"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5 sm:w-6 sm:h-6"
          >
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.223-.548.223l.188-2.85 5.18-4.68c.223-.198-.05-.308-.346-.11l-6.4 4.03-2.76-.918c-.6-.187-.612-.6.125-.89l10.782-4.156c.5-.187.943.112.78.89z" />
          </svg>
        </a>

        <a
          href="https://x.com/weeklyhackathon"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#2DFF05] hover:text-[#2DFF05]/80 transition-colors"
          aria-label="Follow us on X (Twitter)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5 sm:w-6 sm:h-6"
          >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </a>

        <a
          href="https://warpcast.com/~/channel/weeklyhackathon"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#2DFF05] hover:text-[#2DFF05]/80 transition-colors text-3xl"
          aria-label="Join our Farcaster channel"
        >
          W
        </a>
      </div>
    </footer>
  );
}
