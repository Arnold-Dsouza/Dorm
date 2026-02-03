
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Pencil, Trash2, Phone, Mail, Home } from "lucide-react";
import { useAdminAccess } from "@/lib/use-admin-access";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import type { PageContent, ManagerItem } from "@/lib/types";
import { subscribeToPageContent, updatePageContent } from "@/lib/firestore-service";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Skeleton } from "./ui/skeleton";
import { Separator } from "./ui/separator";
import { getDormConfig } from "@/dorms/registry";

export default function PropertyManagement() {
    const [dorm, setDorm] = useState<ReturnType<typeof getDormConfig> | null>(null);
    const pageId = 'propertyManagement';
    
    const { isAdmin } = useAdminAccess(pageId);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [content, setContent] = useState<PageContent | null>(null);
    const [editableContent, setEditableContent] = useState<PageContent | null>(null);
    const { toast } = useToast();

    // Load dorm from localStorage
    useEffect(() => {
        const selectedDormId = localStorage.getItem('selectedDorm');
        setDorm(getDormConfig(selectedDormId || undefined));
    }, []);

    useEffect(() => {
        const unsubscribe = subscribeToPageContent(pageId, (data) => {
            setContent(data);
            setEditableContent(JSON.parse(JSON.stringify(data))); // Deep copy for editing
        });
        return () => unsubscribe();
    }, []);

    const handleSave = async () => {
        if (!editableContent) return;
        try {
            await updatePageContent(pageId, editableContent);
            toast({ title: "Success", description: "Content updated successfully." });
            setIsEditDialogOpen(false);
        } catch (error) {
            toast({ title: "Error", description: "Failed to update content.", variant: "destructive" });
        }
    };
    
    const handleManagerChange = (index: number, field: keyof ManagerItem, value: string) => {
        setEditableContent(prev => {
            if (!prev || !prev.managers) return null;
            const newManagers = [...prev.managers];
            newManagers[index] = { ...newManagers[index], [field]: value };
            return { ...prev, managers: newManagers };
        });
    };

    const handleAddManager = () => {
        setEditableContent(prev => {
            if (!prev) return null;
            const newManager: ManagerItem = { id: `new-${Date.now()}`, name: '', house: '', email: '', phone: '' };
            return { ...prev, managers: [...(prev.managers || []), newManager] };
        });
    };

    const handleRemoveManager = (index: number) => {
        setEditableContent(prev => {
            if (!prev || !prev.managers) return null;
            const newManagers = [...prev.managers];
            newManagers.splice(index, 1);
            return { ...prev, managers: newManagers };
        });
    };
    
    const handleSimpleFieldChange = (field: 'changeOfResponsibility', value: string) => {
        setEditableContent(prev => prev ? { ...prev, [field]: value } : null);
    };

    if (!content) {
        return (
            <div className="p-4 sm:p-6 md:p-8 w-full">
                <Card className="w-full max-w-4xl mx-auto shadow-lg">
                    <CardHeader>
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                        <Skeleton className="h-32 w-full" />
                        <Skeleton className="h-32 w-full" />
                        <Skeleton className="h-32 w-full" />
                        <Skeleton className="h-32 w-full" />
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    return (
        <div className="flex flex-col items-center justify-start p-4 sm:p-6 md:p-8 gap-6 w-full">
            <Card className="w-full max-w-4xl shadow-lg relative">
                {isAdmin && (
                    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="icon" className="absolute top-2 right-2 md:top-4 md:right-4 h-8 w-8">
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Edit Details</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                            <DialogHeader><DialogTitle>Edit Property Management</DialogTitle></DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label>Change of Responsibility Note</Label>
                                    <Input value={editableContent?.changeOfResponsibility || ''} onChange={e => handleSimpleFieldChange('changeOfResponsibility', e.target.value)} />
                                </div>
                                <Separator />
                                <h3 className="font-semibold text-lg">Managers</h3>
                                {editableContent?.managers?.map((manager, index) => (
                                    <div key={manager.id || index} className="p-4 border rounded-md space-y-2 relative">
                                        <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => handleRemoveManager(index)}>
                                            <Trash2 className="h-4 w-4"/>
                                        </Button>
                                        <div><Label>Name</Label><Input value={manager.name} onChange={e => handleManagerChange(index, 'name', e.target.value)} /></div>
                                        <div><Label>House</Label><Input value={manager.house} onChange={e => handleManagerChange(index, 'house', e.target.value)} /></div>
                                        <div><Label>Email</Label><Input value={manager.email} onChange={e => handleManagerChange(index, 'email', e.target.value)} /></div>
                                        <div><Label>Phone</Label><Input value={manager.phone} onChange={e => handleManagerChange(index, 'phone', e.target.value)} /></div>
                                    </div>
                                ))}
                                <Button variant="outline" onClick={handleAddManager}>Add Manager</Button>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                                <Button onClick={handleSave}>Save Changes</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )}
                <CardHeader>
                    <CardTitle className="text-2xl md:text-3xl font-bold font-headline tracking-tight">Property Management</CardTitle>
                    <CardDescription className="text-sm md:text-base">{content.changeOfResponsibility}</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {content.managers?.map((manager) => (
                        <div key={manager.id} className="flex flex-col p-4 bg-background rounded-lg border border-border/50 hover:border-primary/50 hover:bg-muted/50 transition-all">
                            <h3 className="text-lg font-semibold">{manager.name}</h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-2"><Home className="h-4 w-4" />{manager.house}</p>
                            <Separator className="my-3" />
                            <div className="space-y-2 text-sm break-all">
                                <a href={`mailto:${manager.email}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                                    <Mail className="h-4 w-4 flex-shrink-0" />
                                    <span>{manager.email}</span>
                                </a>
                                <a href={`tel:${manager.phone}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                                    <Phone className="h-4 w-4 flex-shrink-0" />
                                    <span>{manager.phone}</span>
                                </a>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
