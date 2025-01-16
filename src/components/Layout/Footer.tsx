export default function Footer() {
  return (
    <footer className="fixed bottom-0 w-full bg-black bg-opacity-80 backdrop-blur-sm py-2 h-16 sm:py-4 px-2 sm:px-4">
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
          href="https://github.com/weeklyhackathon"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#2DFF05] hover:text-[#2DFF05]/80 transition-colors"
          aria-label="Github"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 1024 1024"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z"
              transform="scale(64)"
            />
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
