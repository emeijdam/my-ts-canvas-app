import React, { useEffect, useLayoutEffect, useState } from 'react';
import { ENodeTypes, ICoordinates, IWorkbenchState, nextPosition } from './nodeCanvas/nodesTypes';
import SimpleCanvas from './nodeCanvas/SimpleCanvas';
import { getCenterPoint, getCoordinatesObject, drawCircle, drawRuler, drawGridFromCenter, calcGridUnits } from './nodeCanvas/drawUtils';
import useCanvasResize from './nodeCanvas/useCanvasResize';


const myDoc: IWorkbenchState = {
  nodes: [],
  origin: { x: 0, y: 0 },
  canvasWidth: 0,
  canvasHeight: 0
}

const initNodes = [
  {
    id: 1,
    name: 'node1',
    type: ENodeTypes.SOURCE,
    centerPosition: nextPosition(myDoc, ENodeTypes.SOURCE),
  },
  {
    id: 2,
    name: 'node2',
    type: ENodeTypes.TRANSFORM,
    centerPosition: nextPosition(myDoc, ENodeTypes.TRANSFORM),
  },
  {
    id: 3,
    name: 'node3',
    type: ENodeTypes.TERMINAL,
    centerPosition: nextPosition(myDoc, ENodeTypes.TERMINAL),
  }
]

myDoc.nodes = initNodes


// type TDrawFunc = (context: CanvasRenderingContext2D) => void;

// const hello: TDrawFunc = (canvasContext) => {
//   canvasContext.beginPath();
//   canvasContext.font = '38pt Arial';
//   canvasContext.fillStyle = 'cornflowerblue';
//   canvasContext.strokeStyle = 'blue';
//   canvasContext.textAlign = "center";
//   canvasContext.fillText('Hello Canvas', 0, 0);
//   canvasContext.strokeText('Hello Canvas', 0, 0);
// }

// const scaleWrap = (canvasContext: CanvasRenderingContext2D, scale: ICoordinates) => {
//   const translateOrigin = getCenterPoint({ width: canvasContext.canvas.width, height: canvasContext.canvas.height })
//   canvasContext.translate(translateOrigin.x, translateOrigin.y);
//   canvasContext.scale(scale.x, scale.y)
// }

//scaleWrap(context, scale, origin, hello)

