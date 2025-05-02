import React from "react";
import Modal from "react-modal";
import LoadingSpinner from "@/src/components/ui/LoadingSpinner";

const customStyles: Modal.Styles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    zIndex: 1000,
  },
};

Modal.setAppElement('body');

interface ConfirmationModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  isBulkDelete?: boolean;
  isVariantDelete?: boolean;
}


const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onRequestClose,
  onConfirm,
  isLoading,
  isBulkDelete = false,
  isVariantDelete = false,
}) => (
  <Modal
    isOpen={isOpen}
    onRequestClose={onRequestClose}
    style={customStyles}
    contentLabel="Confirmation Modal"
  >
    <h2 className="text-lg font-medium text-gray-800">Delete Confirmation</h2>
    <p className="mt-4 text-sm text-gray-600">
      {isBulkDelete
        ? "Are you sure you want to delete the selected element or elements?"
        : isVariantDelete
        ? "Are you sure you want to delete this variant?"
        : "Are you sure you want to delete this element?"}
    </p>
    <div className="mt-6 flex justify-end gap-4">
      <button
        onClick={onRequestClose}
        className="px-4 py-3 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
      >
        Cancel
      </button>
      <button
        onClick={onConfirm}
        className="px-4 py-3 bg-red-500 text-white rounded hover:bg-red-600"
        disabled={isLoading}
      >
        {isLoading ? <LoadingSpinner size={6} /> : "Delete"}
      </button>
    </div>
  </Modal>
);

export default ConfirmationModal;
