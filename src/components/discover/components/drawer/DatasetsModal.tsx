import * as _ from "lodash";
import { ChevronRight } from "@mui/icons-material";
import { Box, Button, Collapse, Divider, List, ListItemButton, ListItemIcon, ListItemText, MenuItem, MenuList, Modal, Paper, Stack, Typography } from "@mui/material";
import { useState, useContext } from "react";
import { post } from "../../../../api/network";
import { AppContext } from "../../../../AppContext";
import { ENDPOINT_VIEW_RUN } from "../../../../Constants";
import { ChipItem } from "../../classes/ChipItem";
import { dataDrawerDropId } from "../../Const";
import { python } from "@codemirror/lang-python"
import CodeMirror from "@uiw/react-codemirror"

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    height: "50vh",
    width: "50vh",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
}

export default function DatasetsModal() {
    const aC = useContext(AppContext);
    const [openPyViews, setOpenPyViews] = useState(false);
    const [viewCode, setViewCode] = useState("")
    const handleOpen = () => setOpenPyViews(!openPyViews)

    const handleViewRun = () => {
        post(
            `${aC.apiUrl}${ENDPOINT_VIEW_RUN}`,
            JSON.stringify({code: viewCode})
        ).then((res) => {
            if (res.ok) {
                res.json().then((obj: any) => {
                    aC.setDatasets([{name: "Prices", schema: obj[0].schema, data: obj[0].data }])
                    aC.setDropZones({droppableId: dataDrawerDropId + "Prices", items: _.map(_.keys(obj[0].schema), (name) => new ChipItem(name, obj[0].schema[name], dataDrawerDropId)
                    )})
                })
            } else {
                console.log(res)
            }
        })
    }

    const handleViewSave = () => {}

    return (
      <>
        <Modal
          open={aC.discoveryDataModalOpen}
          onClose={() => aC.setDiscoveryDataModalOpen(false)}
        >
          <Box sx={style}>
            <Stack direction="row" sx={{ height: "100%" }}>
              <Paper sx={{ width: 220, maxWidth: "100%", height: "100%" }}>
                <MenuList>
                  <MenuItem>
                    <ListItemIcon>
                      <ChevronRight fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>JlView</ListItemText>
                    <Typography variant="body2" color="text.secondary">
                      Jl
                    </Typography>
                  </MenuItem>

                  <Collapse in={openPyViews} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      <ListItemButton sx={{ pl: 4 }}>
                        <ListItemText primary="New" />
                      </ListItemButton>
                    </List>
                  </Collapse>
                </MenuList>
              </Paper>

              <Box
                display="flex"
                flexDirection="column"
                height="100%"
                width="100%"
                sx={{
                  overflow: "hidden",
                  // overflowY: "scroll"
                }}
              >
                <CodeMirror
                  height="auto"
                  width="100%"
                  extensions={[python()]}
                  value={viewCode}
                  autoFocus={true}
                  onChange={(value) => setViewCode(value)}
                >
                  <Stack
                    direction="row"
                    justifyContent="end"
                    divider={<Divider orientation="vertical" flexItem />}
                    spacing={2}
                    sx={{ mt: 3 }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleViewRun}
                    >
                      Run
                    </Button>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={handleViewSave}
                    >
                      Save
                    </Button>
                  </Stack>
                </CodeMirror>
              </Box>
            </Stack>
          </Box>
        </Modal>
      </>
    );
}