"use client";

import dynamic from "next/dynamic";

const App = dynamic(() => import("./app"), { ssr: false });

const AdminClient = () => {
  return <App />;
};

export default AdminClient;
