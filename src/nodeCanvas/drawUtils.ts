import { ICoordinates, IPixelDimensions } from "./nodesTypes"


// pIxels per Unit
const calcGridUnits = () => {
    // DPI Dots Per Inch
    // Screens typically contains 72 or 96 dots per inch
    // PPI Pixels Per Inch
    // 1dpcm ≈ 2.54dpi
    // 1dppx is equivalent to 96dpi
  
    const DPI = 96 // Dots per INCH
    //const PPI = 69 // PixelsPerInch
    //const pixelsPerMM = pixelsPerInch / 25.4 // 2.716 px
    const DPCM = DPI / 2.54
    // const DPPX = 96 * DPI // 1px = 1in / 96
    // 1:96 fixed ratio
    // const numLinesX = Math.floor(canvas.width / unitCM)
  
    // let numberOfUnitsX = -Math.floor((numLinesX / 2))
    return DPCM
  }

const drawRuler = (canvasContext: CanvasRenderingContext2D, unit: number, originCoords:ICoordinates) => {
    // const remainderX = (originCoords.x % unit)
    // const remainderY = (originCoords.y % unit)
  
    // const remainderX = (canvasContext.canvas.width % unit)
    // const remainderY = (canvasContext.canvas.height % unit)

    const remainderX = ((originCoords.x) % unit)
    const remainderY = ((originCoords.y) % unit)

    canvasContext.beginPath()
    canvasContext.moveTo(originCoords.x, 0)
    canvasContext.lineTo(originCoords.x, canvasContext.canvas.height)
    canvasContext.strokeStyle = 'green';
    canvasContext.stroke()
  
    canvasContext.beginPath()
    canvasContext.moveTo(0, originCoords.y)
    canvasContext.lineTo(canvasContext.canvas.width, originCoords.y)
    canvasContext.strokeStyle = 'blue';
    canvasContext.stroke()
  
    canvasContext.strokeStyle = 'black';
  
    canvasContext.font = "8px Arial";
    canvasContext.textAlign = "end";
  
    let xUnitCount = -Math.floor((originCoords.x) / unit)
 
    canvasContext.fillText('0u', originCoords.x -5, originCoords.y + 10)

    for (let x = remainderX; x < (canvasContext.canvas.width); x = x + unit) {
        canvasContext.fillText(xUnitCount + 'u', x -5, originCoords.y + 10)
        xUnitCount = xUnitCount + 1
      }

      let yUnitCount = -Math.floor((originCoords.y) / unit)

      for (let y = remainderY; y < (canvasContext.canvas.height); y = y + unit) {
        canvasContext.fillText(yUnitCount + 'u', originCoords.x -5, y + 10)
        yUnitCount = yUnitCount + 1
      }
  }

const drawGridFromCenter = (canvasContext: CanvasRenderingContext2D, unit: number, originCoords: ICoordinates): void => {
    // let path1 = new Path2D();
    // remainder
    const remainderX = ((originCoords.x) % unit)
    const remainderY = ((originCoords.y) % unit)

    canvasContext.beginPath()
    //for (let x = remainderX; x < (originCoords.x *2); x = x + unit) {
    for (let x = remainderX; x < canvasContext.canvas.width; x = x + unit) {
      canvasContext.moveTo(x,0)
      canvasContext.lineTo(x, canvasContext.canvas.height)
    }
    canvasContext.stroke()

    canvasContext.beginPath()
    for (let y = remainderY; y < canvasContext.canvas.height; y = y + unit) {
      canvasContext.moveTo(0, y)
      canvasContext.lineTo(canvasContext.canvas.width, y)
    }
    canvasContext.strokeStyle = 'black';
    canvasContext.stroke()
  
    // return path1
  }

  const drawCircle = (canvasContext: CanvasRenderingContext2D, unit: number, coord: ICoordinates) => {

    //const originCoords = getCenterPoint({ width: canvasContext.canvas.width, height: canvasContext.canvas.height })
    canvasContext.beginPath();
    canvasContext.arc(coord.x, coord.y, unit * 1, 0, 2 * Math.PI);
    canvasContext.stroke();
  }

  const getCenterPoint = (dim: IPixelDimensions): ICoordinates => {
    return { x: dim.width / 2, y: dim.height / 2 }
  }
  
  const getCoordinatesObject = (x: number, y: number): ICoordinates => {
    return { x: x, y: y }
  }

  export {drawGridFromCenter, drawRuler, getCenterPoint, getCoordinatesObject, drawCircle, calcGridUnits} 