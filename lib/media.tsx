/** A video offered as WebM (VP9, smaller) with an MP4 (H.264) fallback for browsers without it. */
export type VideoSources = { webm: string; mp4: string };

// Cloudinary transcodes on request; q_auto keeps the bitrate sensible for the web.
const FILM_BASE =
  "https://res.cloudinary.com/j0g5i7h7/video/upload/q_auto/v1789819294/AQMfDnffPSr71tD_c62fIdNh-x7bZ6Cv91scBpt_fIbKEWo212ffRk7TRkVJn4G_8QO6KfwW5qiMP07zu4d-8YGq0DdB2ir3ZmwXrRmxgLmGpg";

/** The Premium Homes film, used by Art of Living and the testimonial player. */
export const FILM: VideoSources = {
  webm: `${FILM_BASE}.webm`,
  mp4: `${FILM_BASE}.mp4`,
};

/** Local clip pair in public/video. */
export const localClip = (name: string): VideoSources => ({
  webm: `/home/video/${name}.webm`,
  mp4: `/home/video/${name}.mp4`,
});

/** `<source>` children in preference order. */
export function Sources({ video }: { video: VideoSources }) {
  return (
    <>
      <source src={video.webm} type="video/webm" />
      <source src={video.mp4} type="video/mp4" />
    </>
  );
}
