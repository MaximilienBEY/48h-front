import { Add, ArrowBackIosNew, Delete, More, MoreVert } from "@mui/icons-material"
import { Box, Button, Container, Grid, IconButton, Paper, TextField, Typography } from "@mui/material"
import { styled, useTheme } from '@mui/material/styles'
import { useContext, useEffect, useRef, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { request } from "../../functions/request"
import AdminSkeleton from "../../components/AdminSkeleton"
import Group from "../../components/Group"
import { SliderSelection, SortableList } from "../../components/GroupSlider"
import SliderPopup from "../../components/SliderPopup"
import { arrayMoveImmutable } from "array-move"
import { SnackbarContext } from "../../contexts/Snackbar"

export type SliderType = {
    id: number;
    label: string;
    title?: string;
    mediaSource?: string;
    mediaType?: "video" | "image";
}
export type GroupType = {
    id: number;
    label: string;
    sliders: (SliderType & { position: number })[]
}

const GroupEdition = () => {
    const [newS, setNewS] = useState<string | null>(null)
    const { id } = useParams()

    const [sliders, setSliders] = useState<SliderType[]>([])
    const [group, setGroup] = useState<GroupType | null>(null)

    const [label, setLabel] = useState<string>("")
    const [gSliders, setGSliders] = useState<GroupType["sliders"]>([])

    const {addSnackbar} = useContext(SnackbarContext)

    const newSlider = (slider: SliderType) => {
        setSliders([...sliders, slider])

        let position = gSliders.slice().sort((a, b) => a.position - b.position).pop()?.position ?? 0
        setGSliders([...gSliders, { ...slider, position: position + 1 }])
        setNewS(null)
    }
    const deleteSlider = async (id: number) => {
        setGSliders(gSliders.filter(f => f.id !== id))
    }
    const changeOrder = (previous: number, next: number) => {
        setGSliders(arrayMoveImmutable(gSliders, previous, next))
    }

    const edit = async () => {
        let response = await request(`/groups/${id}`, {
            method: "PUT",
            data: {
                label,
                sliders: gSliders.map(s => s.id.toString())
            }
        })

        if (!label.length) setLabel(group?.label ?? "")
        
        if (response.type === "error") {
            addSnackbar({type: "error", message: response.errors[0]})
            setGSliders((group?.sliders || []))
        }
        else addSnackbar({type: "success", message: response.message})
    }

    useEffect(() => {
        request("/sliders").then(res => {
            if (res.type === "error") return
            setSliders(res.sliders)
        })
        request(`/groups/${id}`).then(res => {
            console.log(res)
            if (res.type === "error") {
                console.log("redirect")
            } else {
                setGroup(res.group)
                setLabel(res.group.label)
                setGSliders(res.group.sliders)
            }
        })
    }, [id])


    return <AdminSkeleton active="groups">
        {group ? <>
            <SliderPopup
                open={!!newS}
                label={newS ?? undefined}
                onClose={() => setNewS(null)}
                onSubmit={newSlider}
                type="add"
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
                    <Link to="/admin/groups">
                        <IconButton>
                            <ArrowBackIosNew />
                        </IconButton>
                    </Link>
                    <Typography component="h2" sx={{
                        fontSize: 32,
                        fontWeight: 700
                    }}>Edit group</Typography>
                </Box>
                <Grid container rowSpacing={4} sx={{
                    display: "flex",
                    justifyContent: "space-between"
                }}>
                    <Grid item xs={5} sx={{
                        display: "flex",
                        flexDirection: "column",
                        rowGap: 2
                    }}>
                        <Typography sx={{
                            fontWeight: 700,
                            fontSize: 20,
                            textAlign: "center"
                        }}>
                            Informations
                        </Typography>
                        <Box sx={{
                            display: "flex",
                            flexDirection: "column",
                            rowGap: 2
                        }}>
                            <TextField fullWidth label="Label *" name="label" value={label} onChange={e => setLabel(e.target.value)} />
                            <Box sx={{
                                display: "flex",
                                justifyContent: "flex-start",
                                columnGap: 4,
                                marginTop: 2
                            }}>
                                <Button variant="contained" sx={{
                                    alignSelf: "flex-start",
                                    padding: theme => theme.spacing(1, 4)
                                }} onClick={edit}>
                                    Submit
                                </Button>
                                <Button variant="outlined" color="error" startIcon={<Delete />}>
                                    Delete
                                </Button>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={6} rowSpacing={1} sx={{
                        display: "flex",
                        flexDirection: "column",
                        rowGap: 4
                    }}>
                        <Box sx={{
                            display: "flex",
                            flexDirection: "column",
                            rowGap: 2
                        }}>
                            <Typography sx={{
                                fontWeight: 700,
                                fontSize: 20,
                                textAlign: "center"
                            }}>
                                Sliders
                            </Typography>
                            <SliderSelection onNew={setNewS} onSelect={id => {
                                let slider = sliders.find(f => f.id === id)
                                if (!slider) return

                                let position = gSliders.slice().sort((a, b) => a.position - b.position).pop()?.position ?? 0
                                setGSliders([...gSliders, { ...slider, position: position + 1 }])
                            }} sliders={sliders.map(s => ({ id: s.id, label: s.label })).filter(f => !gSliders.find(e => e.id === f.id))} />
                        </Box>
                        <SortableList onSortEnd={d => changeOrder(d.oldIndex, d.newIndex)} sliders={gSliders} onDelete={deleteSlider} />
                    </Grid>
                </Grid>
            </Container>
        </> : <div>
        </div>}
    </AdminSkeleton>
}

export default GroupEdition