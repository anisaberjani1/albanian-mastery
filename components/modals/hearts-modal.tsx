'use client';
import Image from "next/image";
import { useRouter } from "next/navigation";
import{
    Dialog, DialogContent,
    DialogDescription,
    DialogFooter,  DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useHeartsModal } from "@/store/use-hearts-modal";


export const HeartsModal = () => {
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    const { isOpen, close } = useHeartsModal();

    useEffect(() => setIsClient(true), []); 

    const onClick = () => {
        close();
        router.push("/shop");
    }

    if(!isClient){
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={close}>
            <DialogContent className="max-w-md rounded-2xl border border-border shadow-lg bg-white">
                <DialogHeader className="flex flex-col items-center text-center space-y-3">

                        <Image src='/mascot_bad.png' alt="Mascot" height={90} width={90}/>

                    <DialogTitle className="text-center font-bold text-2xl text-foreground">You’ve out of hearts</DialogTitle>
                    <DialogDescription className="text-center text-base text-muted-foreground">
                        You’ve used all your hearts. Use your points to buy more or keep practicing to earn them back.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex flex-col gap-3 w-full mt-6">
                        <Button variant="primary" className="w-full" size='sm' onClick={onClick}>
                            Buy hearts with points
                        </Button>
                        <Button variant="primaryOutline" className="w-full" size='sm' onClick={close}>
                            Keep practicing
                        </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
};