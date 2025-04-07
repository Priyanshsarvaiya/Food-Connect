import { motion } from 'framer-motion'

const LoadingSpinner = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="text-center">
                <motion.div
                    className="w-16 h-16 border-4 border-t-4 border-t-green-500 border-gray-200 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <p className="mt-4 text-gray-600">Loading...</p>
            </div>
        </div>
    );
}

export default LoadingSpinner;