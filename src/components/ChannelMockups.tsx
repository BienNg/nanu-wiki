import type { ReactNode } from "react";
import type { Block } from "@/lib/types";
import { Bi, Label } from "./Bi";

type ChannelsBlock = Extract<Block, { type: "channels" }>;

const TILE: Record<ChannelsBlock["profile"]["videos"][number]["tone"], string> = {
  teal: "from-[#0B7793] to-[#134E5E]",
  indigo: "from-[#3D4F9F] to-[#1E2A5A]",
  amber: "from-[#E0A23A] to-[#8A5A12]",
  rose: "from-[#C45C74] to-[#6E2C3E]",
  sky: "from-[#5BA4D4] to-[#1E5878]",
  slate: "from-[#5C6B78] to-[#2A343C]",
};

/** Facebook Reels player and TikTok profile: what someone sees before they write. */
export function ChannelMockups({ block }: { block: ChannelsBlock }) {
  const { reel, profile } = block;
  return (
    <figure data-reveal className="m-0 flex flex-col gap-3">
      <div className="flex flex-wrap justify-center gap-6">
        <Phone labelDe="Facebook Reels" labelVi="Facebook Reels">
          <Reel reel={reel} />
        </Phone>
        <Phone labelDe="TikTok-Profil" labelVi="Trang TikTok">
          <Profile profile={profile} />
        </Phone>
      </div>
      {block.note_de ? (
        <figcaption className="text-center text-[13px] leading-relaxed text-body">
          <Bi de={block.note_de} vi={block.note_vi} />
        </figcaption>
      ) : null}
    </figure>
  );
}

function Phone({ children, labelDe, labelVi }: { children: ReactNode; labelDe: string; labelVi: string }) {
  return (
    <div className="flex w-[220px] flex-col gap-2">
      <span className="cap text-center">
        <Label de={labelDe} vi={labelVi} />
      </span>
      <div className="h-[468px] overflow-hidden rounded-[28px] border border-[#1c1e22] bg-black shadow-[0_10px_28px_rgba(16,24,40,.12)]">
        <div className="relative h-full">{children}</div>
      </div>
    </div>
  );
}

function Reel({ reel }: { reel: ChannelsBlock["reel"] }) {
  return (
    <div className="absolute inset-0 bg-[#102033] text-white">
      <div className="absolute inset-x-0 top-0 h-[46%] bg-gradient-to-b from-[#8EC9E4] to-transparent" />
      <div className="absolute right-6 top-[18%] size-11 rounded-full bg-[#F6D37A]" />
      <div className="absolute bottom-[34%] left-[8%] h-[28%] w-[22%] rounded-t-sm bg-[#1B4A62]" />
      <div className="absolute bottom-[34%] left-[32%] h-[38%] w-[18%] rounded-t-sm bg-[#16384C]" />
      <div className="absolute bottom-[34%] left-[52%] h-[24%] w-[16%] rounded-t-sm bg-[#24556E]" />
      <div className="absolute bottom-[34%] right-[8%] h-[32%] w-[14%] rounded-t-sm bg-[#1A455C]" />
      <div className="absolute inset-x-0 bottom-[34%] h-px bg-white/30" />
      <p className="font-display absolute left-4 right-14 top-[40%] text-[22px] font-bold leading-[1.15] tracking-tight">
        <Label de="Ausbildung in Deutschland" vi="Du học nghề Đức" />
      </p>

      <div className="absolute inset-x-0 top-0 flex items-center justify-between px-3.5 pt-3">
        <span className="font-display text-[15px] font-bold tracking-tight">Reels</span>
        <SearchIcon />
      </div>

      <div className="absolute right-2.5 top-[22%] flex flex-col items-center gap-3.5 text-[10px] font-semibold">
        <Action count={reel.likes}><ThumbIcon /></Action>
        <Action count={reel.comments}><CommentIcon /></Action>
        <Action count={reel.shares}><ShareIcon /></Action>
      </div>

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/75 to-transparent pb-3.5 pl-3 pr-12 pt-8">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-full bg-[#0B7793] text-[10px] font-bold">NN</span>
          <span className="truncate text-[13px] font-semibold">{reel.page}</span>
          <span className="rounded-full border border-white/80 px-2 py-0.5 text-[10px] font-semibold">
            <Label de="Folgen" vi="Theo dõi" />
          </span>
        </div>
        <p className="m-0 mt-1.5 line-clamp-2 text-[12px] leading-snug">
          <Label de={reel.caption_de} vi={reel.caption_vi} />
        </p>
        <p className="m-0 mt-1 truncate text-[11px] text-white/80">
          ♪ <Label de={reel.audio_de} vi={reel.audio_vi} />
        </p>
      </div>
    </div>
  );
}

