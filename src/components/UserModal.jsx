import { useState, useEffect, useRef } from "react";
import useDataStore from "@/store/Store";
import { useCookies } from 'react-cookie';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// import { contactFormAction } from '@/lib/actions'
import { Check } from "lucide-react";

export default function Usermodal() {
    const container = useRef(null);
    const [open, setOpen] = useState(true);
    const [name, setName] = useState("");
    const [cookies, setCookies] = useCookies(['name']);

    const nameStore = useDataStore((state) => state.name);
    const addNameStore = useDataStore((state) => state.setName);

    const handleName = (e) => {
        e.preventDefault();
        addNameStore(name);
        setCookies('name', name, { path: '/' });
    };

    useEffect(() => {
        if (cookies.name) {
            addNameStore(cookies.name);
        }

        if (!nameStore) {
            setOpen(true);
        } else {
            setOpen(false);
            setTimeout(() => {
                container.current.style.display = "none";
            }, 500);
        }
    }, [cookies.name, nameStore]);
    return (
        <div ref={container} className={`absolute ease-in-out inset-0 flex items-center justify-center`}>
            <div className={`absolute inset-0 transition-all ${open ? "opacity-100 bg-background bg-opacity-50  backdrop-blur-md" : "opacity-0"}`}></div>
            <Card className={cn("relative z-10 w-full max-w-md bg-background transition-all ease-in-out", open ? "opacity-100 scale-100" : "opacity-0 scale-0")}>
                <CardHeader>
                    <CardTitle className="text-white">Selamat datang di Boedin chat!</CardTitle>
                    <CardDescription className="text-white">Boleh tau nama Anda siapa?</CardDescription>
                </CardHeader>
                <form>
                    <CardContent className="flex flex-col gap-6">
                        <div className="group/field grid gap-2">
                            <Label htmlFor="name" className="group-data-[invalid=true]/field:text-destructive text-white">
                                Nama{" "}
                                <span aria-hidden="true" className="text-destructive">
                                    *
                                </span>
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="Fathin"
                                className="group-data-[invalid=true]/field:border-destructive focus-visible:group-data-[invalid=true]/field:ring-destructive border-white text-white"
                                onChange={(e) => setName(e.target.value)}
                                aria-errormessage="error-name"
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" size="sm" disabled={false} onClick={handleName}>
                            Submit sekarang!
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
