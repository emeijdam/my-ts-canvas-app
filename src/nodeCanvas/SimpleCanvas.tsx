import React, { CSSProperties, forwardRef, useImperativeHandle } from "react";
import {  useRef } from "react";

// interface CanvasProps {
//     width: number;
//     height: number;
//   //  canvasRef: ForwardedRef<HTMLCanvasElement>;
//     style?: CSSProperties;
// }

const SimpleCanvas = forwardRef<HTMLCanvasElement, {style: CSSProperties,  width: number,  height: number}>(({style, width, height}, forwardedRef) => {
    const ref = useRef<HTMLCanvasElement>(null);

    useImperativeHandle(forwardedRef, () => ref.current as HTMLCanvasElement);

    return <canvas ref={ref} style={style} height={height} width={width} ></canvas>
}
)

export default SimpleCanvas