import { Box, Divider, List, ListItem, Stack } from "@mui/material";
import { useContext } from "react";
import { Droppable } from "react-beautiful-dnd";
import { AppContext } from "../../../AppContext";
import { greenBG, purpleBG } from "../../../styles/theme";
import { ChipDnd } from "./ChipDnd";
import { ChipItem } from "../classes/ChipItem";
import { DropZone } from "../classes/DropZone";

interface IDropZoneC {
    dropZone: DropZone;
    header: string | JSX.Element;
}

const getDropStyle = (isDraggingOver: boolean) => ({
    background: isDraggingOver ? greenBG : purpleBG,
    width: 200
})

export function DropZoneC({
    dropZone,
    header=""
}: IDropZoneC) {
    const aC = useContext(AppContext)

    return (
        <Box sx={{borderWidth: "3px"}}>
            <Droppable droppableId={dropZone.id}>
                {(provided, snapshot) => (
                    <div ref={provided.innerRef}
                    style={getDropStyle(snapshot.isDraggingOver)}
                    {...provided.droppableProps}
                    >
                        <Stack direction="row">
                            {header}
                            <List sx={{ width: "100px"}} dense disablePadding>
                                {(aC.dropZones[dropZone.id] || {items: []}).items.map(
                                    (chipItem: ChipItem, index: number) => (
                                    <ListItem key={index+chipItem.dropZoneId+chipItem.name}>
                                        <ChipDnd index={index} chipItem={chipItem} />
                                    </ListItem>
                                    )
                                    )}
                            </List>
                        </Stack>
                        {provided.placeholder}
                        <Divider/>
                    </div>
                )}      
            </Droppable>
        </Box>
        )
}