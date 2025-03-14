import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Slider } from '@/components/ui/slider';
import { ChevronsLeft, ChevronsRight, Maximize, Minimize, Pause, Play, Repeat, Settings, Volume2, VolumeX } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

// Enhanced Props type for VideoPlayer component
interface VideoPlayerProps {
    src: string;
    className?: string;
    title?: string;
    autoPlay?: boolean;
    controls?: boolean;
    width?: string;
    height?: string;
    onEnded?: () => void;
    playbackRates?: number[];
    thumbnails?: string[];
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
    src,
    className = '',
    title = 'Video',
    autoPlay = false,
    controls = true,
    width = 'w-full',
    height = 'aspect-video',
    onEnded,
    playbackRates = [0.5, 1, 1.5, 2],
    thumbnails,
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(autoPlay);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const [isMuted, setIsMuted] = useState<boolean>(false);
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
    const [showControls, setShowControls] = useState<boolean>(true);
    const [volume, setVolume] = useState<number>(1);
    const [playbackRate, setPlaybackRate] = useState<number>(1);
    const [isLooping, setIsLooping] = useState<boolean>(false);
    const [hoveredTime, setHoveredTime] = useState<number | null>(null);
    const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Handle video loaded metadata
    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
            videoRef.current.playbackRate = playbackRate;
        }
    };

    // Handle play/pause
    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
                setIsPlaying(false);
            } else {
                videoRef.current.play();
                setIsPlaying(true);
            }
        }
    };

    // Handle time update
    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
        }
    };

    // Handle video end
    const handleEnd = () => {
        setIsPlaying(false);
        setCurrentTime(0);
        if (videoRef.current) {
            if (isLooping) {
                videoRef.current.play();
                setIsPlaying(true);
            } else {
                videoRef.current.currentTime = 0;
                onEnded?.();
            }
        }
    };

    // Handle seek
    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        if (videoRef.current) {
            const target = e.currentTarget;
            const rect = target.getBoundingClientRect();
            const seekTime = ((e.clientX - rect.left) / rect.width) * duration;

            videoRef.current.currentTime = seekTime;
            setCurrentTime(seekTime);

            // Maintain play state
            if (isPlaying) {
                videoRef.current.play();
            }
        }
    };

    // Handle mouse move on progress bar
    const handleProgressMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (videoRef.current) {
            const target = e.currentTarget;
            const rect = target.getBoundingClientRect();
            const hoveredTime = ((e.clientX - rect.left) / rect.width) * duration;
            setHoveredTime(hoveredTime);
        }
    };

    const handleProgressMouseLeave = () => {
        setHoveredTime(null);
    };

    // Handle volume change
    const handleVolumeChange = (value: number[]) => {
        if (videoRef.current) {
            const newVolume = value[0];
            videoRef.current.volume = newVolume;
            videoRef.current.muted = newVolume === 0;
            setVolume(newVolume);
            setIsMuted(newVolume === 0);
        }
    };

    // Handle mute
    const toggleMute = () => {
        if (videoRef.current) {
            const newMuteState = !isMuted;
            videoRef.current.muted = newMuteState;
            setIsMuted(newMuteState);

            if (newMuteState) {
                setVolume(0);
            } else {
                setVolume(1);
            }
        }
    };

    // Handle playback rate change
    const changePlaybackRate = (rate: number) => {
        if (videoRef.current) {
            videoRef.current.playbackRate = rate;
            setPlaybackRate(rate);
        }
    };

    // Toggle loop
    const toggleLooping = () => {
        if (videoRef.current) {
            const newLoopState = !isLooping;
            videoRef.current.loop = newLoopState;
            setIsLooping(newLoopState);
        }
    };

    // Skip forward/backward
    const skipTime = (seconds: number) => {
        if (videoRef.current) {
            const newTime = Math.max(0, Math.min(videoRef.current.currentTime + seconds, duration));
            videoRef.current.currentTime = newTime;
            setCurrentTime(newTime);

            // Maintain play state
            if (isPlaying) {
                videoRef.current.play();
            }
        }
    };

    // Handle fullscreen
    const toggleFullscreen = () => {
        if (videoRef.current) {
            if (!document.fullscreenElement) {
                videoRef.current.requestFullscreen().catch((err) => {
                    console.error(`Error attempting to enable fullscreen: ${err.message}`);
                });
            } else {
                document.exitFullscreen();
            }
        }
    };

    // Update fullscreen state
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    // Format time (mm:ss)
    const formatTime = (timeInSeconds: number): string => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    // Auto-hide controls
    useEffect(() => {
        const handleMouseMove = () => {
            setShowControls(true);

            // Clear existing timeout
            if (controlsTimeoutRef.current) {
                clearTimeout(controlsTimeoutRef.current);
            }

            // Set new timeout to hide controls
            controlsTimeoutRef.current = setTimeout(() => {
                if (isPlaying) {
                    setShowControls(false);
                }
            }, 3000);
        };

        const videoElement = videoRef.current;
        if (videoElement) {
            videoElement.addEventListener('mousemove', handleMouseMove);
        }

        return () => {
            if (videoElement) {
                videoElement.removeEventListener('mousemove', handleMouseMove);
            }
            if (controlsTimeoutRef.current) {
                clearTimeout(controlsTimeoutRef.current);
            }
        };
    }, [isPlaying]);

    // Clean up on unmount
    useEffect(() => {
        return () => {
            if (controlsTimeoutRef.current) {
                clearTimeout(controlsTimeoutRef.current);
            }
        };
    }, []);

    return (
        <div className={`relative ${width} ${height} bg-black ${className}`}>
            {/* Video element */}
            <video
                ref={videoRef}
                className="h-full w-full"
                title={title}
                onLoadedMetadata={handleLoadedMetadata}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleEnd}
                playsInline
                autoPlay={autoPlay}
                src={src}
            >
                Your browser does not support the video tag.
            </video>

            {/* Thumbnail preview on hover */}
            {thumbnails && hoveredTime !== null && (
                <div
                    className="absolute bottom-16 left-1/2 -translate-x-1/2 transform rounded bg-black/70 p-2"
                    style={{
                        backgroundImage: `url(${thumbnails[Math.floor(hoveredTime / (duration / thumbnails.length))]})`,
                        backgroundSize: 'cover',
                        width: '200px',
                        height: '112px',
                    }}
                >
                    <div className="mt-2 text-center text-xs text-white">{formatTime(hoveredTime)}</div>
                </div>
            )}

            {/* Video overlay for touch targets */}
            <div className="absolute inset-0 cursor-pointer" onClick={togglePlay} />

            {/* Center play button when paused */}
            {!isPlaying && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform" onClick={togglePlay}>
                    <div className="bg-primary/80 flex h-16 w-16 items-center justify-center rounded-full text-white backdrop-blur-sm">
                        <Play className="ml-1 h-8 w-8" />
                    </div>
                </div>
            )}

            {/* Video controls overlay */}
            {controls && (
                <div
                    className={`absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}
                >
                    {/* Progress bar with hover preview */}
                    <div
                        className="mb-3 h-1.5 w-full cursor-pointer rounded-full bg-white/30"
                        onClick={handleSeek}
                        onMouseMove={handleProgressMouseMove}
                        onMouseLeave={handleProgressMouseLeave}
                    >
                        <div className="bg-primary h-full rounded-full" style={{ width: `${(currentTime / duration) * 100}%` }} />
                    </div>

                    {/* Controls row */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            {/* Skip backward */}
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/10" onClick={() => skipTime(-10)}>
                                <ChevronsLeft className="h-5 w-5" />
                            </Button>

                            {/* Play/Pause button */}
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/10" onClick={togglePlay}>
                                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                            </Button>

                            {/* Skip forward */}
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/10" onClick={() => skipTime(10)}>
                                <ChevronsRight className="h-5 w-5" />
                            </Button>

                            {/* Time display */}
                            <div className="text-xs text-white">
                                {formatTime(currentTime)} / {formatTime(duration)}
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            {/* Volume control */}
                            <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/10" onClick={toggleMute}>
                                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                                </Button>
                                <Slider defaultValue={[volume]} max={1} step={0.1} onValueChange={handleVolumeChange} className="w-24" />
                            </div>

                            {/* Playback settings */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/10">
                                        <Settings className="h-5 w-5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    {/* Playback Rate */}
                                    <DropdownMenuItem className="flex items-center justify-between">
                                        Playback Speed
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" className="text-xs">
                                                    {playbackRate}x
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                {playbackRates.map((rate) => (
                                                    <DropdownMenuItem
                                                        key={rate}
                                                        onClick={() => changePlaybackRate(rate)}
                                                        className={`cursor-pointer ${playbackRate === rate ? 'bg-primary/10' : ''}`}
                                                    >
                                                        {rate}x
                                                    </DropdownMenuItem>
                                                ))}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </DropdownMenuItem>

                                    {/* Loop Toggle */}
                                    <DropdownMenuItem className="flex cursor-pointer items-center justify-between" onClick={toggleLooping}>
                                        Loop
                                        <Button variant={isLooping ? 'default' : 'outline'} size="sm" className="text-xs">
                                            <Repeat className={`h-4 w-4 ${isLooping ? 'text-white' : 'text-gray-500'}`} />
                                        </Button>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* Fullscreen button */}
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/10" onClick={toggleFullscreen}>
                                {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
