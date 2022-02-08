import { Alert, Snackbar } from "@mui/material";
import { Portal } from "@mui/base"
import { createContext, useMemo, useState } from "react";

type SnackbarType = {
    type: "success" | "error";
    message: string;
}

export const SnackbarContext = createContext<{
    snackbar?: SnackbarType;
    addSnackbar: (snackbar: SnackbarType | undefined) => void;
}>({
    snackbar: undefined,
    addSnackbar: (snackbar: SnackbarType | undefined): void => { }
})

export const SnackbarProvider = (props: any) => {
    const [snackbar, setSnackbar] = useState<{
        type: "success" | "error";
        message: string;
    } | undefined>(undefined)
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false)
    const addSnackbar = (snack: typeof snackbar) => {
        setSnackbarOpen(false)
        setTimeout(() => {
            setSnackbar(snack)
            setSnackbarOpen(true)
        }, 0)
    }
    const alertClose = (_?: any, reason?: string) => {
        if (reason === "clickaway") return
        setSnackbarOpen(false)
    }

    const value = useMemo(
        () => ({ snackbar, addSnackbar }),
        [snackbar]
    )
    return <SnackbarContext.Provider value={value}>
        <Portal>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={alertClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                {snackbar && <Alert onClose={alertClose} severity={snackbar.type} variant="filled">
                    {snackbar.message}
                </Alert>}
            </Snackbar>
        </Portal>
        {props.children}
    </SnackbarContext.Provider>
}