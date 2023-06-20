import type { jsx } from "@emotion/react";
import { FavoriteDropzones } from "./FavoriteDropzones";
import { HistoricalDrops } from "./HistoricalDrops";
import { NewDropzones } from "./NewDropzones";
import { CurrentDropInfo } from "./CurrentDropInfo";
import { DevChoiceWorlds } from "./DevChoiceWorlds";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { Ribbon } from "@emotion-icons/ionicons-solid/Ribbon";
import { Dice } from "@emotion-icons/fa-solid/Dice";
import { Star } from "@emotion-icons/ionicons-solid/Star";
import { History } from "@emotion-icons/fa-solid/History";
import { PlayerPanel } from "./PlayerPanel";
import { useRecoilState, useSetRecoilState } from "recoil";
import { languageRecoil, useResolveByLanguage, useTranslate } from "../languageRecoil";
import { Trending } from "./Trending";
import { Twemoji } from "react-emoji-render";
import { VolumeMute } from "@emotion-icons/fa-solid/VolumeMute";
import { VolumeUp } from "@emotion-icons/fa-solid/VolumeUp";
import { muteSoundsRecoil } from "../muteSoundsRecoil";
import { TrendingUp } from "@emotion-icons/boxicons-regular/TrendingUp";
import { DropStats } from "./DropStats";
import { ChartBar } from "@emotion-icons/fa-solid/ChartBar";


export function BasecampPanel({
    css: cssProp,
    ...props
}: jsx.JSX.IntrinsicElements["div"]) {

    const iconStyle = {
        height: "1.2em",
        marginTop: "-0.25em",
    };

    const resolveByLanguage = useResolveByLanguage();
    const languageToDisplayAsSelected = resolveByLanguage({
        "en": "en",
        "uk": "uk",
    }) ?? "en";
    const setLanguage = useSetRecoilState(languageRecoil);
    const translate = useTranslate();

    const [muteSounds, setMuteSounds] = useRecoilState(muteSoundsRecoil);

    return <div
        css={[{
            padding: "0.5vmin",
            display: "flex",
            flexDirection: "column",
        }, cssProp]}
        {...props}
    >
        <CurrentDropInfo css={{
            margin: "0.5vmin",
        }} />
        <div css={{
            display: "flex",
            flexDirection: "row",
            minHeight: "0",
        }}>
            <PlayerPanel css={{
                margin: "4.5vmin 3vmin 2.5vmin 4.5vmin",
                flex: "0 0 33vmin",
            }} />
            <div css={{
                margin: "2.5vmin",
            }}>
                <Tabs css={{
                    height: "100%",
                }}>
                    <div css={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                    }}>
                        <TabList>
                            <div css={{ fontSize: "1.2em" }}>
                                <Tab>
                                    <ChartBar css={iconStyle} />&nbsp;
                                    {translate("Drop Stats")}
                                </Tab>
                                <Tab>
                                    <Ribbon css={iconStyle} />&nbsp;
                                    {translate("Dev Choice")}
                                </Tab>
                                <Tab>
                                    <TrendingUp css={iconStyle} />&nbsp;
                                    {translate("Trending")}
                                </Tab>
                                <Tab>
                                    <Dice css={iconStyle} />&nbsp;
                                    {translate("Generate-header")}
                                </Tab>
                                <Tab>
                                    <Star css={iconStyle} />&nbsp;
                                    {translate("Bookmarked")}
                                </Tab>
                                <Tab>
                                    <History css={iconStyle} />&nbsp;
                                    {translate("History")}
                                </Tab>
                            </div>
                        </TabList>
                        <div css={[{
                            flexShrink: 1,
                            overflow: "hidden",
                        }, "&>* { height: 100% }"]}>
                            <TabPanel>
                                <DropStats css={{ height: "100%" }} />
                            </TabPanel>
                            <TabPanel>
                                <DevChoiceWorlds css={{ height: "100%" }} />
                            </TabPanel>
                            <TabPanel>
                                <Trending css={{ height: "100%" }} />
                            </TabPanel>
                            <TabPanel>
                                <NewDropzones css={{ height: "100%" }} />
                            </TabPanel>
                            <TabPanel>
                                <FavoriteDropzones css={{ height: "100%" }} />
                            </TabPanel>
                            <TabPanel>
                                <HistoricalDrops css={{ height: "100%" }} />
                            </TabPanel>
                        </div>
                    </div>
                </Tabs>
            </div>
        </div>
        <div css={{
            position: "absolute",
            right: "13vmin",
            top: "1vmin",
            textAlign: "right",
            fontSize: "1.3em",
        }}>
            {[
                ["en", "en:us:"],
                ["uk", "uk:ua:"],
            ].map(([lang, name]) => <span
                key={lang}
                onClick={() => setLanguage(lang)}
                css={{
                    margin: "0 0.2em",
                    cursor: "pointer",
                    ...(languageToDisplayAsSelected === lang && {
                        borderBottom: "1px solid",
                    }),
                }}
            >
                <Twemoji>{name}</Twemoji>
            </span>)}
        </div>
        <button
            css={{
                position: "absolute",
                right: "7vmin",
                top: "1vmin",
                fontSize: "1.5em",
            }}
            onClick={() => setMuteSounds(!muteSounds)}
        >
            {
                muteSounds
                    ? <VolumeMute css={{
                        height: "1em",
                        margin: "0.15em 0.12em 0.18em 0em",
                    }} />
                    : <VolumeUp css={{
                        height: "1em",
                        margin: "0.15em 0em 0.18em 0em",
                    }} />
            }
        </button>
    </div >;
}

