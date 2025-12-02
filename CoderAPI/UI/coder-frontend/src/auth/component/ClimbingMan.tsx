import React, { useEffect, useState } from "react";

export default function LadderScenes() {
    const scenes = [
        String.raw`                MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
                MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
                MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
 o/     AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
/|      AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
/ \     AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR
RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR
RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR`,

        String.raw`                        CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC
                        CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC
                        CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC
          o     MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
         /|\    MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
         / \    MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
        AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
        AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
        AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA`,

        String.raw`                                OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
                                OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
                                OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
                  \o\   CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC
                   |\   CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC
                   / \  CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC
                MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
                MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
                MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM`,

        String.raw`                                        DDDDDDDDDDDDDDDDDDDDDDDDDDDDDD
                                        DDDDDDDDDDDDDDDDDDDDDDDDDDDDDD
                                        DDDDDDDDDDDDDDDDDDDDDDDDDDDDDD
                              o/OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
                             /| OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
                             / \OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
                        CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC
                        CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC
                        CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC`,

        String.raw`                                                EEEEEEEEEEEEEEEEEEEEEE
                                                EEEEEEEEEEEEEEEEEEEEEE
                                                EEEEEEEEEEEEEEEEEEEEEE
                                    o   DDDDDDDDDDDDDDDDDDDDDDDDDDDDDD
                                   /|\  DDDDDDDDDDDDDDDDDDDDDDDDDDDDDD
                                   / \  DDDDDDDDDDDDDDDDDDDDDDDDDDDDDD
                                OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
                                OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
                                OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO`,

        String.raw`                                                        RRRRRRRRRRRRRR
                                                        RRRRRRRRRRRRRR
                                                        RRRRRRRRRRRRRR
                                           o/   EEEEEEEEEEEEEEEEEEEEEE
                                          /|    EEEEEEEEEEEEEEEEEEEEEE
                                          / \   EEEEEEEEEEEEEEEEEEEEEE
                                        DDDDDDDDDDDDDDDDDDDDDDDDDDDDDD
                                        DDDDDDDDDDDDDDDDDDDDDDDDDDDDDD
                                        DDDDDDDDDDDDDDDDDDDDDDDDDDDDDD`,

        String.raw`                                                 o      RRRRRRRRRRRRRR
                                                /|\     RRRRRRRRRRRRRR
                                                / \     RRRRRRRRRRRRRR
                                                EEEEEEEEEEEEEEEEEEEEEE
                                                EEEEEEEEEEEEEEEEEEEEEE
                                                EEEEEEEEEEEEEEEEEEEEEE
                                        DDDDDDDDDDDDDDDDDDDDDDDDDDDDDD
                                        DDDDDDDDDDDDDDDDDDDDDDDDDDDDDD
                                        DDDDDDDDDDDDDDDDDDDDDDDDDDDDDD`,

        String.raw`                                                                 o   🚩
                                                                /|\  |
                                                                / \  |
                                                        RRRRRRRRRRRRRR
                                                        RRRRRRRRRRRRRR
                                                        RRRRRRRRRRRRRR
                                                EEEEEEEEEEEEEEEEEEEEEE
                                                EEEEEEEEEEEEEEEEEEEEEE
                                                EEEEEEEEEEEEEEEEEEEEEE
                                        DDDDDDDDDDDDDDDDDDDDDDDDDDDDDD
                                        DDDDDDDDDDDDDDDDDDDDDDDDDDDDDD
                                        DDDDDDDDDDDDDDDDDDDDDDDDDDDDDD`
    ];

    // Color map by first letter of each ASCII block line
    const colorFor = (line: string) => {
        const ch = line.trimStart().charAt(0);
        switch (ch) {
            case "M": return "text-purple-600";
            case "A": return "text-orange-600";
            case "R": return "text-red-600";
            case "C": return "text-blue-600";
            case "O": return "text-indigo-600";
            case "D": return "text-emerald-600";
            case "E": return "text-yellow-600";
            default: return "text-slate-900"; // climber etc.
        }
    };

    const [index, setIndex] = useState(0);
    const [burst, setBurst] = useState(false);

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;

        if (index === scenes.length - 1) {
            setBurst(true);
            timer = setTimeout(() => {
                setBurst(false);
                setIndex(0);
            }, 5000);
        } else {
            timer = setTimeout(() => setIndex(i => i + 1), 700);
        }

        return () => clearTimeout(timer);
    }, [index]);

    const renderScene = () =>
        scenes[index]
            .split("\n")
            .map((line, i) => (
                <div key={i} className={colorFor(line)}>
                    {line}
                </div>
            ));

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute top-4 right-6 text-3xl animate-pulse">
                {burst ? "🎉✨🎊" : ""}
            </div>

            <pre className="font-mono text-[15px] leading-tight whitespace-pre">
                {renderScene()}
            </pre>
        </div>
    );
}
