import { StateProp } from "../utils/reactish/StateProp";


export function DisclaimerTextUk({
    optOutSubmissionState: [optOutSubmission, setOptOutSubmission],
    optOutAnalyticsState: [optOutAnalytics, setOptOutAnalytics],
}: {
    optOutSubmissionState: StateProp<boolean>;
    optOutAnalyticsState: StateProp<boolean>;
}) {
    return <>
        <h3>
            # Інді-дослідження на основі громадянської науки
        </h3>
        <p>
            Гра є інді-дослідженням, яке робить спробу <b>досліджувати світи
                клітинних автоматів</b> у стилі <a
                    href="https://uk.wikipedia.org/wiki/%D0%93%D1%80%D0%BE%D0%BC%D0%B0%D0%B4%D1%8F%D0%BD%D1%81%D1%8C%D0%BA%D0%B0_%D0%BD%D0%B0%D1%83%D0%BA%D0%B0"
                    target="_blank"
                >громадянської науки</a>.
            З цією метою гра надсилає успішні проходження гри на сервер.
            Одразу після цього проходження є загальнодоступними
            та їх можна аналізувати. <b>Вихідний код</b> як гри,
            так і сервера <b>відкритий</b>,
            MIT-ліцензований,
            і доступний на GitHub: <a
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
            &nbsp;<b>Надсилати анонімні рішення</b>
            <br />
            (Це <b>необхідна</b> частина дослідження!)
        </label>
        <br />
        <h3># Аналітика</h3>
        <p>
            Гра збирає анонімну статистику взаємодії користувача
            за допомогою аналітики <a
                href="https://amplitude.com"
                target="_blank"
            >Amplitude</a>.
        </p>
        <label>
            <input
                type="checkbox"
                checked={!optOutAnalytics}
                onChange={e => setOptOutAnalytics(!e.target.checked)}
            ></input>
            &nbsp;<b>Надсилати анонімну аналітику</b>
            <br />
            (Це лише допомагає нам відстежувати та покращувати
            геймерський досвід)
        </label>
        <br />
        <br />
        <h3>
            # Попередження щодо втрати прогресу
        </h3>
        <p>
            Гра знаходиться у стадії <b>активної розробки</b>.
            У неї можна грати, але вона ще буде сильно змінюватися.
            Налаштування та прогрес зберігаються локально,
            не синхронізуються,
            і <b>можуть і будуть втрачені</b> у разі несумісних змін
            у майбутніх версіях. Це дозволяє нам швидше ітерувати.
        </p>
    </>;
}
