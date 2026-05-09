'use client';

import { Check, X as XIcon } from 'lucide-react';
import { AnalysisFactor } from '../types';

interface Step1FactorsProps {
  analysisFactors: AnalysisFactor[];
}

export function Step1Factors({ analysisFactors }: Step1FactorsProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">Job vs resume</p>
      <div className="border rounded-md overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted border-b">
              <th className="text-left p-2 font-medium">Factor</th>
              <th className="text-left p-2 font-medium">Job (AI)</th>
              <th className="text-left p-2 font-medium">My resume</th>
              <th className="text-left p-2 font-medium w-24">Result</th>
            </tr>
          </thead>
          <tbody>
            {analysisFactors.map((row, i) => (
              <tr key={i} className="border-b last:border-0">
                <td className="p-2">{row.factor}</td>
                <td className="p-2 text-muted-foreground">{row.jobRequirement}</td>
                <td className="p-2">{row.myValue || '—'}</td>
                <td className="p-2">
                  {row.qualify ? (
                    <Check className="h-5 w-5 text-green-600" />
                  ) : (
                    <XIcon className="h-5 w-5 text-red-500" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {analysisFactors.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No factors yet. Run analysis with a job description.
        </p>
      )}
    </div>
  );
}
