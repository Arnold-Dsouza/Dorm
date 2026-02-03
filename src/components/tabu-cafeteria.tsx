
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Utensils, Calendar, Clock, XCircle, MapPin, PartyPopper, CalendarOff, BookOpen, Check, Gift, Pencil, Trash2, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";
import { useAdminAccess } from "@/lib/use-admin-access";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import type { PageContent, EventItem } from "@/lib/types";
import { subscribeToPageContent, updatePageContent } from "@/lib/firestore-service";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Skeleton } from "./ui/skeleton";
import { getDormConfig } from "@/dorms/registry";

interface TabuCafeteriaProps {
    title?: string;
}

export default function TabuCafeteria({ title = 'Cafeteria' }: TabuCafeteriaProps = {}) {
    const [dorm, setDorm] = useState<ReturnType<typeof getDormConfig> | null>(null);
    const pageId = dorm?.id === 'tabu' ? 'tabuCafeteria' : 'cafeteria';
    
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
            setEditableContent(JSON.parse(JSON.stringify(data)));
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
            toast({ title: "Success", description: "Content updated successfully." });
            setIsEditDialogOpen(false);
        } catch (error) {
            toast({ title: "Error", description: "Failed to update content.", variant: "destructive" });
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
            if (section === 'schedule') newItem = { day: '', hours: '' };
            else if (section === 'specialMenu' || section === 'usualMenu') newItem = { id: `new-${Date.now()}`, name: '', price: '' };
            else if (section === 'upcomingEvents' || section === 'passedEvents') newItem = { id: `new-${Date.now()}`, title: '', date: '', time: '', location: '' };
            else return prev;
            newContent[section] = [...sectionData, newItem] as any;
            return newContent;
        });
    };

    const handleRemoveItem = (section: keyof PageContent, index: number) => {
        setEditableContent(prev => {
            if (!prev) return null;
            const newContent = { ...prev };
            const sectionData = newContent[section] as any[];
            if (sectionData) sectionData.splice(index, 1);
            return newContent;
        });
    };

    const handleSimpleFieldChange = (field: 'privatePartiesContact', value: string) => {
        setEditableContent(prev => prev ? { ...prev, [field]: value } : null);
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
        return <TabuCafeteriaSkeleton />;
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
                            <DialogHeader><DialogTitle>Edit Tabu Cafeteria Details</DialogTitle></DialogHeader>
                             <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-lg">Opening Hours</h3>
                                    {editableContent?.schedule?.map((item, index) => (
                                        <div key={index} className="flex items-end gap-2">
                                            <div className="flex-grow"><Label>Day</Label><Input value={item.day} onChange={e => handleFieldChange('schedule', index, 'day', e.target.value)} /></div>
                                            <div className="flex-grow"><Label>Hours</Label><Input value={item.hours} onChange={e => handleFieldChange('schedule', index, 'hours', e.target.value)} /></div>
                                            <Button variant="destructive" size="icon" onClick={() => handleRemoveItem('schedule', index)}><Trash2 className="h-4 w-4"/></Button>
                                        </div>
                                    ))}
                                    <Button variant="outline" onClick={() => handleAddItem('schedule')}>Add Hour</Button>
                                </div>
                                <Separator/>
                                <div className="space-y-2"><h3 className="font-semibold text-lg">Special Menu</h3>
                                {editableContent?.specialMenu?.map((item, index) => (
                                    <div key={item.id} className="flex items-end gap-2">
                                        <div className="flex-grow"><Label>Name</Label><Input value={item.name} onChange={e => handleFieldChange('specialMenu', index, 'name', e.target.value)}/></div>
                                        <div className="w-1/4"><Label>Price</Label><Input value={item.price} onChange={e => handleFieldChange('specialMenu', index, 'price', e.target.value)}/></div>
                                        <Button variant="destructive" size="icon" onClick={() => handleRemoveItem('specialMenu', index)}><Trash2 className="h-4 w-4"/></Button>
                                    </div>
                                ))}
                                <Button variant="outline" onClick={() => handleAddItem('specialMenu')}>Add Special Item</Button></div>
                                <Separator/>
                                <div className="space-y-2"><h3 className="font-semibold text-lg">Usual Menu</h3>
                                {editableContent?.usualMenu?.map((item, index) => (
                                    <div key={item.id} className="flex items-end gap-2">
                                        <div className="flex-grow"><Label>Name</Label><Input value={item.name} onChange={e => handleFieldChange('usualMenu', index, 'name', e.target.value)}/></div>
                                        <div className="w-1/4"><Label>Price</Label><Input value={item.price} onChange={e => handleFieldChange('usualMenu', index, 'price', e.target.value)}/></div>
                                        <Button variant="destructive" size="icon" onClick={() => handleRemoveItem('usualMenu', index)}><Trash2 className="h-4 w-4"/></Button>
                                    </div>
                                ))}
                                <Button variant="outline" onClick={() => handleAddItem('usualMenu')}>Add Usual Item</Button></div>
                                <Separator/>
                                <div className="space-y-2"><h3 className="font-semibold text-lg">Upcoming Events</h3>
                                {editableContent?.upcomingEvents?.map((event, index) => (
                                    <div key={event.id} className="p-2 border rounded-md space-y-2 relative">
                                        <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={() => handleRemoveItem('upcomingEvents', index)}><Trash2 className="h-4 w-4"/></Button>
                                        <Label>Title</Label><Input value={event.title} onChange={e => handleFieldChange('upcomingEvents', index, 'title', e.target.value)}/>
                                        <Label>Date</Label><Input value={event.date} onChange={e => handleFieldChange('upcomingEvents', index, 'date', e.target.value)}/>
                                        <Label>Time</Label><Input value={event.time} onChange={e => handleFieldChange('upcomingEvents', index, 'time', e.target.value)}/>
                                        <Label>Location</Label><Input value={event.location} onChange={e => handleFieldChange('upcomingEvents', index, 'location', e.target.value)}/>
                                    </div>
                                ))}
                                <Button variant="outline" onClick={() => handleAddItem('upcomingEvents')}>Add Upcoming Event</Button></div>
                                <Separator/>
                                <div className="space-y-2"><h3 className="font-semibold text-lg">Past Events</h3>
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
                                <Button variant="outline" onClick={() => handleAddItem('passedEvents')}>Add Past Event</Button></div>
                                <Separator/>
                                <div className="space-y-2"><Label>Private Parties Contact</Label><Input value={editableContent?.privatePartiesContact || ''} onChange={e => handleSimpleFieldChange('privatePartiesContact', e.target.value)}/></div>
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
                        <Utensils className="h-8 md:h-10 w-8 md:w-10 text-primary" />
                        <CardTitle className="text-2xl md:text-3xl font-bold font-headline tracking-tight">{title}</CardTitle>
                    </div>
                    <CardDescription className="text-base md:text-lg">Opening Hours</CardDescription>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                    <ul className="space-y-3">
                        {content.schedule?.map((item) => (
                            <li key={item.day} className="flex items-center justify-between p-3 md:p-4 bg-background rounded-lg shadow-sm border border-border/50 transition-all hover:border-primary/50 hover:bg-muted/50">
                                <div className="flex items-center gap-3"><Calendar className="h-5 w-5 text-primary/80" />
                                <span className="text-base md:text-lg font-medium">{item.day}</span></div>
                                <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-base md:text-lg font-mono text-foreground">{item.hours}</span></div>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>

            <Separator className="my-2 md:my-4 w-full max-w-2xl" />

            <Card className="w-full max-w-4xl shadow-lg">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <BookOpen className="h-6 md:h-8 w-6 md:w-8 text-primary" />
                        <CardTitle className="text-xl md:text-2xl font-bold font-headline">Menu for the Day</CardTitle>
                    </div>
                    <CardDescription>Seasonal, cold, and made with love</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                        <div>
                            <h3 className="text-lg md:text-xl font-bold mb-4 text-center text-white bg-yellow-500 rounded-md py-2">SPECIAL MENU</h3>
                            <ul className="space-y-3">{content.specialMenu?.map((item) => (
                                <li key={item.id} className="flex justify-between items-baseline border-b border-dashed pb-2">
                                    <span className="font-medium text-sm md:text-base">{item.name}</span>
                                    <span className="font-mono text-muted-foreground text-sm md:text-base">{item.price}</span>
                                </li>))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg md:text-xl font-bold mb-4 text-center text-white bg-yellow-500 rounded-md py-2">USUAL MENU</h3>
                            <ul className="space-y-3">{content.usualMenu?.map((item) => (
                                <li key={item.id} className="flex justify-between items-baseline border-b border-dashed pb-2">
                                    <span className="font-medium text-sm md:text-base">{item.name}</span>
                                    <span className="font-mono text-muted-foreground text-sm md:text-base">{item.price}</span>
                                </li>))}
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="w-full max-w-2xl shadow-lg">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <PartyPopper className="h-6 md:h-8 w-6 md:w-8 text-primary" />
                        <CardTitle className="text-xl md:text-2xl font-bold font-headline">Upcoming Events</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>{upcomingEvents && upcomingEvents.length > 0 ? (
                    <ul className="space-y-3">{upcomingEvents.map((event) => (
                        <li key={event.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 md:p-4 bg-background rounded-lg border border-border/50">
                            <span className="font-semibold text-base md:text-lg">{event.title}</span>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs md:text-sm text-muted-foreground mt-2 sm:mt-0">
                                <div className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {event.date}</div>
                                <div className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {event.time}</div>
                                <div className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {event.location}</div>
                            </div>
                        </li>))}
                    </ul>) : (
                    <p className="text-muted-foreground text-center">No upcoming events scheduled.</p>)}
                </CardContent>
            </Card>

            <Card className="w-full max-w-2xl shadow-lg opacity-70">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <CalendarOff className="h-6 md:h-8 w-6 md:w-8 text-muted-foreground" />
                        <CardTitle className="text-xl md:text-2xl font-bold font-headline">Past Events</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>{passedEvents && passedEvents.length > 0 ? (
                    <ul className="space-y-4">{passedEvents.map((event) => (
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
                        </li>))}
                    </ul>) : (
                    <p className="text-muted-foreground text-center">No past events to show.</p>)}
                </CardContent>
            </Card>

            <Card className="w-full max-w-2xl shadow-lg">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Gift className="h-6 md:h-8 w-6 md:w-8 text-primary" />
                        <CardTitle className="text-xl md:text-2xl font-bold font-headline">Private Parties</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-muted-foreground p-2 md:p-4 text-sm md:text-base">
                        To rent the cafeteria for a private party, please contact {content.privatePartiesContact || 'ABC'}.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}


function TabuCafeteriaSkeleton() {
    return (
        <div className="flex flex-col items-center justify-start p-4 md:p-8 gap-8 w-full">
            <Card className="w-full max-w-2xl shadow-lg"><CardHeader className="text-center bg-muted/30"><div className="flex justify-center items-center gap-3 mb-2"><Utensils className="h-10 w-10 text-primary" /><CardTitle className="text-3xl font-bold font-headline tracking-tight">Tabu Cafeteria</CardTitle></div><CardDescription className="text-lg">Opening Hours</CardDescription></CardHeader><CardContent className="p-6"><div className="space-y-4"><Skeleton className="h-16 w-full" /><Skeleton className="h-16 w-full" /></div></CardContent></Card>
            <Separator className="my-4 w-full max-w-2xl" />
            <Card className="w-full max-w-4xl shadow-lg"><CardHeader><Skeleton className="h-8 w-48" /></CardHeader><CardContent><div className="grid md:grid-cols-2 gap-8"><div><Skeleton className="h-10 w-full mb-4" /><Skeleton className="h-8 w-full mb-2" /><Skeleton className="h-8 w-full" /></div><div><Skeleton className="h-10 w-full mb-4" /><Skeleton className="h-8 w-full mb-2" /><Skeleton className="h-8 w-full" /></div></div></CardContent></Card>
            <Card className="w-full max-w-2xl shadow-lg"><CardHeader><Skeleton className="h-8 w-48" /></CardHeader><CardContent className="space-y-4"><Skeleton className="h-12 w-full" /></CardContent></Card>
        </div>
    );
}

    