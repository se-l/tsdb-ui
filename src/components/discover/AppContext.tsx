import { useReducer, useState } from "react";
import { Cell } from "./classes/Cell";
import { Dataset } from "./classes/Dataset";
import { DropZone } from "./classes/DropZone";
import { View } from "./classes/View";

interface IAppContextDiscover {
    dropZones: { [key: string]: DropZone };
    setDropZones: any;
    datasets: Dataset[];
    setDatasets: any;
    redrawGrid: number;
    setRedrawGrid: any;
    discoveryDataModalOpen: boolean;
    setDiscoveryDataModalOpen: any;
    views: View[];
    setViews: any;
    cells: Cell[];
    setCells: any;
    openDatasets: boolean;
    setOpenDatasets: any;
    enableRnd: boolean;
    setEnableRnd: any;
}

export const AppContextDiscover: IAppContextDiscover = {
    dropZones: {},
    setDropZones: null,
    datasets: [],
    setDatasets: null,
    redrawGrid: 0,
    setRedrawGrid: null,
    discoveryDataModalOpen: false,
    setDiscoveryDataModalOpen: null,
    views: [],
    setViews: null,
    cells: [],
    setCells: null,
    openDatasets: false,
    setOpenDatasets: null,
    enableRnd: true,
    setEnableRnd: null,
}

const zoneReducer = (state: any, dropZone: DropZone) => {
if (!Object.keys(state).includes(dropZone.id)) {
    state[dropZone.id] = dropZone
} else {
    state[dropZone.id].items = dropZone.items
}
return state
}

export function AppContextDiscoverValues(): IAppContextDiscover {
  const [redrawGrid, setRedrawGrid] = useState(0);
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [dropZones, setDropZones] = useReducer(zoneReducer, {});
  const [cells, setCells] = useState<Cell[]>([]);
  const [views, setViews] = useState<View[]>([]);
  const [discoveryDataModalOpen, setDiscoverDataModalOpen] = useState(false);
  const [openDatasets, setOpenDatasets] = useState<boolean>(false);
  const [enableRnd, setEnableRnd] = useState<boolean>(false);

  return {
    dropZones: dropZones,
    setDropZones: setDropZones,
    datasets: datasets,
    setDatasets: setDatasets,
    redrawGrid: redrawGrid,
    setRedrawGrid: setRedrawGrid,
    discoveryDataModalOpen: discoveryDataModalOpen,
    setDiscoveryDataModalOpen: setDiscoverDataModalOpen,
    views: views,
    setViews: setViews,
    cells: cells,
    setCells: setCells,
    openDatasets: openDatasets,
    setOpenDatasets: setOpenDatasets,
    enableRnd: enableRnd,
    setEnableRnd: setEnableRnd,
  };
}