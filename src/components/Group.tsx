import { MoreVert } from "@mui/icons-material"
import { Box, Grid, IconButton, Menu, MenuItem, Paper, Typography } from "@mui/material"
import { useState } from "react"
import { Link } from "react-router-dom"
import { humanDate } from "../functions/basic";

export interface GroupProps {
    id: number;
    label: string;
    slides: number;
    updatedAt: Date;
    onDelete: () => void;
}

const Group = (props: GroupProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const handleClick = (e: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(e.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }

    return <Grid item xs={6}>
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
                Number of slides : <b>{props.slides}</b><br />
                Last update : <b>{humanDate(props.updatedAt)}</b>
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
            sx={{
                "& a": {
                    textDecoration: "none",
                    color: "text.primary"
                }
            }}
        >
            <Link to={`/admin/groups/${props.id}`}>
                <MenuItem sx={{
                    minWidth: 96
                }}>
                    Edit
                </MenuItem>
            </Link>
            <MenuItem onClick={() => props.onDelete()} sx={{
                minWidth: 96,
                color: "error.dark"
            }}>
                Delete
            </MenuItem>
        </Menu>
    </Grid>
}

export default Group