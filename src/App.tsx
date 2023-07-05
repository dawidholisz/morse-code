import './App.css'
import {useCallback, useState} from "react";
import {useDebounce, useKeyPressEvent} from "react-use";
import {morseCodeMap} from "./utils";

const DASH_SIGN_DURATION = 1000

function App() {
    const [message, setMessage,] = useState<string>("");
    const [sequence, setSequence,] = useState<string>("");
    const [pressDownTimeStamp, setPressDownTimeStamp] = useState<number>(0);

    const [, cancelDecoding] = useDebounce(
        () => {
            const decodedCharacter = morseCodeMap.get(sequence)
            if (decodedCharacter !== undefined)
                setMessage(currentMessage => currentMessage.concat(decodedCharacter))
            setSequence('')
        },
        DASH_SIGN_DURATION,
        [sequence]
    );

    const handlePressDown = useCallback(() => {
        cancelDecoding()
        setPressDownTimeStamp(new Date().valueOf())
    }, [])

    const handlePressUp = useCallback(() => {
        const pressDuration = new Date().valueOf() - pressDownTimeStamp
        const character = pressDuration >= DASH_SIGN_DURATION ? "-" : "."
        setSequence(currentSequence => currentSequence.concat(character))
        setPressDownTimeStamp(0)
    }, [pressDownTimeStamp])


    useKeyPressEvent(' ', handlePressDown, handlePressUp)

    return (
        <>
            <h1>Morse code</h1>

            <h2>Decoded message: {message}</h2>
            <h2>Current sequence: {sequence}</h2>
            <button
                type="button"
                className="morse-btn"
                onMouseDown={handlePressDown}
                onMouseUp={handlePressUp}
            >
                Press and hold to encode Morse Code
            </button>
            <p className="read-the-docs">
                yellow button - dot, green - dash,
                dash - {DASH_SIGN_DURATION / 1000}s
            </p>
            <p className="read-the-docs">you can also use spacebar</p>
        </>
    )
}

export default App
