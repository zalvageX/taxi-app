import dynamic from "next/dynamic";

const ConfirmModal = dynamic(() => import("./confirmModal"), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

export default ConfirmModal;
