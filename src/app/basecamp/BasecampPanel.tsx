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
import { useRecoilState } from "recoil";
import { languageRecoil, useTranslate } from "../languageRecoil";

export function BasecampPanel({
    css: cssProp,
    ...props
}: jsx.JSX.IntrinsicElements["div"]) {

    const iconStyle = {
        height: "1.2em",
        marginTop: "-0.25em",
    };

    const [language, setLanguage] = useRecoilState(languageRecoil);
    const ukrainian = "uk";
    const english = "en";
    const translate = useTranslate();

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
                margin: "5vmin 3vmin 2.5vmin 4.5vmin",
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
                            <Tab>
                                <Ribbon css={iconStyle} />&nbsp;
                                {translate("Dev Choice Worlds")}
                            </Tab>
                            <Tab>
                                <Dice css={iconStyle} />&nbsp;
                                {translate("Generate Worlds")}
                            </Tab>
                            <Tab>
                                <Star css={iconStyle} />&nbsp;
                                {translate("Bookmarked Drops")}
                            </Tab>
                            <Tab>
                                <History css={iconStyle} />&nbsp;
                                {translate("Drop History")}
                            </Tab>
                        </TabList>
                        <div css={[{
                            flexShrink: 1,
                            overflow: "hidden",
                        }, "&>* { height: 100% }"]}>
                            <TabPanel>
                                <DevChoiceWorlds css={{ height: "100%" }} />
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
            display: "flex",
            margin: "0 0 2vmin 0.5vmin ",
            position: "absolute",
            right: "8vmin",
            top: "3vmin",
        }}>
            change language:
            <div
                onClick={() => setLanguage(english)}
                css={{
                    margin: "0 2vmin 0 2vmin",
                    textDecoration: language === "en" ? "underline" : "none",
                    cursor: "pointer",
                }}
            >EN</div>
            <div
                onClick={() => setLanguage(ukrainian)}
                css={{
                    textDecoration: language === "uk" ? "underline" : "none",
                    cursor: "pointer",
                }}
            >UA</div>
        </div>
    </div >;
}

