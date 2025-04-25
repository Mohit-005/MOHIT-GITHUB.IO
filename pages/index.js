import Ubuntu from "../components/ubuntu";
import Meta from "../components/SEO/Meta";
import { initGA } from "../utils/analytics";

// Initialize Google Analytics if tracking ID is available
initGA();

function App() {
  return (
    <>
      <Meta />
      <Ubuntu />
    </>
  );
}

export default App;
