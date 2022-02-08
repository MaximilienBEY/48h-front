import { Close } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, SnackbarContent, TextField, Typography } from "@mui/material"
import { Box } from "@mui/system";
import { useContext, useEffect, useRef, useState } from "react";
import { SnackbarContext } from "../contexts/Snackbar";
import { request } from "../functions/request";
import { SliderType } from "../views/admin/GroupEdition";
import { GroupProps } from "./Group";
import { SliderSelection } from "./GroupSlider";
import SliderPopup from "./SliderPopup";

interface IProps {
    open: boolean;
    onClose: () => void;
    onSubmit?: (data: GroupProps) => void;
}

const GroupPopup = (props: IProps) => {
    const [label, setLabel] = useState<string>("")
    const [slider, setSlider] = useState<number | undefined>(undefined)
    const [sliders, setSliders] = useState<SliderType[]>([])
    const [newS, setNewS] = useState<string | null>(null)
    const { addSnackbar } = useContext(SnackbarContext)

    const newSlider = (slider: SliderType) => {
        setSliders([...sliders, slider])
        setSlider(slider.id)
        setNewS(null)
    }
    const submit = async () => {
        let response = await request("/groups", {
            method: "POST",
            data: {
                label,
                sliders: slider ? [slider.toString()] : []
            }
        })

        if (response.type === "error") return addSnackbar({
            type: "error",
            message: response.errors[0]
        })

        setLabel("")

        addSnackbar({
            type: "success",
            message: `Group successfully created.`
        })
        props.onSubmit && props.onSubmit({
            id: response.group.id,
            label: response.group.label,
            slides: response.group.slides,
            updatedAt: new Date(response.group.updatedAt)
        } as GroupProps)
    }

    useEffect(() => {
        setLabel("")
    }, [props.open])

    useEffect(() => {
        request("/sliders").then(res => {
            if (res.type === "error") return
            setSliders(res.sliders)
        })
    }, [])

    return <Dialog
        open={props.open}
        onClose={() => props.onClose()}
        maxWidth="xl"
    >
        <SliderPopup
            open={!!newS}
            label={newS ?? undefined}
            onClose={() => setNewS(null)}
            onSubmit={newSlider}
            type="add"
        />
        <DialogTitle>
            <Box sx={{
                display: "flex",
                alignItems: "center",
                position: "relative",
                justifyContent: "space-between",
                width: {
                    xs: "80vw",
                    md: "60vw",
                    lg: "30vw"
                }
            }}>
                <Typography sx={{ fontSize: 20, fontWeight: 500 }}>
                    Add group
                </Typography>
                <IconButton onClick={() => props.onClose()}>
                    <Close />
                </IconButton>
            </Box>
        </DialogTitle>
        <DialogContent sx={{
            display: "flex",
            justifyContent: "center",
            paddingTop: "16px !important",
            paddingBottom: 2
        }}>
            <Box sx={{
                width: "75%",
                display: "flex",
                flexDirection: "column",
                rowGap: 2
            }}>
                <TextField fullWidth label="Label *" name="label" value={label} onChange={e => setLabel(e.target.value)} />
                <SliderSelection
                    value={slider}
                    onNew={setNewS}
                    onSelect={id => setSlider(id ? id : undefined)}
                    sliders={sliders.map(s => ({ id: s.id, label: s.label }))}
                />
            </Box>
        </DialogContent>
        <DialogActions>
            <Button onClick={submit}>
                Submit
            </Button>
        </DialogActions>
    </Dialog>
}

export default GroupPopup