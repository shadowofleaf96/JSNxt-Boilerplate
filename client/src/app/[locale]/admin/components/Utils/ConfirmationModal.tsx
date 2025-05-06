"use client";

import React from "react";
import Modal from "react-modal";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useTranslation } from "next-i18next";

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

Modal.setAppElement("body");

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
}) => {
  const { t } = useTranslation();

  let messageKey = "confirm.deleteSingle";
  if (isBulkDelete) messageKey = "confirm.deleteBulk";
  else if (isVariantDelete) messageKey = "confirm.deleteVariant";

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel={t("confirm.modalLabel")}
    >
      <h2 className="text-lg font-medium text-gray-800">
        {t("confirm.title")}
      </h2>
      <p className="mt-4 text-sm text-gray-600">{t(messageKey)}</p>
      <div className="mt-6 flex justify-end gap-4">
        <button
          onClick={onRequestClose}
          className="px-4 py-3 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          {t("buttons.cancel")}
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-3 bg-red-500 text-white rounded hover:bg-red-600"
          disabled={isLoading}
        >
          {isLoading ? <LoadingSpinner size={6} /> : t("buttons.delete")}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
