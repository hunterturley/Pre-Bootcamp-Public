import React from 'react';

import { useScanStore } from '../../store/scanStore';
import { IdleScreen } from './IdleScreen';
import { ProcessingScreen } from './ProcessingScreen';
import { ReviewScreen } from './ReviewScreen';
import { SuccessScreen } from './SuccessScreen';

/**
 * The Scan tab is a four-state machine (idle -> processing -> review ->
 * success), driven by the scan store rather than navigation routes.
 */
export function ScanTab() {
  const stage = useScanStore((s) => s.stage);

  switch (stage) {
    case 'processing':
      return <ProcessingScreen />;
    case 'review':
      return <ReviewScreen />;
    case 'success':
      return <SuccessScreen />;
    case 'idle':
    default:
      return <IdleScreen />;
  }
}
