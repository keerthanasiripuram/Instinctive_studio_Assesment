
import React, { useState, useEffect, useRef } from 'react';
import styles from './Button.module.css';


export default function Button() {
    const [count, setCount] = useState(3);
    const [countActivate, setCountActivate] = useState(false);
    const [status, setStatus] = useState("Stop");
    const [del, setDel] = useState(false);
    const [resume, setResume] = useState(false);
    const [isBabble, setIsBabble] = useState(true);
    const [isSpeaking, setIsSpeaking] = useState(false);

    const manualStop = useRef(false);
    const recognition = useRef(null);

    useEffect(() => {
        // Check for browser support for the SpeechRecognition API
        if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            console.log("Speech recognition is not supported in this browser.");
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition.current = new SpeechRecognition();
        recognition.current.continuous = true;

        // Event handler for when the microphone starts listening
        recognition.current.onstart = () => {
            console.log("Microphone is active, start speaking...");
            setIsSpeaking(true);
        };

        // Event handler for errors during recognition
        recognition.current.onerror = (event) => {
            console.log("Error occurred in recognition: ", event.error);
        };

        // Event handler for when speech is recognized
        recognition.current.onresult = (event) => {
            const transcript = event.results[event.results.length - 1][0].transcript;
            console.log("Transcription: ", transcript);
            setIsSpeaking(true);
        };

        // Event handler for when the microphone stops listening
        recognition.current.onend = () => {
            console.log("Microphone deactivated.");
            setIsSpeaking(false);

            // Restart only if not manually stopped and if speaking was detected
            if (!manualStop.current && isSpeaking) {
                recognition.current.start();
            } else {
                manualStop.current = false;
            }
        };

        // Cleanup on unmount
        return () => {
            recognition.current.stop();// Stop recognition
        };
    }, []);

    const requestMicPermission = () => {
        setIsBabble(false);
        startCountdown();

        setTimeout(() => {
            if (recognition.current) {
                manualStop.current = false;
                recognition.current.start();
            }
        }, 3000);
    };

    const startCountdown = () => {
        setCountActivate(true);
        let countdown = 3;
        const intervalCount = setInterval(() => {
            countdown -= 1;
            setCount(countdown);
            if (countdown === 0) {
                setDel(true);
                clearInterval(intervalCount);
            }
        }, 1000);
    };

    const stopMic = () => {
        if (recognition.current) {
            manualStop.current = true;
            setDel(true);
            recognition.current.stop();
            setStatus("Done");
            setResume(true);
        }
    };
    const done = () => {
        setDel(false);
        setResume(false);
        setCountActivate(false);
        setStatus("Stop");
        setCount(3);
        setIsSpeaking(false);
    }
    return (
        <>
            <div>
                {!countActivate ? <div className={styles.babbleText}>babble</div> : <div className={styles.babbleText} style={{}}>{" "}</div>}
            </div>
            <div className={styles.container} style={{ border: !countActivate ? "0.5px solid white" : "" }}>
                <div className={styles.innerContainer}>
                    <div className={styles.delStylings}>
                        <div style={{ backgroundColor: isBabble ? "#324E66" : "white" }} className={styles.circle}>
                            <button className={styles.btn} onClick={!countActivate ? requestMicPermission : (resume ? done : stopMic)}>
                                {!countActivate ? <p style={{ color: "#ffb684" }}>Babble</p> : count <= 0 ? <p className={styles.statusColor}>{status}</p> : count}
                            </button>
                            {!countActivate && <div className={`${styles.innerCircle1} ${styles.innerCircle}`}></div>}
                            {(count <= 0 || !countActivate) && <div className={`${styles.innerCircle2} ${styles.innerCircle}`}></div>}
                            {!countActivate && <div className={`${styles.innerCircle3} ${styles.innerCircle}`}></div>}
                        </div>
                        {del && <div className={styles.delIcon}><span className="material-symbols-outlined">
                            delete
                        </span></div>}

                    </div >
                    {(count <= 0) && resume && <div className={styles.resumeContainer}><button className={styles.btn}>Resume</button></div>}
                </div>
            </div >
            {/* Wave animation*/}
            {countActivate && isSpeaking && (
                <div className={`${styles.waveWrapper} ${styles.waveAnimation}`}>
                    <div className={`${styles.waveWrapperInner} ${styles.bgMiddle}`}>
                        <div className={`${styles.wave} ${styles.waveMiddle}`} style={{ backgroundImage: "url('http://front-end-noobs.com/jecko/img/wave-mid.png')" }}></div>
                    </div>
                    <div className={`${styles.waveWrapperInner} ${styles.bgBottom}`}>
                        <div className={`${styles.wave} ${styles.waveBottom}`} style={{ backgroundImage: "url('http://front-end-noobs.com/jecko/img/wave-bot.png')" }}></div>
                    </div>
                </div>
            )}
            {/*Icons*/}
            {!countActivate && <div className={styles.icons}>
                <div className={styles.iconCircle}><span className="material-symbols-outlined">
                    network_node
                </span>
                </div>
                <div className={styles.iconCircle}>
                    <span className="material-symbols-outlined">
                        graphic_eq
                    </span>
                </div>
            </div>}
        </>
    )
}







