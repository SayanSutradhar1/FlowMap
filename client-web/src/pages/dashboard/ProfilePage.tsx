import { useUserContext } from "@/context/user.context";
import { motion } from "framer-motion";
import {
    Calendar,
    CheckCircle2,
    Mail,
    MapPin,
    User,
    Briefcase,
    ShieldCheck,
    ShieldAlert,
} from "lucide-react";

const ProfilePage = () => {
    const { user, loading } = useUserContext();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center h-96">
                <p className="text-muted-foreground">Failed to load profile details.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative"
            >
                <div className="h-48 rounded-2xl bg-linear-to-r from-primary/20 via-accent/20 to-primary/20" />
                <div className="absolute -bottom-16 left-8 flex items-end gap-6">
                    <div className="w-32 h-32 rounded-2xl bg-background p-2 shadow-xl ring-1 ring-border">
                        <div className="w-full h-full rounded-xl bg-linear-to-br from-primary to-accent flex items-center justify-center text-primary-foreground">
                            <User className="w-16 h-16" />
                        </div>
                    </div>
                    <div className="mb-4 space-y-1">
                        <h1 className="text-3xl font-bold">{user.name}</h1>
                        <p className="text-muted-foreground flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            {user.email}
                        </p>
                    </div>
                </div>
            </motion.div>

            <div className="pt-20 grid gap-6 md:grid-cols-2">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-6 rounded-2xl border bg-card text-card-foreground shadow-sm space-y-6"
                >
                    <div className="flex items-center gap-2 font-semibold text-lg">
                        <User className="w-5 h-5 text-primary" />
                        <h3>Personal Information</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Profession</p>
                                <div className="flex items-center gap-2">
                                    <Briefcase className="w-4 h-4 text-muted-foreground" />
                                    <p className="font-medium">{user.profession}</p>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Location</p>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-muted-foreground" />
                                    <p className="font-medium">{user.state}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-6 rounded-2xl border bg-card text-card-foreground shadow-sm space-y-6"
                >
                    <div className="flex items-center gap-2 font-semibold text-lg">
                        <ShieldCheck className="w-5 h-5 text-primary" />
                        <h3>Account Status</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
                            <div className="flex items-center gap-3">
                                {user.isVerified ? (
                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                ) : (
                                    <ShieldAlert className="w-5 h-5 text-yellow-500" />
                                )}
                                <div>
                                    <p className="font-medium">Verification Status</p>
                                    <p className="text-sm text-muted-foreground">
                                        {user.isVerified ? "Verified Account" : "Pending Verification"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Member Since</p>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <p className="font-medium">
                                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ProfilePage;
