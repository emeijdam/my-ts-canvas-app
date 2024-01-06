import { useState, useEffect, useRef, useMemo } from "react";
import { IPixelDimensions } from "./nodesTypes";

const useCanvasResize = () => {
    const [canvasPixelDimensions, setCanvasPixelDimensions] = useState<IPixelDimensions>({ width: 0, height: 0 });
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const observer = useMemo(
        () =>
          new ResizeObserver((entries) => {
            // setWidth(entries[0].target.getBoundingClientRect().width);
            console.log('changed')
            setCanvasPixelDimensions({ width: entries[0].target.clientWidth, height: entries[0].target.clientHeight });
    
          }),
        []
      );

    useEffect(() => {
        if (canvasRef) {
            if (canvasRef.current) {
              const canvas = canvasRef.current
              const canvasContext = canvas.getContext('2d');
              if (canvasContext) {
                observer.observe(canvas);
                // https://codesandbox.io/p/sandbox/react-resizeobserver-example-6cdwv?file=%2Fsrc%2FApp.js%3A27%2C5
                const handleResize = () => {
                  setCanvasPixelDimensions({ width: canvas.clientWidth, height: canvas.clientHeight });
                };
      
                handleResize();
                window.addEventListener("resize", handleResize);
      
                return () => {
                  window.removeEventListener("resize", handleResize)
                  observer.unobserve(canvas);
              }
            }
        }
    }
    }, [observer]);

    return [canvasRef, canvasPixelDimensions] as const;
};

export default useCanvasResize;