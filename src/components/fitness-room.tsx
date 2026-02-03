
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell, Calendar, Clock, XCircle, Check, MapPin, PartyPopper, CalendarOff, Pencil, Trash2, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";
import { useAdminAccess } from "@/lib/use-admin-access";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import type { PageContent, ScheduleItem, EventItem } from "@/lib/types";
import { subscribeToPageContent, updatePageContent } from "@/lib/firestore-service";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Skeleton } from "./ui/skeleton";
import { getDormConfig } from "@/dorms/registry";

interface FitnessRoomProps {
    title?: string;
}

export default function FitnessRoom({ title = 'Fitness Room' }: FitnessRoomProps = {}) {
    const [dorm, setDorm] = useState<ReturnType<typeof getDormConfig> | null>(null);
    const pageId = dorm?.id === 'tabu' ? 'fitnessRoom' : 'fitnessRoom';
    
    const { isAdmin, userApartment } = useAdminAccess(pageId);
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
        if (!pageId) return;
        const unsubscribe = subscribeToPageContent(pageId, (data) => {
            setContent(data);
            setEditableContent(JSON.parse(JSON.stringify(data))); // Deep copy for editing
        });

        return () => unsubscribe();
    }, [pageId]);

    const parseEventDateTime = (event: EventItem) => {
        if (!event?.date) return null;
        const dateValue = event.date.trim();
        const timeValue = (event.time || "23:59").trim();
        let parsed: Date;
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
            parsed = new Date(`${dateValue}T${timeValue}`);
        } else {
            parsed = new Date(`${dateValue} ${timeValue}`.trim());
        }
        return Number.isNaN(parsed.getTime()) ? null : parsed;
    };

    const splitEvents = (current: PageContent) => {
        const upcoming = current.upcomingEvents || [];
        const passed = current.passedEvents || [];
        const passedIds = new Set(passed.map((event) => event.id));
        const now = Date.now();

        const expiredToMove: EventItem[] = [];
        const stillUpcoming: EventItem[] = [];

        for (const event of upcoming) {
            const eventDate = parseEventDateTime(event);
            if (eventDate && eventDate.getTime() <= now) {
                if (!passedIds.has(event.id)) {
                    expiredToMove.push(event);
                }
            } else {
                stillUpcoming.push(event);
            }
        }

        const normalizedPassed = [...expiredToMove, ...passed];

        return {
            expiredToMove,
            upcomingEvents: stillUpcoming,
            passedEvents: normalizedPassed,
        };
    };

    useEffect(() => {
        if (!content) return;
        const { expiredToMove, upcomingEvents, passedEvents } = splitEvents(content);
        if (!isAdmin || expiredToMove.length === 0) return;
        updatePageContent(pageId, { ...content, upcomingEvents, passedEvents }).catch(() => {
            toast({ title: "Error", description: "Failed to auto-move past events.", variant: "destructive" });
        });
    }, [content, isAdmin, pageId, toast]);

    const handleSave = async () => {
        if (!editableContent) return;
        try {
            await updatePageContent(pageId, editableContent);
            toast({
                title: "Success",
                description: "Content updated successfully.",
            });
            setIsEditDialogOpen(false);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update content.",
                variant: "destructive",
            });
        }
    };

    const handleFieldChange = (section: keyof PageContent, index: number, field: string, value: string) => {
        setEditableContent(prev => {
            if (!prev) return null;
            const newContent = { ...prev };
            const sectionData = newContent[section] as any[];
            if (sectionData && sectionData[index]) {
                sectionData[index] = { ...sectionData[index], [field]: value };
            }
            return newContent;
        });
    };
    
    const handleAddItem = (section: keyof PageContent) => {
        setEditableContent(prev => {
            if (!prev) return null;
            const newContent = { ...prev };
            const sectionData = newContent[section] as any[] || [];
            
            let newItem;
            if (section === 'schedule') {
                newItem = { day: '', hours: '' };
            } else if (section === 'upcomingEvents' || section === 'passedEvents') {
                newItem = { id: `new-${Date.now()}`, title: '', date: '', time: '', location: '' };
            } else {
                return prev;
            }
            
            newContent[section] = [...sectionData, newItem] as any;
            return newContent;
        });
    };

    const handleRemoveItem = (section: keyof PageContent, index: number) => {
        setEditableContent(prev => {
            if (!prev) return null;
            const newContent = { ...prev };
            const sectionData = newContent[section] as any[];
            if (sectionData) {
                sectionData.splice(index, 1);
            }
            return newContent;
        });
    };

    const handleAddPictureToEvent = (eventIndex: number, file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const base64 = e.target?.result as string;
            setEditableContent(prev => {
                if (!prev || !prev.passedEvents) return null;
                const newEvents = [...prev.passedEvents];
                const event = newEvents[eventIndex];
                if (event) {
                    event.pictures = [...(event.pictures || []), base64];
                }
                return { ...prev, passedEvents: newEvents };
            });
        };
        reader.readAsDataURL(file);
    };

    const handleRemovePictureFromEvent = (eventIndex: number, picIndex: number) => {
        setEditableContent(prev => {
            if (!prev || !prev.passedEvents) return null;
            const newEvents = [...prev.passedEvents];
            const event = newEvents[eventIndex];
            if (event && event.pictures) {
                event.pictures.splice(picIndex, 1);
            }
            return { ...prev, passedEvents: newEvents };
        });
    };

    if (!content) {
        return <FitnessRoomSkeleton />;
    }

    const { upcomingEvents, passedEvents } = splitEvents(content);

    return (
        <div className="flex flex-col items-center justify-start p-2 md:p-8 gap-6 md:gap-8 w-full">
            <Card className="w-full max-w-2xl shadow-lg relative">
                {isAdmin && (
                    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="icon" className="absolute top-2 right-2 md:top-4 md:right-4 h-8 w-8">
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Edit Details</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Edit Fitness Room Details</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-lg">Opening Hours</h3>
                                    {editableContent?.schedule?.map((item, index) => (
                                        <div key={index} className="flex items-end gap-2">
                                            <div className="grid-1/2 flex-grow">
                                                <Label>Day</Label>
                                                <Input value={item.day} onChange={e => handleFieldChange('schedule', index, 'day', e.target.value)} />
                                            </div>
                                            <div className="grid-1/2 flex-grow">
                                                <Label>Hours</Label>
                                                <Input value={item.hours} onChange={e => handleFieldChange('schedule', index, 'hours', e.target.value)} />
                                            </div>
                                            <Button variant="destructive" size="icon" onClick={() => handleRemoveItem('schedule', index)}><Trash2 className="h-4 w-4"/></Button>
                                        </div>
                                    ))}
                                    <Button variant="outline" onClick={() => handleAddItem('schedule')}>Add Hour</Button>
                                </div>
                                <Separator />
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-lg">Upcoming Events</h3>
                                    {editableContent?.upcomingEvents?.map((event, index) => (
                                         <div key={event.id} className="p-2 border rounded-md space-y-2 relative">
                                            <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={() => handleRemoveItem('upcomingEvents', index)}><Trash2 className="h-4 w-4"/></Button>
                                            <Label>Title</Label><Input value={event.title} onChange={e => handleFieldChange('upcomingEvents', index, 'title', e.target.value)}/>
                                            <Label>Date</Label><Input value={event.date} onChange={e => handleFieldChange('upcomingEvents', index, 'date', e.target.value)}/>
                                            <Label>Time</Label><Input value={event.time} onChange={e => handleFieldChange('upcomingEvents', index, 'time', e.target.value)}/>
                                            <Label>Location</Label><Input value={event.location} onChange={e => handleFieldChange('upcomingEvents', index, 'location', e.target.value)}/>
                                        </div>
                                    ))}
                                    <Button variant="outline" onClick={() => handleAddItem('upcomingEvents')}>Add Upcoming Event</Button>
                                </div>
                                 <Separator />
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-lg">Past Events</h3>
                                    {editableContent?.passedEvents?.map((event, index) => (
                                         <div key={event.id} className="p-2 border rounded-md space-y-2 relative">
                                            <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={() => handleRemoveItem('passedEvents', index)}><Trash2 className="h-4 w-4"/></Button>
                                            <Label>Title</Label><Input value={event.title} onChange={e => handleFieldChange('passedEvents', index, 'title', e.target.value)}/>
                                            <Label>Date</Label><Input value={event.date} onChange={e => handleFieldChange('passedEvents', index, 'date', e.target.value)}/>
                                            <Label>Description</Label><textarea className="w-full p-2 border rounded-md text-sm" rows={3} value={event.description || ''} onChange={e => handleFieldChange('passedEvents', index, 'description', e.target.value)} placeholder="Write a description of the event..."/>
                                            <div className="space-y-2">
                                                <Label>Event Pictures</Label>
                                                {event.pictures && event.pictures.length > 0 && (
                                                    <div className="grid grid-cols-3 gap-2">
                                                        {event.pictures.map((pic, picIndex) => (
                                                            <div key={picIndex} className="relative">
                                                                <img src={pic} alt={`Event pic ${picIndex}`} className="w-full h-24 object-cover rounded-md border" />
                                                                <Button variant="destructive" size="icon" className="absolute top-1 right-1 h-5 w-5" onClick={() => handleRemovePictureFromEvent(index, picIndex)}><Trash2 className="h-3 w-3"/></Button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                <Input type="file" accept="image/*" onChange={e => e.target.files?.[0] && handleAddPictureToEvent(index, e.target.files[0])} />
                                            </div>
                                        </div>
                                    ))}
                                     <Button variant="outline" onClick={() => handleAddItem('passedEvents')}>Add Past Event</Button>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                                <Button onClick={handleSave}>Save Changes</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )}
                <CardHeader className="text-center bg-muted/30">
                    <div className="flex justify-center items-center gap-3 mb-2">
                        <Dumbbell className="h-8 md:h-10 w-8 md:w-10 text-primary" />
                        <CardTitle className="text-2xl md:text-3xl font-bold font-headline tracking-tight">
                            {title}
                        </CardTitle>
                    </div>
                    <CardDescription className="text-base md:text-lg">Opening Hours</CardDescription>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                    <ul className="space-y-3">
                        {content.schedule?.map((item) => {
                            const isClosed = item.hours === 'Closed';
                            return (
                                <li key={item.day} className={cn(
                                    "flex items-center justify-between p-3 md:p-4 bg-background rounded-lg shadow-sm border border-border/50 transition-all",
                                    isClosed ? "opacity-60" : "hover:border-primary/50 hover:bg-muted/50"
                                )}>
                                    <div className="flex items-center gap-3">
                                        <Calendar className={cn("h-5 w-5", isClosed ? "text-muted-foreground" : "text-primary/80")} />
                                        <span className="text-base md:text-lg font-medium">{item.day}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {isClosed ? (
                                            <XCircle className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                        )}
                                        <span className={cn(
                                            "text-base md:text-lg font-mono text-sm",
                                            isClosed ? "text-muted-foreground" : "text-foreground"
                                        )}>
                                            {item.hours}
                                        </span>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </CardContent>
            </Card>

            <Separator className="my-2 md:my-4 w-full max-w-2xl" />

             <Card className="w-full max-w-2xl shadow-lg">
                <CardHeader>
                    <div className="flex items-center gap-3">
                         <PartyPopper className="h-6 md:h-8 w-6 md:w-8 text-primary" />
                        <CardTitle className="text-xl md:text-2xl font-bold font-headline">Upcoming Events</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-3">
                        {upcomingEvents?.map((event) => (
                            <li key={event.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 md:p-4 bg-background rounded-lg border border-border/50">
                                <span className="font-semibold text-base md:text-lg">{event.title}</span>
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs md:text-sm text-muted-foreground mt-2 sm:mt-0">
                                    <div className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {event.date}</div>
                                    <div className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {event.time}</div>
                                    <div className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {event.location}</div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>

            <Card className="w-full max-w-2xl shadow-lg opacity-70">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <CalendarOff className="h-6 md:h-8 w-6 md:w-8 text-muted-foreground" />
                        <CardTitle className="text-xl md:text-2xl font-bold font-headline">Past Events</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                        {passedEvents?.map((event) => (
                            <li key={event.id} className="border-l-4 border-green-500 pl-4 pb-4">
                                <div className="flex items-start gap-3 mb-2">
                                    <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-base md:text-lg">{event.title}</h4>
                                        <p className="text-xs md:text-sm text-muted-foreground">{event.date}</p>
                                    </div>
                                </div>
                                {event.description && (
                                    <p className="text-sm text-muted-foreground mb-3 ml-8">{event.description}</p>
                                )}
                                {event.pictures && event.pictures.length > 0 && (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 ml-8 mt-3">
                                        {event.pictures.map((pic, picIndex) => (
                                            <img key={picIndex} src={pic} alt={`Event ${event.title}`} className="w-full h-32 object-cover rounded-md shadow-sm hover:shadow-md transition-shadow" />
                                        ))}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}

function FitnessRoomSkeleton() {
    return (
        <div className="flex flex-col items-center justify-start p-4 md:p-8 gap-8 w-full">
            <Card className="w-full max-w-2xl shadow-lg">
                <CardHeader className="text-center bg-muted/30">
                    <div className="flex justify-center items-center gap-3 mb-2">
                        <Dumbbell className="h-10 w-10 text-primary" />
                        <CardTitle className="text-3xl font-bold font-headline tracking-tight">Fitness Room</CardTitle>
                    </div>
                    <CardDescription className="text-lg">Opening Hours</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="space-y-4">
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                    </div>
                </CardContent>
            </Card>
            <Separator className="my-4 w-full max-w-2xl" />
            <Card className="w-full max-w-2xl shadow-lg">
                <CardHeader><Skeleton className="h-8 w-48" /></CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </CardContent>
            </Card>
            <Card className="w-full max-w-2xl shadow-lg">
                <CardHeader><Skeleton className="h-8 w-48" /></CardHeader>
                <CardContent className="space-y-3">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                </CardContent>
            </Card>
        </div>
    );
}

    