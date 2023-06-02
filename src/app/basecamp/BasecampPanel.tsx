import type { jsx } from "@emotion/react";
import { FavoriteDropzones } from "./FavoriteDropzones";
import { HistoricalWorlds } from "./HistoricalWorlds";
import { NewDropzones } from "./NewDropzones";
import { CurrentDropInfo } from "./CurrentDropInfo";
import { DropEquipmentSelector } from "./DropEquipmentSelector";
import { DevChoiceWorlds } from "./DevChoiceWorlds";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { Ribbon } from "@emotion-icons/ionicons-solid/Ribbon";
import { Dice } from "@emotion-icons/fa-solid/Dice";
import { Star } from "@emotion-icons/ionicons-solid/Star";
import { History } from "@emotion-icons/fa-solid/History";


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
            padding: "1vmin",
        }, cssProp]}
        {...props}
    >
        <CurrentDropInfo />
        <br />
        <DropEquipmentSelector />
        <Tabs>
            <TabList>
                <Tab><Ribbon css={iconStyle} /> Dev Choice Worlds</Tab>
                <Tab><Dice css={iconStyle} /> Generate Worlds</Tab>
                <Tab><Star css={iconStyle} /> Bookmarked Drops</Tab>
                <Tab><History css={iconStyle} /> Drop History</Tab>
            </TabList>
            <TabPanel>
                <DevChoiceWorlds />
            </TabPanel>
            <TabPanel>
                <NewDropzones />
            </TabPanel>
            <TabPanel>
                <FavoriteDropzones />
            </TabPanel>
            <TabPanel>
                <HistoricalWorlds />
            </TabPanel>
        </Tabs>
    </div >;
}

