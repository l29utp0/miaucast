import { Box, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player/youtube";
import PickSource from "../layout/Actions/Sources/PickSource";
import XGPlayer from "./XGPlayer";
import Danmaku from "./Danmaku";
import SignalRManager from "../../managers/SignalRManager";
import { useNavigate, useLocation } from "react-router-dom";
import SourceCountdown from "../layout/Actions/Sources/SourceCountdown";
import ChatActionsManager from "../../managers/ChatActionsManager";

const WrapperSx = {
  width: "100%",
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const SitePlayer = (props) => {
  const { streamStatus, signalR, configuration } = props,
    { source, streamEnabled, mustPickStream } = streamStatus,
    { useRTCEmbed, useLegacyPlayer, startsAt } = source,
    url = source.url || "",
    video = useRef(),
    isHLS = url.endsWith(".m3u8"),
    isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent),
    forceM3U8 = isHLS && !window.MediaSource,
    [muted, setMuted] = useState(false),
    [messages, setMessages] = useState([]),
    location = useLocation(),
    previousPath = useRef(location.pathname),
    tryPlay = () => {
      let player = video.current.getInternalPlayer();
      if (player.play !== undefined) {
        player.play().catch(() => setMuted(true));
      } else {
        player.playVideo();
      }
    },
    navigate = useNavigate(),
    showCountdown = startsAt && new Date(startsAt).getTime() - Date.now() > 0;

  // Use original URL for iOS native video (don't modify HLS URLs)
  const adjustedUrl = url;

  // Effect to handle chat messages for danmaku
  useEffect(() => {
    if (!signalR) return;

    const handleChatMessage = (message) => {
      if (message.messageType === "UserMessage" && message.messageId) {
        setMessages((prev) => [...prev, message]);
      }
    };

    signalR.on("ChatMessage", handleChatMessage);

    return () => {
      signalR.off("ChatMessage", handleChatMessage);
      setMessages([]);
    };
  }, [signalR]);

  // Effect to handle path changes
  useEffect(() => {
    if (previousPath.current !== location.pathname) {
      setMessages([]);
      previousPath.current = location.pathname;
    }
  }, [location]);

  useEffect(() => {
    signalR.on(SignalRManager.events.redirectSource, (data) => {
      const { from, to } = data;
      if (from === source?.name) {
        console.log(`Redirecting from ${from} to ${to}`);
        navigate(`/${to}`);
      }
    });

    ChatActionsManager.SetQueryParams(signalR, source?.name);
    return () => signalR.off(SignalRManager.events.redirectSource);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source]);

  const renderPlayer = () => {
    if (useRTCEmbed) {
      return (
        <iframe
          src={`${adjustedUrl}`}
          title="rtc-embed"
          id="rtc-embed"
          allow="autoplay"
          frameBorder="no"
          scrolling="no"
          allowFullScreen
        />
      );
    } else if (isIOS && isHLS) {
      // Use native HTML5 video for iOS HLS streams with live edge seeking
      return (
        <video
          width="100%"
          height="100%"
          controls
          playsInline
          muted
          autoPlay
          src={adjustedUrl}
          style={{ backgroundColor: '#000' }}
          onLoadedMetadata={(e) => {
            const video = e.target;
            console.log('Video duration:', video.duration);
            console.log('Video seekable:', video.seekable.length > 0 ? video.seekable.end(0) : 'No seekable range');

            // For live streams, try to seek to the end
            if (video.duration === Infinity || video.duration > 3600) { // Likely a live stream
              setTimeout(() => {
                try {
                  if (video.seekable.length > 0) {
                    const liveEdge = video.seekable.end(0) - 5; // 5 seconds from live edge
                    console.log('Seeking to live edge:', liveEdge);
                    video.currentTime = Math.max(0, liveEdge);
                  }
                } catch (error) {
                  console.log('Could not seek to live edge:', error);
                }
              }, 1000);
            }
          }}
          onCanPlay={(e) => {
            const video = e.target;
            console.log('Video can play, current time:', video.currentTime);

            // Try to seek to live edge when video can play
            if (video.seekable.length > 0 && video.currentTime < video.seekable.end(0) - 30) {
              const liveEdge = video.seekable.end(0) - 5;
              console.log('Seeking on canplay to:', liveEdge);
              video.currentTime = Math.max(0, liveEdge);
            }
          }}
          onError={(e) => console.log('iOS video error:', e)}
        />
      );
    } else if (!useLegacyPlayer && isHLS && !forceM3U8) {
      // Use XGPlayer for non-iOS devices with MediaSource support
      return <XGPlayer url={adjustedUrl} />;
    } else {
      // ReactPlayer for YouTube or other supported URLs
      return (
        <ReactPlayer
          width={"100%"}
          height={"100%"}
          controls
          playsinline
          url={adjustedUrl}
          ref={video}
          playing={muted}
          muted={muted}
          onReady={tryPlay}
        />
      );
    }
  };


  return streamEnabled ? (
    mustPickStream ? (
      <PickSource
        showViewerCountPerStream={configuration.showViewerCountPerStream}
        sources={streamStatus.sources}
        signalR={signalR}
      />
    ) : showCountdown ? (
      <SourceCountdown startsAt={startsAt} />
    ) : (
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        {renderPlayer()}
        <Danmaku
          messages={messages}
          emotes={props.emotes}
          isActive={true}
        />
      </div>
    )
  ) : (
    <Box sx={WrapperSx}>
      <Typography className="noselect" textAlign="center" variant="h2">
        Nada a tocar de momento ;_;
      </Typography>
    </Box>
  );
};

export default SitePlayer;
