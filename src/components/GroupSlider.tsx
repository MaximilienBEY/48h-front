import { Delete, DeleteOutlined, MoreVert } from "@mui/icons-material"
import { Autocomplete, Box, createFilterOptions, Grid, IconButton, Menu, MenuItem, Paper, TextField, Typography } from "@mui/material"
import { useRef, useState } from "react"
import { Link } from "react-router-dom"
import { SortableContainer, SortableElement } from "react-sortable-hoc"
import { GroupType } from "../views/admin/GroupEdition"

interface Slider {
    id: number;
    label: string;
}
const filter = createFilterOptions<Slider>()

export const SliderSelection = (props: {
    onNew: (name: string) => void;
    onSelect: (id: number) => void;
    sliders: Slider[];
    value?: number
}) => {
    const inputRef = useRef<HTMLInputElement>(null)

    return (
        <Autocomplete
            value={props.value ? props.sliders.find(f => f.id === props.value) ?? null : null}
            onChange={(event, newValue) => {
                if (props.value !== undefined && !newValue) props.onSelect(0)
                if (typeof newValue === "string" || !newValue) return
                setTimeout(() => inputRef.current?.blur(), 0)

                if (newValue.id === 0) {
                    let value = (newValue.label.match(/(?<=^Add ").*(?="$)/g) || [])[0]
                    props.onNew(value)
                } else {
                    props.onSelect(newValue.id)
                }
            }}
            filterOptions={(options, params) => {
                const filtered = filter(options, params)
                const { inputValue: value } = params
                
                const isExisting = options.some((option) => value === option.label)
                if (value.length && !isExisting) {
                    filtered.push({
                        id: 0,
                        label: `Add "${value}"`
                    })
                }

                return filtered;
            }}
            selectOnFocus
            clearOnBlur
            options={props.sliders}
            getOptionLabel={(option) => option.label}
            renderOption={(props, option) => <li {...props}>{option.label}</li>}
            renderInput={(params) => (
                <TextField {...params} label="Add new slider" fullWidth inputRef={inputRef}/>
            )}
        />
    );
}

export const SortableItem = SortableElement(({ value, id, onDelete }: { 
    value: string;
    id: number;
    onDelete: (id: number) => void;
 }) => {
    return <Paper elevation={2} sx={{
        padding: theme => theme.spacing(1, 2, 1, 3)
    }}>
        <Box sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
        }}>
            <Typography component="h6" variant="h6" sx={{
                fontSize: 18
            }}>{value}</Typography>
            <IconButton onMouseDown={() => onDelete(id)} color="error">
                <DeleteOutlined />
            </IconButton>
        </Box>
    </Paper>
})

export const SortableList = SortableContainer(({sliders, onDelete}: {
    sliders: GroupType["sliders"];
    onDelete: (id: number) => void;
}) => {
    return <Box sx={{
        display: "flex",
        flexDirection: "column",
        rowGap: 1
    }}>
        {sliders.map((slider, i) => <SortableItem value={slider.label} index={i} key={slider.id} id={slider.id} onDelete={onDelete}/>)}
    </Box>
})