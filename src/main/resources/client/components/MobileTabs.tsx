import {
  useBreakpointValue,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import React from "react";

type MobileTabsProps = {
  children: JSX.Element[];
  labels: string[];
  defaultIndex?: number;
};
export default function MobileTabs({
  labels,
  children,
  defaultIndex = 0,
}: MobileTabsProps) {
  const showTabs = useBreakpointValue([true, true, false]);

  if (showTabs) {
    return (
      <Tabs
        isFitted
        defaultIndex={defaultIndex}
        variant="enclosed-colored"
        colorScheme="red"
        flex={1}
      >
        <TabList>
          {labels.map((label, i) => (
            <Tab key={i}>{label}</Tab>
          ))}
        </TabList>
        <TabPanels>
          {children.map((panel, i) => (
            <TabPanel key={i}>{panel}</TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    );
  }

  // Typescript doesn't like returning arrays
  return <>{children}</>;
}
