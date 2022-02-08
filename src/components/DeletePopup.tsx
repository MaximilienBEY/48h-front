import { Close } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, SnackbarContent, TextField, Typography } from "@mui/material"
import { Box } from "@mui/system";
import { GroupProps } from "./Group";

interface IProps {
    open: boolean;
    message: string;
    onClose: () => void;
    onSubmit?: () => void;
}

const DeletePopup = (props: IProps) => {
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
                    Delete
                </Typography>
                <IconButton onClick={() => props.onClose()}>
                    <Close />
                </IconButton>
            </Box>
        </DialogTitle>
        <DialogContent sx={{
            display: "flex",
            justifyContent: "flex-start",
            paddingTop: "16px !important",
            paddingBottom: 2
        }}>
            <Typography>{props.message}</Typography>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => props.onSubmit && props.onSubmit()} color="error">
                Submit
            </Button>
        </DialogActions>
    </Dialog>
}

export default DeletePopup