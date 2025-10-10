import React from 'react';


export const Carousel: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="w-full overflow-x-auto py-2">
            <div className="flex gap-4 px-2">
                {children}
            </div>
        </div>
    );
};