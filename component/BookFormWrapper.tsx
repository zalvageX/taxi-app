import dynamic from "next/dynamic";

const BookForm = dynamic(() => import("./BookForm"), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

export default BookForm;
