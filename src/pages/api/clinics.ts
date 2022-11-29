// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { readFileSync } from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import Papa from 'papaparse';
import path from 'path';

export default function clinics(req: NextApiRequest, res: NextApiResponse) {
  const file = path.join(process.cwd(), 'public', 'data', 'clinics.csv');
  const clinicsRawCsv = readFileSync(file, 'utf8');

  Papa.parse(clinicsRawCsv, {
    complete: function (parsedCsv) {
      res.status(200).json(parsedCsv.data);
    },
  });

}
