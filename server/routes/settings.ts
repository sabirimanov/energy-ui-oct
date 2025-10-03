import { RequestHandler } from "express";

export const handleSettings: RequestHandler = (_req, res) => {
  res.json({
    logo: { az: null, en: null },
    placeholder: null,
  });
};
