
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Mail, Phone, AlertCircle, Zap, Wifi, Lock, Pencil, Trash2, Plus } from "lucide-react";
import { useAdminAccess } from "@/lib/use-admin-access";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import type { PageContent, ManagerItem, CompletedTask } from "@/lib/types";
import { subscribeToPageContent, updatePageContent } from "@/lib/firestore-service";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Skeleton } from "./ui/skeleton";
import { Separator } from "./ui/separator";
import { getDormConfig } from "@/dorms/registry";

interface NetworkMentorProps {
    title?: string;
}

export default function NetworkMentor({ title = 'Network Mentors' }: NetworkMentorProps = {}) {
    const [dorm, setDorm] = useState<ReturnType<typeof getDormConfig> | null>(null);
    const pageId = 'networkMentor';
    
    const { isAdmin } = useAdminAccess(pageId);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
    const [content, setContent] = useState<PageContent | null>(null);
    const [editableContent, setEditableContent] = useState<PageContent | null>(null);
    const [newTask, setNewTask] = useState({ issue: '', resolution: '' });
    const { toast } = useToast();

    // Load dorm from localStorage
    useEffect(() => {
        const selectedDormId = localStorage.getItem('selectedDorm');
        setDorm(getDormConfig(selectedDormId || undefined));
    }, []);

    useEffect(() => {
        const unsubscribe = subscribeToPageContent(pageId, (data) => {
            setContent(data);
            setEditableContent(JSON.parse(JSON.stringify(data)));
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
            const newManager: ManagerItem = { 
                id: `mentor-${Date.now()}`, 
                name: '', 
                house: 'Network Mentor', 
                email: '', 
                phone: '' 
            };
            return { ...prev, managers: [...(prev.managers || []), newManager] };
        });
    };

    const handleRemoveManager = (index: number) => {
        setEditableContent(prev => {
            if (!prev || !prev.managers) return null;
            const newManagers = prev.managers.filter((_, i) => i !== index);
            return { ...prev, managers: newManagers };
        });
    };

    const handleAddTask = async () => {
        if (!content || !newTask.issue.trim() || !newTask.resolution.trim()) {
            toast({ title: "Error", description: "Please fill in both issue and resolution.", variant: "destructive" });
            return;
        }
        try {
            const task: CompletedTask = {
                id: `task-${Date.now()}`,
                issue: newTask.issue,
                resolution: newTask.resolution,
                timestamp: Date.now(),
            };
            const updatedTasks = [...(content.completedTasks || []), task];
            await updatePageContent(pageId, { ...content, completedTasks: updatedTasks });
            toast({ title: "Success", description: "Completed task added successfully." });
            setNewTask({ issue: '', resolution: '' });
            setIsAddTaskDialogOpen(false);
        } catch (error) {
            toast({ title: "Error", description: "Failed to add task.", variant: "destructive" });
        }
    };

    const handleRemoveTask = async (taskId: string) => {
        if (!content) return;
        try {
            const updatedTasks = content.completedTasks?.filter(t => t.id !== taskId) || [];
            await updatePageContent(pageId, { ...content, completedTasks: updatedTasks });
            toast({ title: "Success", description: "Task removed successfully." });
        } catch (error) {
            toast({ title: "Error", description: "Failed to remove task.", variant: "destructive" });
        }
    };

    if (!content) {
        return <NetworkMentorSkeleton />;
    }

    const commonIssues = [
        { icon: Wifi, title: "WiFi Connection", solution: "Check your WiFi credentials in settings. Ensure you're connected to the correct network. Restart your router if needed." },
        { icon: Zap, title: "Slow Internet", solution: "Move closer to the router. Check if too many devices are connected. Contact network support if issues persist." },
        { icon: Lock, title: "Connection Issues", solution: "Verify your network password is correct. Try connecting to a different network to test. Clear DNS cache if applicable." },
        { icon: AlertCircle, title: "Network Timeout", solution: "Check your connection speed. Restart your device. Update your network drivers if on Windows/Linux." },
    ];

    return (
        <div className="flex flex-col items-center justify-start p-2 md:p-8 gap-6 md:gap-8 w-full">
            {isAdmin && (
                <Dialog open={isAddTaskDialogOpen} onOpenChange={setIsAddTaskDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Add Completed Task
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Add Completed Task</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label>Issue</Label>
                                <Input 
                                    placeholder="Describe the issue..." 
                                    value={newTask.issue} 
                                    onChange={e => setNewTask({ ...newTask, issue: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Resolution</Label>
                                <textarea 
                                    className="w-full p-2 border rounded-md text-sm"
                                    rows={4}
                                    placeholder="Describe how it was resolved..."
                                    value={newTask.resolution}
                                    onChange={e => setNewTask({ ...newTask, resolution: e.target.value })}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddTaskDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleAddTask}>Add Task</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {isAdmin && content?.completedTasks && content.completedTasks.length > 0 && (
                <Card className="w-full max-w-4xl shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                            <AlertCircle className="h-6 w-6 text-primary" />
                            Resolved Issues (Only visible to admins)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6">
                        <div className="space-y-4">
                            {content.completedTasks.map((task) => (
                                <div key={task.id} className="border rounded-lg p-4 bg-muted/20 relative">
                                    {isAdmin && (
                                        <Button 
                                            variant="destructive" 
                                            size="icon" 
                                            className="absolute top-2 right-2 h-8 w-8"
                                            onClick={() => handleRemoveTask(task.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                    <h4 className="font-semibold text-primary mb-2">{task.issue}</h4>
                                    <p className="text-sm text-muted-foreground">{task.resolution}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

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
                            <DialogHeader><DialogTitle>Edit Network Mentors</DialogTitle></DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <h3 className="font-semibold text-lg">Help Section Content</h3>
                                        <Label>Description</Label>
                                        <textarea className="w-full p-2 border rounded-md text-sm" rows={4} value={editableContent?.helpDescription || ''} onChange={e => setEditableContent(prev => prev ? { ...prev, helpDescription: e.target.value } : null)}/>
                                        <Label>Response Time</Label>
                                        <Input value={editableContent?.helpResponseTime || ''} onChange={e => setEditableContent(prev => prev ? { ...prev, helpResponseTime: e.target.value } : null)}/>
                                        <Label>Office Hours</Label>
                                        <Input value={editableContent?.helpOfficeHours || ''} onChange={e => setEditableContent(prev => prev ? { ...prev, helpOfficeHours: e.target.value } : null)}/>
                                    </div>
                                    <Separator />
                                    <div className="space-y-2">
                                        <h3 className="font-semibold text-lg">Mentors</h3>
                                        {editableContent?.managers?.map((mentor, index) => (
                                            <div key={mentor.id} className="p-3 border rounded-md space-y-2 relative">
                                                <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={() => handleRemoveManager(index)}><Trash2 className="h-4 w-4"/></Button>
                                                <Label>Name</Label><Input value={mentor.name} onChange={e => handleManagerChange(index, 'name', e.target.value)}/>
                                                <Label>Email</Label><Input value={mentor.email} onChange={e => handleManagerChange(index, 'email', e.target.value)}/>
                                                <Label>Phone</Label><Input value={mentor.phone} onChange={e => handleManagerChange(index, 'phone', e.target.value)}/>
                                            </div>
                                        ))}
                                        <Button variant="outline" onClick={handleAddManager}>Add Mentor</Button>
                                    </div>
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
                        <Users className="h-8 md:h-10 w-8 md:w-10 text-primary" />
                        <CardTitle className="text-2xl md:text-3xl font-bold font-headline tracking-tight">{title}</CardTitle>
                    </div>
                    <CardDescription className="text-base md:text-lg">Get help with network issues from our mentor team</CardDescription>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {content.managers?.map((mentor: ManagerItem) => (
                            <div key={mentor.id} className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                <h3 className="font-semibold text-lg text-primary mb-3">{mentor.name}</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <a href={`mailto:${mentor.email}`} className="text-sm hover:underline text-blue-500">
                                            {mentor.email}
                                        </a>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <a href={`tel:${mentor.phone}`} className="text-sm hover:underline text-blue-500">
                                            {mentor.phone}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Separator className="my-2 md:my-4 w-full max-w-4xl" />

            <Card className="w-full max-w-4xl shadow-lg">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <AlertCircle className="h-6 md:h-8 w-6 md:w-8 text-primary" />
                        <CardTitle className="text-xl md:text-2xl font-bold font-headline">Common Network Issues & Solutions</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {commonIssues.map((issue, index) => {
                            const IconComponent = issue.icon;
                            return (
                                <div key={index} className="p-4 border rounded-lg bg-background hover:bg-muted/30 transition-colors">
                                    <div className="flex items-center gap-3 mb-2">
                                        <IconComponent className="h-5 w-5 text-primary" />
                                        <h4 className="font-semibold">{issue.title}</h4>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{issue.solution}</p>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            <Card className="w-full max-w-4xl shadow-lg">
                <CardHeader>
                    <CardTitle>Need Immediate Help?</CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                    <p className="text-muted-foreground mb-4">
                        {content.helpDescription}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Response time: {content.helpResponseTime} | Office hours: {content.helpOfficeHours}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

function NetworkMentorSkeleton() {
    return (
        <div className="flex flex-col items-center justify-start p-4 md:p-8 gap-8 w-full">
            <Card className="w-full max-w-4xl shadow-lg">
                <CardHeader className="text-center bg-muted/30">
                    <Skeleton className="h-10 w-48 mx-auto mb-2" />
                    <Skeleton className="h-6 w-64 mx-auto" />
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-32 w-full" />
                        ))}
                    </div>
                </CardContent>
            </Card>
            <Separator className="my-4 w-full max-w-4xl" />
            <Card className="w-full max-w-4xl shadow-lg">
                <CardHeader><Skeleton className="h-8 w-64" /></CardHeader>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <Skeleton key={i} className="h-24 w-full" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
