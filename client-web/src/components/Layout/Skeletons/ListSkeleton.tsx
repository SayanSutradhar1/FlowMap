import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";


const ListSkeleton = ({ length = 5 }: { length?: number }) => {
    return (
        <div className="space-y-6 w-full overflow-x-hidden">

            {/* Expenses List Skeleton */}
            <Card className="glass-card border-border/50">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-7 w-40" />
                        <Skeleton className="h-5 w-32" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {[...Array(length)].map((_, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between p-4 rounded-xl bg-card border border-border/40"
                            >
                                <div className="flex items-center gap-4">
                                    <Skeleton className="w-12 h-12 rounded-xl" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-5 w-48" />
                                        <div className="flex gap-2">
                                            <Skeleton className="h-5 w-20 rounded-md" />
                                            <Skeleton className="h-4 w-32" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right space-y-1">
                                        <Skeleton className="h-6 w-24" />
                                        <Skeleton className="h-3 w-16 ml-auto" />
                                    </div>
                                    <div className="flex gap-1">
                                        <Skeleton className="h-8 w-8 rounded-md" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ListSkeleton;