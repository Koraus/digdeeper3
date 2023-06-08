import { StateProp } from "../utils/reactish/StateProp";


export function DisclaimerText({
    optOutSubmissionState: [optOutSubmission, setOptOutSubmission],
    optOutAnalyticsState: [optOutAnalytics, setOptOutAnalytics],
}: {
    optOutSubmissionState: StateProp<boolean>;
    optOutAnalyticsState: StateProp<boolean>;
}) {
    return <>
        <h3>
            # Indie-research, based on citizen science
        </h3>
        <p>
            The game is an indie-research project, attempting to <b>explore
                cellular automata worlds</b> in a <a
                    href="https://en.wikipedia.org/wiki/Citizen_science"
                    target="_blank"
                >citizen science</a> manner.
            For this purpose,
            the game submits successful game solutions to a server.
            The solutions are then instantly publicly available and analyzable.
            The <b>source code</b> of
            both the game and the server <b>is open</b>, MIT-licensed,
            and available on GitHub: <a
                href="https://github.com/ndry/digdeeper3"
                target="_blank"
            >digdeeper3</a>.
        </p>
        <label>
            <input
                type="checkbox"
                checked={!optOutSubmission}
                onChange={e => setOptOutSubmission(!e.target.checked)}
            ></input>
            &nbsp;<b>Do submit anonymous solutions</b>
            <br />
            (Please mind this is a <b>vital</b> part of the research!)
        </label>
        <br />
        <h3># Analytics</h3>
        <p>
            The game gathers anonymous statistics on the user interactions
            using <a
                href="https://amplitude.com"
                target="_blank"
            >Amplitude</a> analytics.
        </p>
        <label>
            <input
                type="checkbox"
                checked={!optOutAnalytics}
                onChange={e => setOptOutAnalytics(!e.target.checked)}
            ></input>
            <b> Do send anonymous analytics</b>
            <br />
            (This just helps us to track and improve the gamer experience)
        </label>
        <br />
        <br />
        <h3># Disclaimer on progress loss</h3>
        <p>
            The game is in a stage of <b>active development</b>.
            It is playable, but a subject to heavy changes.
            The <b>settings and progress</b> are stored locally,
            not synchronized,
            and <b>can and would be lost</b> in case of breaking changes
            in future versions. This allows us to iterate much faster.
        </p>
    </>;
}
