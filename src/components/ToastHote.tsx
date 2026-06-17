import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../store/store';
import { cacheToast, toastSelector } from '../store/toastSlice';
import { Toast } from './Toast';

export function ToastHote() {
  const toast = useSelector(toastSelector);
  const dispatch = useDispatch<AppDispatch>();

  if (!toast.visible) return null;

  return (
    <Toast
      key={toast.id}
      message={toast.message}
      niveau={toast.niveau}
      onHide={() => dispatch(cacheToast())}
    />
  );
}
