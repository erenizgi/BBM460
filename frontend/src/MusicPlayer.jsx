import {useEffect, useRef} from "react";

export default function MusicPlayer() {
    const audioRef = useRef(null);
    useEffect(() => {
        const audio = audioRef.current;
        const handleInteraction = () => {
            if (audio && audio.paused) {
                audio.play().catch((err) => {
                    console.log("Auto-play blocked:", err);
                });
                document.removeEventListener("click", handleInteraction);
            }
        };
        document.addEventListener("click", handleInteraction);
        return () => {
            document.removeEventListener("click", handleInteraction);
        };
    }, []);

    return (
        <audio ref={audioRef} loop autoPlay controls style={{display: "none"}}>
            <source src="/background_music.mp3" type="audio/mpeg"/>
            Tarayıcın bu müziği desteklemiyor kankeyto
        </audio>
    );
}