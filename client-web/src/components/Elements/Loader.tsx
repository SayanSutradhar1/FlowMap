import { motion } from "framer-motion";

const Loader = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] w-full gap-8">
            <div className="relative">
                {/* Abstract Financial Graph Animation */}
                <div className="flex items-end gap-2 h-16">
                    {[0, 1, 2, 3, 4].map((index) => (
                        <motion.div
                            key={index}
                            className="w-3 rounded-full bg-linear-to-t from-emerald-600 to-emerald-400"
                            initial={{ height: "20%" }}
                            animate={{
                                height: ["20%", "80%", "20%"],
                            }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: index * 0.15,
                            }}
                        />
                    ))}
                </div>

                {/* Orbiting Coin/Dot Effect */}
                <motion.div
                    className="absolute -top-4 left-1/2 w-full h-full -translate-x-1/2"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] absolute -top-2 left-1/2" />
                </motion.div>
            </div>

            <div className="flex flex-col items-center gap-2">
                <motion.h3
                    className="text-lg font-semibold text-emerald-950 dark:text-emerald-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    Processing Financial Data
                </motion.h3>
                <motion.p
                    className="text-sm text-muted-foreground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    Please wait while we secure your statement...
                </motion.p>
            </div>
        </div>
    );
};

export default Loader;
