import { Dialog, Button, CloseButton, Portal, Box, Text } from "@chakra-ui/react";

interface PrerequisitesDialogProps {
    isOpen: boolean;
    onOpenChange: (e: { open: boolean }) => void;
    pendingPrerequisites: string[];
    onConfirm: () => void;
}

export const PrerequisitesDialog = ({
    isOpen,
    onOpenChange,
    pendingPrerequisites,
    onConfirm,
}: PrerequisitesDialogProps) => {
    return (
        <Dialog.Root lazyMount open={isOpen} onOpenChange={onOpenChange}>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>No cumples con los requisitos.</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                             Las siguientes correlativas están pendientes:
                            <Box mt={2}>
                                {pendingPrerequisites.map((prerequisite, index) => (
                                    <Text key={index} fontWeight="bold">• {prerequisite}</Text>
                                ))}
                            </Box>
                            <Text mt={2}>¿Deseas continuar igualmente?</Text>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                                <Button variant="outline">
                                    Cancelar
                                </Button>
                            </Dialog.ActionTrigger>
                            <Button colorScheme="red" onClick={onConfirm}>
                                Continuar
                            </Button>
                        </Dialog.Footer>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" position="absolute" right={2} top={2} />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}; 