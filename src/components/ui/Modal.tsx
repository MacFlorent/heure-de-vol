import { memo } from "react";

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal = memo(({ onClose, children }: ModalProps) => {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
});

Modal.displayName = "Modal";
