import { Request, Response } from 'express';
import { addHeadersToResponse } from './server-helpers';
import { pgCreds } from './config/postgres';

//GET
export async function getPostgresDbItem(req: Request, res: Response) {
  addHeadersToResponse(res);
  try {
    return res.status(200).json("USER:" + process.env.PG_USER);
  } catch (error) {}
}


//CREATE
export async function createPostgresDbItem(req: Request, res: Response) {
  addHeadersToResponse(res);
  try {
    return res.status(201).json('postPostgresDbItem');
  } catch (error) {}
}

//PUT
export async function updatePostgresItem(req: Request, res: Response) {
  addHeadersToResponse(res);
  try {
    return res.status(200).json('putPostgresItem');
  } catch (error) {}
}

//DELETE
export async function deletePostgresItem(req: Request, res: Response) {
  addHeadersToResponse(res);
  try {
    return res.status(200).json('deletePostgresItem');
  } catch (error) {}
}




