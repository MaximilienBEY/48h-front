import { LockOutlined } from "@mui/icons-material";
import { Avatar, Box, Button, Checkbox, Container, CssBaseline, FormControlLabel, Grid, Link, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { request } from "../functions/request"
import { setCookie } from "../functions/storage"
import { SnackbarContext } from "../contexts/Snackbar"
import { useNavigate } from "react-router-dom"
import { GroupProps } from "../components/Group";


const Group = () => {
    const history = useNavigate()
    const [value, setValue] = useState<number>(0)
    const [groups, setGroups] = useState<GroupProps[]>([])

    const selectGroup = (id: number) => {
        if (!id) return
        setCookie("group_id", id.toString())

        history("/")
    }

    useEffect(() => {
        request("/groups").then(res => {
            if (res.type === "error") return

            setGroups(res.groups.map((g: any) => ({
                id: g.id,
                label: g.label,
                slides: g.slides,
                updatedAt: new Date(g.updatedAt),
            })))
            setValue(res.groups[0]?.id ?? 0)
        })
    }, [])

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ margin: 1 }}>
                    <LockOutlined />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Select group
                </Typography>
                <Box sx={{ mt: 4 }}>
                    <Select
                        value={value || ""}
                        onChange={e => setValue(e.target.value as number)}
                        fullWidth
                    >
                        {groups.map(group => <MenuItem value={group.id} key={group.id}>{group.label}</MenuItem>)}
                    </Select>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        onClick={() => selectGroup(value)}
                    >
                        Select
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}

export default Group