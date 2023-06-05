import type { jsx } from "@emotion/react";
import { FavoriteDropzones } from "./FavoriteDropzones";
import { HistoricalWorlds } from "./HistoricalWorlds";
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


export function BasecampPanel({
    css: cssProp,
    ...props
}: jsx.JSX.IntrinsicElements["div"]) {

    const iconStyle = {
        height: "1.2em",
        marginTop: "-0.25em",
    };

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
                margin: "0.5vmin",
                width: "30vmin",
                height: "50vmin",
            }} />
            <div css={{
                margin: "0.5vmin",
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
                                <Ribbon css={iconStyle} /> Dev Choice Worlds
                            </Tab>
                            <Tab>
                                <Dice css={iconStyle} /> Generate Worlds
                            </Tab>
                            <Tab>
                                <Star css={iconStyle} /> Bookmarked Drops
                            </Tab>
                            <Tab>
                                <History css={iconStyle} /> Drop History
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
                                <HistoricalWorlds css={{ height: "100%" }} />
                            </TabPanel>
                        </div>
                    </div>
                </Tabs>
            </div>
        </div>
    </div >;
}

