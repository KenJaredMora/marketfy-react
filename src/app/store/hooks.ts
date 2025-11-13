import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './index';

/**
 * Type-safe Redux hooks
 * Use these hooks throughout the app instead of plain `useDispatch` and `useSelector`
 */

/**
 * Use throughout your app instead of plain `useDispatch`
 */
export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();

/**
 * Use throughout your app instead of plain `useSelector`
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
