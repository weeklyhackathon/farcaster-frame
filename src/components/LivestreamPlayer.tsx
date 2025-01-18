import { cn } from "../lib/utils/cn";
import {
  EnterFullscreenIcon,
  ExitFullscreenIcon,
  LoadingIcon,
  PauseIcon,
  PlayIcon,
} from "@livepeer/react/assets";
import * as Player from "@livepeer/react/player";

import React from "react";
import { Src } from "@livepeer/react";

export const LivestreamPlayer = ({ src }: { src: Src[] | null }) => {
  if (!src) {
    return (
      <PlayerLoading
        title="Invalid source"
        description="We could not fetch valid playback information for the playback ID you provided. Please check and try again."
      />
    );
  }

  return (
    <Player.Root src={src}>
      <Player.Container className="h-full w-full overflow-hidden bg-black outline-none transition border border-[#2DFF05]">
        <Player.Video
          title="Live stream"
          className={cn("h-full w-full transition")}
        />

        <Player.LoadingIndicator className="w-full relative h-full bg-black/50 backdrop-blur data-[visible=true]:animate-in data-[visible=false]:animate-out data-[visible=false]:fade-out-0 data-[visible=true]:fade-in-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <LoadingIcon className="w-8 h-8 animate-spin" />
          </div>
          <PlayerLoading />
        </Player.LoadingIndicator>

        <Player.ErrorIndicator
          matcher="all"
          className="absolute select-none inset-0 text-center bg-black/40 backdrop-blur-lg flex flex-col items-center justify-center gap-4 duration-1000 data-[visible=true]:animate-in data-[visible=false]:animate-out data-[visible=false]:fade-out-0 data-[visible=true]:fade-in-0"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <LoadingIcon className="w-8 h-8 animate-spin" />
          </div>
          <PlayerLoading />
        </Player.ErrorIndicator>

        <Player.ErrorIndicator
          matcher="offline"
          className="absolute select-none animate-in fade-in-0 inset-0 text-center bg-black/40 backdrop-blur-lg flex flex-col items-center justify-center gap-4 duration-1000 data-[visible=true]:animate-in data-[visible=false]:animate-out data-[visible=false]:fade-out-0 data-[visible=true]:fade-in-0"
        >
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <div className="text-lg sm:text-2xl font-bold">
                Stream is offline
              </div>
              <div className="text-xs sm:text-sm text-gray-100">
                Playback will start automatically once the stream has started
              </div>
            </div>
            <LoadingIcon className="w-6 h-6 md:w-8 md:h-8 mx-auto animate-spin" />
          </div>
        </Player.ErrorIndicator>

        <Player.ErrorIndicator
          matcher="access-control"
          className="absolute select-none inset-0 text-center bg-black/40 backdrop-blur-lg flex flex-col items-center justify-center gap-4 duration-1000 data-[visible=true]:animate-in data-[visible=false]:animate-out data-[visible=false]:fade-out-0 data-[visible=true]:fade-in-0"
        >
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <div className="text-lg sm:text-2xl font-bold">
                Stream is private
              </div>
              <div className="text-xs sm:text-sm text-gray-100">
                It looks like you don't have permission to view this content
              </div>
            </div>
            <LoadingIcon className="w-6 h-6 md:w-8 md:h-8 mx-auto animate-spin" />
          </div>
        </Player.ErrorIndicator>

        <Player.Controls
          style={{
            background:
              "linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.6))",
            padding: "0.5rem 1rem",
            display: "flex",
            flexDirection: "column-reverse",
            gap: 5,
          }}
          className="bg-gradient-to-b gap-1 px-3 md:px-3 py-2 flex-col-reverse flex from-black/5 via-80% via-black/30 duration-1000 to-black/60 data-[visible=true]:animate-in data-[visible=false]:animate-out data-[visible=false]:fade-out-0 data-[visible=true]:fade-in-0"
        >
          <div className="flex justify-between gap-4">
            <div className="flex flex-1 items-center gap-3">
              <Player.PlayPauseTrigger className="w-6 h-6 hover:scale-110 transition flex-shrink-0 group relative bg-black border border-[#2DFF05] ">
                <Player.PlayingIndicator matcher={false} asChild>
                  <PlayIcon className="w-full h-full text-[#2DFF05]" />
                </Player.PlayingIndicator>
                <Player.PlayingIndicator matcher={true} asChild>
                  <PauseIcon className="w-full h-full text-[#2DFF05]" />
                </Player.PlayingIndicator>
                <span className="absolute -top-8 scale-0 transition-all rounded bg-gray-900 p-2 text-xs text-white group-hover:scale-100">
                  Play/Pause
                </span>
              </Player.PlayPauseTrigger>

              <Player.LiveIndicator className="gap-2 flex items-center">
                <div className="bg-[#2DFF05] h-1.5 w-1.5 rounded-full" />
                <span className="text-sm select-none text-[#2DFF05]">LIVE</span>
              </Player.LiveIndicator>
              <Player.LiveIndicator
                matcher={false}
                className="flex gap-2 items-center"
              >
                <Player.Time className="text-sm tabular-nums select-none text-[#2DFF05]" />
              </Player.LiveIndicator>

              <Player.Volume className="relative mr-1 flex-1 group flex cursor-pointer items-center select-none touch-none max-w-[120px] h-5">
                <Player.Track className="bg-[#2DFF05]/30 relative grow rounded-full transition h-[2px] md:h-[3px] group-hover:h-[3px] group-hover:md:h-[4px]">
                  <Player.Range className="absolute bg-[#2DFF05] rounded-full h-full" />
                </Player.Track>
                <Player.Thumb className="block transition group-hover:scale-110 w-3 h-3 bg-[#2DFF05] rounded-full" />
              </Player.Volume>
            </div>
            <div className="flex sm:flex-1 md:flex-[1.5] justify-end items-center gap-2.5">
              <Player.FullscreenTrigger className=" bg-black border border-[#2DFF05]  w-6 h-6 hover:scale-110 transition flex-shrink-0 text-[#2DFF05] hover:text-[#2DFF05]/80 group relative">
                <Player.FullscreenIndicator asChild>
                  <ExitFullscreenIcon className="w-full h-full" />
                </Player.FullscreenIndicator>

                <Player.FullscreenIndicator matcher={false} asChild>
                  <EnterFullscreenIcon
                    color="#2DFF05"
                    className="w-full h-full"
                  />
                </Player.FullscreenIndicator>
                <span className="absolute -top-8 right-12 scale-0 transition-all rounded bg-gray-900 p-2 text-xs text-white group-hover:scale-100">
                  Toggle Fullscreen
                </span>
              </Player.FullscreenTrigger>
            </div>
          </div>
          <Player.Seek className="relative group flex cursor-pointer items-center select-none touch-none w-full h-5">
            <Player.Track className="bg-[#2DFF05]/30 relative grow rounded-full transition h-[2px] md:h-[3px] group-hover:h-[3px] group-hover:md:h-[4px]">
              <Player.SeekBuffer className="absolute bg-black/30 transition duration-1000 rounded-full h-full" />
              <Player.Range className="absolute bg-[#2DFF05] rounded-full h-full" />
            </Player.Track>
            <Player.Thumb className="block group-hover:scale-110 w-3 h-3 bg-[#2DFF05] transition rounded-full" />
          </Player.Seek>
        </Player.Controls>
      </Player.Container>
    </Player.Root>
  );
};

