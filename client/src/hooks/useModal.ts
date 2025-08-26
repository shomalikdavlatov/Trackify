import { useState, useCallback } from "react";

export default function useModal(initial = false) {
    const [open, setOpen] = useState(initial);
    const onOpen = useCallback(() => setOpen(true), []);
    const onClose = useCallback(() => setOpen(false), []);
    return { open, onOpen, onClose, setOpen };
}
