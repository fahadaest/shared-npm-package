import React, { MouseEvent, TouchEvent, useState } from 'react';
import Tooltip, { Position } from './Tooltip';
import { isTouch } from '../../utils/utils';

// import "./Button.less"
import _ from "lodash";
import { DEBUG } from "../../shared";
import { motion } from 'framer-motion';
import { ImSpinner2 } from "react-icons/im";

export type ButtonSize = 'tiny' | 'small' | 'medium' | 'large' | 'xl';

type MyButtonProps = {
    tooltip?: string;
    size?: ButtonSize;
    style?: React.CSSProperties;
    className?: string;
    wrapClass?: string;
    tooltipClass?: string;
    tooltipPlacement?: Position;
    wrapStyle?: React.CSSProperties;
    disabled?: boolean;
    inProgress?: boolean;
    Icon?: React.ComponentType<any>;
    onClick?: (event: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>) => void;
    onMouseDown?: (event: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>) => void;
    onMouseEnter?: (event: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>) => void;
    onMouseLeave?: (event: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>) => void;
    delayed?: boolean;
    visible?: boolean;
    children?: React.ReactNode
};

const s = 0.7

const sizeToEm: Record<string, string> = {
    tiny: `${16 * s}px`, small: `${21 * s}px`, medium: `${25 * s}px`, large: `${32 * s}px`, xl: `${38 * s}px`,
    // tiny: '1em', small: '1.3em', medium: '1.55em', large: '2em', xl: '2.4em',
};

const Button: React.FC<MyButtonProps> = ({
    children,
    disabled = false, inProgress = false, onClick, Icon, tooltip,
    size = 'small', style, className = '', tooltipClass = '', tooltipPlacement,
    wrapStyle, wrapClass, delayed = false, visible = true,
    onMouseDown, onMouseEnter, onMouseLeave
}) => {
    if (!visible) return null;

    // const [isDragging, setIsDragging] = useState(false);

    const [mouseHasMoved, setMouseHasMoved] = useState(false);
    const [mouseDownTime, setMouseDownTime] = useState(0);

    const IconFinal = Icon ? (inProgress ? ImSpinner2 : Icon) : null;

    // const debounceHandleClick = (event: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>, handler?: (e: any) => void) => {
    //     handler ? handler(event) : onClick!(event)
    // }

    const debounceHandleClick = _.debounce((event: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>, handler?: (e: any) => void) => {
        // DEBUG && console.log("Button.debounceHandleClick.mouseHasMoved?", mouseHasMoved)
        // if (isDragging) return;
        if (mouseHasMoved) return

        if ((handler || onClick) && !disabled && !inProgress) {
            // DEBUG && console.log("btnClick", tooltip)
            event.preventDefault()
            const wrapper = () => { event.preventDefault(); handler ? handler(event) : onClick!(event) }
            // delayed ? setTimeout(() => wrapper(), 100) : wrapper();
            wrapper()
            // delayed ? setTimeout(() => onClick(event), 100) : onClick(event);
        }
    }, 100)


    // const debounceHandleClick = _.debounce((event: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>) => {
    //     if (onClick && !disabled) {
    //         // DEBUG && console.log("btnClick", tooltip)
    //         event.preventDefault()
    //         const wrapper = () => {event.preventDefault(); onClick(event)}
    //         delayed ? setTimeout(() => wrapper(), 100) : wrapper();
    //         // delayed ? setTimeout(() => onClick(event), 100) : onClick(event);
    //     }
    // }, 100)
    //
    const iconElement = !Icon ? null : (
        // @ts-ignore
        <IconFinal size={sizeToEm[size]}
            // Make sure clicks pass through to the parent
            // style={{...style}}
            style={{ ...style, pointerEvents: 'none' }}
            className={`${className} fl-btn-icon ${inProgress ? 'fl-spinning' : ''} ${disabled || inProgress ? 'fl-btn-icon-disabled' : ''}`}
        />
    );

    // DEBUG && console.log("btnRender", tooltip)

    return (
        // <motion.div
        //     whileHover={{ scale: 1.1 }}
        //     whileTap={{ scale: 0.9 }}
        // >
        <div
            className={`fl-btn-wrapper ${wrapClass || ''} ${disabled ? 'fl-btn-icon-disabled' : ''}`}
            style={{ cursor: disabled || inProgress ? 'default' : 'pointer', ...wrapStyle }}
            // onClick={() => console.log("btnClick", tooltip)}
            onClick={debounceHandleClick}
            // onTouchStart={debounceHandleClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            // onMouseDown={(e) => debounceHandleClick(e, onMouseDown)}
            onMouseDown={(e) => {
                setMouseHasMoved(false)
                setMouseDownTime(Date.now());
                onMouseDown?.(e)
            }}
            onMouseMove={() => {
                if (Date.now() - mouseDownTime > 100) {
                    setMouseHasMoved(true);
                }
            }}
        //{...(!isTouch() ? {
        //    onMouseEnter: handleMouseEnter,
        //    onMouseLeave: handleMouseLeave
        //} : {})}
        >
            {tooltip && !isTouch() ? (
                <Tooltip
                    title={tooltip}
                    overlayClassName={tooltipClass}
                    {...(tooltipPlacement ? { placement: tooltipPlacement } : {})}
                >
                    <>
                        {iconElement}
                        {children && children}
                    </>
                </Tooltip>
            ) : (
                <>
                    {iconElement && iconElement}
                    {children && children}
                </>
            )}
        </div>
        // </motion.div>
    );
};

export default React.memo(Button);