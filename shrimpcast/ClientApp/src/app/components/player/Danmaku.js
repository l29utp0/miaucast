import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";

const COMMENT_STYLES = {
  base: {
    position: "absolute",
    fontWeight: "bold",
    fontSize: "24px",
    fontFamily: "Roboto, sans-serif",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
    whiteSpace: "nowrap",
    zIndex: "999",
    userSelect: "none",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  emoteImage: {
    height: "40px",
    verticalAlign: "middle",
    display: "inline-block",
  },
};

const ANIMATION_CONFIG = {
  duration: 5000,
  commentHeight: 30,
};

const Danmaku = ({ messages, isActive, emotes }) => {
  const containerRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const displayedMessagesRef = useRef(new Set());
  const activeCommentsRef = useRef([]);

  // Memoize emote pattern to avoid recreation on each render
  const emotePattern = useMemo(() => {
    if (!emotes?.length) return null;
    const escapedEmotes = emotes.map((emote) =>
      emote.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
    );
    return new RegExp(`(${escapedEmotes.join("|")})`, "gi");
  }, [emotes]);

  const createEmoteElement = useCallback((emote) => {
    const img = document.createElement("img");
    img.src = emote.url;
    img.alt = emote.name;
    Object.assign(img.style, COMMENT_STYLES.emoteImage);
    return img;
  }, []);

  const createTextElement = useCallback((text, color) => {
    const span = document.createElement("span");
    span.innerText = text;
    span.style.color = color || "#FFFFFF";
    return span;
  }, []);

  const createCommentElement = useCallback(
    (message) => {
      if (!containerRef.current) return null;

      const commentElement = document.createElement("div");
      Object.assign(commentElement.style, COMMENT_STYLES.base);

      if (emotePattern) {
        const parts = message.content.split(emotePattern);
        parts.forEach((part) => {
          const emote = emotes.find(
            (e) => e.name.toLowerCase() === part.toLowerCase(),
          );

          if (emote) {
            commentElement.appendChild(createEmoteElement(emote));
          } else if (part.trim()) {
            commentElement.appendChild(
              createTextElement(part, message.userColorDisplay),
            );
          }
        });
      } else {
        commentElement.appendChild(
          createTextElement(message.content, message.userColorDisplay),
        );
      }

      containerRef.current.appendChild(commentElement);

      return commentElement;
    },
    [emotePattern, emotes, createEmoteElement, createTextElement],
  );

  const positionComment = useCallback((element) => {
    const width = element.offsetWidth;
    element.style.right = `-${width}px`;

    const containerHeight = containerRef.current.offsetHeight;
    const maxTop = containerHeight - ANIMATION_CONFIG.commentHeight;
    const randomTop = Math.floor(Math.random() * maxTop);
    element.style.top = `${randomTop}px`;
  }, []);

  const animateComment = useCallback((commentElement, messageId) => {
    if (!commentElement || !containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const commentWidth = commentElement.offsetWidth;
    const totalDistance = containerWidth + commentWidth;
    const startTime = performance.now();

    const commentObj = {
      element: commentElement,
      animationId: null,
      messageId,
    };

    activeCommentsRef.current.push(commentObj);

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = elapsed / ANIMATION_CONFIG.duration;

      if (progress >= 1) {
        commentElement.parentNode?.removeChild(commentElement);
        activeCommentsRef.current = activeCommentsRef.current.filter(
          (c) => c !== commentObj,
        );
        return;
      }

      const currentRight = -commentWidth + progress * totalDistance;
      commentElement.style.right = `${currentRight}px`;

      commentObj.animationId = requestAnimationFrame(animate);
    };

    commentObj.animationId = requestAnimationFrame(animate);
  }, []);

  const processNewMessages = useCallback(() => {
    if (!isActive || !isLoaded || !messages?.length) return;

    const newMessages = messages.filter(
      (message) => !displayedMessagesRef.current.has(message.messageId),
    );

    newMessages.forEach((message) => {
      if (message?.content && message?.messageId) {
        try {
          displayedMessagesRef.current.add(message.messageId);
          const commentElement = createCommentElement(message);
          if (commentElement) {
            positionComment(commentElement);
            animateComment(commentElement, message.messageId);
          }
        } catch (error) {
          console.error("Error creating danmaku message:", error);
        }
      }
    });
  }, [
    messages,
    isActive,
    isLoaded,
    createCommentElement,
    positionComment,
    animateComment,
  ]);

  useEffect(() => {
    if (isActive && containerRef.current) {
      setIsLoaded(true);
    } else {
      setIsLoaded(false);
    }

    return () => {
      activeCommentsRef.current.forEach((comment) => {
        comment.element?.parentNode?.removeChild(comment.element);
      });
      activeCommentsRef.current = [];
    };
  }, [isActive]);

  useEffect(() => {
    processNewMessages();
  }, [processNewMessages]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 998,
        overflow: "hidden",
        display: isActive ? "block" : "none",
      }}
    />
  );
};

export default React.memo(Danmaku);