function Profile({ profile }: { profile: ChannelsBlock["profile"] }) {
  return (
    <div className="absolute inset-0 flex flex-col bg-white text-[#161823]">
      <div className="flex items-center justify-between px-3.5 pb-1 pt-3">
        <span className="text-[13px] text-[#161823]/70">‹</span>
        <span className="truncate text-[13px] font-bold">{profile.handle}</span>
        <span className="text-[13px]">☰</span>
      </div>
      <div className="flex items-center gap-2.5 px-3.5 pt-1.5">
        <span className="flex size-12 flex-none items-center justify-center rounded-full bg-[#0B7793] text-sm font-bold text-white">NN</span>
        <div className="grid flex-1 grid-cols-3 text-center">
          <Stat n={profile.following} de="Folgt" vi="Đang theo" />
          <Stat n={profile.followers} de="Follower" vi="Follower" />
          <Stat n={profile.likes} de="Likes" vi="Thích" />
        </div>
      </div>
      <div className="px-3.5 pt-2">
        <p className="m-0 text-[13px] font-bold leading-tight">{profile.name}</p>
        <p className="m-0 mt-0.5 line-clamp-2 text-[11px] leading-snug text-[#161823]/80">
          <Label de={profile.bio_de} vi={profile.bio_vi} />
        </p>
      </div>
      <div className="px-3.5 py-2.5">
        <span className="flex h-7 items-center justify-center rounded-md bg-[#FE2C55] text-[12px] font-semibold text-white">
          <Label de="Folgen" vi="Theo dõi" />
        </span>
      </div>
      <div className="flex border-b border-[#161823]/10 text-[11px] font-semibold">
        <span className="flex-1 border-b-2 border-[#161823] py-1.5 text-center">▦</span>
        <span className="flex-1 py-1.5 text-center text-[#161823]/35">♡</span>
      </div>
      <div className="mt-auto grid h-[168px] grid-cols-3 grid-rows-2 gap-px bg-[#161823]/10">
        {profile.videos.map((v) => (
          <div key={v.label_de} className={`relative flex items-center justify-center bg-gradient-to-b p-1 ${TILE[v.tone]}`}>
            <span className="font-display px-1 text-center text-[11px] font-semibold leading-tight text-white">
              <Label de={v.label_de} vi={v.label_vi} />
            </span>
            <span className="absolute bottom-1 left-1 text-[9px] font-semibold text-white">▶ {v.views}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Stat({ n, de, vi }: { n: string; de: string; vi: string }) {
  return (
    <span className="flex flex-col leading-tight">
      <strong className="text-[13px]">{n}</strong>
      <span className="text-[9px] text-[#161823]/60">
        <Label de={de} vi={vi} />
      </span>
    </span>
  );
}

function Action({ count, children }: { count: string; children: ReactNode }) {
  return (
    <span className="flex flex-col items-center gap-0.5">
      {children}
      <span>{count}</span>
    </span>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="7" cy="7" r="4.2" stroke="white" strokeWidth="1.6" />
      <path d="M10.4 10.4 13.5 13.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function ThumbIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="white" aria-hidden>
      <path d="M8 10.5V20H5.5A1.5 1.5 0 0 1 4 18.5v-6A1.5 1.5 0 0 1 5.5 11H8m0-.5 3.2-6.2A1.6 1.6 0 0 1 14.3 6v3h4.2a1.5 1.5 0 0 1 1.5 1.7l-1 7A1.5 1.5 0 0 1 17.5 19H8" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="white" aria-hidden>
      <path d="M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H9l-4 3.5V6a1 1 0 0 1 1-1z" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 4v10M8 8l4-4 4 4M6 14v4a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
