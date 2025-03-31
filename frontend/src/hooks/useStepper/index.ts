import { useContext } from 'react';
import { StepperContext } from '@/context/StepperContext/index';

export function useStepper() {
  return useContext(StepperContext);
}