function App() {
  // const [workbenchState, setworkbenchState] = useState<IWorkbenchState>(myDoc)
  const [[a, b], setTest] = useState(['10%', '90%'])
  //const canvasRef = useRef<HTMLCanvasElement>(null)

  const [canvasRef, canvasPixelDimensions] = useCanvasResize()
  const [mouseClickCoord, setMouseClickCoord] = useState<ICoordinates>({ x: 0, y: 0 })
  const [cameraOffset, setCameraOffset] = useState<ICoordinates>({ x: 0, y: 0 })
  const [dragStart, setDragStart] = useState<ICoordinates>({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  // const canvas = canvasRef.current;
  // const canvasContext = canvas?.getContext("2d");

  //  const [[w, h], setcInfo] = useState([0, 0])
  // const [canvasSizeInfo, setCanvasSizeInfo] = useState({ w: 0, h: 0 })

  //let isDragging = false
  //let dragStart = { x: 0, y: 0 }

  //let cameraOffset = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
  let cameraZoom = 1
  let MAX_ZOOM = 5
  let MIN_ZOOM = 0.1
  let SCROLL_SENSITIVITY = 0.0005

  let initialPinchDistance = null
  let lastZoom = cameraZoom


  // https://stackoverflow.com/questions/3420975/html5-canvas-zooming
  useLayoutEffect(() => {
    console.log('*****************')
    if (canvasRef) {
      if (canvasRef.current) {
        const canvas = canvasRef.current
        const canvasContext = canvas.getContext('2d');
        if (canvasContext) {

          let scale = getCoordinatesObject(1, 1)
          if (canvas.width !== 0) {
            scale = getCoordinatesObject(canvas.width / canvas.clientWidth, canvas.height / canvas.clientHeight)
            console.log('scaling: ', scale.x)
            console.log('scaling: ', scale.y)
            const ascale = window.devicePixelRatio;

            scale.x = scale.x * window.devicePixelRatio
            scale.y = scale.y * window.devicePixelRatio
            console.log('dpr: ', ascale)
          }

         

          //const originCoords = getCenterPoint({ width: canvasContext.canvas.width, height: canvasContext.canvas.height })

          // const originCoords = getCenterPoint({ width: canvas.width, height: canvasContext.canvas.height })

          let originCoords = getCenterPoint({ width: canvasPixelDimensions.width, height: canvasPixelDimensions.height })

          if (mouseClickCoord.x !== 0) {
            originCoords = mouseClickCoord
           //setCameraOffset(originCoords)
          }
          //scaleWrap(canvasContext, scale) // latest
          if (cameraOffset.x === 0) {
            setCameraOffset(originCoords)
          }
          canvasContext.scale(cameraZoom, cameraZoom)
         // canvasContext.translate( -originCoords.x + cameraOffset.x, -originCoords.y + cameraOffset.y )

          canvasContext.clearRect(0, 0, canvasContext.canvas.width, canvasContext.canvas.height);

          //canvasContext.save();

          drawCircle(canvasContext, calcGridUnits(), originCoords)
          drawRuler(canvasContext, calcGridUnits(), originCoords)
          drawGridFromCenter(canvasContext, calcGridUnits(), originCoords)
          // hello(canvasContext)

          const toGridUnits = (coord: { x: number, y: number }) => {
            const justx = Math.round((coord.x - originCoords.x) / calcGridUnits())
            const justy = -Math.round((coord.y - originCoords.y) / calcGridUnits())
            return { x: justx, y: justy }
          }


          const snapToGrid = (coord: { x: number, y: number }) => {
            const justx = originCoords.x + (coord.x * calcGridUnits())
            const justy = originCoords.y - (coord.y * calcGridUnits())
            return { x: justx, y: justy }
          }

          const snap = snapToGrid({ x: 1, y: 1 })
          //const snap = snapToGrid(just)
          //  console.log(snap)

          // close
          canvasContext.beginPath();
          canvasContext.fillStyle = "red";
          canvasContext.arc(snap.x, snap.y, 5, 0, 2 * Math.PI, true);
          canvasContext.fill();

          canvasContext.restore();
        }
      }
    }
  }, [canvasPixelDimensions, canvasRef, mouseClickCoord]);

  const getCoord = (event: MouseEvent): ICoordinates => {

    if (canvasRef) {
      if (canvasRef.current) {
        const canvas = canvasRef.current
        // const canvasContext = canvas.getContext('2d');
        return {
          x: event.clientX - canvas.offsetLeft,
          y: event.clientY - canvas.offsetTop
        };
      } else { return { x: 0, y: 0 }; }

    } else {
      return { x: 0, y: 0 };
    };
  }

  // const start = (event: MouseEvent, cb: (event: MouseEvent) => void) => {
  //   const coord = getCoord(event);
  //   console.log('mousedown', coord)
  //   setMouseClickCoord(coord)
  //   cb(event)
  // };

  // const startCB = (event: MouseEvent) => {

  //   console.log('CALL ME BACK!')

  // };

  // const stop = () => {
  //   console.log('mouseup')
  // };

  function getEventLocation(e: MouseEvent) {
    // if (e.touches && e.touches.length == 1)
    // {
    //     return { x:e.touches[0].clientX, y: e.touches[0].clientY }
    // }
    //  if (e.clientX && e.clientY)
    // {
    //     return { x: e.clientX, y: e.clientY }        
    // }
    return { x: e.clientX, y: e.clientY }
  }

 

  useEffect(
    () => {
      // call resize() once.
      // resize();

      // attach event listeners.
      // window.addEventListener("resize", resize);

      function onPointerDown(e: MouseEvent) {
        setIsDragging(true)
        const x = getEventLocation(e).x / cameraZoom - cameraOffset.x
        const y = getEventLocation(e).y / cameraZoom - cameraOffset.y
    
        setDragStart({x: x, y:y})
      }
    
      function onPointerUp(e: MouseEvent) {
        setIsDragging(false)
      //  initialPinchDistance = null
        //lastZoom = cameraZoom
      }
    
    
      function onPointerMove(e: MouseEvent) {
       console.log('move', isDragging)
        if (isDragging) {
          console.log('dragmove')
          const x = getEventLocation(e).x / cameraZoom - dragStart.x
          const y = getEventLocation(e).y / cameraZoom - dragStart.y
          setCameraOffset({x:x, y:y})
          
          // cameraOffset.x = getEventLocation(e).x / cameraZoom - dragStart.x
          // cameraOffset.y = getEventLocation(e).y / cameraZoom - dragStart.y
        }
      }

      document.addEventListener("mousedown", onPointerDown);
      document.addEventListener("mouseup", onPointerUp);
      document.addEventListener("mousemove", onPointerMove);

      // remove listeners on unmount.
      return () => {
        //  window.removeEventListener("resize", resize);

        document.removeEventListener("mousedown", onPointerDown);
        document.removeEventListener("mouseup", onPointerUp);
        document.removeEventListener("mousemove", onPointerMove);
      };
    },
    [] // no dependencies means that it will be called once on mount.
  );



  const handleFlexToggle = () => {
    if (a === '10%') {
      setTest(['50%', '50%'])
    } else {
      setTest(['10%', '90%'])
    }
  }

  // useEffect(() => {
  //   if (canvasRef) {
  //     if (canvasRef.current) {
  //       setcInfo([canvasRef.current.clientWidth, canvasRef.current.clientHeight])
  //       setCanvasSizeInfo({ w: canvasRef.current.width, h: canvasRef.current.height })
  //     }
  //   }
  // }, [canvasRef, canvasPixelDimensions]);

  return (
    <div className="App" style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: `${a} `, backgroundColor: 'blue' }}>
        <button onClick={handleFlexToggle}>SIZE ME</button>
        <button onClick={() => setMouseClickCoord({ x: 0, y: 0 })}>RESET PAN</button>
        <div style={{ color: 'white' }}>window:{window.innerWidth}, {window.innerHeight} </div>
        <div style={{ color: 'white' }}>mouse:{mouseClickCoord.x}, {mouseClickCoord.y} </div>
        <div style={{ color: 'white' }}>canvas:{canvasPixelDimensions.width}, {canvasPixelDimensions.height} </div>
        <div style={{ color: 'white' }}>isDragging: {'' + isDragging} </div>
        <div style={{ color: 'white' }}>cameraOffset:{cameraOffset.x}, {cameraOffset.y} </div>
      </div>
      {/* <NodeCanvas style={{ flex: 'flex: 20 80' , width: b }} workbenchState={workbenchState} size={[b,'100vh']} 
        updateOrigin={handleUpdateCoordinates} updateCanvasWidthHeight={handleCanvasWidthHeight}
        /> */}
      <SimpleCanvas style={{ flex: `${b}`, overflow: 'hidden', borderColor: 'red', border: '5px solid' }} width={canvasPixelDimensions.width} height={canvasPixelDimensions.height} ref={canvasRef}></SimpleCanvas>
    </div>
  );
}

export default App;
