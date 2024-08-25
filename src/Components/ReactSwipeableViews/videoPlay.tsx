import React, { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import Hls from "hls.js";
import "swiper/css";
import "swiper/css/pagination";
import "../../style.css";

interface AppProps {
  videoKey: string;
  active: number | boolean;
  thumbnail: string;
}

export default function VideoPlayer({ videoKey, active, thumbnail }: AppProps) {
  const hlsUrl = `https://vz-bbe06792-04e.b-cdn.net/${videoKey}/playlist.m3u8`;
  const playerRef = useRef<ReactPlayer>(null);
  const hlsRef = useRef<Hls | null>(null); // Memoize HLS instance
  const [showThumbnail, setShowThumbnail] = useState(true);

  useEffect(() => {
    if (active) {
      const delay = 350;
      const timer = setTimeout(() => {
        setShowThumbnail(false);
        const player = playerRef.current?.getInternalPlayer();
        if (player && Hls.isSupported()) {
          hlsRef.current = new Hls();
          hlsRef.current.loadSource(hlsUrl);
          hlsRef.current.attachMedia(player.video);
          hlsRef.current.on(Hls.Events.MANIFEST_PARSED, () => {
            player.play();
          });
        }
      }, delay);

      return () => {
        clearTimeout(timer);
      };
    } else {
      setShowThumbnail(true);
      playerRef.current?.getInternalPlayer()?.pause();
      if (hlsRef.current) {
        hlsRef.current.destroy(); // Clean up HLS instance
        hlsRef.current = null;
      }
    }
  }, [active, hlsUrl]);

  return (
    <div>
      {showThumbnail ? (
        <img
          style={{
            position: "fixed",
            width: "100%",
            height: "94dvh",
            objectFit: "cover",
            overflow: "hidden",
          }}
          src={thumbnail}
          alt="Video thumbnail"
        />
      ) : (
        <ReactPlayer
          ref={playerRef}
          url={hlsUrl}
          playing={active === true} // Play only if active is true
          loop
          muted
          width="100%"
          height="100%"
          style={{ position: "fixed", objectFit: "cover", overflow: "hidden" }}
          config={{ file: { attributes: { playsInline: true } } }}
        />
      )}
    </div>
  );
}
