import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  /**
   * Next blocks dev-only endpoints — including the HMR WebSocket — for any
   * origin other than `localhost`. Reach the dev server over 127.0.0.1 or
   * the LAN address and that socket is refused, so the client runtime never
   * finishes booting: the server-rendered HTML paints, but nothing hydrates.
   *
   * The symptom is misleading rather than obvious. Content is visibly
   * present, yet the theme toggle is inert, scroll reveals never fire, and
   * any element whose entrance animation starts at opacity 0 — such as the
   * hero headline — stays invisible forever, with no error in the console
   * beyond the failing socket.
   *
   * `next dev` prints a "Network:" URL for exactly this case, so both have
   * to be allowed or the advertised address is unusable. The LAN entry is
   * this machine's current DHCP address; update it if the IP changes.
   */
  allowedDevOrigins: ["127.0.0.1", "192.168.0.101"],

  /**
   * Next.js infers the workspace root by walking up to the nearest
   * lockfile. On this machine that resolves to a package-lock.json in the
   * home directory, which is outside this repository — so Next discards
   * this project's own lockfile and treats the home directory as the
   * workspace root. Pinning the root to __dirname keeps the build honest.
   */
  turbopack: {
    root: path.resolve(__dirname),
  },

  images: {
    /**
     * Cover art is hotlinked from AniList's CDN rather than committed —
     * see src/lib/poster-art.ts for the reasoning. Only that one host is
     * allowed; next/image will refuse anything else.
     */
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s4.anilist.co",
        pathname: "/file/anilistcdn/media/**",
      },
    ],

    /**
     * Default is [75]. Flat-shaded anime key art bands visibly at that,
     * and the library shelf is the one place these are looked at closely
     * rather than as 16%-opacity texture, so 90 is allowed there. The
     * hero wall deliberately stays on the default.
     */
    qualities: [75, 90],
  },
};

export default nextConfig;