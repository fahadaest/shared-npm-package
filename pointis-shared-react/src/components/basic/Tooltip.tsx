// TODO update it later

import React from 'react';

export type Position = 'top' | 'bottom' | 'left' | 'right';

interface TooltipProps {
    children: React.ReactNode;
    position?: Position;
    title?: string;
    overlayClassName?: string;
}

const Tooltip: React.FC<TooltipProps> = ({ children, position = 'top' }) => {
    return (
        <div className={`tooltip tooltip-${position}`}>
            {children}
        </div>
    );
};

export default Tooltip;
