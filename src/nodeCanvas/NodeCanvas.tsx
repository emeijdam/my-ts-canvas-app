import { CSSProperties, useEffect, useRef } from "react";
import { ICoordinates, IWorkbenchState, getShapePath2d } from "./nodesTypes";



const drawgrid = (canvas: HTMLCanvasElement, unit: number, originCoords: { x: number, y: number }) => {
    let path1 = new Path2D();

    // remainder
    const remainderX = (originCoords.x % unit)
    const remainderY = (originCoords.y % unit)
    // console.log(centerPos, remainderX)

    for (let x = remainderX; x < canvas.width; x = x + unit) {
        path1.moveTo(x, 0)
        path1.lineTo(x, canvas.height)
    }

    for (let y = remainderY; y < canvas.height; y = y + unit) {
        path1.moveTo(0, y)
        path1.lineTo(canvas.width, y)
    }
    return path1
}

const drawRuler = (canvas: HTMLCanvasElement, canvasContext: CanvasRenderingContext2D, unit: number, originCoords: { x: number, y: number }, cm: number) => {
    const remainderX = (originCoords.x % unit)
    const remainderY = (originCoords.y % unit)

    canvasContext.moveTo(originCoords.x, 0)
    canvasContext.lineTo(originCoords.x, canvas.height)
    canvasContext.stroke()

    canvasContext.moveTo(0, originCoords.y)
    canvasContext.lineTo(canvas.width, originCoords.y)
    canvasContext.stroke()

    canvasContext.font = "8px Arial";
    canvasContext.textAlign = "end";

    // rulers
    for (let x = remainderX; x < canvas.width; x = x + unit) {
        canvasContext.fillText(cm + '', x, originCoords.y + 10)
        cm = cm + 1
    }

    //const remainderY = (centerPos.y % unitCM)
    const numLinesY = Math.floor(canvas.height / unit)
    cm = Math.floor((numLinesY / 2))

    canvasContext.textAlign = "end";
    for (let y = remainderY; y < canvas.height; y = y + unit) {
        // canvasContext.fillText(cm + '', remainderX, y)
        canvasContext.fillText(cm + '', originCoords.x - 3, y + 10)
        cm = cm - 1
    }
}

interface NodeCanvasProps {
    //    width: number
    //    height: number,
    workbenchState: IWorkbenchState,
    style?: CSSProperties;
    size: [w: string, h: string]
    updateOrigin(coords: ICoordinates): void,
    updateCanvasWidthHeight(w:number, h:number): void
}

const NodeCanvas = ({workbenchState, style, size, updateOrigin, updateCanvasWidthHeight}:NodeCanvasProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
   

   // const [origin, setOrigin] = useState<{ x: number, y: number }>({ x: 0, y: 0 })


    // const [size] = useState(props.size);


    useEffect(() => {
       // console.log('huh', props.size)
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const canvasContext = canvas.getContext('2d');
            //https://github.com/robinovitch61/hotstuff/blob/main/src/components/Canvas/hooks/useWindowSize.ts


            const resize = () => {
                //console.log('rwzie')
                // const canvas = canvasRef.current;
                if (canvas) {
                   // console.log('w:', canvas.style.width)
                    // canvas.style.width = sizew
                    //canvas.style.height = sizeh
                    // canvas.width = window.innerWidth;
                    //canvas.height = window.innerHeight;

                    canvas.width = canvas.clientWidth;
                    canvas.height = canvas.clientHeight;

                    // Clientwidth
                    // SCREENWIDTH
                }
            };

            if (canvasContext) {
                //canvas.style.width='100%';
                //canvas.style.height='100%';

                // canvas.width  = canvas.offsetWidth;
                // canvas.height = canvas.offsetHeight;
                // https://harrisonmilbradt.com/articles/canvas-panning-and-zooming
                if (workbenchState.origin.x === 0) {
                    updateOrigin({ x: canvas.width / 2, y: canvas.height / 2 })
                }
                
               // updateCanvasWidthHeight(canvas.width, canvas.height)
                resize()
                updateOrigin({ x: canvas.width / 2, y: canvas.height / 2 })

                canvasContext.clearRect(0, 0, canvas.width, canvas.height);

                const pixelsPerInch = 69
                const pixelsPerMM = pixelsPerInch / 25.4 // 2.716 px
                const unitCM = pixelsPerMM * 10
                const numLinesX = Math.floor(canvas.width / unitCM)

                let numberOfUnitsX = -Math.floor((numLinesX / 2))

               
               // props.updateOrigin(origin)
                //  const centerPos = { x: canvas.width / 2, y: canvas.height / 2 }


                // const basicCanvasInfo = {
                //     width: canvas.width,
                //     height: canvas.height,
                //     origin: {
                //         x: canvas.width / 2,
                //         y: canvas.height / 2
                //     },
                //     unitPX: unitCM,
                //     linesx: numLinesX,
                //     numberOfUnitsX: numberOfUnitsX
                // }

                //console.log(basicCanvasInfo)

                // const remainderX = (centerPos.x % unitCM)

                const toGridUnits = (coord: { x: number, y: number }) => {
                    const justx = Math.round((coord.x - workbenchState.origin.x) / unitCM)
                    const justy = -Math.round((coord.y - workbenchState.origin.y) / unitCM)
                    return { x: justx, y: justy }
                }

                const snapToGrid = (coord: { x: number, y: number }) => {
                    const justx = workbenchState.origin.x + (coord.x * unitCM)
                    const justy = workbenchState.origin.y - (coord.y * unitCM)
                    return { x: justx, y: justy }
                }

                // centerpoint
                canvasContext.beginPath();
                canvasContext.arc(workbenchState.origin.x, workbenchState.origin.y, 5, 0, 2 * Math.PI, true);
                canvasContext.fill();


                // some text
                canvasContext.font = "30px Arial"
                canvasContext.fillText("mm: " + unitCM, 1000, 50)


                //   drawgrid(unitCM, canvas.width, canvas.height)
                canvasContext.strokeStyle = "#ce9898";
                canvasContext.globalAlpha = 0.2
                canvasContext.stroke(drawgrid(canvas, unitCM, workbenchState.origin));
                canvasContext.globalAlpha = 1

                drawRuler(canvas, canvasContext, unitCM, workbenchState.origin, numberOfUnitsX)

                for (const node of workbenchState.nodes) {
                    canvasContext.stroke(getShapePath2d(node))
                }

                // just a point
                const checkPoint = { x: 100, y: 400 }

                // transform to unit
                canvasContext.beginPath();
                canvasContext.arc(checkPoint.x, checkPoint.y, 5, 0, 2 * Math.PI, true);
                canvasContext.fillStyle = "blue";
                canvasContext.fill();


                //const just = toGridUnits(checkPoint)
                //const snap = snapToGrid(just)
                
                // console.log(just)
                const snap = snapToGrid({ x: -5, y: -5 })
                //const snap = snapToGrid(just)
                //  console.log(snap)

                // close
                canvasContext.beginPath();
                canvasContext.fillStyle = "red";
                canvasContext.arc(snap.x, snap.y, 5, 0, 2 * Math.PI, true);
                canvasContext.fill();

                canvasContext.fillStyle = "black";

              //  window.addEventListener("resize", () => resize);
            }

        }

       // return window.removeEventListener("resize", () => console.log('resize'));
    }, [])



    //https://jsfiddle.net/PQS3A/7/
    return <canvas ref={canvasRef} style={style} />
}

export default NodeCanvas