import * as express from "express";


const getDurationInMilliseconds = (start: [number, number]) => {
  const NS_PER_SEC = 1e9
  const NS_TO_MS = 1e6
  const diff = process.hrtime(start)

  return Math.round((diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS)
}

const requestLogger = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const start: [number, number] = process.hrtime()
  res.on('finish', () => {
    const durationInMilliseconds = getDurationInMilliseconds(start)
    console.info(`${req.method} ${req.originalUrl} ${res.statusCode} ${durationInMilliseconds.toLocaleString()}ms`)
    console.debug(`headers ${JSON.stringify(req.headers)}`)
  })
  next()
}
export default requestLogger;
