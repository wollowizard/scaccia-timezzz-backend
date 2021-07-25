import * as express from 'express';

const healthController = async (req: express.Request, res: express.Response) => {
  res.json({status: "OK"});
};
export default healthController;
