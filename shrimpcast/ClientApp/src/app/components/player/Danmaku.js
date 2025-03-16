import React, { useEffect, useRef, useState, useCallback } from "react";

const Danmaku = ({ messages, isActive, emotes }) => {
  const containerRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const displayedMessagesRef = useRef(new Set());
  const activeCommentsRef = useRef([]);

  const createCommentElement = useCallback(
    (message) => {
      if (!containerRef.current) return null;

      const commentElement = document.createElement("div");
      commentElement.style.position = "absolute";
      commentElement.style.fontWeight = "bold";
      commentElement.style.fontSize = "24px";
      commentElement.style.fontFamily = "Roboto, sans-serif";
      commentElement.style.textShadow = "2px 2px 4px rgba(0, 0, 0, 0.8)";
      commentElement.style.whiteSpace = "nowrap";
      commentElement.style.zIndex = "999";
      commentElement.style.userSelect = "none";
      commentElement.style.pointerEvents = "none";
      commentElement.style.display = "flex";
      commentElement.style.alignItems = "center";
      commentElement.style.gap = "4px";

      const escapeRegExp = (string) => {
        return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      };

      if (emotes && emotes.length > 0) {
        const emotePattern = new RegExp(
          `(${emotes.map((emote) => escapeRegExp(emote.name)).join("|")})`,
          "gi",
        );

        const parts = message.content.split(emotePattern);

        parts.forEach((part) => {
          const emote = emotes.find(
            (e) => e.name.toLowerCase() === part.toLowerCase(),
          );

          if (emote) {
            const emoteImg = document.createElement("img");
            emoteImg.src = emote.url;
            emoteImg.alt = emote.name;
            emoteImg.style.height = "40px";
            emoteImg.style.verticalAlign = "middle";
            emoteImg.style.display = "inline-block";
            commentElement.appendChild(emoteImg);
          } else if (part.trim()) {
            const textSpan = document.createElement("span");
            textSpan.innerText = part;
            textSpan.style.color = message.userColorDisplay || "#FFFFFF";
            commentElement.appendChild(textSpan);
          }
        });
      } else {
        commentElement.innerText = message.content;
        commentElement.style.color = message.userColorDisplay || "#FFFFFF";
      }

      containerRef.current.appendChild(commentElement);
      const width = commentElement.offsetWidth;
      commentElement.style.right = `-${width}px`;

      const containerHeight = containerRef.current.offsetHeight;
      const commentHeight = 30;
      const maxTop = containerHeight - commentHeight;
      const randomTop = Math.floor(Math.random() * maxTop);
      commentElement.style.top = randomTop + "px";

      return commentElement;
    },
    [emotes],
  );

  const animateComment = useCallback((commentElement, messageId) => {
    if (!commentElement || !containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const commentWidth = commentElement.offsetWidth;
    const totalDistance = containerWidth + commentWidth;
    const duration = 5000;
    const startTime = performance.now();

    const commentObj = {
      element: commentElement,
      animationId: null,
      messageId,
    };

    activeCommentsRef.current.push(commentObj);

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = elapsed / duration;

      if (progress >= 1) {
        if (commentElement.parentNode) {
          commentElement.parentNode.removeChild(commentElement);
        }
        activeCommentsRef.current = activeCommentsRef.current.filter(
          (c) => c !== commentObj,
        );
        return;
      }

      const currentRight = -commentWidth + progress * totalDistance;
      commentElement.style.right = currentRight + "px";

      commentObj.animationId = requestAnimationFrame(animate);
    };

    commentObj.animationId = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (isActive && containerRef.current) {
      setIsLoaded(true);
    } else {
      setIsLoaded(false);
    }

    return () => {
      activeCommentsRef.current.forEach((comment) => {
        if (comment.element && comment.element.parentNode) {
          comment.element.parentNode.removeChild(comment.element);
        }
      });
      activeCommentsRef.current = [];
    };
  }, [isActive]);

  useEffect(() => {
    if (isActive && isLoaded && messages?.length > 0) {
      const newMessages = messages.filter(
        (message) => !displayedMessagesRef.current.has(message.messageId),
      );

      newMessages.forEach((message) => {
        if (message?.content && message?.messageId) {
          try {
            displayedMessagesRef.current.add(message.messageId);
            const commentElement = createCommentElement(message);
            if (commentElement) {
              animateComment(commentElement, message.messageId);
            }
          } catch (error) {
            console.error("Error creating danmaku message:", error);
          }
        }
      });
    }
  }, [messages, isActive, isLoaded, createCommentElement, animateComment]);

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

export default Danmaku;