export const PlayerLoading = ({
  title,
  description,
}: {
  title?: React.ReactNode;
  description?: React.ReactNode;
}) => (
  <div className="relative w-full px-3 py-2 gap-3 flex-col-reverse flex aspect-video bg-black overflow-hidden rounded-sm border border-[#2DFF05]">
    <div className="flex justify-between">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 animate-pulse bg-[#2DFF05]/5 overflow-hidden rounded-lg" />
        <div className="w-16 h-6 md:w-20 md:h-7 animate-pulse bg-[#2DFF05]/5 overflow-hidden rounded-lg" />
      </div>

      <div className="flex items-center gap-2">
        <div className="w-6 h-6 animate-pulse bg-[#2DFF05]/5 overflow-hidden rounded-lg" />
        <div className="w-6 h-6 animate-pulse bg-[#2DFF05]/5 overflow-hidden rounded-lg" />
      </div>
    </div>
    <div className="w-full h-2 animate-pulse bg-[#2DFF05]/5 overflow-hidden rounded-lg" />

    {title && (
      <div className="absolute flex flex-col gap-1 inset-10 text-center justify-center items-center">
        <span className="text-[#2DFF05] text-lg font-medium">{title}</span>
        {description && (
          <span className="text-sm text-[#2DFF05]/80">{description}</span>
        )}
      </div>
    )}
  </div>
);
