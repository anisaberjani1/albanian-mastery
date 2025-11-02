'use client';
import Image from "next/image";
import{
    Dialog, DialogContent,
    DialogDescription,
    DialogFooter,  DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { usePracticeModal } from "@/store/use-practice-modal";


export const PracticeModal = () => {
    const [isClient, setIsClient] = useState(false);
    const { isOpen, close } = usePracticeModal();

    useEffect(() => setIsClient(true), []); 

    if(!isClient){
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={close}>
            <DialogContent className="max-w-md rounded-2xl border border-border bg-white shadow-lg">
                <DialogHeader className="space-y-3">
                    <div className="flex justify-center">
                        <Image src='/heart.png' alt="Heart" height={90} width={90}/>
                    </div>
                    <DialogTitle className="text-center font-bold text-2xl text-foreground">Practice lesson</DialogTitle>
                    <DialogDescription className="text-center text-base text-muted-foreground">
                        Use practice lessons to regain hearts and points. You cannot lose hearts or points in practice lessons.
                    </DialogDescription>

                </DialogHeader>
                <DialogFooter className="flex flex-col gap-3 w-full mt-6">
                        <Button variant="primary" className="w-full" size='lg' onClick={close}>
                            Start practice
                        </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
};