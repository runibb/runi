import { Mail } from "lucide-react"
import { YouTubeBackground } from "@/components/youtube-background"

export default function Home() {
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      {/* Video Background */}
      <YouTubeBackground videoId="F8sXIyZV_Sc" />

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/25" />

      {/* Navigation Content */}
      <nav className="relative z-10 flex h-full flex-col justify-end p-8 pb-12 sm:p-12 sm:pb-16 lowercase">
        {/* Stream schedule */}
        <p
          className="mb-10 font-sans text-4xl text-white tracking-wide sm:text-5xl lg:text-6xl"
          style={{ WebkitTextStroke: "2px black" }}
        >
          live on{" "}
          <a
            href="https://www.twitch.tv/runi_bb"
            target="_blank"
            rel="noopener noreferrer"
            className="underline transition-opacity hover:opacity-60"
            style={{ color: "#9146FF" }}
          >
            twitch
          </a>{" "}
          every tues, weds, and fri at 6pm eastern
        </p>

        {/* Latest YouTube video */}
        <div className="mb-6 flex flex-col gap-3">
          <a
            href="https://youtu.be/7mWh9Hlfe7Y"
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-5xl text-white tracking-wide transition-opacity hover:opacity-60 sm:text-6xl lg:text-7xl"
          >
            latest youtube video
          </a>
          <div className="aspect-video w-full max-w-xl overflow-hidden rounded-lg">
            <iframe
              className="h-full w-full"
              src="https://www.youtube.com/embed/7mWh9Hlfe7Y"
              title="Latest YouTube video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>

        <ul className="flex flex-col gap-3">
          <li>
            <a
              href="https://www.twitch.tv/runi_bb"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-5xl text-white tracking-wide transition-opacity hover:opacity-60 sm:text-6xl lg:text-7xl"
            >
              twitch
            </a>
          </li>
          <li>
            <a
              href="https://www.tiktok.com/@runi_bb"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-5xl text-white tracking-wide transition-opacity hover:opacity-60 sm:text-6xl lg:text-7xl"
            >
              tiktok
            </a>
          </li>
          <li>
            <a
              href="https://discord.gg/VSrHTytUV9"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-5xl text-white tracking-wide transition-opacity hover:opacity-60 sm:text-6xl lg:text-7xl"
            >
              discord
            </a>
          </li>
        </ul>

        {/* Email icon */}
        <a
          href="mailto:runi.babyy@gmail.com"
          className="mt-5 inline-flex text-white transition-opacity hover:opacity-60"
          aria-label="Send email to runi.babyy@gmail.com"
        >
          <Mail className="h-16 w-16 sm:h-20 sm:w-20" strokeWidth={1.5} />
        </a>
      </nav>
    </div>
  )
}
