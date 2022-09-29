import { Chip } from "@mui/material";
import { useContext } from "react";
import { Draggable } from "react-beautiful-dnd";
import { AppContext } from "../../../AppContext";
import { NumbersSharp, TextFieldsSharp } from "@mui/icons-material"
import { ChipItem } from "../classes/ChipItem";
import { IChipDnd } from "../types/IChipDnd";
import { DropZone } from "../classes/DropZone";
import { dataDrawerDropId } from "../Const";

export function ChipDnd({index, chipItem}: IChipDnd) {
    const aC = useContext(AppContext)

    const handleDelete = (chipItem: ChipItem) => (data: any) => {
        let zone = aC.dropZones[chipItem.droppableId]
        const newArr = Array.from((aC.dropZones[chipItem.droppableId] || {items: []}).items)
        const ixItem: number = newArr.indexOf(chipItem)
        const [removed] = newArr.splice(ixItem, 1);
        aC.setDropZones(new DropZone(zone.id, newArr, zone.name))
        aC.setRedrawGrid(aC.redrawGrid + 1)
    }

    const type2Icon: { [key: string]: JSX.Element } = {
        string: <TextFieldsSharp />,
        number: <NumbersSharp />
    }

    return (
        <Draggable key={chipItem.droppableId + chipItem.name} draggableId={chipItem.droppableId + chipItem.name} index={index}>
            {(provided) => (
                <div ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                >
                    <Chip 
                    key={chipItem.droppableId + chipItem.name}
                    avatar={type2Icon[chipItem.type]}
                    label={chipItem.name}
                    variant="outlined"
                    color="secondary"
                    onDelete={chipItem.droppableId === dataDrawerDropId ? undefined : handleDelete(chipItem)}
                />
                </div>
                )}
        </Draggable>
    );
}