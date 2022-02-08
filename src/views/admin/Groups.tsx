import { Add, More, MoreVert } from "@mui/icons-material"
import { Box, Button, Container, Grid, IconButton, Paper, Typography } from "@mui/material"
import { styled, useTheme } from '@mui/material/styles'
import { useContext, useEffect, useState } from "react"
import AdminSkeleton from "../../components/AdminSkeleton"
import DeletePopup from "../../components/DeletePopup"
import Group, { GroupProps } from "../../components/Group"
import GroupPopup from "../../components/GroupPopup"
import { SnackbarContext } from "../../contexts/Snackbar"
import { request } from "../../functions/request"

const AdminGroups = () => {
    const [groups, setGroups] = useState<GroupProps[]>([])
    const [addOpen, setAddOpen] = useState(false)
    const [deleteId, setDeleteId] = useState<number|null>(null)
    const {addSnackbar} = useContext(SnackbarContext)

    const deleteGroup = async (id: number|null) => {
        if (!id) return

        let res = await request(`/groups/${id}`, {
            method: "DELETE"
        })
        
        if (res.type === "error") return addSnackbar({
            type: "error",
            message: res.errors[0]
        })

        setGroups(groups.filter(g => g.id !== id))
        setDeleteId(null)
        addSnackbar({
            type: "success",
            message: res.message
        })
    }
    const addGroup = (group: GroupProps) => {
        setGroups([...groups, group])
        setAddOpen(false)
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
        })
    }, [])

    return <AdminSkeleton active="groups">
        <GroupPopup
            open={addOpen}
            onClose={() => setAddOpen(false)}
            onSubmit={addGroup}
        />
        <DeletePopup 
            open={!!deleteId}
            onClose={() => setDeleteId(null)}
            onSubmit={() => deleteGroup(deleteId)}
            message={`Please confirm to delete the groupe.`}
        />
        <Container maxWidth="lg" sx={{
            display: "flex",
            flexDirection: "column",
            rowGap: 4
        }}>
            <Box sx={{
                display: "flex",
                alignItems: "center",
                columnGap: 4
            }}>
                <Typography component="h2" sx={{
                    fontSize: 32,
                    fontWeight: 700
                }}>Group list</Typography>
                <Button startIcon={<Add />} size="large" onClick={() => setAddOpen(true)}>
                    Add
                </Button>
            </Box>
            <Grid container columnSpacing={6} rowSpacing={4}>
                {groups.map(g => <Group key={g.id} id={g.id} label={g.label} slides={g.slides} updatedAt={g.updatedAt} onDelete={() => setDeleteId(g.id)}/>)}
            </Grid>
        </Container>
    </AdminSkeleton>
}

export default AdminGroups