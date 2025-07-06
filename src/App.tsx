import { RecoilRoot } from "recoil";
import { RouterProvider } from "react-router-dom";
import { router } from './core/router/Router';


function App() {

  return (
    <RecoilRoot>
      <>
        <RouterProvider router={router} />
      </>
    </RecoilRoot>
  );
} 

export default App
