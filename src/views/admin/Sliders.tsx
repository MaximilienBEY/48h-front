import { Add, More, MoreVert } from "@mui/icons-material"
import { Box, Button, Container, Grid, IconButton, Paper, Typography } from "@mui/material"
import { styled, useTheme } from '@mui/material/styles'
import { useContext, useEffect, useState } from "react"
import AdminSkeleton from "../../components/AdminSkeleton"
import DeletePopup from "../../components/DeletePopup"
import Group from "../../components/Group"
import Slider from "../../components/Slider"
import SliderPopup from "../../components/SliderPopup"
import { SnackbarContext } from "../../contexts/Snackbar"
import { request } from "../../functions/request"
import { SliderType } from "./GroupEdition"

const AdminSliders = () => {
    const [sliders, setSliders] = useState<SliderType[]>([])
    const [edit, setEdit] = useState<SliderType | null>(null)
    const [deleteId, setDeleteId] = useState<number|null>(null)
    const [newS, setNewS] = useState<boolean>(false)

    const {addSnackbar} = useContext(SnackbarContext)


    const newSlider = (slider: SliderType) => {
        setSliders([...sliders, slider])
        setNewS(false)
    }
    const editSlider = (slider: SliderType) => {
        let index = sliders.findIndex(f => f.id === slider.id)
        sliders[index] = slider

        setSliders(sliders)
        setEdit(null)
    }
    const deleteSlider = async (id: number|null) => {
        if (!id) return

        let res = await request(`/sliders/${id}`, {
            method: "DELETE"
        })
        
        if (res.type === "error") return addSnackbar({
            type: "error",
            message: res.errors[0]
        })

        setSliders(sliders.filter(g => g.id !== id))
        setDeleteId(null)
        addSnackbar({
            type: "success",
            message: res.message
        })
    }
    useEffect(() => {
        request("/sliders").then(res => {
            if (res.type === "error") return
            setSliders(res.sliders)
        })
    }, [])
    return <AdminSkeleton active="sliders">
        <SliderPopup
            type="edit"
            open={!!edit}
            onClose={() => setEdit(null)}
            onSubmit={editSlider}
            id={edit?.id ?? 0}
            label={edit?.label ?? ""}
            title={edit?.title}
            media={edit?.mediaSource}
        />
        <SliderPopup
            open={newS}
            onClose={() => setNewS(false)}
            onSubmit={newSlider}
            type="add"
        />
        <DeletePopup 
            open={!!deleteId}
            onClose={() => setDeleteId(null)}
            onSubmit={() => deleteSlider(deleteId)}
            message={`Please confirm to delete the slider.`}
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
                }}>Slider list</Typography>
                <Button startIcon={<Add />} size="large" onClick={() => setNewS(true)}>
                    Add
                </Button>
            </Box>
            <Grid container columnSpacing={6} rowSpacing={4}>
                {sliders.map(slider => <Slider key={slider.id} {...slider} onEdit={() => setEdit(slider)} onDelete={() => setDeleteId(slider.id)} />)}
            </Grid>
        </Container>
    </AdminSkeleton>
}

export default AdminSliders