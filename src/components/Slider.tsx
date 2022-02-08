import { MoreVert } from "@mui/icons-material"
import { Box, Grid, IconButton, Menu, MenuItem, Paper, Typography } from "@mui/material"
import { useState } from "react"
import { Link } from "react-router-dom"
import { SliderType } from "../views/admin/GroupEdition"

interface IProps extends SliderType {
    onEdit: () => void;
    onDelete: () => void;
}

const Slider = (props: IProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const handleClick = (e: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(e.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }

    return <Grid item xs={4}>
        <Paper elevation={4} sx={{
            padding: theme => theme.spacing(2, 4),
        }}>
            <Box sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 2
            }}>
                <Typography component="h6" variant="h6">{props.label}</Typography>
                <IconButton onClick={handleClick}>
                    <MoreVert />
                </IconButton>
            </Box>
            <Box>
                Title : <b>{props.title ?? "No title"}</b><br />
                Media type : <b>{props.mediaType === "image" ? "Image" : props.mediaType === "video" ? "Video" : "No media" }</b><br />
            </Box>
        </Paper>
        <Menu
            id="long-menu"
            MenuListProps={{
                'aria-labelledby': 'long-button',
            }}
            anchorEl={anchorEl}
            open={!!anchorEl}
            onClose={handleClose}
        >
            <MenuItem sx={{
                minWidth: 96,
                "& a": {
                    textDecoration: "none",
                    color: "text.primary"
                }
            }} onClick={() => props.onEdit()}>
                <Typography>
                    Edit
                </Typography>
            </MenuItem>
            <MenuItem sx={{
                minWidth: 96,
                color: "error.dark"
            }} onClick={() => props.onDelete()}>
                Delete
            </MenuItem>
        </Menu>
    </Grid>
}

export default Slider