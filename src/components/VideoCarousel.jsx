import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
gsap.registerPlugin(ScrollTrigger);
import { useEffect, useRef, useState } from "react";

import { hightlightsSlides } from "../constants";
import { pauseImg, playImg, replayImg } from "../utils";

const VideoCarousel = () => {
  const videoElementsRef = useRef([]);
  const videoSpanRef = useRef([]);
  const videoDivRef = useRef([]);

  const [video, setVideo] = useState({
    isEnd: false,
    startPlay: false,
    videoId: 0,
    isLastVideo: false,
    isPlaying: false,
  });

  const [loadedData, setLoadedData] = useState([]);
  const { isEnd, isLastVideo, startPlay, videoId, isPlaying } = video;

  useGSAP(() => {
    // Moves the slider to the left by a percentage based on the value of videoId.
    // If videoId = 0, the slider stays in its original position (translateX(0%)).
    // If videoId = 1, the slider moves to -100% (showing the second video).
    // If videoId = 2, the slider moves to -200% (showing the third video), and so on.

    gsap.to("#slider", {
      transform: `translateX(${-100 * videoId}%)`,
      duration: 2,
      ease: "power2.inOut",
    });

    // State update triggered when #video enters the viewport
    // The state update sets startPlay to true, initiating video playback,
    // and sets isPlaying to true to indicate that the video is currently playing.

    gsap.to("#video", {
      scrollTrigger: {
        trigger: "#video",
        toggleActions: "restart none none none",
      },
      onComplete: () => {
        setVideo((pre) => ({
          ...pre,
          startPlay: true,
          isPlaying: true,
        }));
      },
    });
  }, [isEnd, videoId]);

  useEffect(
    function animateIndicator() {
      let currentProgress = 0;
      let span = videoSpanRef.current;

      if (span[videoId]) {
        // animation to move the indicator
        let anim = gsap.to(span[videoId], {
          onUpdate: () => {
            // get the progress of the video
            const progress = Math.ceil(anim.progress() * 100);

            if (progress != currentProgress) {
              currentProgress = progress;

              // set the width of the progress bar
              gsap.to(videoDivRef.current[videoId], {
                width:
                  window.innerWidth < 760
                    ? "10vw" // mobile
                    : window.innerWidth < 1200
                    ? "10vw" // tablet
                    : "4vw", // laptop
              });

              // set the background color of the progress bar
              gsap.to(span[videoId], {
                width: `${currentProgress}%`,
                backgroundColor: "white",
              });
            }
          },

          // when the video is ended, replace the progress bar with the indicator and change the background color
          onComplete: () => {
            if (isPlaying) {
              gsap.to(videoDivRef.current[videoId], {
                width: "12px",
              });
              gsap.to(span[videoId], {
                backgroundColor: "#afafaf",
              });
            }
          },
        });

        if (videoId == 0) {
          anim.restart();
        }

        // update the progress bar
        const animUpdate = () => {
          anim.progress(
            videoElementsRef.current[videoId]?.currentTime /
              hightlightsSlides[videoId].videoDuration
          );
        };

        if (isPlaying) {
          // ticker to update the progress bar
          gsap.ticker.add(animUpdate);
        } else {
          // remove the ticker when the video is paused (progress bar is stopped)
          gsap.ticker.remove(animUpdate);
        }
      }
    },
    [videoId, startPlay, isPlaying]
  );

  // This useEffect hook ensures that videos are paused or played based on user interactions and loaded data.
  // - If loadedData array has length > 3 (we got 4 videos),
  // - If isPlaying is false => pauses the video with the current videoID.
  // - If startPlay is true and isPlaying is true  => plays the video with the current videoID.

  useEffect(() => {
    if (loadedData.length > 3) {
      if (!isPlaying) {
        videoElementsRef.current[videoId].pause();
      } else {
        startPlay && videoElementsRef.current[videoId].play();
      }
    }
  }, [startPlay, videoId, isPlaying, loadedData]);

  const handleProcess = (type, i) => {
    switch (type) {
      case "video-end":
        setVideo((pre) => ({ ...pre, isEnd: true, videoId: i + 1 }));
        break;

      case "video-last":
        setVideo((pre) => ({ ...pre, isLastVideo: true }));
        break;

      case "video-reset":
        setVideo((pre) => ({ ...pre, videoId: 0, isLastVideo: false }));
        break;

      case "pause":
        setVideo((pre) => ({ ...pre, isPlaying: !pre.isPlaying }));
        break;

      case "play":
        setVideo((pre) => ({ ...pre, isPlaying: !pre.isPlaying }));
        break;

      default:
        return video;
    }
  };

  const handleLoadedMetaData = (i, e) => setLoadedData((pre) => [...pre, e]);

  return (
    <>
      <div className="flex items-center">
        {hightlightsSlides.map((list, i) => (
          <div key={list.id} id="slider" className="sm:pr-20 pr-10">
            <div className="video-carousel_container">
              <div className="w-full h-full flex-center rounded-3xl overflow-hidden bg-black">
                <video
                  id="video"
                  playsInline={true}
                  className={`${
                    list.id === 2 && "translate-x-44"
                  } pointer-events-none`}
                  preload="auto"
                  muted
                  ref={(el) => (videoElementsRef.current[i] = el)}
                  onEnded={() =>
                    i !== 3
                      ? handleProcess("video-end", i)
                      : handleProcess("video-last")
                  }
                  onPlay={() =>
                    setVideo((pre) => ({ ...pre, isPlaying: true }))
                  }
                  onLoadedMetadata={(e) => handleLoadedMetaData(i, e)}
                >
                  <source src={list.video} type="video/mp4" />
                </video>
              </div>

              <div className="absolute top-12 left-[5%] z-10">
                {list.textLists.map((text, i) => (
                  <p key={i} className="md:text-2xl text-xl font-medium">
                    {text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative flex-center mt-10">
        <div className="flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full">
          {videoElementsRef.current.map((_, i) => (
            <span
              key={i}
              className="mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer"
              ref={(el) => (videoDivRef.current[i] = el)}
            >
              <span
                className="absolute h-full w-full rounded-full"
                ref={(el) => (videoSpanRef.current[i] = el)}
              />
            </span>
          ))}
        </div>

        <button className="control-btn">
          <img
            src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
            alt={isLastVideo ? "replay" : !isPlaying ? "play" : "pause"}
            onClick={
              isLastVideo
                ? () => handleProcess("video-reset")
                : !isPlaying
                ? () => handleProcess("play")
                : () => handleProcess("pause")
            }
          />
        </button>
      </div>
    </>
  );
};

export default VideoCarousel;
