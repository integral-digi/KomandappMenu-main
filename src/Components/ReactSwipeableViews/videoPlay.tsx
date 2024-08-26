import React, { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import Hls from "hls.js";
import "swiper/css";
import "swiper/css/pagination";
import "../../style.css";

interface appProps {
  videoKey: string;
  active: number | boolean;
  thumbnail: string;
}

export default function VideoPlayer({
  videoKey,
  active,
  thumbnail,
}: appProps) {
  const hlsUrl = `https://vz-bbe06792-04e.b-cdn.net/${videoKey}/playlist.m3u8`;
  const playerRef = useRef<ReactPlayer>(null);
  const [showThumbnail, setShowThumbnail] = useState(true);

  useEffect(() => {
    if (active) {
      const delay = 350;
      const timer = setTimeout(() => {
        setShowThumbnail(false);
        const player = playerRef.current?.getInternalPlayer();
        if (player) {
          const hls = new Hls();
          hls.loadSource(hlsUrl);
          hls.attachMedia(playerRef.current?.getInternalPlayer().video);
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
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
    }
  }, [active, hlsUrl]);

  return (
    <div>
      {active && showThumbnail ? (
        <img
          style={{
            position: "fixed",
            width: "100%",
            height: "94dvh",
            objectFit: "cover",
            overflow: "hidden",
          }}
          src={thumbnail}
        />
      ) : (
        <ReactPlayer
          ref={playerRef}
          url={hlsUrl}
          playing={true}
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