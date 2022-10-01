import { useEffect, useState } from "react"

export const Character = ({ character, mood }: { character: string, mood: string }) => {
    const [flexibleMood, setMood] = useState(mood);

    const punchTheCan = () => {
        setMood("Angry");
        setTimeout(() => {
            setMood("Neutral")
        }, 3000)
    }

    return <img src={`/characters/${character}_${flexibleMood}.png`} onClick={punchTheCan} alt="Soda" />

}