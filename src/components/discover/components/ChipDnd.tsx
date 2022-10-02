import { Chip } from "@mui/material";
import { useContext } from "react";
import { Draggable } from "react-beautiful-dnd";
import { AppContext } from "../../../AppContext";
import { NumbersSharp, TextFieldsSharp } from "@mui/icons-material"
import { ChipItem } from "../classes/ChipItem";
import { dataDrawerDropId } from "../Const";

interface IChipDnd {
    index: number;
    chipItem: ChipItem;
}

export function ChipDnd({index, chipItem}: IChipDnd) {
    const aC = useContext(AppContext)

    const handleDelete = (chipItem: ChipItem) => (data: any) => {
        let zone = aC.dropZones[chipItem.dropZoneId]
        const newArr = Array.from((aC.dropZones[chipItem.dropZoneId] || {items: []}).items)
        const ixItem: number = newArr.indexOf(chipItem)
        const [removed] = newArr.splice(ixItem, 1);
        let dz = aC.dropZones[chipItem.dropZoneId]
        dz.items = newArr
        aC.setDropZones(dz)
        aC.setRedrawGrid(aC.redrawGrid + 1)
    }

    const type2Icon: { [key: string]: JSX.Element } = {
        string: <TextFieldsSharp />,
        number: <NumbersSharp />
    }

    return (
        <Draggable key={chipItem.dropZoneId + chipItem.name} draggableId={chipItem.dropZoneId + chipItem.name} index={index}>
            {(provided) => (
                <div ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                >
                    <Chip 
                    key={chipItem.dropZoneId + chipItem.name}
                    avatar={type2Icon[chipItem.type]}
                    label={chipItem.name}
                    variant="outlined"
                    color="secondary"
                    onDelete={chipItem.dropZoneId === dataDrawerDropId ? undefined : handleDelete(chipItem)}
                />
                </div>
                )}
        </Draggable>
    );
}