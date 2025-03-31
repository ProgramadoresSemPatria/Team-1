import { useContext } from 'react';
import { StepperContext } from '@/context/StepperContext';

export function useStepper() {
  return useContext(StepperContext);
}
