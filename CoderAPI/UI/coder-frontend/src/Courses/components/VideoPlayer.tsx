// src/features/course/components/VideoPlayer.tsx
import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
// Make sure to import the CSS globally or in this file if using a bundler like Webpack
import 'video.js/dist/video-js.css';

interface VideoPlayerProps {
    videoUrl: string;
    subtitleUrl?: string;
    onVideoEnd: () => void; // A function to call when the video finishes
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, subtitleUrl, onVideoEnd }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const playerRef = useRef<videojs.Player | null>(null);

    useEffect(() => {
        if (!videoRef.current) return;

        const options: videojs.PlayerOptions = {
            controls: true,
            autoplay: false,
            preload: 'auto',
            sources: [{ src: videoUrl, type: 'video/mp4' }],
            responsive: true,
            fluid: true, // makes the video player fill the available space
        };

        const player = videojs(videoRef.current, options, () => {
            console.log('Video.js player is ready');
        });

        if (subtitleUrl) {
            player.addRemoteTextTrack({
                kind: 'subtitles',
                src: subtitleUrl,
                srclang: 'en',
                label: 'English',
                default: true,
            }, true);
        }

        player.on('ended', onVideoEnd);
        playerRef.current = player;

        return () => {
            if (playerRef.current && !playerRef.current.isDisposed()) {
                playerRef.current.dispose();
                playerRef.current = null;
            }
        };
    }, [videoUrl, subtitleUrl, onVideoEnd]);

    return (
        <div data-vjs-player>
            {/* The video element needs a unique ID or use the ref directly for videojs */}
            <video ref={videoRef} className="video-js vjs-big-play-centered" />
        </div>
    );
};

export default VideoPlayer;