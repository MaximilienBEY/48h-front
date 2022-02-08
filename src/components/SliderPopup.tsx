import { Close } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, SnackbarContent, TextField, Typography } from "@mui/material"
import { Box } from "@mui/system";
import { useContext, useEffect, useRef, useState } from "react";
import { SnackbarContext } from "../contexts/Snackbar";
import { request } from "../functions/request";
import { SliderType } from "../views/admin/GroupEdition";

interface IProps {
    open: boolean;
    onClose: () => void;
    onSubmit?: (data: SliderType) => void;
}
interface AddProps extends IProps {
    type: "add";
    label?: string;
}
interface EditProps extends IProps {
    type: "edit";
    id: number;
    label: string;
    title?: string;
    media?: string;
}

const SliderPopup = (props: AddProps | EditProps) => {
    const inputRef = useRef<HTMLInputElement>(null)

    const [label, setLabel] = useState<string>(props.label ?? "")
    const [title, setTitle] = useState<string>(props.type === "edit" ? props.title ?? "" : "")
    const [filename, setFilename] = useState<string>(props.type === "edit" ? props.media ?? "" : "")

    const [file, setFile] = useState<File | null>(null)

    const { addSnackbar } = useContext(SnackbarContext)

    const submit = async () => {
        let response = await request(props.type === "add" ? "/sliders" : `/sliders/${props.id}`, {
            method: props.type === "add" ? "POST" : "PUT",
            data: {
                label,
                title,
                media: file ?? ""
            }
        })
        
        if (response.type === "error") return addSnackbar({
            type: "error",
            message: response.errors[0]
        })

        setLabel(props.label ?? "")
        setTitle(props.type === "edit" ? props.title ?? "" : "")
        setFilename(props.type === "edit" ? props.media ?? "" : "")

        addSnackbar({
            type: "success",
            message: `Slider successfully ${props.type === "add" ? "created" : "edited"}.`
        })
        props.onSubmit && props.onSubmit({
            id: response.slider.id,
            label: response.slider.label,
            title: response.slider.title,
            mediaType: response.slider.mediaType,
            mediaSource: response.slider.mediaSource
        } as SliderType)
    }

    useEffect(() => {
        if (props.type === "add") return setLabel(props.label ?? "")
        setLabel(props.label)
        setTitle(props.title ?? "")
        setFilename(props.media ?? "")

    }, props.type === "add" ? [props.label] : [props.label, props.title, props.media])


    return <Dialog
        open={props.open}
        onClose={() => props.onClose()}
        maxWidth="xl"
    >
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
                    {props.type === "add" ? "Add" : "Edit"} slider
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
                <TextField fullWidth label="Title" name="title" value={title} onChange={e => setTitle(e.target.value)} />
                <TextField fullWidth label="File" onMouseDown={(e) => {
                    e.preventDefault()
                    inputRef.current?.click()
                }} value={filename} />
                <input type="file" style={{ display: "none" }} name="file" ref={inputRef} onChange={e => {
                    let target = e.target as HTMLInputElement
                    if (!target.files || !target.files[0]) return

                    let file = target.files[0]
                    setFile(file)
                    setFilename(file.name)
                }} />
            </Box>
        </DialogContent>
        <DialogActions>
            <Button onClick={submit}>
                Submit
            </Button>
        </DialogActions>
    </Dialog>
}

export default SliderPopup